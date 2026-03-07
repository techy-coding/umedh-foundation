import { useAuth } from "@/hooks/use-auth";
import { useDonations } from "@/hooks/use-donations";
import { useLocation } from "wouter";
import {
  Loader2,
  LayoutDashboard,
  DollarSign,
  FolderKanban,
  Users,
  Calendar,
  UserRound,
  HandHeart,
  Image,
  MessageSquare,
  FileText,
  Newspaper,
  Settings,
  Plus,
  CheckCircle2,
  Upload,
  Bell,
  LogOut,
} from "lucide-react";
import {
  useAdminChildren,
  useAdminPrograms,
  useCreateAdminProgram,
  useUpdateAdminProgram,
  useDeleteAdminProgram,
  useCreateChild,
  useUpdateChild,
  useDeleteChild,
  useGenerateReceipt,
  useAdminSponsorships,
  useUpdateSponsorshipStatus,
  useAdminVolunteers,
  useApproveVolunteer,
  useRejectVolunteer,
  useAdminEvents,
  useCreateAdminEvent,
  useAdminBeneficiaries,
  useReviewBeneficiary,
  useUpdateBeneficiaryFunding,
  useAdminGallery,
  useCreateGalleryItem,
  useDeleteGalleryItem,
  useAdminMessages,
  useAdminUsers,
  useAdminSendInboxMessage,
  useReplyAdminMessage,
  useAdminActivities,
  useAdminNotifications,
  useAdminReportSummary,
  useAdminSettings,
  useUpdateAdminEvent,
  useDeleteAdminEvent,
  useAdminEventRegistrations,
  useAdminUpdateEventRegistrationAttendance,
  useAssignVolunteerTask,
  useAdminDonationReport,
  useAdminSponsorshipReport,
  useAdminVolunteerReport,
  useAdminEventReport,
  useAdminBlogs,
  useCreateAdminBlog,
  useUpdateAdminBlog,
  useDeleteAdminBlog,
} from "@/hooks/use-admin";
import { type ComponentType, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { api, buildUrl } from "@shared/routes";

type AdminSection =
  | "dashboard"
  | "children"
  | "programs"
  | "beneficiaries"
  | "donations"
  | "sponsorships"
  | "volunteers"
  | "events"
  | "gallery"
  | "messages"
  | "blog"
  | "reports"
  | "settings";

function BeneficiaryManagement() {
  const { data, isLoading, isError } = useAdminBeneficiaries();
  const reviewMutation = useReviewBeneficiary();
  const fundingMutation = useUpdateBeneficiaryFunding();

  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});
  const [fundMap, setFundMap] = useState<Record<number, { amount: string; status: string }>>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (isError) {
    return <p className="text-red-600">Failed to load beneficiary applications.</p>;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Beneficiary Applications</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Name</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Type</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">New Status</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Notes</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Funding</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((app) => (
              <tr key={app.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{app.name}</td>
                <td className="py-3 pr-4 text-slate-600 capitalize">{app.applicationType}</td>

                {/* status column with editable select */}
                <td className="py-3 pr-4">
                  <select
                    value={statusMap[app.id] ?? app.status}
                    onChange={(e) => setStatusMap((m) => ({ ...m, [app.id]: e.target.value }))}
                    className="rounded-md border border-slate-300 px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>

                <td className="py-3 pr-4">
                  <input
                    type="text"
                    placeholder="Notes"
                    value={notesMap[app.id] || ""}
                    onChange={(e) => setNotesMap((m) => ({ ...m, [app.id]: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-2 py-1"
                  />
                </td>

                <td className="py-3 pr-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={fundMap[app.id]?.amount ?? ((app.fundingAmount || 0) / 100).toString()}
                    onChange={(e) => {
                      setFundMap((m) => ({
                        ...m,
                        [app.id]: {
                          ...(m[app.id] || { status: app.fundingStatus || "pending" }),
                          amount: e.target.value,
                        },
                      }));
                    }}
                    className="w-full rounded-md border border-slate-300 px-2 py-1"
                  />
                  <select
                    value={fundMap[app.id]?.status ?? app.fundingStatus ?? "pending"}
                    onChange={(e) => {
                      const st = e.target.value;
                      setFundMap((m) => ({
                        ...m,
                        [app.id]: {
                          ...(m[app.id] || { amount: ((app.fundingAmount || 0) / 100).toString() }),
                          status: st,
                        },
                      }));
                    }}
                    className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="released">Released</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                <td className="py-3 pr-4 space-x-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      const newStatus = statusMap[app.id] ?? app.status ?? "pending";
                      reviewMutation.mutate(
                        { id: app.id, status: newStatus, notes: notesMap[app.id] || undefined },
                        {
                          onSuccess: () => alert("Review updated successfully"),
                          onError: () => alert("Failed to update review"),
                        }
                      );
                    }}
                    disabled={reviewMutation.isPending}
                  >
                    Save Review
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const fund = fundMap[app.id] || {
                        amount: ((app.fundingAmount || 0) / 100).toString(),
                        status: app.fundingStatus || "pending",
                      };
                      const amountPaise = Math.round((parseFloat(fund.amount || "0") || 0) * 100);
                      fundingMutation.mutate(
                        { id: app.id, fundingAmount: amountPaise, fundingStatus: fund.status },
                        {
                          onSuccess: () => alert("Funding updated successfully"),
                          onError: () => alert("Failed to update funding"),
                        }
                      );
                    }}
                    disabled={fundingMutation.isPending}
                  >
                    Save Funding
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


function ChildrenManagement() {
  const { data, isLoading, isError } = useAdminChildren();
  const createChild = useCreateChild();
  const updateChild = useUpdateChild();
  const deleteChild = useDeleteChild();

  const [formState, setFormState] = useState({ name: "", age: "", gender: "", educationDetails: "", medicalDetails: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = () => {
    const payload: any = {
      name: formState.name,
      age: parseInt(formState.age),
      gender: formState.gender,
      educationDetails: formState.educationDetails,
      medicalDetails: formState.medicalDetails,
    };
    if (editingId) {
      updateChild.mutate({ id: editingId, data: payload });
    } else {
      createChild.mutate(payload);
    }
    setFormState({ name: "", age: "", gender: "", educationDetails: "", medicalDetails: "" });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600">Failed to load children.</p>;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Children Management</h2>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Child Name</label>
            <input
              placeholder="Enter child name"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Age</label>
            <input
              placeholder="8"
              type="number"
              value={formState.age}
              onChange={(e) => setFormState({ ...formState, age: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Gender</label>
            <input
              placeholder="Male / Female / Other"
              value={formState.gender}
              onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Education Details</label>
            <input
              placeholder="School, class, learning notes"
              value={formState.educationDetails}
              onChange={(e) => setFormState({ ...formState, educationDetails: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Medical Details</label>
            <input
              placeholder="Health condition, allergies, notes"
              value={formState.medicalDetails}
              onChange={(e) => setFormState({ ...formState, medicalDetails: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={handleSubmit} disabled={createChild.isPending || updateChild.isPending}>
            {editingId ? "Update Child" : "Add Child"}
          </Button>
          {editingId && (
            <Button variant="outline" className="ml-2" onClick={() => { setEditingId(null); setFormState({ name: "", age: "", gender: "", educationDetails: "", medicalDetails: "" }); }}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Name</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Age</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Gender</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((child) => (
              <tr key={child.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{child.name}</td>
                <td className="py-3 pr-4 text-slate-600">{child.age}</td>
                <td className="py-3 pr-4 text-slate-600">{child.gender}</td>
                <td className="py-3 pr-4">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => {
                      setEditingId(child.id);
                      setFormState({
                        name: child.name || "",
                        age: child.age?.toString() || "",
                        gender: child.gender || "",
                        educationDetails: child.educationDetails || "",
                        medicalDetails: child.medicalDetails || "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteChild.mutate(child.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ProgramsManagement() {
  const { data, isLoading, isError, error } = useAdminPrograms();
  const createProgram = useCreateAdminProgram();
  const updateProgram = useUpdateAdminProgram();
  const deleteProgram = useDeleteAdminProgram();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    goalAmount: "",
    imageUrl: "",
  });

  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">{error instanceof Error ? error.message : "Failed to load programs."}</p>;

  const reset = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", description: "", longDescription: "", goalAmount: "", imageUrl: "" });
  };

  const submit = () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      longDescription: form.longDescription || undefined,
      goalAmount: parseInt(form.goalAmount, 10) || 0,
      imageUrl: form.imageUrl || undefined,
    };
    if (editingId) updateProgram.mutate({ id: editingId, data: payload }, { onSuccess: reset });
    else createProgram.mutate(payload, { onSuccess: reset });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Programs Management</h2>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Program Title</label>
            <input
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="Enter program title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Slug</label>
            <input
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="education-for-all"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Goal Amount (INR)</label>
            <input
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="500000"
              type="number"
              value={form.goalAmount}
              onChange={(e) => setForm({ ...form, goalAmount: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Image URL</label>
            <input
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1 mb-3">
          <label className="text-sm font-medium text-slate-700">Short Description</label>
          <input
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            placeholder="One-line summary for cards"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Long Description</label>
          <textarea
            className="w-full min-h-[120px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            placeholder="Detailed description shown on program details page"
            value={form.longDescription}
            onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Button onClick={submit} disabled={createProgram.isPending || updateProgram.isPending || !form.title || !form.slug || !form.description || !form.goalAmount}>
          {editingId ? "Update Program" : "Add Program"}
        </Button>
        {editingId && <Button variant="outline" onClick={reset}>Cancel</Button>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Title</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Goal</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Raised</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Progress</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((p) => {
              const progress = p.goalAmount > 0 ? Math.min(100, Math.round(((p.raisedAmount || 0) / p.goalAmount) * 100)) : 0;
              return (
                <tr key={p.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 text-slate-900">{p.title}</td>
                  <td className="py-3 pr-4 text-slate-600">₹{p.goalAmount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-slate-600">₹{(p.raisedAmount || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4 text-slate-600">{progress}%</td>
                  <td className="py-3 pr-4 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setEditingId(p.id);
                        setForm({
                          title: p.title || "",
                          slug: p.slug || "",
                          description: p.description || "",
                          longDescription: p.longDescription || "",
                          goalAmount: p.goalAmount?.toString() || "",
                          imageUrl: p.imageUrl || "",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteProgram.mutate(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminSponsorshipsSection() {
  const { data, isLoading, isError } = useAdminSponsorships();
  const { data: children } = useAdminChildren();
  const updateStatus = useUpdateSponsorshipStatus();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600">Failed to load sponsorships.</p>;
  }

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Sponsorships</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Child</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Sponsor</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Amount</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Frequency</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((s) => {
              const child = (children || []).find((c) => c.id === s.childId);
              return (
                <tr key={s.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 text-slate-900">
                    {child ? child.name : `Unknown Child (ID: ${s.childId})`}
                  </td>
                  <td className="py-3 pr-4 text-slate-900">{s.sponsorName}</td>
                  <td className="py-3 pr-4 text-slate-900">₹{s.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-slate-600 capitalize">{s.frequency}</td>
                  <td className="py-3 pr-4 text-slate-600 capitalize">{s.status}</td>
                  <td className="py-3 pr-4">
                    {s.status !== "active" && (
                      <Button size="sm" onClick={() => updateStatus.mutate({ id: s.id, status: "active" })}>
                        Activate
                      </Button>
                    )}
                    {s.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: s.id, status: "paused" })}>
                        Pause
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EventManagement() {
  const { data, isLoading, isError } = useAdminEvents();
  const create = useCreateAdminEvent();
  const update = useUpdateAdminEvent();
  const remove = useDeleteAdminEvent();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { data: registrations, isLoading: regsLoading } = useAdminEventRegistrations(selectedEventId);
  const updateAttendance = useAdminUpdateEventRegistrationAttendance();
  const [form, setForm] = useState({ title: "", slug: "", description: "", date: "", location: "", imageUrl: "", capacity: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">Failed to load events.</p>;

  const handleSubmit = () => {
    const payload: any = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      date: new Date(form.date),
      location: form.location,
      imageUrl: form.imageUrl,
      capacity: parseInt(form.capacity) || 0,
    };
    if (editingId) {
      update.mutate({ id: editingId, data: payload });
    } else {
      create.mutate(payload);
    }
    setForm({ title: "", slug: "", description: "", date: "", location: "", imageUrl: "", capacity: "" });
    setEditingId(null);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Events Management</h2>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold mb-3 text-slate-900">{editingId ? "Edit Event" : "Create Event"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Event Title</label>
            <input
              placeholder="Annual Charity Gala"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Slug</label>
            <input
              placeholder="annual-charity-gala"
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Location</label>
            <input
              placeholder="City Hall, Kolhapur"
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Image URL</label>
            <input
              placeholder="https://..."
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Capacity</label>
            <input
              placeholder="200"
              type="number"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleSubmit} disabled={create.isPending || update.isPending}>
          {editingId ? "Update Event" : "Create Event"}
        </Button>
        {editingId && (
          <Button className="mt-4 ml-2" variant="outline" onClick={() => {
            setEditingId(null);
            setForm({ title: "", slug: "", description: "", date: "", location: "", imageUrl: "", capacity: "" });
          }}>
            Cancel
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Title</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Date</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Location</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Capacity</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Registrations</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(ev => (
              <tr key={ev.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{ev.title}</td>
                <td className="py-3 pr-4 text-slate-600">{ev.date ? new Date(ev.date).toLocaleDateString() : '-'}</td>
                <td className="py-3 pr-4 text-slate-600">{ev.location}</td>
                <td className="py-3 pr-4 text-slate-600">{ev.capacity}</td>
                <td className="py-3 pr-4 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setEditingId(ev.id);
                      setForm({
                        title: ev.title || "",
                        slug: ev.slug || "",
                        description: ev.description || "",
                        date: ev.date ? new Date(ev.date).toISOString().slice(0, 10) : "",
                        location: ev.location || "",
                        imageUrl: ev.imageUrl || "",
                        capacity: ev.capacity?.toString() || "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => remove.mutate(ev.id)}>
                    Delete
                  </button>
                </td>
                <td className="py-3 pr-4">
                  <Button size="sm" variant="outline" onClick={() => setSelectedEventId(ev.id)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Event Registrations</h3>
        {!selectedEventId ? (
          <p className="text-slate-600">Select an event to view registrations.</p>
        ) : regsLoading ? (
          <div className="flex items-center gap-2 text-slate-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading registrations...</div>
        ) : !registrations || registrations.length === 0 ? (
          <p className="text-slate-600">No registrations for this event yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold text-slate-700">Name</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Email</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Registered At</th>
                  <th className="py-3 pr-4 font-semibold text-slate-700">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-900">{reg.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{reg.email}</td>
                    <td className="py-3 pr-4 text-slate-600">{reg.createdAt ? new Date(reg.createdAt).toLocaleString() : "-"}</td>
                    <td className="py-3 pr-4">
                      <Button
                        size="sm"
                        variant={reg.attended ? "default" : "outline"}
                        onClick={() => updateAttendance.mutate({ registrationId: reg.id, attended: !reg.attended })}
                        disabled={updateAttendance.isPending}
                      >
                        {reg.attended ? "Present" : "Mark Present"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function GalleryManagement() {
  const { data, isLoading, isError } = useAdminGallery();
  const create = useCreateGalleryItem();
  const remove = useDeleteGalleryItem();
  const [form, setForm] = useState({ title: "", mediaUrl: "", mediaType: "image", category: "" });
  const [selectedFileName, setSelectedFileName] = useState("");

  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">Failed to load gallery.</p>;

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, mediaType, mediaUrl: String(reader.result || "") }));
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Gallery</h2>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="Annual Day Celebration" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Media URL (optional if file selected)</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="https://..." value={form.mediaUrl} onChange={e => setForm({ ...form, mediaUrl: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Media Type</label>
            <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30" value={form.mediaType} onChange={e => setForm({ ...form, mediaType: e.target.value })}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="events / activities" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Upload File (Demo)</label>
            <input
              type="file"
              accept="image/*,video/*"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1 file:text-sky-700"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </div>
      {selectedFileName && <p className="text-sm text-slate-600 mb-3">Selected file: {selectedFileName}</p>}
      <Button
        onClick={() => {
          create.mutate(form);
          setForm({ title: "", mediaUrl: "", mediaType: "image", category: "" });
          setSelectedFileName("");
        }}
        disabled={create.isPending || !form.title || !form.mediaUrl}
      >
        Add Media (Demo Upload)
      </Button>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Title</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Type</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Category</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{item.title}</td>
                <td className="py-3 pr-4 text-slate-600 capitalize">{item.mediaType}</td>
                <td className="py-3 pr-4 text-slate-600">{item.category || "-"}</td>
                <td className="py-3 pr-4">
                  <button className="text-red-600 hover:underline" onClick={() => remove.mutate(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MessagesManagement() {
  const { data, isLoading, isError } = useAdminMessages();
  const { data: users } = useAdminUsers();
  const sendInbox = useAdminSendInboxMessage();
  const reply = useReplyAdminMessage();
  const [replyMap, setReplyMap] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<"all" | "replied" | "unreplied">("all");
  const [targetUserId, setTargetUserId] = useState("");
  const [inboxText, setInboxText] = useState("");
  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">Failed to load messages.</p>;

  const rows = data || [];
  const repliedCount = rows.filter((m) => !!m.adminReply).length;
  const unrepliedCount = rows.length - repliedCount;
  const filteredRows = rows.filter((m) => {
    if (filter === "replied") return !!m.adminReply;
    if (filter === "unreplied") return !m.adminReply;
    return true;
  });

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Messages</h2>
      <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white">
        <h3 className="font-semibold text-slate-900 mb-3">Send Message to User Inbox</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            className="input input-bordered w-full"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
          >
            <option value="">Select user</option>
            {(users || [])
              .filter((u: any) => u.role !== "admin")
              .map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role}) - {u.email}
                </option>
              ))}
          </select>
          <input
            className="input input-bordered w-full md:col-span-2"
            placeholder="Type message for selected user"
            value={inboxText}
            onChange={(e) => setInboxText(e.target.value)}
          />
        </div>
        <Button
          className="mt-3"
          onClick={() =>
            sendInbox.mutate(
              { userId: targetUserId, message: inboxText },
              {
                onSuccess: () => {
                  setInboxText("");
                  setTargetUserId("");
                },
              }
            )
          }
          disabled={sendInbox.isPending || !targetUserId || !inboxText.trim()}
        >
          Send to Inbox
        </Button>
        {sendInbox.isError && (
          <p className="text-sm text-red-600 mt-2">Failed to send inbox message. Please try again.</p>
        )}
        {sendInbox.isSuccess && (
          <p className="text-sm text-emerald-700 mt-2">Message sent to user inbox.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
          All ({rows.length})
        </Button>
        <Button size="sm" variant={filter === "unreplied" ? "default" : "outline"} onClick={() => setFilter("unreplied")}>
          Unreplied ({unrepliedCount})
        </Button>
        <Button size="sm" variant={filter === "replied" ? "default" : "outline"} onClick={() => setFilter("replied")}>
          Replied ({repliedCount})
        </Button>
      </div>
      <div className="space-y-3">
        {filteredRows.map((m) => (
          <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="font-semibold text-slate-900">{m.name} ({m.email})</p>
            <p className="text-slate-700 mt-1">{m.message}</p>
            {m.adminReply && <p className="text-sm text-emerald-700 mt-2">Reply: {m.adminReply}</p>}
            <div className="mt-2 flex gap-2">
              <input
                className="input input-bordered w-full"
                placeholder="Type reply..."
                value={replyMap[m.id] || ""}
                onChange={(e) => setReplyMap((prev) => ({ ...prev, [m.id]: e.target.value }))}
              />
              <Button
                size="sm"
                onClick={() =>
                  reply.mutate(
                    { id: m.id, reply: replyMap[m.id] || "" },
                    {
                      onSuccess: () => setReplyMap((prev) => ({ ...prev, [m.id]: "" })),
                    }
                  )
                }
                disabled={reply.isPending || !(replyMap[m.id] || "").trim()}
              >
                Reply
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">{m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}</p>
          </div>
        ))}
        {filteredRows.length === 0 && <p className="text-slate-600">No messages found.</p>}
      </div>
    </>
  );
}

function ReportsSection() {
  const { data, isLoading, isError } = useAdminReportSummary();
  const { data: donationRows } = useAdminDonationReport();
  const { data: sponsorshipRows } = useAdminSponsorshipReport();
  const { data: volunteerRows } = useAdminVolunteerReport();
  const { data: eventRows } = useAdminEventReport();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [donationStatus, setDonationStatus] = useState<"all" | "completed" | "pending" | "failed">("all");
  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError || !data) return <p className="text-red-600">Failed to load reports.</p>;

  const inRange = (value?: string | Date | null) => {
    if (!value) return false;
    const time = new Date(value).getTime();
    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;
    if (start && time < start) return false;
    if (end && time > end) return false;
    return true;
  };

  const filteredDonations = (donationRows || []).filter((row) => {
    const statusOk = donationStatus === "all" ? true : row.status === donationStatus;
    const dateOk = startDate || endDate ? inRange(row.createdAt) : true;
    return statusOk && dateOk;
  });
  const donationTotal = filteredDonations.reduce((sum, row) => sum + row.amount, 0);
  const filteredSponsorships = (sponsorshipRows || []).filter((row) => (startDate || endDate ? inRange(row.startDate) : true));
  const filteredVolunteers = (volunteerRows || []).filter((row) => (startDate || endDate ? inRange(row.createdAt) : true));
  const filteredEvents = (eventRows || []).filter((row) => (startDate || endDate ? inRange(row.date) : true));

  const downloadCsv = async (type: "donations" | "sponsorships" | "volunteers" | "events") => {
    const url = buildUrl(api.admin.reportCsv.path, { type });
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return;
    const text = await res.text();
    const blob = new Blob([text], { type: "text/csv" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${type}-report.csv`;
    a.click();
    URL.revokeObjectURL(href);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Reports Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <input type="date" className="input input-bordered w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="input input-bordered w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <select
          className="input input-bordered w-full"
          value={donationStatus}
          onChange={(e) => setDonationStatus(e.target.value as "all" | "completed" | "pending" | "failed")}
        >
          <option value="all">All Donation Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <Button
          variant="outline"
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setDonationStatus("all");
          }}
        >
          Clear Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl">Children: <strong>{data.totalChildren}</strong></div>
        <div className="bg-slate-50 p-4 rounded-xl">Donations: <strong>{filteredDonations.length}</strong></div>
        <div className="bg-slate-50 p-4 rounded-xl">Sponsors: <strong>{data.totalSponsors}</strong></div>
        <div className="bg-slate-50 p-4 rounded-xl">Volunteers: <strong>{filteredVolunteers.length}</strong></div>
        <div className="bg-slate-50 p-4 rounded-xl">Events: <strong>{filteredEvents.length}</strong></div>
        <div className="bg-slate-50 p-4 rounded-xl">Donation Amount: <strong>₹{(donationTotal / 100).toLocaleString()}</strong></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Donations</p>
          <p className="text-xl font-semibold text-slate-900 mb-3">{filteredDonations.length} records</p>
          <Button size="sm" variant="outline" onClick={() => downloadCsv("donations")}>Download CSV</Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Sponsorships</p>
          <p className="text-xl font-semibold text-slate-900 mb-3">{filteredSponsorships.length} records</p>
          <Button size="sm" variant="outline" onClick={() => downloadCsv("sponsorships")}>Download CSV</Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Volunteers</p>
          <p className="text-xl font-semibold text-slate-900 mb-3">{filteredVolunteers.length} records</p>
          <Button size="sm" variant="outline" onClick={() => downloadCsv("volunteers")}>Download CSV</Button>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Events</p>
          <p className="text-xl font-semibold text-slate-900 mb-3">{filteredEvents.length} records</p>
          <Button size="sm" variant="outline" onClick={() => downloadCsv("events")}>Download CSV</Button>
        </div>
      </div>
    </>
  );
}

function BlogManagement() {
  const { data, isLoading, isError } = useAdminBlogs();
  const createBlog = useCreateAdminBlog();
  const updateBlog = useUpdateAdminBlog();
  const deleteBlog = useDeleteAdminBlog();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    imageUrl: "",
    published: true,
  });

  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">Failed to load blog posts.</p>;

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", slug: "", content: "", imageUrl: "", published: true });
  };

  const submit = () => {
    const payload = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      published: form.published,
      authorId: null,
    };
    if (editingId) updateBlog.mutate({ id: editingId, data: payload }, { onSuccess: resetForm });
    else createBlog.mutate(payload, { onSuccess: resetForm });
  };

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Blog Management</h2>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Post Title</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="Impact of Education on Rural Development" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Slug (unique)</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="impact-of-education" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Image URL</label>
            <input className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="https://..." value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 pb-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Publish now
            </label>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Blog Content</label>
          <textarea className="w-full min-h-[160px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30" placeholder="Write blog content..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        <Button onClick={submit} disabled={createBlog.isPending || updateBlog.isPending || !form.title || !form.slug || !form.content}>
          {editingId ? "Update Post" : "Create Post"}
        </Button>
        {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Title</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Slug</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Published</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((post) => (
              <tr key={post.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{post.title}</td>
                <td className="py-3 pr-4 text-slate-600">{post.slug}</td>
                <td className="py-3 pr-4 text-slate-600">{post.published ? "Yes" : "No"}</td>
                <td className="py-3 pr-4 space-x-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setEditingId(post.id);
                      setForm({
                        title: post.title || "",
                        slug: post.slug || "",
                        content: post.content || "",
                        imageUrl: post.imageUrl || "",
                        published: !!post.published,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => deleteBlog.mutate(post.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SettingsSection() {
  const { user } = useAuth();
  const save = useAdminSettings();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    profileImageUrl: user?.profileImageUrl || "",
  });

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="input input-bordered w-full" placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input className="input input-bordered w-full" placeholder="Profile image URL" value={form.profileImageUrl || ""} onChange={e => setForm({ ...form, profileImageUrl: e.target.value })} />
      </div>
      <Button className="mt-4" onClick={() => save.mutate(form)} disabled={save.isPending}>Save Profile</Button>
    </>
  );
}

function VolunteerManagement() {
  const { data, isLoading, isError } = useAdminVolunteers();
  const approve = useApproveVolunteer();
  const reject = useRejectVolunteer();
  const assignTask = useAssignVolunteerTask();
  const [taskMap, setTaskMap] = useState<
    Record<number, { title: string; description: string; priority: string; dueDate: string; assignedBy: string }>
  >({});

  if (isLoading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin" /></div>;
  if (isError) return <p className="text-red-600">Failed to load volunteers.</p>;

  return (
    <>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Volunteer Approvals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="py-3 pr-4 font-semibold text-slate-700">Name</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Email</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Actions</th>
              <th className="py-3 pr-4 font-semibold text-slate-700">Task Assignment</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((v) => (
              <tr key={v.id} className="border-b border-slate-100">
                <td className="py-3 pr-4 text-slate-900">{v.name}</td>
                <td className="py-3 pr-4 text-slate-600">{v.email}</td>
                <td className="py-3 pr-4 text-slate-600 capitalize">{v.status}</td>
                <td className="py-3 pr-4 space-x-2">
                  <Button size="sm" onClick={() => approve.mutate(v.id)} disabled={approve.isPending || v.status === "approved"}>
                    {v.status === "approved" ? "Approved" : "Approve"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => reject.mutate(v.id)} disabled={reject.isPending || v.status === "rejected"}>
                    {v.status === "rejected" ? "Rejected" : "Reject"}
                  </Button>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Task Title</label>
                      <input
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                      placeholder="Task title"
                      value={taskMap[v.id]?.title || ""}
                      onChange={(e) =>
                        setTaskMap((prev) => ({
                          ...prev,
                          [v.id]: { ...(prev[v.id] || { description: "", priority: "medium", dueDate: "", assignedBy: "" }), title: e.target.value },
                        }))
                      }
                    />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Task Description</label>
                      <input
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                      placeholder="Task description"
                      value={taskMap[v.id]?.description || ""}
                      onChange={(e) =>
                        setTaskMap((prev) => ({
                          ...prev,
                          [v.id]: { ...(prev[v.id] || { title: "", priority: "medium", dueDate: "", assignedBy: "" }), description: e.target.value },
                        }))
                      }
                    />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Priority</label>
                        <select
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                          value={taskMap[v.id]?.priority || "medium"}
                          onChange={(e) =>
                            setTaskMap((prev) => ({
                              ...prev,
                              [v.id]: { ...(prev[v.id] || { title: "", description: "", dueDate: "", assignedBy: "" }), priority: e.target.value },
                            }))
                          }
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Due Date</label>
                        <input
                          type="date"
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                          value={taskMap[v.id]?.dueDate || ""}
                          onChange={(e) =>
                            setTaskMap((prev) => ({
                              ...prev,
                              [v.id]: { ...(prev[v.id] || { title: "", description: "", priority: "medium", assignedBy: "" }), dueDate: e.target.value },
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">Assigned By</label>
                        <input
                          className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                          placeholder="Assigned by"
                          value={taskMap[v.id]?.assignedBy || ""}
                          onChange={(e) =>
                            setTaskMap((prev) => ({
                              ...prev,
                              [v.id]: { ...(prev[v.id] || { title: "", description: "", priority: "medium", dueDate: "" }), assignedBy: e.target.value },
                            }))
                          }
                        />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const task = taskMap[v.id];
                        const details = task?.description?.trim() || "";
                        const lines = [
                          details ? `Details: ${details}` : "Details:",
                          `Priority: ${task?.priority || "medium"}`,
                          `Due Date: ${task?.dueDate || "-"}`,
                          `Assigned By: ${task?.assignedBy || "Admin"}`,
                        ];
                        assignTask.mutate({
                          volunteerId: v.id,
                          title: task?.title || "",
                          description: lines.join("\n"),
                        });
                      }}
                      disabled={assignTask.isPending || !(taskMap[v.id]?.title || "").trim()}
                    >
                      Assign Task
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Admin() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const {
    data: donations,
    isLoading: donationsLoading,
    isError: donationsError,
  } = useDonations();
  const { data: adminChildren } = useAdminChildren();
  const { data: activities } = useAdminActivities();
  const { data: notifications } = useAdminNotifications();
  const generateReceipt = useGenerateReceipt();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const totalRaised = donations?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const totalDonors = new Set(donations?.map((d) => d.donorEmail)).size || 0;
  const activeSponsors = Math.max(0, Math.floor(totalDonors * 0.6));
  const recentDonationsCount = donations?.slice(0, 5).length || 0;
  const notificationCount = (notifications || []).reduce((sum, n) => sum + (n.count || 0), 0);

  const donationChartData = (() => {
    const buckets = new Map<string, number>();

    (donations || []).forEach((donation) => {
      if (!donation.createdAt) {
        return;
      }
      const date = new Date(donation.createdAt);
      const key = date.toLocaleString("en-US", { month: "short" });
      buckets.set(key, (buckets.get(key) || 0) + donation.amount / 100);
    });

    return Array.from(buckets.entries()).map(([name, amount]) => ({ name, amount }));
  })();

  const menuItems: Array<{ key: AdminSection; label: string; icon: ComponentType<{ className?: string }> }> = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "programs", label: "Programs", icon: FolderKanban },
    { key: "children", label: "Children Management", icon: UserRound },
    { key: "beneficiaries", label: "Beneficiaries", icon: UserRound },
    { key: "donations", label: "Donations", icon: DollarSign },
    { key: "sponsorships", label: "Sponsorships", icon: HandHeart },
    { key: "volunteers", label: "Volunteers", icon: Users },
    { key: "events", label: "Events", icon: Calendar },
    { key: "gallery", label: "Gallery", icon: Image },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "blog", label: "Blog", icon: Newspaper },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex admin-form">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:block">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold font-display text-slate-900">Umedh Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Orphanage Management</p>
        </div>
        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeSection}</h1>
            <p className="text-slate-600 text-sm">Welcome, {user.firstName}. Manage operations from one place.</p>
          </div>
          <div className="flex items-center gap-3 relative">
            <Button
              variant="outline"
              className="relative"
              onClick={() => setShowNotificationPanel((prev) => !prev)}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notificationCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {notificationCount}
                </span>
              )}
            </Button>
            {showNotificationPanel && (
              <div className="absolute top-12 left-0 z-20 w-80 rounded-xl border border-slate-200 bg-white shadow-lg p-3">
                <p className="text-sm font-semibold text-slate-900 mb-2">Admin Notifications</p>
                <div className="space-y-2 max-h-80 overflow-auto">
                  {(notifications || []).map((n, idx) => (
                    <button
                      key={`${n.title}-${idx}`}
                      className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100"
                      onClick={() => {
                        if (n.title.includes("Volunteer")) setActiveSection("volunteers");
                        else if (n.title.includes("Contact")) setActiveSection("messages");
                        else if (n.title.includes("Beneficiary")) setActiveSection("beneficiaries");
                        else setActiveSection("dashboard");
                        setShowNotificationPanel(false);
                      }}
                    >
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-600">{n.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Button variant="outline" onClick={() => setLocation("/")}>Website View</Button>
            <Button onClick={() => setActiveSection("events")}>Create Event</Button>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {activeSection === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Total Children</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{adminChildren?.length || 0}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Total Donations</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">₹{(totalRaised / 100).toLocaleString()}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Active Sponsors</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{activeSponsors}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Volunteers</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{totalDonors}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-500">Upcoming Events</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">3</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Donation Overview</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={donationChartData.length > 0 ? donationChartData : [{ name: "No Data", amount: 0 }]}> 
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activities</h2>
                <div className="space-y-3 text-sm text-slate-600">
                  {(activities || []).slice(0, 4).map((activity, idx) => (
                    <div key={`${activity.type}-${idx}`} className="p-3 rounded-lg bg-slate-50">
                      {activity.description}
                    </div>
                  ))}
                  {(!activities || activities.length === 0) && (
                    <>
                      <div className="p-3 rounded-lg bg-slate-50">New child profile added</div>
                      <div className="p-3 rounded-lg bg-slate-50">{recentDonationsCount} recent donations received</div>
                      <div className="p-3 rounded-lg bg-slate-50">Volunteer registration pending review</div>
                      <div className="p-3 rounded-lg bg-slate-50">Event created for this month</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {notifications && notifications.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Notifications</h2>
                <div className="space-y-2">
                  {notifications.map((n, idx) => (
                    <div key={`${n.title}-${idx}`} className="p-3 rounded-lg bg-slate-50">
                      <p className="font-medium text-slate-900">{n.title}</p>
                      <p className="text-sm text-slate-600">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Children Overview</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-slate-200">
                        <th className="py-3 pr-4 font-semibold text-slate-700">Name</th>
                        <th className="py-3 pr-4 font-semibold text-slate-700">Age</th>
                        <th className="py-3 pr-4 font-semibold text-slate-700">Sponsorship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(adminChildren || []).slice(0, 5).map((child) => (
                        <tr key={child.id} className="border-b border-slate-100">
                          <td className="py-3 pr-4 text-slate-900">{child.name}</td>
                          <td className="py-3 pr-4 text-slate-600">{child.age}</td>
                          <td className="py-3 pr-4 text-slate-600">{child.sponsorshipStatus || "pending"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => setActiveSection("children")}> 
                    <Plus className="w-4 h-4 mr-2" /> Add New Child
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection("events")}> 
                    <Calendar className="w-4 h-4 mr-2" /> Create Event
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection("volunteers")}> 
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Volunteers
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection("gallery")}> 
                    <Upload className="w-4 h-4 mr-2" /> Upload Gallery
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === "donations" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            {donationsLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading donations...
              </div>
            ) : donationsError ? (
              <p className="text-red-600">Failed to load donations.</p>
            ) : !donations || donations.length === 0 ? (
              <p className="text-slate-600">No donations found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-slate-200">
                      <th className="py-3 pr-4 font-semibold text-slate-700">Date</th>
                      <th className="py-3 pr-4 font-semibold text-slate-700">Donor</th>
                      <th className="py-3 pr-4 font-semibold text-slate-700">Email</th>
                      <th className="py-3 pr-4 font-semibold text-slate-700">Amount</th>
                      <th className="py-3 pr-4 font-semibold text-slate-700">Status</th>
                      <th className="py-3 pr-4 font-semibold text-slate-700">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 text-slate-600">
                          {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="py-3 pr-4 text-slate-900">{donation.donorName}</td>
                        <td className="py-3 pr-4 text-slate-600">{donation.donorEmail}</td>
                        <td className="py-3 pr-4 text-slate-900">₹{(donation.amount / 100).toLocaleString()}</td>
                        <td className="py-3 pr-4 capitalize text-slate-600">{donation.status}</td>
                        <td className="py-3 pr-4">
                          {donation.receiptUrl ? (
                            <a href={donation.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              View
                            </a>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                generateReceipt.mutate({
                                  id: donation.id,
                                  receiptUrl: `/api/donations/${donation.id}/receipt/download?email=${encodeURIComponent(donation.donorEmail || "")}`,
                                })
                              }
                              disabled={generateReceipt.isPending}
                            >
                              Create Demo Receipt
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeSection === "beneficiaries" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <BeneficiaryManagement />
          </div>
        )}

        {activeSection === "children" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <ChildrenManagement />
          </div>
        )}

        {activeSection === "programs" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <ProgramsManagement />
          </div>
        )}

        {activeSection === "sponsorships" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <AdminSponsorshipsSection />
          </div>
        )}

        {activeSection === "volunteers" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <VolunteerManagement />
          </div>
        )}

        {activeSection === "events" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <EventManagement />
          </div>
        )}

        {activeSection === "gallery" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <GalleryManagement />
          </div>
        )}

        {activeSection === "messages" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <MessagesManagement />
          </div>
        )}

        {activeSection === "blog" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <BlogManagement />
          </div>
        )}

        {activeSection === "reports" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <ReportsSection />
          </div>
        )}

        {activeSection === "settings" && (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
            <SettingsSection />
          </div>
        )}

      </main>
    </div>
  );
}
