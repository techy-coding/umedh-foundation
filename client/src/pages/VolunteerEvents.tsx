import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useVolunteerEvents, useMyEvents, useRegisterForEvent, useUpdateAttendance } from "@/hooks/use-volunteer";
import { Button } from "@/components/ui/button";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function VolunteerEvents() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: events, isLoading: eventsLoading } = useVolunteerEvents();
  const { data: myEvents, isLoading: myLoading } = useMyEvents();
  const register = useRegisterForEvent();
  const updateAttendance = useUpdateAttendance();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "volunteer" && user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || eventsLoading || myLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const registeredIds = new Set((myEvents || []).map((e: any) => e.registration?.eventId || e.event?.id || e.id));
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const filteredEvents = selectedDate
    ? (events || []).filter((ev: any) => new Date(ev.date).toDateString() === selectedDate.toDateString())
    : events;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Available Events</h1>
        <div className="mb-8">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ available: (date) => (events || []).some((ev: any) => new Date(ev.date).toDateString() === date.toDateString()) }}
            modifiersClassNames={{ available: "bg-blue-100" }}
          />
        </div>
        <div className="space-y-6">
          {(filteredEvents || []).map((ev: any) => (
            <div key={ev.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{ev.title}</h2>
              <p className="text-sm text-slate-600 mb-1">
                {new Date(ev.date).toLocaleDateString()} • {ev.location}
              </p>
              <p className="text-slate-700 mb-3">{ev.description}</p>
              <Button
                disabled={registeredIds.has(ev.id) || register.isPending}
                onClick={() => register.mutate({ eventId: ev.id, name: user?.firstName + ' ' + (user?.lastName||''), email: user?.email || '' })}
              >
                {registeredIds.has(ev.id) ? "Registered" : "Join Event"}
              </Button>
            </div>
          ))}
          {(!events || events.length === 0) && <p className="text-slate-600">No events found.</p>}
        </div>

        {/* Registered events with attendance */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">My Events</h2>
          <div className="space-y-6">
            {(myEvents || []).map((item: any) => {
              const ev = item.event || item;
              const reg = item.registration || {};
              return (
                <div key={reg.id || ev.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{ev.title}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(ev.date).toLocaleDateString()} • {ev.location}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={reg.attended}
                        onChange={e => updateAttendance.mutate({ registrationId: reg.id, attended: e.target.checked })}
                        disabled={updateAttendance.isPending}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-slate-700">Attended</span>
                    </label>
                  </div>
                </div>
              );
            })}
            {(!myEvents || myEvents.length === 0) && <p className="text-slate-600">You haven't joined any events yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
