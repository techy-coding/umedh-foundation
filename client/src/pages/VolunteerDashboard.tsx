import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Calendar, CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  useCompleteTask,
  useVolunteerDashboard,
  useVolunteerMessages,
} from "@/hooks/use-volunteer";
import { useTranslation } from "react-i18next";

export default function VolunteerDashboard() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data, isLoading: dashboardLoading } = useVolunteerDashboard();
  const { data: messages, isLoading: messagesLoading } = useVolunteerMessages();
  const completeTask = useCompleteTask();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setLocation("/login");
      return;
    }

    if (user.role !== "volunteer" && user.role !== "admin") {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  if (authLoading || dashboardLoading || messagesLoading || !user || (user.role !== "volunteer" && user.role !== "admin")) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const pendingTasks = data?.tasks.filter((task) => task.status !== "completed") ?? [];
  const completedTasks = data?.tasks.filter((task) => task.status === "completed").length ?? 0;
  const notifications = (messages || []).slice(0, 5).map((m) => m.message);
  const parseTaskMeta = (task: any) => {
    const text = task.description || "";
    const lines = text.split("\n");
    const details = lines.find((line: string) => line.startsWith("Details:"))?.replace("Details:", "").trim();
    const priority = lines.find((line: string) => line.startsWith("Priority:"))?.replace("Priority:", "").trim();
    const dueDate = lines.find((line: string) => line.startsWith("Due Date:"))?.replace("Due Date:", "").trim();
    const assignedBy = lines.find((line: string) => line.startsWith("Assigned By:"))?.replace("Assigned By:", "").trim();
    return { details, priority, dueDate, assignedBy };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dashboard.volunteer.title", "Volunteer Dashboard")}</h1>
          <p className="text-slate-600">
            Welcome, {user.firstName}. Assigned role: {data?.volunteer?.status || "Volunteer"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-500">Assigned Tasks</h3>
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{data?.tasks.length ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-500">Completed Tasks</h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{completedTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-500">Upcoming Events</h3>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{data?.upcomingEvents.length ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Assigned Tasks</h2>
            <div className="space-y-3">
              {pendingTasks.length === 0 && (
                <p className="text-slate-600">No pending tasks.</p>
              )}
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  {(() => {
                    const meta = parseTaskMeta(task);
                    return (
                      <>
                  <p className="font-semibold text-slate-900">{task.title}</p>
                  <p className="text-sm text-slate-600 mb-2">{meta.details || task.description || "No description provided."}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {meta.priority && <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Priority: {meta.priority}</span>}
                    {meta.dueDate && <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Due: {meta.dueDate}</span>}
                    {meta.assignedBy && <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700">By: {meta.assignedBy}</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-slate-500">{task.status}</span>
                    <Button
                      size="sm"
                      onClick={() => completeTask.mutate(task.id)}
                      disabled={completeTask.isPending}
                    >
                      Mark Completed
                    </Button>
                  </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {data?.upcomingEvents.length === 0 && (
                <p className="text-slate-600">No upcoming events assigned.</p>
              )}
              {data?.upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Notifications</h2>
            <ul className="space-y-2 text-slate-600 text-sm">
              {notifications.map((item) => (
                <li key={item} className="p-3 rounded-lg bg-slate-50">{item}</li>
              ))}
              {notifications.length === 0 && (
                <li className="p-3 rounded-lg bg-slate-50">No new notifications from admin.</li>
              )}
            </ul>
          </div>

          <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
            <h2 className="text-xl font-bold text-primary mb-2">Quick Action</h2>
            <p className="text-slate-700 mb-4">Browse upcoming events and volunteer opportunities.</p>
            <Link href="/volunteer/events">
              <Button>View Events</Button>
            </Link>
            <Link href="/volunteer/messages">
              <Button variant="outline" className="mt-2">Messages</Button>
            </Link>
            <Link href="/inbox">
              <Button variant="outline" className="mt-2">{t("nav.inbox", "Inbox")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
