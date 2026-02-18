import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertProgram } from "@shared/routes";

export function usePrograms() {
  return useQuery({
    queryKey: [api.programs.list.path],
    queryFn: async () => {
      const res = await fetch(api.programs.list.path);
      if (!res.ok) throw new Error("Failed to fetch programs");
      return api.programs.list.responses[200].parse(await res.json());
    },
  });
}

export function useProgram(slug: string) {
  return useQuery({
    queryKey: [api.programs.get.path, slug],
    queryFn: async () => {
      const res = await fetch(api.programs.get.path.replace(":slug", slug));
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch program");
      }
      return api.programs.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertProgram) => {
      const res = await fetch(api.programs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create program");
      return api.programs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.programs.list.path] });
    },
  });
}
