"use client";

import React, { useEffect, useState } from "react";
import { ContactMessage } from "@/types";
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Loader2,
  Reply,
  Eye,
  Check,
  Search,
  Filter,
  X,
} from "lucide-react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load messages");
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => (prev ? { ...prev, read: !currentRead } : null));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!confirm(`Are you sure you want to delete inquiry from "${senderName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);

    // If unread, automatically mark as read
    if (!message.read) {
      try {
        await fetch(`/api/admin/messages/${message.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read: true }),
        });

        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error("Auto mark read error", err);
      }
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter((m) => {
    if (filterMode === "unread" && m.read) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            <span>INQUIRY DISPATCH & CRM</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            MESSAGES & INBOX
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-4 py-2 uppercase font-semibold transition-colors ${
              filterMode === "all"
                ? "bg-[#E31B23] text-white"
                : "bg-[#141414] text-[#777777] hover:text-white border border-[#222222]"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterMode("unread")}
            className={`px-4 py-2 uppercase font-semibold transition-colors flex items-center gap-1.5 ${
              filterMode === "unread"
                ? "bg-[#E31B23] text-white"
                : "bg-[#141414] text-[#777777] hover:text-white border border-[#222222]"
            }`}
          >
            {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            <span>Unread ({unreadCount})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter messages by name, email, topic, or keyword..."
          className="w-full bg-[#101010] border border-[#222222] focus:border-[#E31B23] pl-10 pr-4 py-3 text-[#F5F5F5] outline-none text-xs"
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#777777]">
          <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
          <span>Loading client inquiries from Supabase...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 text-center bg-[#101010] border border-[#1F1F1F] p-8 space-y-4">
          <Mail className="w-10 h-10 text-[#444444] mx-auto" />
          <p className="text-[#777777]">
            {searchQuery ? "No inquiries match your search filter." : "Your inbox is empty. No inquiries received yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Message List (5 cols on lg) */}
          <div className="lg:col-span-5 bg-[#101010] border border-[#1F1F1F] divide-y divide-[#171717] max-h-[680px] overflow-y-auto">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-4 cursor-pointer transition-colors relative ${
                    isSelected
                      ? "bg-[#181818] border-l-2 border-l-[#E31B23]"
                      : "hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-[#E31B23] shrink-0" title="Unread" />
                      )}
                      <span className={`font-bold truncate text-xs ${!msg.read ? "text-white" : "text-[#A0A0A0]"}`}>
                        {msg.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#666666] shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#C0C0C0] truncate mb-1">
                    {msg.subject || "No Subject"}
                  </div>

                  <p className="text-[10px] text-[#777777] line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Message Detail Viewer (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#101010] border border-[#1F1F1F] p-6 sm:p-8 space-y-6 sticky top-6">
            {selectedMessage ? (
              <>
                {/* Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#E31B23] font-bold text-xs uppercase tracking-widest">
                        FROM:
                      </span>
                      <span className="font-bold text-sm text-[#F5F5F5]">{selectedMessage.name}</span>
                    </div>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs text-[#888888] hover:text-[#E31B23] transition-colors block"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.read)}
                      className="px-3 py-1.5 bg-[#181818] border border-[#2B2B2B] hover:border-[#E31B23] text-[#A0A0A0] hover:text-white transition-colors"
                      title={selectedMessage.read ? "Mark as Unread" : "Mark as Read"}
                    >
                      {selectedMessage.read ? "Mark Unread" : "Mark Read"}
                    </button>

                    <button
                      onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                      className="p-2 bg-red-950/30 border border-red-800/60 text-red-400 hover:bg-red-950/80 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#141414] border border-[#222222] p-4 text-[11px]">
                  <div>
                    <span className="text-[#666666] block uppercase tracking-wider text-[10px]">
                      SUBJECT / TOPIC
                    </span>
                    <span className="text-[#F5F5F5] font-medium">
                      {selectedMessage.subject || "General Inquiry"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666666] block uppercase tracking-wider text-[10px]">
                      BUDGET / SCOPE
                    </span>
                    <span className="text-[#E31B23] font-medium">
                      {selectedMessage.budget || "Not Specified"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666666] block uppercase tracking-wider text-[10px]">
                      RECEIVED DATE
                    </span>
                    <span className="text-[#A0A0A0]">
                      {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                  <span className="text-[#666666] block uppercase tracking-wider text-[10px]">
                    MESSAGE BODY:
                  </span>
                  <div className="bg-[#141414] border border-[#222222] p-6 text-sm text-[#D0D0D0] leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Direct Reply CTA */}
                <div className="pt-2 flex justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || "Collaboration Inquiry"
                    )}`}
                    className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-3 font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-[#666666]">
                <Eye className="w-8 h-8 mx-auto mb-2 text-[#444444]" />
                <span>Select an inquiry from the list on the left to read full details.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
