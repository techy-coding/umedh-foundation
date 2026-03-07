import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, MapPin, CreditCard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useDonorProfile, useUpdateDonorProfile } from "@/hooks/use-admin";
import { useState } from "react";

export default function DonorProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const { data, isLoading: profileLoading } = useDonorProfile();
  const updateProfile = useUpdateDonorProfile();
  const [, setLocation] = useLocation();

  const [form, setForm] = useState({ firstName: "", lastName: "", profileImageUrl: "", address: "", paymentMethod: "" });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "donor" && user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        profileImageUrl: data.profileImageUrl || "",
        address: data.address || "",
        paymentMethod: data.paymentMethod || "",
      });
    }
  }, [data]);

  if (authLoading || profileLoading || !user || (user.role !== "donor" && user.role !== "admin")) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleSubmit = () => {
    updateProfile.mutate(form);
  };

  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Donor";
  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() || "D";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-white">
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Edit Profile</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              {form.profileImageUrl ? (
                <img
                  src={form.profileImageUrl}
                  alt={fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-sky-100 shadow-sm"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-sky-100 text-sky-700 border-4 border-sky-50 shadow-sm flex items-center justify-center text-3xl font-bold">
                  {initials}
                </div>
              )}
              <h2 className="mt-4 text-xl font-semibold text-slate-900">{fullName}</h2>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Enter your first name"
                  className="h-11 border-slate-300 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Enter your last name"
                  className="h-11 border-slate-300 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="profileImageUrl" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-500" /> Profile Image URL
                </Label>
                <Input
                  id="profileImageUrl"
                  value={form.profileImageUrl}
                  onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="h-11 border-slate-300 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" /> Address
                </Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="City, State"
                  className="h-11 border-slate-300 bg-white focus-visible:ring-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-500" /> Preferred Payment Method
                </Label>
                <Input
                  id="paymentMethod"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  placeholder="UPI / Card / Net Banking"
                  className="h-11 border-slate-300 bg-white focus-visible:ring-sky-500"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSubmit} disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    firstName: data?.firstName || "",
                    lastName: data?.lastName || "",
                    profileImageUrl: data?.profileImageUrl || "",
                    address: data?.address || "",
                    paymentMethod: data?.paymentMethod || "",
                  })
                }
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
