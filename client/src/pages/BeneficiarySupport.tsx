import { useBeneficiarySupport } from "@/hooks/use-beneficiary";
import { Loader2 } from "lucide-react";

export default function BeneficiarySupport() {
  const { data, isLoading, isError } = useBeneficiarySupport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600 text-center py-20">Failed to fetch support information.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6">My Support</h1>
      {data && data.length > 0 ? (
        <ul className="space-y-4">
          {data.map((app) => (
            <li key={app.id} className="p-4 bg-white rounded-lg shadow">
              <p><strong>Type:</strong> {app.applicationType}</p>
              <p><strong>Funding:</strong> ₹{(app.fundingAmount || 0).toLocaleString()}</p>
              <p><strong>Funding Status:</strong> {app.fundingStatus}</p>
              <p><strong>Submitted:</strong> {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-"}</p>
              <p><strong>Status:</strong> {app.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-slate-600">No approved applications with funding yet.</p>
      )}
    </div>
  );
}