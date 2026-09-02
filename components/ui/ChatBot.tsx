"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  RotateCcw,
  Sparkles,
  User,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS_ID = [
  "Apa tech stack utama yang dikuasai Ary?",
  "Ceritakan proyek-proyek unggulan Ary",
  "Bagaimana cara menghubungi atau hire Ary?",
  "Berapa pengalaman & spesialisasi Ary?",
];

const QUICK_PROMPTS_EN = [
  "What is Ary's core tech stack?",
  "Tell me about Ary's featured projects",
  "How can I contact or hire Ary for a project?",
  "What are Ary's primary engineering strengths?",
];

export const ChatBot: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Proactive Chat Prompt Timer (Triggers after 20 seconds of viewing)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    try {
      const isDismissed = sessionStorage.getItem("ardp_chat_prompt_dismissed");
      if (!isDismissed) {
        timer = setTimeout(() => {
          setShowPromptBubble((prev) => {
            // Only show if chat hasn't been opened yet
            return !isOpen ? true : prev;
          });
        }, 20000); // 20 seconds
      }
    } catch (err) {}

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  const initialWelcome =
    language === "id"
      ? "Halo! Saya adalah **ARDP AI Assistant**, asisten digital resmi Ary Dian Pratama. Ada yang ingin Anda tanyakan tentang proyek, keahlian, atau kerja sama software development?"
      : "Hello! I am the **ARDP AI Assistant**, Ary Dian Pratama's official digital assistant. What would you like to know about Ary's projects, tech stack, or engineering services?";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: initialWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setShowPromptBubble(false);
      scrollToBottom();
      if (!hasOpenedOnce) {
        setHasOpenedOnce(true);
      }
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Map to payload for API
      const apiMessages = newMessages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendapatkan respon dari AI.");
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.message || "Maaf, tidak ada respon yang diterima.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **Terjadi kendala:** ${err.message || "Gagal menghubungi server."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          language === "id"
            ? "Riwayat obrolan telah dibersihkan. Silakan tanyakan hal lain seputar Ary Dian Pratama!"
            : "Chat history cleared. Feel free to ask anything about Ary Dian Pratama!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const quickPrompts = language === "id" ? QUICK_PROMPTS_ID : QUICK_PROMPTS_EN;

  // Simple Markdown text formatter (bold, lists, code)
  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      // Process bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-bold text-[var(--foreground)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      // Check if bullet point
      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        return (
          <li key={idx} className="ml-4 list-disc my-1 leading-relaxed">
            {formattedLine}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="no-print print:hidden select-none">
      {/* 1. Floating Launcher Button (Bottom Right next to ThemeToggle) */}
      <div className="fixed bottom-6 right-20 sm:bottom-8 sm:right-24 z-40">
        {/* Proactive Floating Chat Speech Bubble Prompt */}
        {!isOpen && showPromptBubble && (
          <div className="absolute bottom-14 sm:bottom-16 right-0 z-40 w-64 sm:w-72 bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#E31B23]/15 border border-[#E31B23]/40 flex items-center justify-center shrink-0 text-[#E31B23] mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div
                className="flex-1 cursor-pointer"
                onClick={() => {
                  setShowPromptBubble(false);
                  setIsOpen(true);
                }}
              >
                <p className="font-mono text-xs text-[var(--foreground)] leading-relaxed">
                  {language === "id"
                    ? "Hai! 👋 Mau tanya-tanya langsung seputar proyek atau skill Ary? Klik di sini!"
                    : "Hi! 👋 Want to ask anything about Ary's projects or skills? Click here!"}
                </p>
                <span className="font-mono text-[10px] text-[#E31B23] font-bold mt-1.5 inline-flex items-center gap-1 hover:underline">
                  <span>{language === "id" ? "Buka Chat" : "Open Chat"}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPromptBubble(false);
                  try {
                    sessionStorage.setItem("ardp_chat_prompt_dismissed", "true");
                  } catch (err) {}
                }}
                className="p-1 text-[var(--muted)] hover:text-[#E31B23] rounded transition-colors -mr-1 -mt-1"
                title="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speech Bubble Arrow pointing down to the button */}
            <div className="absolute -bottom-1.5 right-8 sm:right-10 w-3 h-3 bg-[var(--surface)] border-b border-r border-[var(--border)] rotate-45" />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setShowPromptBubble(false);
            setIsOpen(!isOpen);
          }}
          aria-label={isOpen ? "Close AI Chat" : "Chat with ARDP AI Assistant"}
          title={isOpen ? "Tutup Chat" : "Tanya ARDP AI Assistant"}
          className="relative h-11 sm:h-12 px-3.5 sm:px-4 rounded-full bg-[var(--surface)] border border-[var(--border)] hover:border-[#E31B23] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#E31B23] group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="hidden sm:inline font-mono text-xs font-bold text-[var(--foreground)] tracking-wider">
            ARDP AI
          </span>
        </button>
      </div>

      {/* 2. Expandable Cyberpunk Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[82vh] bg-[var(--surface)] border border-[var(--border)] rounded-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Top Decorative Cyberpunk Strip */}
          <div className="h-1 bg-gradient-to-r from-[#E31B23] via-red-500 to-[#E31B23]" />

          {/* Header Bar */}
          <div className="p-3.5 sm:p-4 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E31B23]/15 border border-[#E31B23]/40 flex items-center justify-center text-[#E31B23]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-xs font-bold text-[var(--foreground)] uppercase tracking-wider">
                    ARDP AI ASSISTANT
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="font-mono text-[10px] text-[var(--muted)]">
                  Personal Digital Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-[var(--muted)] hover:text-[#E31B23] hover:bg-[var(--surface)] rounded transition-colors"
                title="Bersihkan Percakapan (Clear Chat)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--muted)] hover:text-[#E31B23] hover:bg-[var(--surface)] rounded transition-colors"
                title="Tutup Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 font-mono text-xs select-text">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[#E31B23]/10 border border-[#E31B23]/30 flex items-center justify-center shrink-0 text-[#E31B23] mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg p-3 leading-relaxed text-xs ${
                    m.role === "user"
                      ? "bg-[#E31B23] text-white rounded-br-none"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none"
                  }`}
                >
                  <div className="text-[11px] leading-relaxed break-words">
                    {formatMarkdown(m.content)}
                  </div>
                  <div
                    className={`mt-1.5 text-[9px] text-right ${
                      m.role === "user" ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--muted)] mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-[#E31B23]/10 border border-[#E31B23]/30 flex items-center justify-center shrink-0 text-[#E31B23]">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg rounded-bl-none flex items-center gap-2 text-[var(--muted)] text-[11px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E31B23]" />
                  <span>ARDP AI sedang mengetik...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips (If only initial greeting is shown) */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 pt-1 border-t border-[var(--border)]/50 bg-[var(--background)]/50 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-[var(--muted)] font-mono block w-full mb-0.5">
                💡 {language === "id" ? "Pertanyaan Cepat:" : "Quick Questions:"}
              </span>
              {quickPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--border)] hover:border-[#E31B23] text-[var(--foreground)] hover:text-[#E31B23] transition-colors text-left flex items-center gap-1 disabled:opacity-50"
                >
                  <span>{prompt}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--background)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "id"
                    ? "Tanyakan apapun tentang Ary..."
                    : "Ask anything about Ary..."
                }
                disabled={loading}
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] focus:border-[#E31B23] px-3.5 py-2 text-xs font-mono text-[var(--foreground)] outline-none rounded transition-colors disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-9 w-9 flex items-center justify-center bg-[#E31B23] hover:bg-[#c9141b] text-white rounded transition-colors disabled:opacity-40 shrink-0"
                title="Kirim Pesan"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
