import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Loader2, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvent, useRegisterEvent } from "@/hooks/use-events";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

export default function EventDetail() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/events/:slug");
  const slug = match ? params.slug : "";
  const { data: event, isLoading } = useEvent(slug);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerMutation = useRegisterEvent(event?.id || 0);

  useEffect(() => {
    if (!user) return;
    setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
    setEmail(user.email || "");
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-16">{t("eventDetail.notFound", "Event not found.")}</div>;
  }

  const handleRegister = () => {
    setError(null);
    setSuccess(null);
    if (!name.trim() || !email.trim()) {
      setError(t("eventDetail.nameEmailRequired", "Name and email are required."));
      return;
    }
    registerMutation.mutate(
      { name: name.trim(), email: email.trim() },
      {
        onSuccess: () => setSuccess(t("eventDetail.registerSuccess", "Registration successful.")),
        onError: (err: any) => setError(err?.message || t("eventDetail.registerFailed", "Registration failed.")),
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/events" className="inline-flex items-center text-slate-600 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("eventDetail.back", "Back to Events")}
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-72 object-cover" />}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm mb-4">
              <span className="inline-flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(event.date).toLocaleString()}</span>
              <span className="inline-flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.location}</span>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap mb-6">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder={t("eventDetail.yourName", "Your Name")} value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder={t("eventDetail.yourEmail", "Your Email")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            {success && <p className="text-emerald-600 text-sm mb-3">{success}</p>}
            <Button onClick={handleRegister} disabled={registerMutation.isPending}>
              {registerMutation.isPending ? t("eventDetail.registering", "Registering...") : t("eventDetail.register", "Register for Event")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
