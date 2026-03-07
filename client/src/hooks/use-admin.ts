import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// children
export function useAdminPrograms() {
  return useQuery({
    queryKey: [api.admin.programs.path],
    queryFn: async () => {
      const res = await fetch(api.admin.programs.path, { credentials: "include" });
      if (!res.ok) {
        let message = "Failed to fetch programs";
        try {
          const body = await res.json();
          if (body?.message) message = body.message;
        } catch {}
        throw new Error(message);
      }
      return api.admin.programs.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAdminProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.createProgram.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create program");
      return api.admin.createProgram.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.admin.programs.path] });
      qc.invalidateQueries({ queryKey: [api.programs.list.path] });
    },
  });
}

export function useUpdateAdminProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.admin.updateProgram.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update program");
      return api.admin.updateProgram.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.admin.programs.path] });
      qc.invalidateQueries({ queryKey: [api.programs.list.path] });
    },
  });
}

export function useDeleteAdminProgram() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.deleteProgram.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete program");
      return;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.admin.programs.path] });
      qc.invalidateQueries({ queryKey: [api.programs.list.path] });
    },
  });
}

export function useAdminChildren() {
  return useQuery({
    queryKey: [api.admin.children.path],
    queryFn: async () => {
      const res = await fetch(api.admin.children.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch children");
      return api.admin.children.responses[200].parse(await res.json());
    },
  });
}

export function useCreateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.createChild.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create child");
      return api.admin.createChild.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.children.path] }),
  });
}

export function useUpdateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.admin.updateChild.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update child");
      return api.admin.updateChild.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.children.path] }),
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.deleteChild.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete child");
      return;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.children.path] }),
  });
}

// generate receipt
export function useGenerateReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, receiptUrl }: { id: number; receiptUrl: string }) => {
      const url = buildUrl(api.admin.generateReceipt.path, { id });
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptUrl }),
      });
      if (!res.ok) throw new Error('Failed to generate receipt');
      return api.admin.generateReceipt.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.donor.donations.path] });
      qc.invalidateQueries({ queryKey: [api.donations.list.path] });
    },
  });
}

// sponsorships
export function useAdminSponsorships() {
  return useQuery({
    queryKey: [api.admin.sponsorships.path],
    queryFn: async () => {
      const res = await fetch(api.admin.sponsorships.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sponsorships");
      return api.admin.sponsorships.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAdminSponsorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.createSponsorship.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create sponsorship");
      return api.admin.createSponsorship.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.sponsorships.path] }),
  });
}

export function useUpdateSponsorshipStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl(api.admin.updateSponsorshipStatus.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update sponsorship status");
      return api.admin.updateSponsorshipStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.sponsorships.path] }),
  });
}

// gallery
export function useAdminGallery() {
  return useQuery({
    queryKey: [api.admin.gallery.path],
    queryFn: async () => {
      const res = await fetch(api.admin.gallery.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch gallery");
      return api.admin.gallery.responses[200].parse(await res.json());
    },
  });
}

export function useCreateGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.createGalleryItem.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create gallery item");
      return api.admin.createGalleryItem.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.gallery.path] }),
  });
}

export function useDeleteGalleryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.deleteGalleryItem.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete gallery item");
      return;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.gallery.path] }),
  });
}

// admin messages
export function useAdminMessages() {
  return useQuery({
    queryKey: [api.admin.messages.path],
    queryFn: async () => {
      const res = await fetch(api.admin.messages.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.admin.messages.responses[200].parse(await res.json());
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.admin.users.responses[200].parse(await res.json());
    },
  });
}

export function useAdminSendInboxMessage() {
  return useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const res = await fetch(api.admin.sendInboxMessage.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message }),
      });
      if (!res.ok) throw new Error("Failed to send inbox message");
      return api.admin.sendInboxMessage.responses[201].parse(await res.json());
    },
  });
}

export function useReplyAdminMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reply }: { id: number; reply: string }) => {
      const url = buildUrl(api.admin.replyMessage.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });
      if (!res.ok) throw new Error("Failed to reply to message");
      return api.admin.replyMessage.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.messages.path] }),
  });
}

export function useAdminActivities() {
  return useQuery({
    queryKey: [api.admin.activities.path],
    queryFn: async () => {
      const res = await fetch(api.admin.activities.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.admin.activities.responses[200].parse(await res.json());
    },
  });
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: [api.admin.notifications.path],
    queryFn: async () => {
      const res = await fetch(api.admin.notifications.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return api.admin.notifications.responses[200].parse(await res.json());
    },
  });
}

// reports
export function useAdminReportSummary() {
  return useQuery({
    queryKey: [api.admin.reports.path],
    queryFn: async () => {
      const res = await fetch(api.admin.reports.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.admin.reports.responses[200].parse(await res.json());
    },
  });
}

export function useAdminDonationReport() {
  return useQuery({
    queryKey: [api.admin.reportDonations.path],
    queryFn: async () => {
      const res = await fetch(api.admin.reportDonations.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch donation report");
      return api.admin.reportDonations.responses[200].parse(await res.json());
    },
  });
}

export function useAdminSponsorshipReport() {
  return useQuery({
    queryKey: [api.admin.reportSponsorships.path],
    queryFn: async () => {
      const res = await fetch(api.admin.reportSponsorships.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sponsorship report");
      return api.admin.reportSponsorships.responses[200].parse(await res.json());
    },
  });
}

export function useAdminVolunteerReport() {
  return useQuery({
    queryKey: [api.admin.reportVolunteers.path],
    queryFn: async () => {
      const res = await fetch(api.admin.reportVolunteers.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch volunteer report");
      return api.admin.reportVolunteers.responses[200].parse(await res.json());
    },
  });
}

export function useAdminEventReport() {
  return useQuery({
    queryKey: [api.admin.reportEvents.path],
    queryFn: async () => {
      const res = await fetch(api.admin.reportEvents.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch event report");
      return api.admin.reportEvents.responses[200].parse(await res.json());
    },
  });
}

// admin blogs
export function useAdminBlogs() {
  return useQuery({
    queryKey: [api.admin.blogs.path],
    queryFn: async () => {
      const res = await fetch(api.admin.blogs.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return api.admin.blogs.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAdminBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.createBlog.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create blog");
      return api.admin.createBlog.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.blogs.path] }),
  });
}

export function useUpdateAdminBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.admin.updateBlog.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      return api.admin.updateBlog.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.blogs.path] }),
  });
}

export function useDeleteAdminBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.deleteBlog.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      return;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.blogs.path] }),
  });
}

export function useAdminReportCsv(type: "donations" | "sponsorships" | "volunteers" | "events") {
  return useQuery({
    queryKey: [api.admin.reportCsv.path, type],
    enabled: false,
    queryFn: async () => {
      const url = buildUrl(api.admin.reportCsv.path, { type });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch CSV report");
      return res.text();
    },
  });
}

// donor receipts (CSV)
export function useDonorReceipts() {
  return useQuery({
    queryKey: [api.donor.receipts.path],
    queryFn: async () => {
      const res = await fetch(api.donor.receipts.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch receipts");
      return res.text();
    },
  });
}

// admin volunteers management
export function useAdminVolunteers() {
  return useQuery({
    queryKey: [api.admin.volunteers.path],
    queryFn: async () => {
      const res = await fetch(api.admin.volunteers.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch volunteers");
      return api.admin.volunteers.responses[200].parse(await res.json());
    },
  });
}

export function useApproveVolunteer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.approveVolunteer.path, { id });
      const res = await fetch(url, { method: "PUT", credentials: "include" });
      if (!res.ok) throw new Error("Failed to approve volunteer");
      return api.admin.approveVolunteer.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.volunteers.path] }),
  });
}

export function useRejectVolunteer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.rejectVolunteer.path, { id });
      const res = await fetch(url, { method: "PUT", credentials: "include" });
      if (!res.ok) throw new Error("Failed to reject volunteer");
      return api.admin.rejectVolunteer.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.volunteers.path] }),
  });
}

export function useAssignVolunteerTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      volunteerId,
      title,
      description,
      eventId,
    }: {
      volunteerId: number;
      title: string;
      description?: string;
      eventId?: number;
    }) => {
      const url = buildUrl(api.admin.assignTask.path, { id: volunteerId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, eventId }),
      });
      if (!res.ok) throw new Error("Failed to assign task");
      return api.admin.assignTask.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.volunteers.path] }),
  });
}

// admin event management
export function useAdminEvents() {
  return useQuery({
    queryKey: [api.admin.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.admin.events.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.admin.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAdminEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch(api.admin.events.create.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.admin.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.events.list.path] }),
  });
}

export function useUpdateAdminEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const url = buildUrl(api.admin.events.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return api.admin.events.update.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.events.list.path] }),
  });
}

export function useDeleteAdminEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.admin.events.delete.path, { id });
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete event");
      return;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.events.list.path] }),
  });
}

export function useAdminEventRegistrations(eventId: number | null) {
  return useQuery({
    queryKey: [api.admin.eventRegistrations.path, eventId],
    enabled: typeof eventId === "number",
    queryFn: async () => {
      const url = buildUrl(api.admin.eventRegistrations.path, { id: eventId as number });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch registrations");
      return api.admin.eventRegistrations.responses[200].parse(await res.json());
    },
  });
}

export function useAdminUpdateEventRegistrationAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ registrationId, attended }: { registrationId: number; attended: boolean }) => {
      const url = buildUrl(api.admin.updateEventRegistrationAttendance.path, { id: registrationId });
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended }),
      });
      if (!res.ok) throw new Error("Failed to update attendance");
      return api.admin.updateEventRegistrationAttendance.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.admin.eventRegistrations.path] });
    },
  });
}

// admin beneficiary management
export function useAdminBeneficiaries() {
  return useQuery({
    queryKey: [api.admin.beneficiaries.path],
    queryFn: async () => {
      const res = await fetch(api.admin.beneficiaries.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch beneficiary applications");
      return api.admin.beneficiaries.responses[200].parse(await res.json());
    },
  });
}

export function useReviewBeneficiary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes?: string }) => {
      const url = buildUrl(api.admin.reviewBeneficiary.path, { id });
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error('Failed to review application');
      return api.admin.reviewBeneficiary.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.beneficiaries.path] }),
  });
}

export function useUpdateBeneficiaryFunding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, fundingAmount, fundingStatus }: { id: number; fundingAmount: number; fundingStatus: string }) => {
      const url = buildUrl(api.admin.updateFunding.path, { id });
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fundingAmount, fundingStatus }),
      });
      if (!res.ok) throw new Error('Failed to update funding');
      return api.admin.updateFunding.responses[200].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.admin.beneficiaries.path] }),
  });
}

// admin settings
export function useAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.admin.settings.path, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return api.admin.settings.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      qc.setQueryData(["/api/auth/user"], user);
    },
  });
}

// donor profile
export function useDonorProfile() {
  return useQuery({
    queryKey: [api.donor.profile.path],
    queryFn: async () => {
      const res = await fetch(api.donor.profile.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.donor.profile.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateDonorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.donor.updateProfile.path, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return api.donor.updateProfile.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      qc.setQueryData(["/api/auth/user"], user);
      qc.invalidateQueries({ queryKey: [api.donor.profile.path] });
    },
  });
}
