import {
  programs,
  donations,
  events,
  eventRegistrations,
  volunteers,
  volunteerTasks,
  blogPosts,
  contactMessages,
  beneficiaryApplications,
  children,
  sponsorships,
  galleryItems,
  volunteerMessages,
  type InsertProgram,
  type InsertDonation,
  type InsertEvent,
  type InsertEventRegistration,
  type InsertVolunteer,
  type InsertVolunteerTask,
  type InsertBlogPost,
  type InsertContactMessage,
  type InsertBeneficiaryApplication,
  type InsertChild,
  type InsertSponsorship,
  type InsertGalleryItem,
  type InsertVolunteerMessage,
  type Program,
  type Donation,
  type Event,
  type EventRegistration,
  type Volunteer,
  type VolunteerTask,
  type VolunteerMessage,
  type BlogPost,
  type ContactMessage,
  type BeneficiaryApplication,
  type Child,
  type Sponsorship,
  type GalleryItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./auth/storage";
import { users } from "@shared/models/auth";

export interface IStorage extends IAuthStorage {
  // Programs
  getPrograms(): Promise<Program[]>;
  getProgramBySlug(slug: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: number): Promise<void>;
  incrementProgramRaised(id: number, amount: number): Promise<Program>;
  reconcileProgramRaisedAmounts(): Promise<void>;

  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
  getDonationsByEmail(email: string): Promise<Donation[]>;
  getDonationById(id: number): Promise<Donation | undefined>;
  updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation>;

  // Events
  getEvents(): Promise<Event[]>;
  getEventBySlug(slug: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  registerForEvent(registration: InsertEventRegistration): Promise<EventRegistration>;

  // Volunteers
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;

  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;

  // Donations (Enhanced)
  getDonationsByUserId(userId: string): Promise<Donation[]>;
  getRecurringDonationsByUserId(userId: string): Promise<Donation[]>;
  updateDonationReceipt(donationId: number, receiptUrl: string): Promise<void>;

  // Volunteers (Enhanced)
  getVolunteerByUserId(userId: string): Promise<Volunteer | undefined>;
  getVolunteers(): Promise<Volunteer[]>;
  getVolunteersByStatus(status: string): Promise<Volunteer[]>;
  approveVolunteer(volunteerId: number, userId: string): Promise<Volunteer>;
  rejectVolunteer(volunteerId: number): Promise<Volunteer>;

  // Volunteer Tasks
  getTasksByVolunteerId(volunteerId: number): Promise<VolunteerTask[]>;
  createTask(task: InsertVolunteerTask): Promise<VolunteerTask>;
  updateTaskStatus(taskId: number, status: string): Promise<VolunteerTask>;
  getTasksByEventId(eventId: number): Promise<VolunteerTask[]>;

  // Beneficiary Applications
  createBeneficiaryApplication(application: InsertBeneficiaryApplication): Promise<BeneficiaryApplication>;
  getBeneficiaryApplications(): Promise<BeneficiaryApplication[]>;
  getBeneficiaryApplicationById(id: number): Promise<BeneficiaryApplication | undefined>;
  getBeneficiaryApplicationsByUserId(userId: string): Promise<BeneficiaryApplication[]>;
  getBeneficiaryApplicationsByEmail(email: string): Promise<BeneficiaryApplication[]>;
  linkBeneficiaryApplicationToUser(id: number, userId: string): Promise<BeneficiaryApplication>;
  updateBeneficiaryApplicationStatus(id: number, status: string, reviewedBy: string, notes?: string): Promise<BeneficiaryApplication>;
  updateBeneficiaryApplicationFunding(id: number, fundingAmount: number, fundingStatus: string): Promise<BeneficiaryApplication>;

  // Users
  getAllUsers(): Promise<any[]>;
  updateUserRole(userId: string, role: string): Promise<any>;
  updateUserProfile(userId: string, data: { firstName?: string; lastName?: string; profileImageUrl?: string; address?: string; paymentMethod?: string }): Promise<any>;

  // Event registrations (volunteer)
  getEventRegistrationsByUserId(userId: string): Promise<Event[]>;
  // enhanced registration info with event data and attendance
  getRegistrationsWithEventByUserId(userId: string): Promise<Array<{ registration: EventRegistration; event: Event }>>;
  getEventRegistrationsByEventId(eventId: number): Promise<EventRegistration[]>;
  getEventRegistrationById(id: number): Promise<EventRegistration | undefined>;
  updateEventRegistrationAttendance(registrationId: number, attended: boolean): Promise<any>;

  // Volunteer Messages
  createVolunteerMessage(message: InsertVolunteerMessage): Promise<VolunteerMessage>;
  getVolunteerMessagesByUserId(userId: string): Promise<VolunteerMessage[]>;

  // Children
  getChildren(): Promise<Child[]>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: number, child: Partial<InsertChild>): Promise<Child>;
  deleteChild(id: number): Promise<void>;

  // Sponsorships
  getSponsorships(): Promise<Sponsorship[]>;
  getSponsorshipsByUserId(userId: string): Promise<Sponsorship[]>;
  createSponsorship(sponsorship: InsertSponsorship): Promise<Sponsorship>;
  updateSponsorshipStatus(id: number, status: string): Promise<Sponsorship>;

  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: number): Promise<void>;

  // Messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessagesByEmail(email: string): Promise<ContactMessage[]>;
  updateContactMessageReply(id: number, reply: string): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  // Auth Storage Delegation
  getUser = authStorage.getUser;
  getUserByEmail = authStorage.getUserByEmail;
  upsertUser = authStorage.upsertUser;
  createAdminUser = authStorage.createAdminUser;
  updatePassword = authStorage.updatePassword;

  // Programs
  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs).orderBy(desc(programs.createdAt));
  }

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.slug, slug));
    return program;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db.insert(programs).values(insertProgram).returning();
    return program;
  }

  async updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program> {
    const [updated] = await db.update(programs).set(program).where(eq(programs.id, id)).returning();
    return updated;
  }

  async deleteProgram(id: number): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  async incrementProgramRaised(id: number, amount: number): Promise<Program> {
    const [updated] = await db
      .update(programs)
      .set({ raisedAmount: sql`coalesce(${programs.raisedAmount}, 0) + ${amount}` as any })
      .where(eq(programs.id, id))
      .returning();
    return updated;
  }

  async reconcileProgramRaisedAmounts(): Promise<void> {
    const allPrograms = await db.select().from(programs);
    for (const program of allPrograms) {
      const [row] = await db
        .select({
          totalPaise: sql<number>`coalesce(sum(${donations.amount}), 0)`,
        })
        .from(donations)
        .where(
          and(
            eq(donations.programId, program.id),
            eq(donations.status, "completed")
          )
        );
      const raisedRupees = Math.round((row?.totalPaise || 0) / 100);
      await db
        .update(programs)
        .set({ raisedAmount: raisedRupees })
        .where(eq(programs.id, program.id));
    }
  }

  // Donations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(insertDonation).returning();
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
      return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  async getDonationsByEmail(email: string): Promise<Donation[]> {
      return await db.select().from(donations).where(eq(donations.donorEmail, email)).orderBy(desc(donations.createdAt));
  }

  async getDonationById(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation;
  }

  async updateDonationStatus(id: number, status: string, paymentId?: string): Promise<Donation> {
    const [donation] = await db
      .update(donations)
      .set({ status, paymentId })
      .where(eq(donations.id, id))
      .returning();
    return donation;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(events.date);
  }

  async getEventBySlug(slug: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.slug, slug));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updated] = await db.update(events).set(event).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async registerForEvent(insertRegistration: InsertEventRegistration): Promise<EventRegistration> {
    const [registration] = await db.insert(eventRegistrations).values(insertRegistration).returning();
    return registration;
  }

  // Volunteers
  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const [volunteer] = await db.insert(volunteers).values(insertVolunteer).returning();
    return volunteer;
  }

  // Blog
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [updated] = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return updated;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Contact
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  // Donations (Enhanced)
  async getDonationsByUserId(userId: string): Promise<Donation[]> {
    return await db.select().from(donations).where(eq(donations.userId, userId)).orderBy(desc(donations.createdAt));
  }

  async getRecurringDonationsByUserId(userId: string): Promise<Donation[]> {
    return await db.select().from(donations).where(
      and(eq(donations.userId, userId), eq(donations.isRecurring, true))
    ).orderBy(desc(donations.createdAt));
  }

  async updateDonationReceipt(donationId: number, receiptUrl: string): Promise<void> {
    await db.update(donations).set({ receiptGenerated: true, receiptUrl }).where(eq(donations.id, donationId));
  }

  // Volunteers (Enhanced)
  async getVolunteerByUserId(userId: string): Promise<Volunteer | undefined> {
    const [volunteer] = await db.select().from(volunteers).where(eq(volunteers.userId, userId));
    return volunteer;
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers).orderBy(desc(volunteers.createdAt));
  }

  async getVolunteersByStatus(status: string): Promise<Volunteer[]> {
    return await db.select().from(volunteers).where(eq(volunteers.status, status)).orderBy(desc(volunteers.createdAt));
  }

  async approveVolunteer(volunteerId: number, userId: string): Promise<Volunteer> {
    const [volunteer] = await db.update(volunteers)
      .set({ status: "approved", approvedAt: new Date(), userId })
      .where(eq(volunteers.id, volunteerId))
      .returning();
    return volunteer;
  }

  async rejectVolunteer(volunteerId: number): Promise<Volunteer> {
    const [volunteer] = await db.update(volunteers)
      .set({ status: "rejected" })
      .where(eq(volunteers.id, volunteerId))
      .returning();
    return volunteer;
  }

  // Volunteer Tasks
  async getTasksByVolunteerId(volunteerId: number): Promise<VolunteerTask[]> {
    return await db.select().from(volunteerTasks).where(eq(volunteerTasks.volunteerId, volunteerId)).orderBy(desc(volunteerTasks.createdAt));
  }

  async createTask(task: InsertVolunteerTask): Promise<VolunteerTask> {
    const [newTask] = await db.insert(volunteerTasks).values(task).returning();
    return newTask;
  }

  async updateTaskStatus(taskId: number, status: string): Promise<VolunteerTask> {
    const updateData: any = { status };
    if (status === "completed") {
      updateData.completedAt = new Date();
    }
    const [task] = await db.update(volunteerTasks).set(updateData).where(eq(volunteerTasks.id, taskId)).returning();
    return task;
  }

  async getTasksByEventId(eventId: number): Promise<VolunteerTask[]> {
    return await db.select().from(volunteerTasks).where(eq(volunteerTasks.eventId, eventId)).orderBy(desc(volunteerTasks.createdAt));
  }

  // Beneficiary Applications
  async createBeneficiaryApplication(application: InsertBeneficiaryApplication): Promise<BeneficiaryApplication> {
    const [newApplication] = await db.insert(beneficiaryApplications).values(application).returning();
    return newApplication;
  }

  async getBeneficiaryApplications(): Promise<BeneficiaryApplication[]> {
    return await db.select().from(beneficiaryApplications).orderBy(desc(beneficiaryApplications.createdAt));
  }

  async getBeneficiaryApplicationById(id: number): Promise<BeneficiaryApplication | undefined> {
    const [application] = await db.select().from(beneficiaryApplications).where(eq(beneficiaryApplications.id, id));
    return application;
  }

  async getBeneficiaryApplicationsByUserId(userId: string): Promise<BeneficiaryApplication[]> {
    return await db.select().from(beneficiaryApplications).where(eq(beneficiaryApplications.userId, userId)).orderBy(desc(beneficiaryApplications.createdAt));
  }

  async getBeneficiaryApplicationsByEmail(email: string): Promise<BeneficiaryApplication[]> {
    return await db
      .select()
      .from(beneficiaryApplications)
      .where(eq(beneficiaryApplications.email, email))
      .orderBy(desc(beneficiaryApplications.createdAt));
  }

  async linkBeneficiaryApplicationToUser(id: number, userId: string): Promise<BeneficiaryApplication> {
    const [application] = await db
      .update(beneficiaryApplications)
      .set({ userId, updatedAt: new Date() })
      .where(eq(beneficiaryApplications.id, id))
      .returning();
    return application;
  }

  async updateBeneficiaryApplicationStatus(id: number, status: string, reviewedBy: string, notes?: string): Promise<BeneficiaryApplication> {
    const [application] = await db.update(beneficiaryApplications)
      .set({ status, reviewedBy, reviewedAt: new Date(), notes, updatedAt: new Date() })
      .where(eq(beneficiaryApplications.id, id))
      .returning();
    return application;
  }

  async updateBeneficiaryApplicationFunding(id: number, fundingAmount: number, fundingStatus: string): Promise<BeneficiaryApplication> {
    const [application] = await db.update(beneficiaryApplications)
      .set({ fundingAmount, fundingStatus, updatedAt: new Date() })
      .where(eq(beneficiaryApplications.id, id))
      .returning();
    return application;
  }

  // Users
  async getAllUsers(): Promise<any[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    const [user] = await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }

  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string; profileImageUrl?: string; address?: string; paymentMethod?: string }): Promise<any> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Event registrations (volunteer)
  async getEventRegistrationsByUserId(userId: string): Promise<Event[]> {
    // join event_registrations with events
    const regs = await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId));
    const eventIds = regs.map(r => r.eventId).filter((id): id is number => !!id);
    if (eventIds.length === 0) return [];
    // `in` method isn't strongly typed on PgColumn, so cast to any
    return await db.select().from(events).where((events.id as any).in(eventIds as any)).orderBy(events.date);
  }

  // Event registrations helpers
  async getRegistrationsWithEventByUserId(userId: string): Promise<Array<{ registration: EventRegistration; event: Event }>> {
    const regs = await db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId));
    if (regs.length === 0) return [];
    const eventIds = regs.map(r => r.eventId).filter((id): id is number => !!id);
    const eventsList = await db.select().from(events).where((events.id as any).in(eventIds as any));
    const eventMap = new Map(eventsList.map(ev => [ev.id, ev] as const));
    return regs.map(r => ({ registration: r, event: eventMap.get(r.eventId)! }));
  }

  async getEventRegistrationsByEventId(eventId: number): Promise<EventRegistration[]> {
    return await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(desc(eventRegistrations.createdAt));
  }

  async getEventRegistrationById(id: number): Promise<EventRegistration | undefined> {
    const [reg] = await db.select().from(eventRegistrations).where(eq(eventRegistrations.id, id));
    return reg;
  }

  async updateEventRegistrationAttendance(registrationId: number, attended: boolean): Promise<EventRegistration> {
    const [reg] = await db
      .update(eventRegistrations)
      .set({ attended })
      .where(eq(eventRegistrations.id, registrationId))
      .returning();
    return reg;
  }

  // Volunteer Messages
  async createVolunteerMessage(message: InsertVolunteerMessage): Promise<VolunteerMessage> {
    const [msg] = await db.insert(volunteerMessages).values(message).returning();
    return msg;
  }

  async getVolunteerMessagesByUserId(userId: string): Promise<VolunteerMessage[]> {
    return await db.select().from(volunteerMessages).where(eq(volunteerMessages.userId, userId)).orderBy(desc(volunteerMessages.createdAt));
  }

  // Children
  async getChildren(): Promise<Child[]> {
    return await db.select().from(children).orderBy(desc(children.createdAt));
  }

  async createChild(child: InsertChild): Promise<Child> {
    const [record] = await db.insert(children).values(child).returning();
    return record;
  }

  async updateChild(id: number, child: Partial<InsertChild>): Promise<Child> {
    const [record] = await db.update(children).set(child).where(eq(children.id, id)).returning();
    return record;
  }

  async deleteChild(id: number): Promise<void> {
    await db.delete(children).where(eq(children.id, id));
  }

  // Sponsorships
  async getSponsorships(): Promise<Sponsorship[]> {
    return await db.select().from(sponsorships).orderBy(desc(sponsorships.createdAt));
  }

  async getSponsorshipsByUserId(userId: string): Promise<Sponsorship[]> {
    return await db
      .select()
      .from(sponsorships)
      .where(eq(sponsorships.sponsorUserId, userId))
      .orderBy(desc(sponsorships.createdAt));
  }

  async createSponsorship(sponsorship: InsertSponsorship): Promise<Sponsorship> {
    const [record] = await db.insert(sponsorships).values(sponsorship).returning();
    await db
      .update(children)
      .set({ sponsorshipStatus: "sponsored" })
      .where(eq(children.id, sponsorship.childId));
    return record;
  }

  async updateSponsorshipStatus(id: number, status: string): Promise<Sponsorship> {
    const [record] = await db
      .update(sponsorships)
      .set({ status })
      .where(eq(sponsorships.id, id))
      .returning();
    return record;
  }

  // Gallery
  async getGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems).orderBy(desc(galleryItems.createdAt));
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [record] = await db.insert(galleryItems).values(item).returning();
    return record;
  }

  async deleteGalleryItem(id: number): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  // Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessagesByEmail(email: string): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .where(sql`lower(${contactMessages.email}) = lower(${email})`)
      .orderBy(desc(contactMessages.createdAt));
  }

  async updateContactMessageReply(id: number, reply: string): Promise<ContactMessage> {
    const [message] = await db
      .update(contactMessages)
      .set({ adminReply: reply, repliedAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
