import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ArrowRight, Users, HandHeart, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/ProgramCard";
import { usePrograms } from "@/hooks/use-programs";
import { useEvents } from "@/hooks/use-events";

// Animation variants
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { t } = useTranslation();
  const { data: programs, isLoading: programsLoading } = usePrograms();
  const { data: events, isLoading: eventsLoading } = useEvents();

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          {/* unsplash: happy indian children studying outdoor school village */}
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl space-y-8"
          >
            <motion.div variants={fadeIn}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/90 text-white font-medium text-sm backdrop-blur-sm shadow-lg border border-white/10 mb-4">
                👋 {t('hero.welcome', 'Welcome to Umedh Foundation')}
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold font-display text-white leading-tight drop-shadow-lg">
              {t('hero.title', 'Empowering Dreams, Transform Lives')}
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-slate-200 leading-relaxed max-w-2xl">
              {t('hero.subtitle', 'Join our mission to provide education, healthcare, and sustainable livelihood opportunities to underprivileged communities in rural India.')}
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/donate">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 border-2 border-primary hover:-translate-y-1 transition-all">
                  {t('hero.cta', 'Make a Donation')} <Heart className="ml-2 w-5 h-5 fill-current" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-slate-900 hover:-translate-y-1 transition-all">
                  {t('hero.learn_more', 'Learn More')} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative -mt-20 z-20 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: "Lives Impacted", value: "10,000+" },
            { icon: HandHeart, label: "Volunteers", value: "500+" },
            { icon: Calendar, label: "Years Active", value: "12+" },
            { icon: CheckCircle, label: "Projects Done", value: "150+" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center space-x-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="p-4 rounded-xl bg-primary/10 text-primary">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-slate-900 font-display">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROGRAMS */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-4 py-1.5 rounded-full">Our Initiatives</span>
            <h2 className="text-4xl font-bold font-display text-slate-900">Featured Programs</h2>
            <p className="text-slate-600 text-lg">
              Discover how we are making a tangible difference in various sectors of society.
            </p>
          </div>

          {programsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 rounded-3xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs?.slice(0, 3).map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/programs">
              <Button variant="outline" size="lg" className="rounded-full px-8 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 md:p-16 border border-white/10 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold font-display text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Whether you choose to donate, volunteer, or partner with us, your contribution creates ripples of positive change.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/volunteer">
                <Button size="lg" className="rounded-full bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg shadow-lg shadow-secondary/25">
                  Become a Volunteer
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-secondary font-bold tracking-wider uppercase text-sm bg-secondary/10 px-4 py-1.5 rounded-full">Join Us</span>
              <h2 className="text-4xl font-bold font-display text-slate-900 mt-4">Upcoming Events</h2>
            </div>
            <Link href="/events" className="hidden md:block">
              <Button variant="link" className="text-primary text-lg">See All Events →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {eventsLoading ? (
              [1, 2].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)
            ) : events?.slice(0, 2).map((event) => (
              <div key={event.id} className="flex flex-col md:flex-row bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                <div className="md:w-2/5 relative overflow-hidden">
                  {/* unsplash: community gathering event india */}
                  <img 
                    src={event.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm">
                    <div className="text-xs font-bold text-slate-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold text-primary font-display">{new Date(event.date).getDate()}</div>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center text-sm text-slate-500 mb-6">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                  <Link href={`/events/${event.slug}`}>
                    <Button variant="outline" className="w-fit rounded-lg border-primary text-primary hover:bg-primary hover:text-white">
                      Register Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Import Heart for hero button */}
      <Heart className="hidden" />
      <MapPin className="hidden" />
    </div>
  );
}

// Temporary import fixes for icons used in JSX but not imported at top
import { Heart, MapPin } from "lucide-react";
