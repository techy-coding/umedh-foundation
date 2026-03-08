import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated, isAdmin } from "./auth";
import { registerRoleBasedRoutes } from "./routes/roleBased";
import { api } from "@shared/routes";
import { z } from "zod";
import PDFDocument from "pdfkit";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);
  registerRoleBasedRoutes(app);

  // Programs
  app.get(api.programs.list.path, async (req, res) => {
    const programs = await storage.getPrograms();
    res.json(programs);
  });

  app.get(api.programs.get.path, async (req, res) => {
    const program = await storage.getProgramBySlug(req.params.slug);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json(program);
  });

  app.post(api.programs.create.path, async (req, res) => {
    try {
      const input = api.programs.create.input.parse(req.body);
      const program = await storage.createProgram(input);
      res.status(201).json(program);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Donations
  app.post(api.donations.create.path, async (req, res) => {
    try {
      const input = api.donations.create.input.parse(req.body);
      const userId = (req as any).user?.id as string | undefined;
      const created = await storage.createDonation({
        ...input,
        userId: userId ?? input.userId,
      });

      // Demo mode: mark as successful with a dummy payment id.
      const paymentId = `DUMMY-${Date.now()}-${created.id}`;
      const completed = await storage.updateDonationStatus(created.id, "completed", paymentId);

      if (completed.programId) {
        // Donation amount is stored in paise; program totals are in rupees.
        await storage.incrementProgramRaised(completed.programId, Math.round(completed.amount / 100));
      }

      // Store direct download receipt URL for easy demo.
      const receiptUrl = `/api/donations/${created.id}/receipt/download?email=${encodeURIComponent(completed.donorEmail || "")}`;
      await storage.updateDonationReceipt(created.id, receiptUrl);
      const finalDonation = await storage.getDonationById(created.id);

      res.status(201).json(finalDonation ?? completed);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Demo receipt download (PDF file).
  app.get(api.donations.downloadReceipt.path, async (req: any, res) => {
    const id = parseInt(req.params.id, 10);
    const donation = await storage.getDonationById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const emailParam = typeof req.query?.email === "string" ? req.query.email : "";
    const isOwnerByEmail = emailParam && donation.donorEmail && emailParam.toLowerCase() === donation.donorEmail.toLowerCase();
    const isAdmin = req.isAuthenticated?.() && req.user?.role === "admin";
    const isOwnerUser = req.isAuthenticated?.() && donation.userId && req.user?.id === donation.userId;

    if (!isOwnerByEmail && !isAdmin && !isOwnerUser) {
      return res.status(403).json({ message: "Access denied" });
    }

    const dateText = donation.createdAt ? new Date(donation.createdAt).toLocaleString() : "-";
    const amountInr = (donation.amount / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk as Buffer));
    doc.on("end", () => {
      const pdf = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"umedh-receipt-${donation.id}.pdf\"`);
      res.send(pdf);
    });

    // Header
    doc.rect(50, 45, 495, 70).fill("#0F766E");
    doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("Umedh Foundation", 65, 65);
    doc.fontSize(11).font("Helvetica").text("Donation Receipt", 65, 90);

    // Receipt metadata
    doc.fillColor("#0F172A").fontSize(12).font("Helvetica-Bold").text("Receipt Details", 50, 135);
    doc.moveTo(50, 152).lineTo(545, 152).stroke("#CBD5E1");

    const rows: Array<[string, string]> = [
      ["Receipt ID", `RCPT-${donation.id}`],
      ["Donation ID", String(donation.id)],
      ["Payment ID", donation.paymentId || "DUMMY PAYMENT"],
      ["Date", dateText],
      ["Status", (donation.status || "completed").toUpperCase()],
    ];

    let y = 165;
    for (const [label, value] of rows) {
      doc.font("Helvetica-Bold").fontSize(10).fillColor("#475569").text(label, 55, y);
      doc.font("Helvetica").fontSize(11).fillColor("#0F172A").text(value, 180, y);
      y += 22;
    }

    // Donor section
    doc.roundedRect(50, y + 10, 495, 88, 8).fillAndStroke("#F8FAFC", "#E2E8F0");
    doc.fillColor("#0F172A").font("Helvetica-Bold").fontSize(12).text("Donor Information", 65, y + 24);
    doc.font("Helvetica").fontSize(11).text(`Name: ${donation.donorName || "-"}`, 65, y + 46);
    doc.text(`Email: ${donation.donorEmail || "-"}`, 65, y + 64);

    // Amount highlight
    doc.roundedRect(50, y + 118, 495, 78, 8).fillAndStroke("#ECFEFF", "#A5F3FC");
    doc.fillColor("#0E7490").font("Helvetica-Bold").fontSize(12).text("Total Donation Amount", 65, y + 135);
    doc.fillColor("#0C4A6E").font("Helvetica-Bold").fontSize(24).text(`INR ${amountInr}`, 65, y + 152);

    // Footer
    doc.fillColor("#334155").font("Helvetica").fontSize(10).text(
      "Thank you for your contribution. This receipt is system-generated for demo purposes.",
      50,
      y + 225,
      { width: 495, align: "center" }
    );

    doc.end();
  });

  app.get(api.donations.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    
    if (user?.role === 'admin') {
      const donations = await storage.getDonations();
      return res.json(donations);
    }
    
    // For regular donors, return only their donations
    if (user?.email) {
      const donations = await storage.getDonationsByEmail(user.email);
      return res.json(donations);
    }
    
    res.json([]);
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEventBySlug(req.params.slug);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  });

  app.post(api.events.register.path, async (req: any, res) => {
    try {
      const input = api.events.register.input.parse(req.body);
      const eventIdParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const registrationData: any = {
        ...input,
        eventId: parseInt(eventIdParam),
      };
      if (req.isAuthenticated?.() && req.user?.id) {
        registrationData.userId = req.user.id;
      }
      const registration = await storage.registerForEvent(registrationData);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Volunteers
  app.post(api.volunteers.register.path, async (req, res) => {
    try {
      const input = api.volunteers.register.input.parse(req.body);
      const volunteer = await storage.createVolunteer(input);
      res.status(201).json(volunteer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Blog
  app.get(api.blog.list.path, async (req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get(api.blog.get.path, async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = api.contact.submit.input.parse(req.body);
      const message = await storage.createContactMessage(input);

      // If sender is logged in, mirror the user message into inbox thread.
      const reqAny = req as any;
      if (reqAny.isAuthenticated?.() && reqAny.user?.id) {
        const threadTag = `[THREAD:contact:${message.id}]`;
        await storage.createVolunteerMessage({
          userId: reqAny.user.id,
          message: `${threadTag} [YOU] ${input.message}`,
        });
      }

      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Public Gallery
  app.get(api.gallery.list.path, async (_req, res) => {
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching public gallery:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  // Seed/reconcile are convenience tasks; don't block production boot on them.
  if (process.env.NODE_ENV !== "production") {
    await seedDatabase();
    await storage.reconcileProgramRaisedAmounts();
  } else {
    try {
      await seedDatabase();
      await storage.reconcileProgramRaisedAmounts();
    } catch (error) {
      console.error("Startup warning: seed/reconcile skipped:", error);
    }
  }

  return httpServer;
}

async function seedDatabase() {
  const existingPrograms = await storage.getPrograms();
  if (existingPrograms.length === 0) {
    await storage.createProgram({
      title: "Education for All",
      slug: "education-for-all",
      description: "Providing quality education to underprivileged children.",
      longDescription: "Our Education for All initiative aims to bridge the gap...",
      goalAmount: 500000,
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80",
    });
    await storage.createProgram({
      title: "Women Empowerment",
      slug: "women-empowerment",
      description: "Empowering women through skill development and self-help groups.",
      longDescription: "We believe in the power of women to transform communities...",
      goalAmount: 300000,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    });
    await storage.createProgram({
      title: "Health Camps",
      slug: "health-camps",
      description: "Free medical checkups and health awareness in rural areas.",
      longDescription: "Access to healthcare is a fundamental right...",
      goalAmount: 200000,
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80",
    });
  }

  const existingEvents = await storage.getEvents();
  if (existingEvents.length === 0) {
    await storage.createEvent({
      title: "Annual Charity Gala",
      slug: "annual-charity-gala-2024",
      description: "Join us for an evening of giving and celebration.",
      date: new Date("2024-12-15T18:00:00Z"),
      location: "Grand Hotel, Mumbai",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
      capacity: 200,
    });
    await storage.createEvent({
      title: "Tree Plantation Drive",
      slug: "tree-plantation-drive-june",
      description: "Help us make the city greener.",
      date: new Date("2024-06-05T09:00:00Z"),
      location: "City Park",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      capacity: 100,
    });
  }

  const existingPosts = await storage.getBlogPosts();
  if (existingPosts.length === 0) {
    await storage.createBlogPost({
      title: "Impact of Education on Rural Development",
      slug: "impact-of-education",
      content: "Education is the cornerstone of development...",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80",
      published: true,
      authorId: null,
    });
    await storage.createBlogPost({
      title: "Success Stories: From Beneficiary to Benefactor",
      slug: "success-stories",
      content: "Read about how our programs have changed lives...",
      imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80",
      published: true,
      authorId: null,
    });
  }

  const existingChildren = await storage.getChildren();
  if (existingChildren.length === 0) {
    await storage.createChild({
      name: "Aarav",
      age: 8,
      gender: "Male",
      educationDetails: "Grade 3 - Government School",
      medicalDetails: "Routine pediatric care",
      sponsorshipStatus: "pending",
    });
    await storage.createChild({
      name: "Anaya",
      age: 10,
      gender: "Female",
      educationDetails: "Grade 5 - English Medium",
      medicalDetails: "Healthy",
      sponsorshipStatus: "sponsored",
    });
    await storage.createChild({
      name: "Vihaan",
      age: 7,
      gender: "Male",
      educationDetails: "Grade 2 - Primary School",
      medicalDetails: "Nutritional support required",
      sponsorshipStatus: "pending",
    });
  }

  const existingMessages = await storage.getContactMessages();
  if (existingMessages.length === 0) {
    await storage.createContactMessage({
      name: "Priya Sharma",
      email: "priya.demo@example.com",
      message: "Can I sponsor a child monthly?",
    });
    await storage.createContactMessage({
      name: "Rahul Patil",
      email: "rahul.demo@example.com",
      message: "I want to volunteer for teaching activities.",
    });
  }

  const existingGallery = await storage.getGalleryItems();
  if (existingGallery.length === 0) {
    await storage.createGalleryItem({
      title: "Art Workshop",
      mediaUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80",
      mediaType: "image",
      category: "activities",
    });
    await storage.createGalleryItem({
      title: "Annual Day Celebration",
      mediaUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80",
      mediaType: "image",
      category: "events",
    });
  }
}
