import { useBeneficiaryApplications } from "@/hooks/use-beneficiary";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function BeneficiaryDashboard() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useBeneficiaryApplications();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600 text-center py-20">{t("beneficiary.applications.loadError", "Unable to load your applications.")}</p>;
  }

  const applications = data || [];
  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const pendingCount = applications.filter((a) => a.status === "pending" || a.status === "under_review").length;
  const fundedCount = applications.filter((a) => a.fundingStatus === "released" || a.fundingStatus === "completed").length;
  const completedFundCount = applications.filter((a) => a.fundingStatus === "completed").length;
  const adminUpdates = applications
    .filter((a) => a.notes || a.status || a.fundingStatus)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-3">
        <div>
          <h1 className="text-3xl font-bold">{t("beneficiary.dashboard.title", "Beneficiary Dashboard")}</h1>
          <p className="text-slate-600 mt-1">{t("beneficiary.dashboard.subtitle", "Track your applications and admin updates.")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/inbox")}>{t("nav.inbox", "Inbox")}</Button>
          <Button onClick={() => setLocation("/beneficiary/apply")}>{t("beneficiary.newApplication", "New Application")}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">{t("beneficiary.totalApplications", "Total Applications")}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">{t("beneficiary.pendingReview", "Pending / Under Review")}</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">{t("beneficiary.approvedFunded", "Approved / Funded")}</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{Math.max(approvedCount, fundedCount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <p className="text-sm text-slate-500">{t("beneficiary.fundCompleted", "Fund Status: Completed")}</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{completedFundCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">{t("beneficiary.adminUpdates", "Admin Messages & Updates")}</h2>
        {adminUpdates.length === 0 ? (
          <p className="text-slate-600">{t("beneficiary.noAdminUpdates", "No admin updates yet.")}</p>
        ) : (
          <div className="space-y-3">
            {adminUpdates.map((app) => (
              <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex flex-wrap gap-2 text-xs mb-2">
                  <span className="px-2 py-1 rounded-full bg-slate-200 text-slate-700 capitalize">#{app.id}</span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">{app.status}</span>
                  {app.fundingStatus && (
                    <span
                      className={`px-2 py-1 rounded-full capitalize ${
                        app.fundingStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : app.fundingStatus === "released"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {t("beneficiary.funding", "Funding")} {app.fundingStatus === "completed" ? t("beneficiary.completed", "Completed") : app.fundingStatus}
                    </span>
                  )}
                </div>
                {app.notes ? (
                  <p className="text-slate-800"><strong>{t("beneficiary.adminNote", "Admin Note")}:</strong> {app.notes}</p>
                ) : (
                  <p className="text-slate-700">{t("beneficiary.statusUpdated", "Status updated by admin.")}</p>
                )}
                {app.fundingAmount != null && (
                  <p className="text-slate-700 mt-1">
                    <strong>{t("beneficiary.fundingAmount", "Funding Amount")}:</strong> ₹{(app.fundingAmount / 100).toLocaleString()}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => setLocation(`/beneficiary/applications/${app.id}`)}
                >
                  {t("beneficiary.viewDetails", "View Details")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
