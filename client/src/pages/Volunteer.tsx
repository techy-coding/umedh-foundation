import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterVolunteer } from "@/hooks/use-volunteers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const volunteerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number required"),
  skills: z.string().optional(),
  availability: z.string().optional(),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type VolunteerForm = z.infer<typeof volunteerSchema>;

export default function Volunteer() {
  const { t } = useTranslation();
  const { mutate, isPending } = useRegisterVolunteer();
  const form = useForm<VolunteerForm>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = (data: VolunteerForm) => {
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">{t("volunteer.title", "Join Our Team")}</h1>
            <p className="text-slate-600">{t("volunteer.subtitle", "Volunteer your time and skills to help us create a better world.")}</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input {...form.register("name")} className="h-12 rounded-xl" />
              {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register("email")} className="h-12 rounded-xl" />
                {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input {...form.register("phone")} className="h-12 rounded-xl" />
                {form.formState.errors.phone && <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills & Interests</Label>
              <Textarea {...form.register("skills")} className="min-h-[100px] rounded-xl" placeholder="Tell us what you're good at..." />
            </div>

            <div className="space-y-2">
              <Label>Availability (Days/Hours)</Label>
              <Input {...form.register("availability")} className="h-12 rounded-xl" />
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-xl bg-secondary hover:bg-secondary/90 text-white" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin mr-2" />}
              {t("beneficiary.apply.submit", "Submit Application")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
