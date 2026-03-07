import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useVolunteerDashboard() {
  return useQuery({
    queryKey: [api.volunteer.dashboard.path],
    queryFn: async () => {
      const res = await fetch(api.volunteer.dashboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return api.volunteer.dashboard.responses[200].parse(await res.json());
    },
  });
}

export function useVolunteerTasks() {
  return useQuery({
    queryKey: [api.volunteer.tasks.path],
    queryFn: async () => {
      const res = await fetch(api.volunteer.tasks.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      return api.volunteer.tasks.responses[200].parse(await res.json());
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: number) => {
      const res = await fetch(api.volunteer.completeTask.path.replace(":id", String(taskId)), {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to complete task");
      return api.volunteer.completeTask.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.volunteer.tasks.path] });
      queryClient.invalidateQueries({ queryKey: [api.volunteer.dashboard.path] });
    },
  });
}

export function useVolunteerEvents() {
  return useQuery({
    queryKey: [api.volunteer.events.path],
    queryFn: async () => {
      const res = await fetch(api.volunteer.events.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.volunteer.events.responses[200].parse(await res.json());
    },
  });
}

export function useMyEvents() {
  return useQuery({
    queryKey: [api.volunteer.myEvents.path],
    queryFn: async () => {
      const res = await fetch(api.volunteer.myEvents.path, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch my events');
      return api.volunteer.myEvents.responses[200].parse(await res.json());
    },
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, name, email }: { eventId: number; name: string; email: string }) => {
      const res = await fetch(api.events.register.path.replace(':id', String(eventId)), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error('Failed to register for event');
      return api.events.register.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.volunteer.myEvents.path] });
    },
  });
}

export function useUpdateAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ registrationId, attended }: { registrationId: number; attended: boolean }) => {
      const res = await fetch(api.volunteer.updateAttendance.path.replace(':id', String(registrationId)), {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attended }),
      });
      if (!res.ok) throw new Error('Failed to update attendance');
      return api.volunteer.updateAttendance.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [api.volunteer.myEvents.path] });
    },
  });
}

export function useVolunteerMessages() {
  return useQuery({
    queryKey: [api.volunteer.messages.path],
    queryFn: async () => {
      const res = await fetch(api.volunteer.messages.path, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return api.volunteer.messages.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}

export function useSendVolunteerMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch(api.volunteer.sendMessage.path, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return api.volunteer.sendMessage.responses[201].parse(await res.json());
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [api.volunteer.messages.path] }),
  });
}
