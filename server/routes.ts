import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

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
      const donation = await storage.createDonation(input);
      res.status(201).json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.donations.list.path, async (req, res) => {
      // In a real app, this should be protected
      const donations = await storage.getDonations();
      res.json(donations);
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

  app.post(api.events.register.path, async (req, res) => {
    try {
      const input = api.events.register.input.parse(req.body);
      const registration = await storage.registerForEvent({
        ...input,
        eventId: parseInt(req.params.id),
      });
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
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Seed Data
  await seedDatabase();

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
      raisedAmount: 125000,
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80",
    });
    await storage.createProgram({
      title: "Women Empowerment",
      slug: "women-empowerment",
      description: "Empowering women through skill development and self-help groups.",
      longDescription: "We believe in the power of women to transform communities...",
      goalAmount: 300000,
      raisedAmount: 80000,
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    });
    await storage.createProgram({
      title: "Health Camps",
      slug: "health-camps",
      description: "Free medical checkups and health awareness in rural areas.",
      longDescription: "Access to healthcare is a fundamental right...",
      goalAmount: 200000,
      raisedAmount: 45000,
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
}
