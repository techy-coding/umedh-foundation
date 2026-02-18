import { Link } from "wouter";
import { type ProgramResponse } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";

interface ProgramCardProps {
  program: ProgramResponse;
}

export function ProgramCard({ program }: ProgramCardProps) {
  const percentRaised = Math.min(100, Math.round((program.raisedAmount || 0) / program.goalAmount * 100));

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
        {program.imageUrl && (
          <img 
            src={program.imageUrl} 
            alt={program.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-xs font-bold mb-2 shadow-lg">
            Active Program
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold font-display text-slate-900 mb-2 group-hover:text-primary transition-colors">
          {program.title}
        </h3>
        <p className="text-slate-600 mb-6 line-clamp-2 text-sm leading-relaxed">
          {program.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-primary">Raised: ₹{program.raisedAmount?.toLocaleString() || 0}</span>
              <span className="text-slate-500">Goal: ₹{program.goalAmount.toLocaleString()}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentRaised}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{percentRaised}% Funded</span>
              <span><Target className="inline w-3 h-3 mr-1" /> Ongoing</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Link href={`/programs/${program.slug}`} className="flex-1">
               <Button variant="outline" className="w-full rounded-xl hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-all">
                 Details
               </Button>
            </Link>
            <Link href={`/donate?program=${program.id}`} className="flex-1">
              <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Donate <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
