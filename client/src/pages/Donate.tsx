import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDonation } from "@/hooks/use-donations";
import { usePrograms } from "@/hooks/use-programs";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Heart, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const donateSchema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  donorName: z.string().min(2, "Name is required"),
  donorEmail: z.string().email("Invalid email"),
  programId: z.string().optional(),
});

type DonateForm = z.infer<typeof donateSchema>;

export default function Donate() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const programIdParam = searchParams.get("program");

  const { data: programs } = usePrograms();
  const { mutate: createDonation, isPending } = useCreateDonation();
  const { toast } = useToast();

  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1000);

  const form = useForm<DonateForm>({
    resolver: zodResolver(donateSchema),
    defaultValues: {
      amount: 1000,
      donorName: "",
      donorEmail: "",
      programId: programIdParam || "general",
    },
  });

  const onSubmit = (data: DonateForm) => {
    // In a real app, this would integrate with Razorpay/Stripe
    // Here we simulate the donation creation
    createDonation({
      ...data,
      amount: data.amount * 100, // convert to paise/cents
      currency: "INR",
      programId: data.programId === "general" ? undefined : Number(data.programId),
    }, {
      onSuccess: () => {
        toast({
          title: "Thank you for your donation!",
          description: "We have received your contribution.",
        });
        form.reset();
      },
    });
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setSelectedPreset(null);
    form.setValue("amount", Number(val));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Make a Donation</h1>
            <p className="text-slate-600 mb-8">Your contribution changes lives directly.</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Amount Selection */}
              <div className="space-y-4">
                <Label>Select Amount (INR)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 1000, 2500, 5000, 10000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAmountSelect(amt)}
                      className={`py-3 rounded-xl border-2 font-medium transition-all ${
                        selectedPreset === amt
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-100 hover:border-primary/50 text-slate-600"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customAmount}
                      onChange={handleCustomAmount}
                      className={`w-full h-full pl-7 pr-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-all ${
                        !selectedPreset ? "border-primary bg-primary/5" : "border-slate-100"
                      }`}
                    />
                  </div>
                </div>
                {form.formState.errors.amount && <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>}
              </div>

              {/* Program Selection */}
              <div className="space-y-2">
                <Label>I want to support</Label>
                <Select 
                  onValueChange={(val) => form.setValue("programId", val)} 
                  defaultValue={programIdParam || "general"}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200">
                    <SelectValue placeholder="Select a cause" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Fund (Where needed most)</SelectItem>
                    {programs?.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...form.register("donorName")} className="h-12 rounded-xl" placeholder="John Doe" />
                  {form.formState.errors.donorName && <p className="text-red-500 text-sm">{form.formState.errors.donorName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input {...form.register("donorEmail")} className="h-12 rounded-xl" placeholder="john@example.com" />
                  {form.formState.errors.donorEmail && <p className="text-red-500 text-sm">{form.formState.errors.donorEmail.message}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                disabled={isPending}
              >
                {isPending ? <Loader2 className="animate-spin mr-2" /> : <Heart className="mr-2 fill-current" />}
                {isPending ? "Processing..." : "Complete Donation"}
              </Button>

              <div className="flex items-center justify-center text-sm text-slate-500 space-x-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>Secure payment powered by Stripe/Razorpay</span>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
              <h3 className="font-bold text-secondary text-lg mb-2">Why Donate?</h3>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-secondary" /> Tax benefits under 80G</li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-secondary" /> Complete transparency reports</li>
                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-secondary" /> Direct impact on beneficiaries</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600 mb-4">Contact our donor support team for any queries regarding your donation.</p>
              <p className="font-medium text-primary">support@umedh.org</p>
              <p className="font-medium text-primary">+91 98765 43210</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Temporary Icon Fix */}
      <CheckCircle2 className="hidden" />
    </div>
  );
}

// Icon import needed for the secondary component
import { CheckCircle2 } from "lucide-react";
