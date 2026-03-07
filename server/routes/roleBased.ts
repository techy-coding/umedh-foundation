import type { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../auth";
import { z } from "zod";
import { api } from "@shared/routes";

// Role-based middleware
const isDonor = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || (req.user.role !== "donor" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Donor access required" });
  }
  next();
};

const isVolunteer = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || (req.user.role !== "volunteer" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Volunteer access required" });
  }
  next();
};

const isBeneficiary = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || (req.user.role !== "beneficiary" && req.user.role !== "admin")) {
    return res.status(403).json({ message: "Beneficiary access required" });
  }
  next();
};

export function registerRoleBasedRoutes(app: Express): void {
  // ========== DONOR ROUTES ==========
  
  // Donor Dashboard
  app.get(api.donor.dashboard.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const donations = await storage.getDonationsByUserId(userId);
      const recurring = await storage.getRecurringDonationsByUserId(userId);
      
      const totalAmount = donations
        .filter(d => d.status === "completed")
        .reduce((sum, d) => sum + d.amount, 0);
      
      res.json({
        totalDonations: donations.filter(d => d.status === "completed").length,
        totalAmount,
        recurringCount: recurring.filter(d => d.status === "completed").length,
        recentDonations: donations.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching donor dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Donor Donation History
  app.get(api.donor.donations.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const donations = await storage.getDonationsByUserId(userId);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // Recurring Donations
  app.get(api.donor.recurring.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const donations = await storage.getRecurringDonationsByUserId(userId);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching recurring donations:", error);
      res.status(500).json({ message: "Failed to fetch recurring donations" });
    }
  });

  // Donor sponsorships list
  app.get(api.donor.sponsorships.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const records = await storage.getSponsorshipsByUserId(userId);
      res.json(records);
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
      res.status(500).json({ message: "Failed to fetch sponsorships" });
    }
  });

  // Create sponsorship (donor)
  app.post(api.donor.createSponsorship.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const input = api.donor.createSponsorship.input.parse(req.body);
      const user = req.user;
      const record = await storage.createSponsorship({
        childId: input.childId,
        sponsorUserId: user.id,
        sponsorName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        sponsorEmail: user.email,
        amount: input.amount,
        frequency: input.frequency || 'monthly',
      });
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating sponsorship (donor):", err);
      res.status(500).json({ message: "Failed to create sponsorship" });
    }
  });

  // Download Receipt
  app.get(api.donor.receipt.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const donationId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const donations = await storage.getDonationsByUserId(userId);
      const donation = donations.find(d => d.id === donationId);
      
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      
      if (!donation.receiptUrl) {
        return res.status(404).json({ message: "Receipt not generated yet" });
      }
      
      res.json({ receiptUrl: donation.receiptUrl });
    } catch (error) {
      console.error("Error fetching receipt:", error);
      res.status(500).json({ message: "Failed to fetch receipt" });
    }
  });

  // ========== VOLUNTEER ROUTES ==========
  
  // Volunteer Dashboard
  app.get(api.volunteer.dashboard.path, isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const volunteer = await storage.getVolunteerByUserId(userId);
      
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer profile not found" });
      }
      
      const tasks = await storage.getTasksByVolunteerId(volunteer.id);
      const events = await storage.getEvents();
      const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).slice(0, 5);
      
      res.json({
        volunteer,
        tasks,
        upcomingEvents,
      });
    } catch (error) {
      console.error("Error fetching volunteer dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Volunteer Tasks
  app.get(api.volunteer.tasks.path, isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const volunteer = await storage.getVolunteerByUserId(userId);
      
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer profile not found" });
      }
      
      const tasks = await storage.getTasksByVolunteerId(volunteer.id);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Complete Task
  app.put(api.volunteer.completeTask.path, isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.updateTaskStatus(taskId, "completed");
      res.json(task);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  // Volunteer Events
  app.get(api.volunteer.events.path, isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // My Events (registrations for this volunteer) including event details
  app.get('/api/volunteer/my-events', isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const regs = await storage.getRegistrationsWithEventByUserId(userId);
      res.json(regs);
    } catch (error) {
      console.error('Error fetching my events:', error);
      res.status(500).json({ message: 'Failed to fetch my events' });
    }
  });

  // Update attendance for a registration
  app.put('/api/volunteer/my-events/:id/attendance', isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const registrationId = parseInt(req.params.id);
      const userId = req.user.id;
      const { attended } = req.body;

      // ensure the registration belongs to this user
      const existing = await storage.getEventRegistrationById(registrationId);
      if (!existing || existing.userId !== userId) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      const updated = await storage.updateEventRegistrationAttendance(registrationId, attended);
      res.json(updated);
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ message: 'Failed to update attendance' });
    }
  });

  // Volunteer Messages
  app.post('/api/volunteer/messages', isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const payload = { userId: req.user.id, message: req.body.message };
      const msg = await storage.createVolunteerMessage(payload);
      res.status(201).json(msg);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  app.get('/api/volunteer/messages', isAuthenticated, isVolunteer, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const msgs = await storage.getVolunteerMessagesByUserId(userId);
      res.json(msgs);
    } catch (error) {
      console.error('Error fetching volunteer messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  });

  // Shared Inbox (for donor/volunteer/beneficiary/admin)
  app.get(api.inbox.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = (req.user.email || "").trim();
      const msgs = await storage.getVolunteerMessagesByUserId(userId);

      const getThreadIdFromMessage = (text?: string | null): string | null => {
        if (!text) return null;
        const m = text.match(/^\[THREAD:([^\]]+)\]/);
        return m ? m[1] : null;
      };
      const existingThreadIds = new Set(
        msgs.map((m) => getThreadIdFromMessage(m.message)).filter((v): v is string => !!v)
      );

      // Also surface contact-thread context (user message + admin reply) by same email.
      // This keeps inbox meaningful even when admin uses "Reply" flow in contact messages.
      const contactMessages = userEmail ? await storage.getContactMessagesByEmail(userEmail) : [];
      const virtualContactThreadMessages = contactMessages.flatMap((m) => {
        const threadId = `contact:${m.id}`;
        if (existingThreadIds.has(threadId)) {
          return [];
        }
        const threadTag = `[THREAD:${threadId}]`;
        const rows: Array<{ id: number; userId: string; message: string; createdAt: Date | string }> = [
          {
            id: 2000000000 + m.id,
            userId,
            message: `${threadTag} [YOU] ${m.message}`,
            createdAt: m.createdAt || new Date(),
          },
        ];
        if (m.adminReply) {
          rows.push({
            id: 1000000000 + m.id,
            userId,
            message: `${threadTag} [ADMIN] ${m.adminReply}`,
            createdAt: m.repliedAt || m.createdAt || new Date(),
          });
        }
        return rows;
      });

      const merged = [
        ...msgs,
        ...virtualContactThreadMessages,
      ].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });

      res.json(merged);
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
      res.status(500).json({ message: "Failed to fetch inbox" });
    }
  });

  // ========== BENEFICIARY ROUTES ==========
  
  // Submit Application
  app.post(api.beneficiary.apply.path, async (req, res) => {
    try {
      const input = api.beneficiary.apply.input.parse(req.body);
      const userId = (req as any).isAuthenticated?.() ? (req as any).user?.id : undefined;
      const application = await storage.createBeneficiaryApplication({
        ...input,
        userId: userId || input.userId,
      });
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get Applications (for logged-in user; ownership-filtered)
  app.get(api.beneficiary.applications.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email as string | undefined;
      const [linked, byEmail] = await Promise.all([
        storage.getBeneficiaryApplicationsByUserId(userId),
        userEmail ? storage.getBeneficiaryApplicationsByEmail(userEmail) : Promise.resolve([]),
      ]);

      // Backfill old records created before userId-linking was enabled.
      await Promise.all(
        byEmail
          .filter((app) => !app.userId)
          .map((app) => storage.linkBeneficiaryApplicationToUser(app.id, userId))
      );

      const mergedMap = new Map<number, any>();
      [...linked, ...byEmail].forEach((app) => mergedMap.set(app.id, app));
      const applications = Array.from(mergedMap.values()).sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get Application Details (ownership-filtered)
  app.get(api.beneficiary.application.path, isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const application = await storage.getBeneficiaryApplicationById(id);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns this application
      if (application.userId !== req.user.id && req.user.role !== "admin") {
        if (application.email && req.user.email && application.email === req.user.email) {
          await storage.linkBeneficiaryApplicationToUser(application.id, req.user.id);
        } else {
          return res.status(403).json({ message: "Access denied" });
        }
      }
      
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Support Tracking (for logged-in user)
  app.get(api.beneficiary.support.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userEmail = req.user.email as string | undefined;
      const [linked, byEmail] = await Promise.all([
        storage.getBeneficiaryApplicationsByUserId(userId),
        userEmail ? storage.getBeneficiaryApplicationsByEmail(userEmail) : Promise.resolve([]),
      ]);

      await Promise.all(
        byEmail
          .filter((app) => !app.userId)
          .map((app) => storage.linkBeneficiaryApplicationToUser(app.id, userId))
      );

      const mergedMap = new Map<number, any>();
      [...linked, ...byEmail].forEach((app) => mergedMap.set(app.id, app));
      const applications = Array.from(mergedMap.values());
      // Filter to show only approved applications with funding
      const supported = applications.filter(a => a.status === "approved" && a.fundingAmount);
      res.json(supported);
    } catch (error) {
      console.error("Error fetching support:", error);
      res.status(500).json({ message: "Failed to fetch support information" });
    }
  });

  // ========== ADMIN ENHANCED ROUTES ==========

  app.get(api.admin.programs.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const list = await storage.getPrograms();
      res.json(list);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.post(api.admin.createProgram.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const input = api.admin.createProgram.input.parse(req.body);
      const created = await storage.createProgram(input);
      res.status(201).json(created);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating program:", err);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put(api.admin.updateProgram.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      const input = api.admin.updateProgram.input.parse(req.body);
      const updated = await storage.updateProgram(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating program:", err);
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.delete(api.admin.deleteProgram.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      await storage.deleteProgram(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });
  
  // Get All Beneficiaries
  app.get(api.admin.beneficiaries.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const applications = await storage.getBeneficiaryApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching beneficiaries:", error);
      res.status(500).json({ message: "Failed to fetch beneficiaries" });
    }
  });

  // Review Beneficiary Application
  app.put(api.admin.reviewBeneficiary.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = api.admin.reviewBeneficiary.input.parse(req.body);
      const application = await storage.updateBeneficiaryApplicationStatus(id, status, req.user.id, notes);
      res.json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Update Funding
  app.put(api.admin.updateFunding.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { fundingAmount, fundingStatus } = api.admin.updateFunding.input.parse(req.body);
      const application = await storage.updateBeneficiaryApplicationFunding(id, fundingAmount, fundingStatus);
      res.json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get All Volunteers
  app.get(api.admin.volunteers.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      res.status(500).json({ message: "Failed to fetch volunteers" });
    }
  });

  // ========== ADMIN BLOG MANAGEMENT ==========
  app.get(api.admin.blogs.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.post(api.admin.createBlog.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const input = api.admin.createBlog.input.parse(req.body);
      const post = await storage.createBlogPost({ ...input, authorId: req.user.id });
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating blog:", err);
      res.status(500).json({ message: "Failed to create blog" });
    }
  });

  app.put(api.admin.updateBlog.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      const input = api.admin.updateBlog.input.parse(req.body);
      const updated = await storage.updateBlogPost(id, input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating blog:", err);
      res.status(500).json({ message: "Failed to update blog" });
    }
  });

  app.delete(api.admin.deleteBlog.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      await storage.deleteBlogPost(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });

  // Approve Volunteer
  app.put(api.admin.approveVolunteer.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const volunteer = await storage.approveVolunteer(id, req.user.id);
      res.json(volunteer);
    } catch (error) {
      console.error("Error approving volunteer:", error);
      res.status(500).json({ message: "Failed to approve volunteer" });
    }
  });

  // Reject Volunteer
  app.put(api.admin.rejectVolunteer.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const volunteer = await storage.rejectVolunteer(id);
      res.json(volunteer);
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      res.status(500).json({ message: "Failed to reject volunteer" });
    }
  });

  // Assign Task to Volunteer
  app.post(api.admin.assignTask.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const volunteerId = parseInt(req.params.id);
      const input = api.admin.assignTask.input.parse(req.body);
      const task = await storage.createTask({ ...input, volunteerId });
      res.status(201).json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Get All Users
  app.get(api.admin.users.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update User Role
  app.put(api.admin.updateUserRole.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    try {
      const userId = req.params.id;
      const { role } = api.admin.updateUserRole.input.parse(req.body);
      const user = await storage.updateUserRole(userId, role);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // ========== PUBLIC CHILDREN LIST ==========
  app.get(api.children.list.path, async (req: any, res) => {
    try {
      const list = await storage.getChildren();
      res.json(list);
    } catch (error) {
      console.error("Error fetching children list:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  // ========== DONOR PROFILE ROUTES ==========
  app.get(api.donor.profile.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching donor profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put(api.donor.updateProfile.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const updates = api.donor.updateProfile.input.parse(req.body);
      const user = await storage.updateUserProfile(req.user.id, updates);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating donor profile:", err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // donor receipt export
  app.get(api.donor.receipts.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const donations = await storage.getDonationsByUserId(req.user.id);
      // generate simple CSV
      const header = ['Date', 'Amount', 'Status', 'ReceiptUrl'];
      const lines = donations.map(d => [
        d.createdAt ? new Date(d.createdAt).toISOString() : '',
        (d.amount / 100).toString(),
        d.status,
        d.receiptUrl || '',
      ].join(','));
      const csv = [header.join(','), ...lines].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    } catch (error) {
      console.error('Error generating receipts:', error);
      res.status(500).json({ message: 'Failed to export receipts' });
    }
  });

  app.put(api.donor.generateReceipt.path, isAuthenticated, isDonor, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { receiptUrl } = api.donor.generateReceipt.input.parse(req.body);
      // ensure donation belongs to user
      const list = await storage.getDonationsByUserId(req.user.id);
      const donation = list.find(d => d.id === id);
      if (!donation) return res.status(404).json({ message: 'Donation not found' });
      await storage.updateDonationReceipt(id, receiptUrl);
      const updated = { ...donation, receiptGenerated: true, receiptUrl };
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error('Error generating donor receipt:', err);
      res.status(500).json({ message: 'Failed to generate receipt' });
    }
  });
  // ========== ADMIN CHILDREN MANAGEMENT ==========
  app.get(api.admin.children.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const list = await storage.getChildren();
      res.json(list);
    } catch (error) {
      console.error("Error fetching children list:", error);
      res.status(500).json({ message: "Failed to fetch children" });
    }
  });

  app.post(api.admin.createChild.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.admin.createChild.input.parse(req.body);
      const child = await storage.createChild(input);
      res.status(201).json(child);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating child:", err);
      res.status(500).json({ message: "Failed to create child" });
    }
  });

  app.put(api.admin.updateChild.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      const updates = api.admin.updateChild.input.parse(req.body);
      const child = await storage.updateChild(id, updates);
      res.json(child);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating child:", err);
      res.status(500).json({ message: "Failed to update child" });
    }
  });

  app.delete(api.admin.deleteChild.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      await storage.deleteChild(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting child:", error);
      res.status(500).json({ message: "Failed to delete child" });
    }
  });

  // ========== ADMIN SPONSORSHIP MANAGEMENT ==========
  app.get(api.admin.sponsorships.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const records = await storage.getSponsorships();
      res.json(records);
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
      res.status(500).json({ message: "Failed to fetch sponsorships" });
    }
  });

  app.post(api.admin.createSponsorship.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.admin.createSponsorship.input.parse(req.body);
      const record = await storage.createSponsorship(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating sponsorship:", err);
      res.status(500).json({ message: "Failed to create sponsorship" });
    }
  });

  app.put(api.admin.updateSponsorshipStatus.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const id = parseInt(req.params.id);
      const { status } = api.admin.updateSponsorshipStatus.input.parse(req.body);
      const record = await storage.updateSponsorshipStatus(id, status);
      res.json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating sponsorship status:", err);
      res.status(500).json({ message: "Failed to update sponsorship status" });
    }
  });

  // ========== ADMIN GALLERY MANAGEMENT ==========
  app.get(api.admin.gallery.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const items = await storage.getGalleryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery" });
    }
  });

  app.post(api.admin.createGalleryItem.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const input = api.admin.createGalleryItem.input.parse(req.body);
      const item = await storage.createGalleryItem(input);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating gallery item:", err);
      res.status(500).json({ message: "Failed to create gallery item" });
    }
  });

  app.delete(api.admin.deleteGalleryItem.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id);
      await storage.deleteGalleryItem(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  // ========== ADMIN MESSAGES ==========
  app.get(api.admin.messages.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post(api.admin.sendInboxMessage.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const input = api.admin.sendInboxMessage.input.parse(req.body);
      const payload = {
        userId: input.userId.trim(),
        message: `[ADMIN] ${input.message.trim()}`,
      };
      const msg = await storage.createVolunteerMessage(payload);
      res.status(201).json(msg);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error sending inbox message:", err);
      res.status(500).json({ message: "Failed to send inbox message" });
    }
  });

  app.put(api.admin.replyMessage.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      const { reply } = api.admin.replyMessage.input.parse(req.body);
      const updated = await storage.updateContactMessageReply(id, reply);

      // If the contact email belongs to a registered user, also deliver to inbox.
      try {
        const normalizedEmail = (updated.email || "").trim().toLowerCase();
        let user = await storage.getUserByEmail(updated.email);

        // Fallback for case/whitespace mismatch between contact message and user record.
        if (!user && normalizedEmail) {
          const users = await storage.getAllUsers();
          user = users.find((u) => (u.email || "").trim().toLowerCase() === normalizedEmail);
        }

        if (user?.id) {
          const threadTag = `[THREAD:contact:${id}]`;
          const existingUserMsgs = await storage.getVolunteerMessagesByUserId(user.id);
          const hasContext = existingUserMsgs.some((m) => (m.message || "").startsWith(`${threadTag} [YOU]`));

          // Keep user-side context in inbox for contact reply threads.
          if (!hasContext) {
            await storage.createVolunteerMessage({
              userId: user.id,
              message: `${threadTag} [YOU] ${updated.message}`,
            });
          }
          await storage.createVolunteerMessage({
            userId: user.id,
            message: `${threadTag} [ADMIN] ${reply.trim()}`,
          });
        }
      } catch (inboxErr) {
        console.error("Error mirroring admin reply to inbox:", inboxErr);
      }

      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error replying to message:", err);
      res.status(500).json({ message: "Failed to reply to message" });
    }
  });

  app.get(api.admin.activities.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const [childrenList, donationsList, volunteersList, eventsList] = await Promise.all([
        storage.getChildren(),
        storage.getDonations(),
        storage.getVolunteersByStatus("pending"),
        storage.getEvents(),
      ]);

      const items = [
        ...childrenList.slice(0, 3).map((c) => ({
          type: "child",
          description: `New child added: ${c.name}`,
          createdAt: (c.createdAt || new Date()).toISOString(),
        })),
        ...donationsList.slice(0, 3).map((d) => ({
          type: "donation",
          description: `Donation received from ${d.donorName}`,
          createdAt: (d.createdAt || new Date()).toISOString(),
        })),
        ...volunteersList.slice(0, 3).map((v) => ({
          type: "volunteer",
          description: `Volunteer registration pending: ${v.name}`,
          createdAt: (v.createdAt || new Date()).toISOString(),
        })),
        ...eventsList.slice(0, 3).map((e) => ({
          type: "event",
          description: `Event scheduled: ${e.title}`,
          createdAt: (e.createdAt || new Date()).toISOString(),
        })),
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

      res.json(items);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get(api.admin.notifications.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const [pendingVolunteers, messages, beneficiaries] = await Promise.all([
        storage.getVolunteersByStatus("pending"),
        storage.getContactMessages(),
        storage.getBeneficiaryApplications(),
      ]);

      const unrepliedMessages = messages.filter((m) => !m.adminReply);
      const underReview = beneficiaries.filter((b) => b.status === "under_review" || b.status === "pending");

      const actionable = [
        {
          title: "Volunteer Approvals",
          description: `${pendingVolunteers.length} volunteer applications need review`,
          count: pendingVolunteers.length,
          severity: "warning" as const,
        },
        {
          title: "Contact Messages",
          description: `${unrepliedMessages.length} inquiries are awaiting reply`,
          count: unrepliedMessages.length,
          severity: "warning" as const,
        },
        {
          title: "Beneficiary Applications",
          description: `${underReview.length} beneficiary applications are pending`,
          count: underReview.length,
          severity: "info" as const,
        },
      ].filter((item) => item.count > 0);

      if (actionable.length === 0) {
        return res.json([
          {
            title: "All Caught Up",
            description: "No pending admin notifications.",
            count: 0,
            severity: "success" as const,
          },
        ]);
      }

      res.json(actionable);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // ========== ADMIN REPORTS ==========
  app.get(api.admin.reports.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      // generate simple summary from storage
      const [children, donations, sponsorships, volunteers, events] = await Promise.all([
        storage.getChildren(),
        storage.getDonations(),
        storage.getSponsorships(),
        storage.getVolunteersByStatus("approved"),
        storage.getEvents(),
      ]);
      const monthlyDonationTrend = donations.reduce((acc: any, d) => {
        if (!d.createdAt) return acc;
        const month = new Date(d.createdAt).toLocaleString("en-US", { month: "short" });
        const entry = acc.find((e: any) => e.month === month);
        const amount = d.amount / 100;
        if (entry) entry.amount += amount;
        else acc.push({ month, amount });
        return acc;
      }, [] as Array<{ month: string; amount: number }>);
      res.json({
        totalChildren: children.length,
        totalDonations: donations.length,
        totalSponsors: sponsorships.length,
        totalVolunteers: volunteers.length,
        totalEvents: events.length,
        monthlyDonationTrend,
      });
    } catch (error) {
      console.error("Error generating report summary:", error);
      res.status(500).json({ message: "Failed to generate reports" });
    }
  });

  app.get(api.admin.reportDonations.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const list = await storage.getDonations();
      res.json(list);
    } catch (error) {
      console.error("Error fetching donation report:", error);
      res.status(500).json({ message: "Failed to fetch donation report" });
    }
  });

  app.get(api.admin.reportSponsorships.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const list = await storage.getSponsorships();
      res.json(list);
    } catch (error) {
      console.error("Error fetching sponsorship report:", error);
      res.status(500).json({ message: "Failed to fetch sponsorship report" });
    }
  });

  app.get(api.admin.reportVolunteers.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const list = await storage.getVolunteersByStatus("approved");
      res.json(list);
    } catch (error) {
      console.error("Error fetching volunteer report:", error);
      res.status(500).json({ message: "Failed to fetch volunteer report" });
    }
  });

  app.get(api.admin.reportEvents.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const list = await storage.getEvents();
      res.json(list);
    } catch (error) {
      console.error("Error fetching event report:", error);
      res.status(500).json({ message: "Failed to fetch event report" });
    }
  });

  app.get(api.admin.reportCsv.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const type = req.params.type;
      let csv = "";

      if (type === "donations") {
        const rows = await storage.getDonations();
        csv = [
          "id,donorName,donorEmail,amount,status,createdAt",
          ...rows.map((r) =>
            [r.id, r.donorName, r.donorEmail, (r.amount / 100).toString(), r.status, r.createdAt ? new Date(r.createdAt).toISOString() : ""].join(",")
          ),
        ].join("\n");
      } else if (type === "sponsorships") {
        const rows = await storage.getSponsorships();
        csv = [
          "id,childId,sponsorName,sponsorEmail,amount,frequency,status,startDate",
          ...rows.map((r) =>
            [r.id, r.childId, r.sponsorName, r.sponsorEmail, r.amount.toString(), r.frequency, r.status, r.startDate ? new Date(r.startDate).toISOString() : ""].join(",")
          ),
        ].join("\n");
      } else if (type === "volunteers") {
        const rows = await storage.getVolunteersByStatus("approved");
        csv = [
          "id,name,email,status,approvedAt,createdAt",
          ...rows.map((r) =>
            [r.id, r.name, r.email, r.status, r.approvedAt ? new Date(r.approvedAt).toISOString() : "", r.createdAt ? new Date(r.createdAt).toISOString() : ""].join(",")
          ),
        ].join("\n");
      } else if (type === "events") {
        const rows = await storage.getEvents();
        csv = [
          "id,title,date,location,capacity,registeredCount",
          ...rows.map((r) => [r.id, r.title, new Date(r.date).toISOString(), r.location, r.capacity ?? "", r.registeredCount ?? 0].join(",")),
        ].join("\n");
      } else {
        return res.status(400).json({ message: "Invalid report type" });
      }

      res.setHeader("Content-Type", "text/csv");
      res.send(csv);
    } catch (error) {
      console.error("Error generating CSV report:", error);
      res.status(500).json({ message: "Failed to generate CSV report" });
    }
  });

  // ========== ADMIN EVENTS ==========
  app.get(api.admin.events.list.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const evs = await storage.getEvents();
      res.json(evs);
    } catch (err) {
      console.error("Error fetching admin events:", err);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post(api.admin.events.create.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const input = api.admin.events.create.input.parse(req.body);
      const ev = await storage.createEvent(input);
      res.status(201).json(ev);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating event:", err);
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put(api.admin.events.update.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      const input = api.admin.events.update.input.parse(req.body);
      const ev = await storage.updateEvent(id, input);
      res.json(ev);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating event:", err);
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete(api.admin.events.delete.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id, 10);
      await storage.deleteEvent(id);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.get(api.admin.eventRegistrations.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const eventId = parseInt(req.params.id, 10);
      const regs = await storage.getEventRegistrationsByEventId(eventId);
      res.json(regs);
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.put(api.admin.updateEventRegistrationAttendance.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const registrationId = parseInt(req.params.id, 10);
      const { attended } = api.admin.updateEventRegistrationAttendance.input.parse(req.body);
      const existing = await storage.getEventRegistrationById(registrationId);
      if (!existing) return res.status(404).json({ message: "Registration not found" });
      const updated = await storage.updateEventRegistrationAttendance(registrationId, attended);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating registration attendance:", err);
      res.status(500).json({ message: "Failed to update attendance" });
    }
  });

  // ========== ADMIN SETTINGS ==========
  app.put(api.admin.settings.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const updates = api.admin.settings.input.parse(req.body);
      const user = await storage.updateUserProfile(req.user.id, updates);
      const { passwordHash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating admin settings:", err);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // ========== ADMIN DONATION RECEIPT ==========
  app.put(api.admin.generateReceipt.path, isAuthenticated, async (req: any, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
      const id = parseInt(req.params.id);
      const { receiptUrl } = api.admin.generateReceipt.input.parse(req.body);
      await storage.updateDonationReceipt(id, receiptUrl);
      const donationList = await storage.getDonations();
      const donation = donationList.find(d => d.id === id);
      if (!donation) return res.status(404).json({ message: "Donation not found" });
      res.json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error generating receipt:", err);
      res.status(500).json({ message: "Failed to generate receipt" });
    }
  });
}
