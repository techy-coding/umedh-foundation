import { useAuth } from "@/hooks/use-auth";
import { useDonorDashboard, useDonorDonations, useDonorSponsorships, useChildrenList } from "@/hooks/use-donor";
import { useDonorReceipts } from "@/hooks/use-admin";
import { useLocation, Link } from "wouter";
import { Loader2, DollarSign, Repeat, FileText, Heart } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function DonorDashboard() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: dashboard, isLoading: dashboardLoading } = useDonorDashboard();
  const { data: donations, isLoading: donationsLoading } = useDonorDonations();
  const { data: sponsorships, isLoading: sponsorshipsLoading } = useDonorSponsorships();
  const { data: children, isLoading: childrenLoading } = useChildrenList();
  const receiptsQuery = useDonorReceipts();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "donor") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || dashboardLoading || donationsLoading || sponsorshipsLoading || childrenLoading || !user || user.role !== "donor") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t("dashboard.donor.title", "Donor Dashboard")}</h1>
          <p className="text-slate-600">Welcome back, {user.firstName}. Thank you for your support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Number of Donations</h3>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{dashboard?.totalDonations || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Total Amount Donated</h3>
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">₹{((dashboard?.totalAmount || 0) / 100).toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Recurring Donations</h3>
              <Repeat className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{dashboard?.recurringCount || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Sponsored Children</h2>
            <div className="space-y-3">
              {(sponsorships || []).map((s) => {
                const child = (children || []).find((c) => c.id === s.childId);
                return (
                  <div key={s.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-medium text-slate-900">{child?.name || `Child #${s.childId}`}</p>
                    <p className="text-sm text-slate-600">Status: {s.status}</p>
                    <p className="text-sm text-slate-600">
                      {s.frequency} sponsorship • ₹{s.amount.toLocaleString()}
                    </p>
                  </div>
                );
              })}
              {(!sponsorships || sponsorships.length === 0) && (
                <p className="text-slate-600">No sponsored children yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/donate">
                <Button className="w-full">Donate Now</Button>
              </Link>
              <Link href="/donor/profile">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
              <Link href="/donor/sponsorships">
                <Button variant="outline" className="w-full">Sponsor Child</Button>
              </Link>
              <Link href="/inbox">
                <Button variant="outline" className="w-full">{t("nav.inbox", "Inbox")}</Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  receiptsQuery.refetch().then((result) => {
                    if (result.data) {
                      const blob = new Blob([result.data], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'receipts.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  });
                }}
                disabled={receiptsQuery.isFetching}
              >
                Download Receipts
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Donation History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold text-slate-700">Date</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Amount</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Payment Method</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {(donations || []).map((donation) => (
                  <tr key={donation.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-600">
                      {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="py-3 pr-4 text-slate-900">₹{(donation.amount / 100).toLocaleString()}</td>
                    <td className="py-3 pr-4 text-slate-600">Online</td>
                    <td className="py-3 pr-4 capitalize text-slate-600">{donation.status}</td>
                    <td className="py-3 pr-4">
                      {donation.receiptUrl ? (
                        <a href={donation.receiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                          <FileText className="w-4 h-4 mr-1" /> Download
                        </a>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!donations || donations.length === 0) && (
                  <tr>
                    <td className="py-6 text-center text-slate-500" colSpan={5}>No donations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
