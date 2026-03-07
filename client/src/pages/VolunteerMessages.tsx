import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useVolunteerMessages, useSendVolunteerMessage } from "@/hooks/use-volunteer";
import { Button } from "@/components/ui/button";

export default function VolunteerMessages() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: messages, isLoading: msgsLoading } = useVolunteerMessages();
  const sendMsg = useSendVolunteerMessage();
  const [text, setText] = useState("");
  const [readIds, setReadIds] = useState<number[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const raw = localStorage.getItem(`volunteer-read-messages:${user.id}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as number[];
      setReadIds(Array.isArray(parsed) ? parsed : []);
    } catch {
      setReadIds([]);
    }
  }, [user?.id]);

  const markAsRead = (id: number) => {
    if (!user?.id || readIds.includes(id)) return;
    const next = [...readIds, id];
    setReadIds(next);
    localStorage.setItem(`volunteer-read-messages:${user.id}`, JSON.stringify(next));
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLocation("/login");
      } else if (user.role !== "volunteer" && user.role !== "admin") {
        setLocation("/");
      }
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || msgsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMsg.mutate(text);
    setText("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Messages</h1>
        <p className="text-sm text-slate-600 mb-4">
          Unread: {(messages || []).filter((msg: any) => !readIds.includes(msg.id)).length}
        </p>
        <div className="mb-6">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg"
            placeholder="Type a message to admin..."
          />
          <Button className="mt-2" onClick={handleSend} disabled={sendMsg.isPending || !text.trim()}>
            Send
          </Button>
        </div>
        <div className="space-y-4">
          {(messages || []).map((msg: any) => (
            <div key={msg.id} className="p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <p className="text-slate-800">{msg.message}</p>
                {!readIds.includes(msg.id) && (
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">New</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
              {!readIds.includes(msg.id) && (
                <Button variant="outline" size="sm" className="mt-2" onClick={() => markAsRead(msg.id)}>
                  Mark as read
                </Button>
              )}
            </div>
          ))}
          {(!messages || messages.length === 0) && <p className="text-slate-600">No messages yet.</p>}
        </div>
      </div>
    </div>
  );
}
