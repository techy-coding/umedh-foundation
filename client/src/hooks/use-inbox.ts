import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useInboxMessages() {
  return useQuery({
    queryKey: [api.inbox.list.path],
    queryFn: async () => {
      const res = await fetch(api.inbox.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch inbox messages");
      return api.inbox.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}
