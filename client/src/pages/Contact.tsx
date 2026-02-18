import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@/hooks/use-contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { mutate, isPending } = useSubmitContact();
  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-primary py-20 text-center text-white">
        <h1 className="text-4xl font-bold font-display mb-4">Get in Touch</h1>
        <p className="text-lg opacity-90">We'd love to hear from you. Send us a message.</p>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Info Side */}
          <div className="md:w-1/3 bg-slate-900 text-white p-10 space-y-8">
            <div>
              <h3 className="font-bold font-display text-xl mb-4">Contact Information</h3>
              <p className="text-slate-400 text-sm">Fill up the form and our team will get back to you within 24 hours.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1" />
                <span>123 NGO Street, Civil Lines,<br/>Nagpur, Maharashtra 440001</span>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-primary" />
                <span>contact@umedh.org</span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="flex-1 p-10">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...form.register("name")} className="h-12 rounded-xl" />
                  {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...form.register("email")} className="h-12 rounded-xl" />
                  {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea {...form.register("message")} className="min-h-[150px] rounded-xl" />
                {form.formState.errors.message && <p className="text-red-500 text-sm">{form.formState.errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full md:w-auto px-8 h-12 rounded-xl bg-primary hover:bg-primary/90" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin mr-2" />}
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
