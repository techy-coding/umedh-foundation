import { useProgram } from "@/hooks/use-programs";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProgramDetail() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/programs/:slug");
  const { data: program, isLoading } = useProgram(params?.slug || "");

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!program) return <div>{t("programDetail.notFound", "Program not found")}</div>;

  const percentRaised = Math.min(100, Math.round((program.raisedAmount || 0) / program.goalAmount * 100));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img src={program.imageUrl || ""} alt={program.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white">
          <div className="container mx-auto">
            <Link href="/programs" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t("programDetail.back", "Back to Programs")}
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">{program.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">{t("programDetail.about", "About the Program")}</h2>
              <div className="prose prose-lg text-slate-600">
                <p className="whitespace-pre-wrap">{program.longDescription || program.description}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t("programDetail.achieveTitle", "What We Will Achieve")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  t("programDetail.achieve1", "Educate 500+ children"),
                  t("programDetail.achieve2", "Provide healthcare access"),
                  t("programDetail.achieve3", "Sustainable community growth"),
                  t("programDetail.achieve4", "Women empowerment workshops")
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Donation Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
              <div className="mb-6">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-primary font-bold">₹{program.raisedAmount?.toLocaleString()} {t("programDetail.raised", "raised")}</span>
                  <span className="text-slate-500">{t("programDetail.of", "of")} ₹{program.goalAmount.toLocaleString()} {t("programDetail.goal", "goal")}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${percentRaised}%` }}
                  />
                </div>
              </div>

              <Link href={`/donate?program=${program.id}`}>
                <Button size="lg" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg py-6 text-lg mb-4">
                  {t("nav.donate", "Donate Now")} <Heart className="w-5 h-5 ml-2 fill-current" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-slate-500">
                {t("programDetail.tax", "All donations are tax deductible under 80G.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
