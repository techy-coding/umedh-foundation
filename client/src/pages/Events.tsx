import { useEvents } from "@/hooks/use-events";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Events() {
  const { t } = useTranslation();
  const { data: events, isLoading } = useEvents();

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">{t("events.title", "Events & Workshops")}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("events.subtitle", "Join our upcoming events to learn, contribute, and connect with the community.")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events?.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full">
              <div className="md:w-48 bg-slate-200 relative shrink-0">
                <img src={event.imageUrl || ""} alt={event.title} className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-lg p-2 text-center shadow-sm">
                  <div className="text-xs font-bold text-slate-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  <div className="text-2xl font-bold text-primary font-display">{new Date(event.date).getDate()}</div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-2">{event.title}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-4 space-x-4">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location}</span>
                </div>
                <p className="text-slate-600 text-sm mb-6 line-clamp-2">{event.description}</p>
                <div className="mt-auto">
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="outline" className="rounded-lg border-primary text-primary hover:bg-primary hover:text-white">
                      {t("events.viewRegister", "View Details & Register")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
