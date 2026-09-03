"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  "Bisa minta file CV / Resume Ary?",
  "Apa tech stack utama yang dikuasai Ary?",
  "Ceritakan proyek-proyek unggulan Ary",
  "Bagaimana cara menghubungi atau hire Ary?",
];

const QUICK_PROMPTS_EN = [
  "Can I get / download Ary's CV or Resume?",
  "What is Ary's core tech stack?",
  "Tell me about Ary's featured projects",
  "How can I contact or hire Ary for a project?",
];

export const ChatBot: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Web Audio Synthesizer Engine
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Unlock audio engine on first user interaction anywhere on the website (except admin/invoice)
  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/invoice")) {
      return;
    }

    const unlockAudio = () => {
      const ctx = getAudioContext();
      if (ctx && ctx.state === "suspended") {
        ctx.resume();
      }
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [pathname]);

  // 1. Proactive Floating Chat Invitation Chime
  const playNotificationSound = () => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/invoice")) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note 1 (D5 ~587Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2 (A5 ~880Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.09);
      gain2.gain.setValueAtTime(0.12, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.45);
    } catch (e) {
      // Graceful fallback
    }
  };

  // 2. Incoming AI Message Reply Sound (Crisp Bubble Pop)
  const playMessageReceivedSound = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Soft message pop (600Hz -> 950Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      // Graceful fallback
    }
  };

  // Proactive Chat Prompt Timer (Triggers after 20 seconds of viewing, never in admin/invoice)
  useEffect(() => {
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/invoice")) {
      return;
    }

    let timer: NodeJS.Timeout;
    try {
      const isDismissed = sessionStorage.getItem("ardp_chat_prompt_dismissed");
      if (!isDismissed) {
        timer = setTimeout(() => {
          setShowPromptBubble((prev) => {
            // Only show and play chime if chat hasn't been opened yet
            if (!isOpen) {
              playNotificationSound();
              return true;
            }
            return prev;
          });
        }, 20000); // 20 seconds
      }
    } catch (err) {}

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, pathname]);

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
      // Only auto-focus on desktop screens with a mouse/keyboard (prevent mobile keyboard popup)
      if (typeof window !== "undefined" && window.innerWidth >= 640 && !("ontouchstart" in window)) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    // Immediately dismiss/blur virtual keyboard on mobile so user can read full screen
    if (typeof window !== "undefined" && (window.innerWidth < 640 || "ontouchstart" in window)) {
      inputRef.current?.blur();
    }

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
      playMessageReceivedSound();
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `**Terjadi kendala:** ${err.message || "Gagal menghubungi server."}`,
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

  // Simple Markdown text formatter (links, bold, code, emails, lists)
  const renderInlineFormatted = (text: string) => {
    // Matches markdown links [label](url), bold **text**, code `code`, raw URLs, and emails
    const tokenRegex = /(\[.*?\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*|`.*?`|https?:\/\/[^\s.,!?)]+(?:\.[^\s.,!?)]+)*|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      // 1. Markdown link [text](url)
      const mdLinkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
      if (mdLinkMatch) {
        return (
          <a
            key={i}
            href={mdLinkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E31B23] font-semibold underline underline-offset-2 hover:text-red-400 transition-colors inline-flex items-center gap-0.5"
          >
            <span>{mdLinkMatch[1]}</span>
            <ArrowUpRight className="w-3 h-3 inline-block" />
          </a>
        );
      }

      // 2. Bold **text**
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return (
          <strong key={i} className="font-bold text-[var(--foreground)]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // 3. Inline `code`
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-[var(--border)]/50 text-[#E31B23] font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // 4. Raw URL
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E31B23] font-semibold underline underline-offset-2 hover:text-red-400 transition-colors inline-flex items-center gap-0.5"
          >
            <span>{part}</span>
            <ArrowUpRight className="w-3 h-3 inline-block" />
          </a>
        );
      }

      // 5. Email address
      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
        return (
          <a
            key={i}
            href={`mailto:${part}`}
            className="text-[#E31B23] font-semibold underline underline-offset-2 hover:text-red-400 transition-colors"
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  const formatMarkdown = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const formattedLine = renderInlineFormatted(line);

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

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/invoice")) {
    return null;
  }

  return (
    <div className="no-print print:hidden select-none">
      {/* 1. Floating Launcher Button (Bottom Right next to ThemeToggle) */}
      <div
        className={`fixed bottom-6 right-20 sm:bottom-8 sm:right-24 z-40 transition-opacity duration-200 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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
                    ? "Hai! Mau tanya-tanya langsung seputar proyek atau skill Ary? Klik di sini!"
                    : "Hi! Want to ask anything about Ary's projects or skills? Click here!"}
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
                    localStorage.setItem("ardp_chatbot_dismissed", Date.now().toString());
                  } catch (e) {}
                }}
                className="text-[var(--muted)] hover:text-[#E31B23] p-1 transition-colors shrink-0"
                aria-label="Tutup saran"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setShowPromptBubble(false);
            setIsOpen(!isOpen);
          }}
          className={`group flex items-center gap-2.5 px-4 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl ${
            isOpen
              ? "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] hover:border-[#E31B23]"
              : "bg-[#E31B23] text-white hover:bg-[#c9141b] hover:scale-105"
          }`}
          aria-label="Toggle ARDP AI Chatbot"
          data-cursor="pointer"
        >
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>{language === "id" ? "TUTUP CHAT" : "CLOSE CHAT"}</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span>ARDP AI</span>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 sm:inset-auto sm:bottom-24 sm:right-6 w-auto sm:w-[400px] h-[580px] max-h-[85vh] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden font-sans backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[var(--background)] px-4 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E31B23]/10 border border-[#E31B23]/30 flex items-center justify-center text-[#E31B23]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    ARDP AI Assistant
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-500 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] font-mono">
                  {language === "id" ? "Didukung Google Gemini 3.5 Flash" : "Powered by Google Gemini 3.5 Flash"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] rounded transition-colors"
                title={language === "id" ? "Mulai Percakapan Baru" : "Reset Conversation"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--muted)] hover:text-[#E31B23] hover:bg-[var(--surface)] rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                    m.role === "user"
                      ? "bg-[#E31B23] text-white"
                      : "bg-[var(--background)] border border-[var(--border)] text-[#E31B23]"
                  }`}
                >
                  {m.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-lg p-3 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#E31B23] text-white rounded-br-none"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none font-sans text-xs"
                  }`}
                >
                  {formatMarkdown(m.content)}
                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      m.role === "user" ? "text-white/70" : "text-[var(--muted)]"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-full bg-[#E31B23]/10 border border-[#E31B23]/40 flex items-center justify-center text-[#E31B23] shrink-0 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[var(--background)] border border-[var(--border)] px-3.5 py-2 rounded-xl rounded-bl-none flex items-center gap-2.5 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]/80 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]/50 animate-bounce" />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--muted)]">
                    {language === "id" ? "ARDP AI sedang mengetik..." : "ARDP AI is typing..."}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 pt-1 border-t border-[var(--border)]/50 bg-[var(--background)]/50 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-[var(--muted)] font-mono flex items-center gap-1.5 w-full mb-0.5">
                <Sparkles className="w-3 h-3 text-[#E31B23]" />
                <span>{language === "id" ? "Pertanyaan Cepat:" : "Quick Questions:"}</span>
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
