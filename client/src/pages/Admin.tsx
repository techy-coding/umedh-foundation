import { useAuth } from "@/hooks/use-auth";
import { useDonations } from "@/hooks/use-donations";
import { useLocation } from "wouter";
import { Loader2, LayoutDashboard, DollarSign, Users, Calendar } from "lucide-react";
import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: donations } = useDonations();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, authLoading]);

  if (authLoading || !user) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  // Calculate stats
  const totalRaised = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const totalDonors = new Set(donations?.map(d => d.donorEmail)).size || 0;
  
  // Mock data for chart
  const data = [
    { name: 'Jan', amount: 4000 },
    { name: 'Feb', amount: 3000 },
    { name: 'Mar', amount: 2000 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold font-display text-slate-900">Admin Panel</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
            <DollarSign className="w-5 h-5 mr-3" /> Donations
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
            <Users className="w-5 h-5 mr-3" /> Volunteers
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium">
            <Calendar className="w-5 h-5 mr-3" /> Events
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-600">Welcome, {user.firstName}</span>
            <img src={user.profileImageUrl || "https://github.com/shadcn.png"} alt="Profile" className="w-10 h-10 rounded-full bg-slate-200" />
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Total Raised</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">₹{(totalRaised/100).toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Unique Donors</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalDonors}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Donation Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip />
                <Bar dataKey="amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
