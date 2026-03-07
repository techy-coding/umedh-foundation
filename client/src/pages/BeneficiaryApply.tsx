import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitApplication } from "@/hooks/use-beneficiary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

const applicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().optional(),
  applicationType: z.enum(["financial", "medical", "education"]),
  description: z.string().min(50, "Please provide a detailed description (at least 50 characters)"),
  documents: z.array(z.string()).optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export default function BeneficiaryApply() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { mutate, isPending } = useSubmitApplication();
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  
  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicationType: "financial",
    },
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLocation("/register");
      return;
    }
    form.setValue("name", `${user.firstName || ""} ${user.lastName || ""}`.trim());
    form.setValue("email", user.email || "");
  }, [authLoading, user, setLocation, form]);

  const onSubmit = (data: ApplicationForm) => {
    mutate(
      {
        ...data,
        documents: documentUrls.length > 0 ? documentUrls : undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          setDocumentUrls([]);
          alert("Application submitted successfully! We will review it and get back to you.");
          setLocation("/beneficiary/dashboard");
        },
      }
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, upload files to storage service (S3, etc.)
    // For now, we'll just store the file names
    const urls = Array.from(files).map(file => `/uploads/${file.name}`);
    setDocumentUrls([...documentUrls, ...urls]);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">
              {t("beneficiary.apply.title", "Apply for Support")}
            </h1>
            <p className="text-slate-600">
              {t("beneficiary.apply.subtitle", "Fill out the form below to apply for financial, medical, or educational support")}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input {...form.register("name")} className="h-12 rounded-xl" />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input type="email" {...form.register("email")} className="h-12 rounded-xl" readOnly />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input {...form.register("phone")} className="h-12 rounded-xl" />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Application Type *</Label>
                <select
                  {...form.register("applicationType")}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2"
                >
                  <option value="financial">Financial Support</option>
                  <option value="medical">Medical Support</option>
                  <option value="education">Educational Support</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea {...form.register("address")} className="min-h-[100px] rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                {...form.register("description")}
                className="min-h-[150px] rounded-xl"
                placeholder="Please provide a detailed description of your situation and why you need support..."
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">
                  Upload relevant documents (ID proof, medical reports, etc.)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-slate-100 rounded-lg cursor-pointer hover:bg-slate-200"
                >
                  Choose Files
                </label>
                {documentUrls.length > 0 && (
                  <div className="mt-4 text-left">
                    <p className="text-sm font-medium mb-2">Uploaded files:</p>
                    <ul className="text-sm text-slate-600">
                      {documentUrls.map((url, idx) => (
                        <li key={idx}>{url}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin mr-2" />}
              {t("beneficiary.apply.submit", "Submit Application")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
