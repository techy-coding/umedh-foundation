import { Target, Eye, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">About Umedh Foundation</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A non-profit organization dedicated to empowering underprivileged communities through sustainable development.
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
              <h3 className="text-xl font-bold font-display mb-4">Our Mission</h3>
              <p className="text-slate-600">To provide quality education, healthcare access, and skill development to every underprivileged child and woman.</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">Our Vision</h3>
              <p className="text-slate-600">A society where every individual has the opportunity to lead a life of dignity and self-reliance.</p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold font-display mb-4">Our Values</h3>
              <p className="text-slate-600">Integrity, Transparency, Inclusivity, and Sustainable Impact in everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold">Board Member {i}</h3>
                <p className="text-sm text-primary mb-2">Director</p>
                <p className="text-sm text-slate-500">Dedicated to social change with over 15 years of experience in the sector.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
