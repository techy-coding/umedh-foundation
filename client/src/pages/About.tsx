import { Target, Eye, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  const boardMembers = [
    {
      name: `${t("about.team.member", "Board Member")} 1`,
      role: t("about.team.role", "Director"),
      bio: t("about.team.bio", "Dedicated to social change with over 15 years of experience in the sector."),
      imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: `${t("about.team.member", "Board Member")} 2`,
      role: t("about.team.role", "Director"),
      bio: t("about.team.bio", "Dedicated to social change with over 15 years of experience in the sector."),
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: `${t("about.team.member", "Board Member")} 3`,
      role: t("about.team.role", "Director"),
      bio: t("about.team.bio", "Dedicated to social change with over 15 years of experience in the sector."),
      imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">{t("about.title", "About Umedh Foundation")}</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t("about.subtitle", "A non-profit organization dedicated to empowering underprivileged communities through sustainable development.")}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">{t("about.mission.title", "Our Mission")}</h3>
              <p className="text-slate-600">{t("about.mission.body", "To provide quality education, healthcare access, and skill development to every underprivileged child and woman.")}</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">{t("about.vision.title", "Our Vision")}</h3>
              <p className="text-slate-600">{t("about.vision.body", "A society where every individual has the opportunity to lead a life of dignity and self-reliance.")}</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">{t("about.values.title", "Our Values")}</h3>
              <p className="text-slate-600">{t("about.values.body", "Integrity, Transparency, Inclusivity, and Sustainable Impact in everything we do.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-12">{t("about.team.title", "Leadership Team")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boardMembers.map((member, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm">
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  loading="lazy"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border border-slate-200"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src =
                      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=500&q=80";
                  }}
                />
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-slate-500">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
