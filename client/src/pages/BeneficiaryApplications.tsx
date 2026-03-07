import { useBeneficiaryApplications } from "@/hooks/use-beneficiary";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function BeneficiaryApplications() {
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

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("beneficiary.applications.title", "My Applications")}</h1>
        <Button onClick={() => setLocation("/beneficiary/apply")}>{t("beneficiary.newApplication", "New Application")}</Button>
      </div>

      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200">
                <th className="py-3 pr-4 font-semibold text-slate-700">Type</th>
                <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
                <th className="py-3 pr-4 font-semibold text-slate-700">Submitted</th>
                <th className="py-3 pr-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((app) => (
                <tr key={app.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 text-slate-900 capitalize">{app.applicationType}</td>
                  <td className="py-3 pr-4 text-slate-600 capitalize">{app.status}</td>
                  <td className="py-3 pr-4 text-slate-600">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <Button size="sm" onClick={() => setLocation(`/beneficiary/applications/${app.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-slate-600">
          <p className="mb-4">{t("beneficiary.applications.empty", "You haven't submitted any applications yet.")}</p>
          <Button onClick={() => setLocation("/beneficiary/apply")}>{t("nav.applySupport", "Apply for Support")}</Button>
        </div>
      )}
    </div>
  );
}
