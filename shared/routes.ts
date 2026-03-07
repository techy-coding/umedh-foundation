import { z } from 'zod';
import {
  insertProgramSchema,
  insertDonationSchema,
  insertEventSchema,
  insertEventRegistrationSchema,
  insertVolunteerSchema,
  insertBlogPostSchema,
  insertContactMessageSchema,
  insertBeneficiaryApplicationSchema,
  insertVolunteerTaskSchema,
  insertChildSchema,
  insertSponsorshipSchema,
  insertGalleryItemSchema,
  programs,
  donations,
  events,
  volunteers,
  volunteerTasks,
  blogPosts,
  contactMessages,
  eventRegistrations,
  beneficiaryApplications,
  children,
  sponsorships,
  galleryItems,
  volunteerMessages,
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  programs: {
    list: {
      method: 'GET' as const,
      path: '/api/programs' as const,
      responses: {
        200: z.array(z.custom<typeof programs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/programs/:slug' as const,
      responses: {
        200: z.custom<typeof programs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/programs' as const,
      input: insertProgramSchema,
      responses: {
        201: z.custom<typeof programs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  donations: {
    create: {
      method: 'POST' as const,
      path: '/api/donations' as const,
      input: insertDonationSchema,
      responses: {
        201: z.custom<typeof donations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
        method: 'GET' as const,
        path: '/api/donations' as const,
        responses: {
            200: z.array(z.custom<typeof donations.$inferSelect>()),
        }
    },
    downloadReceipt: {
      method: 'GET' as const,
      path: '/api/donations/:id/receipt/download' as const,
      responses: {
        200: z.string(),
        404: errorSchemas.notFound,
      },
    }
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events' as const,
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:slug' as const,
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/events/:id/register' as const,
      input: insertEventRegistrationSchema.omit({ eventId: true }),
      responses: {
        201: z.custom<typeof eventRegistrations.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  volunteers: {
    register: {
      method: 'POST' as const,
      path: '/api/volunteers' as const,
      input: insertVolunteerSchema,
      responses: {
        201: z.custom<typeof volunteers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  blog: {
    list: {
      method: 'GET' as const,
      path: '/api/blog' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/blog/:slug' as const,
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact' as const,
      input: insertContactMessageSchema,
      responses: {
        201: z.custom<typeof contactMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  inbox: {
    list: {
      method: 'GET' as const,
      path: '/api/inbox' as const,
      responses: {
        200: z.array(z.custom<typeof volunteerMessages.$inferSelect>()),
      },
    },
  },
  // Donor endpoints
  donor: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/donor/dashboard' as const,
      responses: {
        200: z.object({
          totalDonations: z.number(),
          totalAmount: z.number(),
          recurringCount: z.number(),
          recentDonations: z.array(z.custom<typeof donations.$inferSelect>()),
        }),
      },
    },
    donations: {
      method: 'GET' as const,
      path: '/api/donor/donations' as const,
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    recurring: {
      method: 'GET' as const,
      path: '/api/donor/recurring' as const,
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    sponsorships: {
      method: 'GET' as const,
      path: '/api/donor/sponsorships' as const,
      responses: {
        200: z.array(z.custom<typeof sponsorships.$inferSelect>()),
      },
    },
    createSponsorship: {
      method: 'POST' as const,
      path: '/api/donor/sponsorships' as const,
      input: z.object({
        childId: z.number(),
        amount: z.number(),
        frequency: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof sponsorships.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    receipt: {
      method: 'GET' as const,
      path: '/api/donor/receipts/:id' as const,
      responses: {
        200: z.object({ receiptUrl: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    // donor profile endpoints
    profile: {
      method: 'GET' as const,
      path: '/api/donor/profile' as const,
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/donor/profile' as const,
      input: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        profileImageUrl: z.string().optional(),
        address: z.string().optional(),
        paymentMethod: z.string().optional(),
      }),
      responses: {
        200: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
    receipts: {
      method: 'GET' as const,
      path: '/api/donor/receipts' as const,
      responses: {
        200: z.string(), // csv text
      },
    },
    generateReceipt: {
      method: 'PUT' as const,
      path: '/api/donor/receipts/:id' as const,
      input: z.object({ receiptUrl: z.string() }),
      responses: {
        200: z.custom<typeof donations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  // Volunteer endpoints
  volunteer: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/volunteer/dashboard' as const,
      responses: {
        200: z.object({
          volunteer: z.custom<typeof volunteers.$inferSelect>(),
          tasks: z.array(z.custom<typeof volunteerTasks.$inferSelect>()),
          upcomingEvents: z.array(z.custom<typeof events.$inferSelect>()),
        }),
      },
    },
    tasks: {
      method: 'GET' as const,
      path: '/api/volunteer/tasks' as const,
      responses: {
        200: z.array(z.custom<typeof volunteerTasks.$inferSelect>()),
      },
    },
    completeTask: {
      method: 'PUT' as const,
      path: '/api/volunteer/tasks/:id/complete' as const,
      responses: {
        200: z.custom<typeof volunteerTasks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    events: {
      method: 'GET' as const,
      path: '/api/volunteer/events' as const,
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    // returns registrations joined with event data; used for attendance tracking
    myEvents: {
      method: 'GET' as const,
      path: '/api/volunteer/my-events' as const,
      responses: {
        200: z.array(
          z.object({
            registration: z.custom<typeof eventRegistrations.$inferSelect>(),
            event: z.custom<typeof events.$inferSelect>(),
          })
        ),
      },
    },
    updateAttendance: {
      method: 'PUT' as const,
      path: '/api/volunteer/my-events/:id/attendance' as const,
      input: z.object({ attended: z.boolean() }),
      responses: {
        200: z.custom<typeof eventRegistrations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    messages: {
      method: 'GET' as const,
      path: '/api/volunteer/messages' as const,
      responses: {
        200: z.array(z.custom<typeof volunteerMessages.$inferSelect>()),
      },
    },
    sendMessage: {
      method: 'POST' as const,
      path: '/api/volunteer/messages' as const,
      input: z.object({ message: z.string() }),
      responses: {
        201: z.custom<typeof volunteerMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  // Beneficiary endpoints
  beneficiary: {
    apply: {
      method: 'POST' as const,
      path: '/api/beneficiary/apply' as const,
      input: insertBeneficiaryApplicationSchema,
      responses: {
        201: z.custom<typeof beneficiaryApplications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    applications: {
      method: 'GET' as const,
      path: '/api/beneficiary/applications' as const,
      responses: {
        200: z.array(z.custom<typeof beneficiaryApplications.$inferSelect>()),
      },
    },
    application: {
      method: 'GET' as const,
      path: '/api/beneficiary/applications/:id' as const,
      responses: {
        200: z.custom<typeof beneficiaryApplications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    support: {
      method: 'GET' as const,
      path: '/api/beneficiary/support' as const,
      responses: {
        200: z.array(z.custom<typeof beneficiaryApplications.$inferSelect>()),
      },
    },
  },
  // Public endpoints
  children: {
    list: {
      method: 'GET' as const,
      path: '/api/children' as const,
      responses: {
        200: z.array(z.custom<typeof children.$inferSelect>()),
      },
    },
  },
  gallery: {
    list: {
      method: 'GET' as const,
      path: '/api/gallery' as const,
      responses: {
        200: z.array(z.custom<typeof galleryItems.$inferSelect>()),
      },
    },
  },
  // Admin enhanced endpoints
  admin: {
    programs: {
      method: 'GET' as const,
      path: '/api/admin/programs' as const,
      responses: {
        200: z.array(z.custom<typeof programs.$inferSelect>()),
      },
    },
    createProgram: {
      method: 'POST' as const,
      path: '/api/admin/programs' as const,
      input: insertProgramSchema,
      responses: {
        201: z.custom<typeof programs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateProgram: {
      method: 'PUT' as const,
      path: '/api/admin/programs/:id' as const,
      input: insertProgramSchema.partial(),
      responses: {
        200: z.custom<typeof programs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    deleteProgram: {
      method: 'DELETE' as const,
      path: '/api/admin/programs/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    beneficiaries: {
      method: 'GET' as const,
      path: '/api/admin/beneficiaries' as const,
      responses: {
        200: z.array(z.custom<typeof beneficiaryApplications.$inferSelect>()),
      },
    },
    reviewBeneficiary: {
      method: 'PUT' as const,
      path: '/api/admin/beneficiaries/:id/review' as const,
      input: z.object({
        status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
        notes: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof beneficiaryApplications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateFunding: {
      method: 'PUT' as const,
      path: '/api/admin/beneficiaries/:id/funding' as const,
      input: z.object({
        fundingAmount: z.number(),
        fundingStatus: z.enum(['pending', 'released', 'completed']),
      }),
      responses: {
        200: z.custom<typeof beneficiaryApplications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    events: {
      list: {
        method: 'GET' as const,
        path: '/api/admin/events' as const,
        responses: { 200: z.array(z.custom<typeof events.$inferSelect>()) },
      },
      create: {
        method: 'POST' as const,
        path: '/api/admin/events' as const,
        input: insertEventSchema,
        responses: { 201: z.custom<typeof events.$inferSelect>() },
      },
      update: {
        method: 'PUT' as const,
        path: '/api/admin/events/:id' as const,
        input: insertEventSchema.partial(),
        responses: {
          200: z.custom<typeof events.$inferSelect>(),
          404: errorSchemas.notFound,
        },
      },
      delete: {
        method: 'DELETE' as const,
        path: '/api/admin/events/:id' as const,
        responses: {
          204: z.void(),
          404: errorSchemas.notFound,
        },
      },
    },
    eventRegistrations: {
      method: 'GET' as const,
      path: '/api/admin/events/:id/registrations' as const,
      responses: {
        200: z.array(z.custom<typeof eventRegistrations.$inferSelect>()),
      },
    },
    updateEventRegistrationAttendance: {
      method: 'PUT' as const,
      path: '/api/admin/event-registrations/:id/attendance' as const,
      input: z.object({ attended: z.boolean() }),
      responses: {
        200: z.custom<typeof eventRegistrations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    blogs: {
      method: 'GET' as const,
      path: '/api/admin/blogs' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    createBlog: {
      method: 'POST' as const,
      path: '/api/admin/blogs' as const,
      input: insertBlogPostSchema,
      responses: {
        201: z.custom<typeof blogPosts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateBlog: {
      method: 'PUT' as const,
      path: '/api/admin/blogs/:id' as const,
      input: insertBlogPostSchema.partial(),
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    deleteBlog: {
      method: 'DELETE' as const,
      path: '/api/admin/blogs/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    volunteers: {
      method: 'GET' as const,
      path: '/api/admin/volunteers' as const,
      responses: {
        200: z.array(z.custom<typeof volunteers.$inferSelect>()),
      },
    },
    approveVolunteer: {
      method: 'PUT' as const,
      path: '/api/admin/volunteers/:id/approve' as const,
      responses: {
        200: z.custom<typeof volunteers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    rejectVolunteer: {
      method: 'PUT' as const,
      path: '/api/admin/volunteers/:id/reject' as const,
      responses: {
        200: z.custom<typeof volunteers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    assignTask: {
      method: 'POST' as const,
      path: '/api/admin/volunteers/:id/tasks' as const,
      input: insertVolunteerTaskSchema.omit({ volunteerId: true }),
      responses: {
        201: z.custom<typeof volunteerTasks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    users: {
      method: 'GET' as const,
      path: '/api/admin/users' as const,
      responses: {
        200: z.array(z.custom<any>()),
      },
    },
    updateUserRole: {
      method: 'PUT' as const,
      path: '/api/admin/users/:id/role' as const,
      input: z.object({ role: z.enum(['visitor', 'donor', 'volunteer', 'beneficiary', 'admin']) }),
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    children: {
      method: 'GET' as const,
      path: '/api/admin/children' as const,
      responses: {
        200: z.array(z.custom<typeof children.$inferSelect>()),
      },
    },
    createChild: {
      method: 'POST' as const,
      path: '/api/admin/children' as const,
      input: insertChildSchema,
      responses: {
        201: z.custom<typeof children.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateChild: {
      method: 'PUT' as const,
      path: '/api/admin/children/:id' as const,
      input: insertChildSchema.partial(),
      responses: {
        200: z.custom<typeof children.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    deleteChild: {
      method: 'DELETE' as const,
      path: '/api/admin/children/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    sponsorships: {
      method: 'GET' as const,
      path: '/api/admin/sponsorships' as const,
      responses: {
        200: z.array(z.custom<typeof sponsorships.$inferSelect>()),
      },
    },
    createSponsorship: {
      method: 'POST' as const,
      path: '/api/admin/sponsorships' as const,
      input: insertSponsorshipSchema,
      responses: {
        201: z.custom<typeof sponsorships.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateSponsorshipStatus: {
      method: 'PUT' as const,
      path: '/api/admin/sponsorships/:id/status' as const,
      input: z.object({ status: z.enum(["active", "paused", "completed", "cancelled"]) }),
      responses: {
        200: z.custom<typeof sponsorships.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    gallery: {
      method: 'GET' as const,
      path: '/api/admin/gallery' as const,
      responses: {
        200: z.array(z.custom<typeof galleryItems.$inferSelect>()),
      },
    },
    createGalleryItem: {
      method: 'POST' as const,
      path: '/api/admin/gallery' as const,
      input: insertGalleryItemSchema,
      responses: {
        201: z.custom<typeof galleryItems.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    deleteGalleryItem: {
      method: 'DELETE' as const,
      path: '/api/admin/gallery/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
    messages: {
      method: 'GET' as const,
      path: '/api/admin/messages' as const,
      responses: {
        200: z.array(z.custom<typeof contactMessages.$inferSelect>()),
      },
    },
    sendInboxMessage: {
      method: 'POST' as const,
      path: '/api/admin/inbox' as const,
      input: z.object({
        userId: z.string(),
        message: z.string().min(1),
      }),
      responses: {
        201: z.custom<typeof volunteerMessages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    replyMessage: {
      method: 'PUT' as const,
      path: '/api/admin/messages/:id/reply' as const,
      input: z.object({ reply: z.string().min(1) }),
      responses: {
        200: z.custom<typeof contactMessages.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    activities: {
      method: 'GET' as const,
      path: '/api/admin/activities' as const,
      responses: {
        200: z.array(
          z.object({
            type: z.string(),
            description: z.string(),
            createdAt: z.string(),
          })
        ),
      },
    },
    notifications: {
      method: 'GET' as const,
      path: '/api/admin/notifications' as const,
      responses: {
        200: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            count: z.number().int().nonnegative(),
            severity: z.enum(["info", "warning", "success"]),
          })
        ),
      },
    },
    reports: {
      method: 'GET' as const,
      path: '/api/admin/reports/summary' as const,
      responses: {
        200: z.object({
          totalChildren: z.number(),
          totalDonations: z.number(),
          totalSponsors: z.number(),
          totalVolunteers: z.number(),
          totalEvents: z.number(),
          monthlyDonationTrend: z.array(z.object({ month: z.string(), amount: z.number() })),
        }),
      },
    },
    reportDonations: {
      method: 'GET' as const,
      path: '/api/admin/reports/donations' as const,
      responses: {
        200: z.array(z.custom<typeof donations.$inferSelect>()),
      },
    },
    reportSponsorships: {
      method: 'GET' as const,
      path: '/api/admin/reports/sponsorships' as const,
      responses: {
        200: z.array(z.custom<typeof sponsorships.$inferSelect>()),
      },
    },
    reportVolunteers: {
      method: 'GET' as const,
      path: '/api/admin/reports/volunteers' as const,
      responses: {
        200: z.array(z.custom<typeof volunteers.$inferSelect>()),
      },
    },
    reportEvents: {
      method: 'GET' as const,
      path: '/api/admin/reports/events' as const,
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    reportCsv: {
      method: 'GET' as const,
      path: '/api/admin/reports/:type/csv' as const,
      responses: {
        200: z.string(),
      },
    },
    settings: {
      method: 'PUT' as const,
      path: '/api/admin/settings/profile' as const,
      input: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        profileImageUrl: z.string().optional(),
      }),
      responses: {
        200: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
    generateReceipt: {
      method: 'PUT' as const,
      path: '/api/admin/donations/:id/receipt' as const,
      input: z.object({ receiptUrl: z.string() }),
      responses: {
        200: z.custom<typeof donations.$inferSelect>(),
        404: errorSchemas.notFound,
        400: errorSchemas.validation,
      },
    },
    // children / sponsorships / gallery / reports endpoints are already defined above
  },
  // User registration and login
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        firstName: z.string(),
        lastName: z.string(),
        role: z.enum(['donor', 'volunteer', 'beneficiary']).optional(),
      }),
      responses: {
        201: z.custom<any>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
