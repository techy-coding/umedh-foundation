import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertVolunteer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useRegisterVolunteer() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertVolunteer) => {
      const res = await fetch(api.volunteers.register.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit application");
      return api.volunteers.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for volunteering. We will contact you shortly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
