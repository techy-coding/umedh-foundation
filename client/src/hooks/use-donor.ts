import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDonorDashboard() {
  return useQuery({
    queryKey: [api.donor.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.donor.dashboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return api.donor.dashboard.responses[200].parse(await res.json());
    },
  });
}

export function useDonorDonations() {
  return useQuery({
    queryKey: [api.donor.donations.path],
    queryFn: async () => {
      const res = await fetch(api.donor.donations.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch donations");
      return api.donor.donations.responses[200].parse(await res.json());
    },
  });
}

export function useRecurringDonations() {
  return useQuery({
    queryKey: [api.donor.recurring.path],
    queryFn: async () => {
      const res = await fetch(api.donor.recurring.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recurring donations");
      return api.donor.recurring.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateMyReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, receiptUrl }: { id: number; receiptUrl: string }) => {
      const url = api.donor.generateReceipt.path.replace(':id', String(id));
      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptUrl }),
      });
      if (!res.ok) throw new Error('Failed to generate receipt');
      return api.donor.generateReceipt.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.donor.donations.path] });
    },
  });
}

export function useDonorSponsorships() {
  return useQuery({
    queryKey: [api.donor.sponsorships.path],
    queryFn: async () => {
      const res = await fetch(api.donor.sponsorships.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sponsorships");
      return api.donor.sponsorships.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSponsorship() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { childId: number; amount: number; frequency?: string }) => {
      const res = await fetch(api.donor.createSponsorship.path, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create sponsorship");
      return api.donor.createSponsorship.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.donor.sponsorships.path] }),
  });
}

export function useChildrenList() {
  return useQuery({
    queryKey: [api.children.list.path],
    queryFn: async () => {
      const res = await fetch(api.children.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch children");
      return api.children.list.responses[200].parse(await res.json());
    },
  });
}
