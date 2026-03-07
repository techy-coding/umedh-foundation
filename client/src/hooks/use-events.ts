import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertEventRegistration } from "@shared/schema";

export function useEvents() {
  return useQuery({
    queryKey: [api.events.list.path],
    queryFn: async () => {
      const res = await fetch(api.events.list.path);
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: [api.events.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.events.get.path, { slug });
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch event");
      }
      return api.events.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function useRegisterEvent(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<InsertEventRegistration, "eventId">) => {
      const url = buildUrl(api.events.register.path, { id: eventId });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to register for event");
      return api.events.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}
