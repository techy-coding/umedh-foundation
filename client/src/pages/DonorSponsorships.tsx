import { useAuth } from "@/hooks/use-auth";
import { useDonorSponsorships, useCreateSponsorship, useChildrenList } from "@/hooks/use-donor";
import { useLocation, Link } from "wouter";
import { Loader2, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DonorSponsorships() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: sponsorships, isLoading: sponsorshipsLoading } = useDonorSponsorships();
  const createSponsorship = useCreateSponsorship();
  const { data: children, isLoading: childrenLoading } = useChildrenList();

  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({ childId: 0, amount: "", frequency: "monthly" });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "donor") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || sponsorshipsLoading || childrenLoading || !user || user.role !== "donor") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const availableChildren = (children || []).filter((c) => c.sponsorshipStatus !== "sponsored");

  const handleSubmit = () => {
    createSponsorship.mutate({
      childId: formState.childId,
      amount: parseInt(formState.amount),
      frequency: formState.frequency,
    });
    setFormState({ childId: 0, amount: "", frequency: "monthly" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">My Sponsorships</h1>
          <Button onClick={() => setShowForm((s) => !s)} variant="outline" size="sm">
            <HandHeart className="w-4 h-4 mr-2" /> {showForm ? "Cancel" : "Sponsor a Child"}
          </Button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4">New Sponsorship</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="input input-bordered w-full"
                value={formState.childId}
                onChange={(e) => setFormState({ ...formState, childId: parseInt(e.target.value) })}
              >
                <option value={0} disabled>
                  Select Child
                </option>
                {availableChildren.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (age {c.age})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Monthly Amount (₹)"
                className="input input-bordered w-full"
                value={formState.amount}
                onChange={(e) => setFormState({ ...formState, amount: e.target.value })}
              />
              <select
                className="input input-bordered w-full"
                value={formState.frequency}
                onChange={(e) => setFormState({ ...formState, frequency: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="mt-4">
              <Button onClick={handleSubmit} disabled={createSponsorship.isPending || formState.childId === 0 || !formState.amount}>
                Create Sponsorship
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          {sponsorships && sponsorships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold text-slate-700">Child</th>
                    <th className="py-3 pr-4 font-semibold text-slate-700">Amount</th>
                    <th className="py-3 pr-4 font-semibold text-slate-700">Frequency</th>
                    <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
                    <th className="py-3 pr-4 font-semibold text-slate-700">Since</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map((s) => (
                    (() => {
                      const child = (children || []).find((c) => c.id === s.childId);
                      return (
                        <tr key={s.id} className="border-b border-slate-100">
                          <td className="py-3 pr-4 text-slate-900">
                            {child ? child.name : `Unknown Child (ID: ${s.childId})`}
                          </td>
                          <td className="py-3 pr-4 text-slate-900">₹{s.amount.toLocaleString()}</td>
                          <td className="py-3 pr-4 text-slate-600 capitalize">{s.frequency}</td>
                          <td className="py-3 pr-4 text-slate-600 capitalize">{s.status}</td>
                          <td className="py-3 pr-4 text-slate-600">
                            {s.startDate ? new Date(s.startDate).toLocaleDateString() : "-"}
                          </td>
                        </tr>
                      );
                    })()
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-600">You have no active sponsorships.</p>
          )}
        </div>
      </div>
    </div>
  );
}
