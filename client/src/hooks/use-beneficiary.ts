import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { insertBeneficiaryApplicationSchema } from "@shared/schema";
import type { InsertBeneficiaryApplication } from "@shared/schema";

export function useBeneficiaryApplications() {
  return useQuery({
    queryKey: [api.beneficiary.applications.path],
    queryFn: async () => {
      const res = await fetch(api.beneficiary.applications.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch applications");
      return api.beneficiary.applications.responses[200].parse(await res.json());
    },
  });
}

export function useBeneficiarySupport() {
  return useQuery({
    queryKey: [api.beneficiary.support.path],
    queryFn: async () => {
      const res = await fetch(api.beneficiary.support.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch support");
      return api.beneficiary.support.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBeneficiaryApplication) => {
      const res = await fetch(api.beneficiary.apply.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit application");
      }
      return api.beneficiary.apply.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.beneficiary.applications.path] });
    },
  });
}

export function useBeneficiaryApplication(id: number | undefined) {
  return useQuery({
    queryKey: [api.beneficiary.application.path, id],
    enabled: typeof id === "number",
    queryFn: async () => {
      if (id === undefined) throw new Error("No application id provided");
      const url = api.beneficiary.application.path.replace(":id", id.toString());
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch application");
      return api.beneficiary.application.responses[200].parse(await res.json());
    },
  });
}
