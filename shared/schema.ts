import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export Auth Models
export * from "./models/auth";
import { users } from "./models/auth";

// Programs
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  goalAmount: integer("goal_amount").notNull(),
  raisedAmount: integer("raised_amount").default(0),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProgramSchema = createInsertSchema(programs).omit({ id: true, createdAt: true, raisedAmount: true });
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;

// Donations
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(), // stored in smallest currency unit (e.g. paise/cents)
  currency: text("currency").default("INR"),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  userId: text("user_id").references(() => users.id), // Link to user if logged in
  programId: integer("program_id").references(() => programs.id),
  paymentId: text("payment_id"),
  status: text("status").default("pending"), // pending, completed, failed
  isRecurring: boolean("is_recurring").default(false),
  receiptGenerated: boolean("receipt_generated").default(false),
  receiptUrl: text("receipt_url"), // PDF receipt URL
  createdAt: timestamp("created_at").defaultNow(),
});

export const donationsRelations = relations(donations, ({ one }) => ({
  program: one(programs, {
    fields: [donations.programId],
    references: [programs.id],
  }),
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
}));

export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, createdAt: true, status: true });
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

// Events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  capacity: integer("capacity"),
  registeredCount: integer("registered_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, registeredCount: true });
export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

// Event Registrations
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: text("user_id").references(() => users.id), // Optional, if logged in
  name: text("name").notNull(),
  email: text("email").notNull(),
  attended: boolean("attended").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  event: one(events, {
    fields: [eventRegistrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
  }),
}));

export const insertEventRegistrationSchema = createInsertSchema(eventRegistrations).omit({ id: true, createdAt: true, attended: true });
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = z.infer<typeof insertEventRegistrationSchema>;

// Volunteers
export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // Link to user account
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  skills: text("skills"),
  availability: text("availability"),
  resumeUrl: text("resume_url"),
  status: text("status").default("pending"), // pending, approved, rejected
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({ id: true, createdAt: true, status: true, approvedAt: true, userId: true });
export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;

// Volunteer Tasks/Assignments
export const volunteerTasks = pgTable("volunteer_tasks", {
  id: serial("id").primaryKey(),
  volunteerId: integer("volunteer_id").notNull().references(() => volunteers.id),
  eventId: integer("event_id").references(() => events.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in_progress, completed
  assignedAt: timestamp("assigned_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVolunteerTaskSchema = createInsertSchema(volunteerTasks).omit({ id: true, createdAt: true, assignedAt: true, completedAt: true });
export type VolunteerTask = typeof volunteerTasks.$inferSelect;
export type InsertVolunteerTask = z.infer<typeof insertVolunteerTaskSchema>;

// Volunteer Messages
export const volunteerMessages = pgTable("volunteer_messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVolunteerMessageSchema = createInsertSchema(volunteerMessages).omit({
  id: true,
  createdAt: true,
});
export type VolunteerMessage = typeof volunteerMessages.$inferSelect;
export type InsertVolunteerMessage = z.infer<typeof insertVolunteerMessageSchema>;


// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  authorId: text("author_id").references(() => users.id),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true });
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Contact Messages
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  adminReply: text("admin_reply"),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// Beneficiary Applications
export const beneficiaryApplications = pgTable("beneficiary_applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id), // Link to user account if created
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  applicationType: text("application_type").notNull(), // financial, medical, education
  description: text("description").notNull(),
  documents: jsonb("documents"), // Array of document URLs
  status: text("status").default("pending"), // pending, under_review, approved, rejected
  reviewedBy: text("reviewed_by").references(() => users.id), // Admin who reviewed
  reviewedAt: timestamp("reviewed_at"),
  fundingAmount: integer("funding_amount"), // Amount approved for funding
  fundingStatus: text("funding_status").default("pending"), // pending, released, completed
  notes: text("notes"), // Admin notes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const beneficiaryApplicationsRelations = relations(beneficiaryApplications, ({ one }) => ({
  user: one(users, {
    fields: [beneficiaryApplications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [beneficiaryApplications.reviewedBy],
    references: [users.id],
  }),
}));

export const insertBeneficiaryApplicationSchema = createInsertSchema(beneficiaryApplications).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  fundingAmount: true,
  fundingStatus: true,
  notes: true,
});
export type BeneficiaryApplication = typeof beneficiaryApplications.$inferSelect;
export type InsertBeneficiaryApplication = z.infer<typeof insertBeneficiaryApplicationSchema>;

// Children
export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  educationDetails: text("education_details"),
  medicalDetails: text("medical_details"),
  admissionDate: timestamp("admission_date").defaultNow(),
  sponsorshipStatus: text("sponsorship_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChildSchema = createInsertSchema(children).omit({
  id: true,
  createdAt: true,
});
export type Child = typeof children.$inferSelect;
export type InsertChild = z.infer<typeof insertChildSchema>;

// Sponsorships
export const sponsorships = pgTable("sponsorships", {
  id: serial("id").primaryKey(),
  childId: integer("child_id").notNull().references(() => children.id),
  sponsorUserId: text("sponsor_user_id").references(() => users.id),
  sponsorName: text("sponsor_name").notNull(),
  sponsorEmail: text("sponsor_email").notNull(),
  amount: integer("amount").notNull(),
  frequency: text("frequency").default("monthly"),
  status: text("status").default("active"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sponsorshipsRelations = relations(sponsorships, ({ one }) => ({
  child: one(children, {
    fields: [sponsorships.childId],
    references: [children.id],
  }),
  sponsorUser: one(users, {
    fields: [sponsorships.sponsorUserId],
    references: [users.id],
  }),
}));

export const insertSponsorshipSchema = createInsertSchema(sponsorships).omit({
  id: true,
  createdAt: true,
});
export type Sponsorship = typeof sponsorships.$inferSelect;
export type InsertSponsorship = z.infer<typeof insertSponsorshipSchema>;

// Gallery Items
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  mediaType: text("media_type").default("image"),
  mediaUrl: text("media_url").notNull(),
  category: text("category"),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
});
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;

// API Contract Types
export type ProgramResponse = Program;
export type DonationResponse = Donation;
export type EventResponse = Event;
export type VolunteerResponse = Volunteer;
export type BlogPostResponse = BlogPost & { author?: typeof users.$inferSelect | null };
export type BeneficiaryApplicationResponse = BeneficiaryApplication;
export type ChildResponse = Child;
export type SponsorshipResponse = Sponsorship;
export type GalleryItemResponse = GalleryItem;
