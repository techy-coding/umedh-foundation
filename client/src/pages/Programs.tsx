import { usePrograms } from "@/hooks/use-programs";
import { ProgramCard } from "@/components/ProgramCard";
import { Loader2 } from "lucide-react";

export default function Programs() {
  const { data: programs, isLoading, error } = usePrograms();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-slate-600 mt-2">Failed to load programs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 mb-4">Our Programs</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We focus on holistic development through targeted initiatives in education, healthcare, and sustainable livelihood.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs?.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
