import { useLocation, useRoute } from "wouter";
import { useBeneficiaryApplication } from "@/hooks/use-beneficiary";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BeneficiaryApplicationPage() {
  const [match, params] = useRoute<{ id: string }>("/beneficiary/applications/:id");
  const id = match && params.id ? parseInt(params.id, 10) : undefined;
  const { data, isLoading, isError } = useBeneficiaryApplication(id);
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-red-600 text-center py-20">Unable to load application details.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Button variant="ghost" className="mb-6" onClick={() => setLocation("/beneficiary/applications")}>← Back to applications</Button>
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      <div className="space-y-3">
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Type:</strong> {data.applicationType}</p>
        <p><strong>Status:</strong> {data.status}</p>
        {data.address && (<p><strong>Address:</strong> {data.address}</p>)}
        <p><strong>Description:</strong></p>
        <p className="whitespace-pre-wrap">{data.description}</p>
        {Array.isArray(data.documents) && data.documents.length > 0 && (
          <>
            <p><strong>Documents:</strong></p>
            <ul className="list-disc list-inside">
              {(data.documents as string[]).map((url, idx) => (
                <li key={idx}><a href={url} className="text-primary underline" target="_blank" rel="noreferrer">{url}</a></li>
              ))}
            </ul>
          </>
        )}
        {data.fundingAmount != null && (
          <p><strong>Funding Approved:</strong> ₹{(data.fundingAmount / 100).toLocaleString()}</p>
        )}
        {data.notes && (
          <p><strong>Admin Notes:</strong> {data.notes}</p>
        )}
      </div>
    </div>
  );
}
