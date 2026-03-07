import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useInboxMessages } from "@/hooks/use-inbox";
import { useTranslation } from "react-i18next";

export default function Inbox() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data, isLoading, isError } = useInboxMessages();

  useEffect(() => {
    if (authLoading) return;
    if (!user) setLocation("/login");
  }, [authLoading, user, setLocation]);

  if (authLoading || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-600 text-center py-20">{t("inbox.loadError", "Failed to load inbox.")}</p>;
  }

  const messages = (data || []).slice().sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });

  const parseMessage = (raw: string) => {
    let text = raw || "";
    let threadId: string | null = null;
    const threadMatch = text.match(/^\[THREAD:([^\]]+)\]\s*/);
    if (threadMatch) {
      threadId = threadMatch[1];
      text = text.slice(threadMatch[0].length);
    }

    let role: "admin" | "you" | "user" = "user";
    if (text.startsWith("[ADMIN]")) {
      role = "admin";
      text = text.replace("[ADMIN]", "").trim();
    } else if (text.startsWith("[YOU]")) {
      role = "you";
      text = text.replace("[YOU]", "").trim();
    }

    return { threadId, role, text };
  };

  const threadMap = new Map<string, Array<{ id: number; role: "admin" | "you" | "user"; text: string; createdAt?: string | Date | null }>>();
  const singleCards: Array<{ id: number; role: "admin" | "you" | "user"; text: string; createdAt?: string | Date | null }> = [];

  messages.forEach((msg) => {
    const parsed = parseMessage(String(msg.message || ""));
    const item = { id: msg.id, role: parsed.role, text: parsed.text, createdAt: msg.createdAt };
    if (parsed.threadId) {
      const existing = threadMap.get(parsed.threadId) || [];
      existing.push(item);
      threadMap.set(parsed.threadId, existing);
    } else {
      singleCards.push(item);
    }
  });

  const threadCards = Array.from(threadMap.entries())
    .map(([threadId, entries]) => ({ threadId, entries }))
    .sort((a, b) => {
      const aLast = a.entries[a.entries.length - 1];
      const bLast = b.entries[b.entries.length - 1];
      const aTime = aLast?.createdAt ? new Date(aLast.createdAt).getTime() : 0;
      const bTime = bLast?.createdAt ? new Date(bLast.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">{t("inbox.title", "Inbox")}</h1>
      {threadCards.length === 0 && singleCards.length === 0 ? (
        <p className="text-slate-600">{t("inbox.empty", "No messages yet.")}</p>
      ) : (
        <div className="space-y-3">
          {threadCards.map((thread) => {
            const latest = thread.entries[thread.entries.length - 1];
            return (
              <div key={`thread-${thread.threadId}`} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{t("inbox.contactThread", "Contact Thread")}</span>
                  <span className="text-xs text-slate-500">
                    {latest?.createdAt ? new Date(latest.createdAt).toLocaleString() : "-"}
                  </span>
                </div>
                {thread.entries.map((entry) => (
                  <div key={`${thread.threadId}-${entry.id}`}>
                    <p className={`text-xs font-medium mb-1 ${entry.role === "admin" ? "text-blue-700" : entry.role === "you" ? "text-emerald-700" : "text-slate-700"}`}>
                      {entry.role === "admin" ? t("inbox.adminReply", "Admin Reply") : entry.role === "you" ? t("inbox.you", "You") : t("inbox.user", "User")}
                    </p>
                    <p className="text-slate-800">{entry.text}</p>
                  </div>
                ))}
              </div>
            );
          })}

          {singleCards.map((msg) => {
            const fromAdmin = msg.role === "admin";
            const fromYou = msg.role === "you";
            return (
              <div key={msg.id} className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${fromAdmin ? "bg-blue-100 text-blue-700" : fromYou ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                    {fromAdmin ? t("inbox.admin", "Admin") : fromYou ? t("inbox.you", "You") : t("inbox.user", "User")}
                  </span>
                  <span className="text-xs text-slate-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "-"}</span>
                </div>
                <p className="text-slate-800">{msg.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
