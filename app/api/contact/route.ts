import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/storage";
import { sendInquiryNotification } from "@/lib/mail";

// In-memory sliding rate limiter per IP (max 5 submissions per 10 minutes)
const ipRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Helper to sanitize text by stripping HTML tags and trimming
function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip control characters
    .trim();
}

// Strict email regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const cfConnectingIp = request.headers.get("cf-connecting-ip");
    const clientIp = cfConnectingIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1");

    const now = Date.now();
    const timestamps = (ipRateLimitMap.get(clientIp) || []).filter(
      (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan. Silakan tunggu beberapa menit sebelum mengirim pesan lagi.",
        },
        { status: 429 }
      );
    }

    timestamps.push(now);
    ipRateLimitMap.set(clientIp, timestamps);

    // 2. Parse payload
    const body = await request.json();
    const { name, email, subject, budget, message, _hp_website } = body;

    // 3. Honeypot check (Bots automatically fill this hidden field)
    if (_hp_website && String(_hp_website).trim().length > 0) {
      // Silently accept without saving or sending email to deceive spam bots
      return NextResponse.json(
        {
          success: true,
          message: "Pesan Anda telah berhasil terkirim.",
        },
        { status: 201 }
      );
    }

    // 4. Input Sanitization & Validation
    const cleanName = sanitizeText(name);
    const cleanEmail = sanitizeText(email).toLowerCase();
    const cleanSubject = sanitizeText(subject);
    const cleanBudget = sanitizeText(budget);
    const cleanMessage = sanitizeText(message);

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: "Nama pengirim minimal 2 karakter." },
        { status: 400 }
      );
    }

    if (cleanName.length > 100) {
      return NextResponse.json(
        { error: "Nama pengirim terlalu panjang (maks 100 karakter)." },
        { status: 400 }
      );
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 100) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json(
        { error: "Isi pesan terlalu pendek (minimal 5 karakter)." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 3000) {
      return NextResponse.json(
        { error: "Isi pesan terlalu panjang (maks 3000 karakter)." },
        { status: 400 }
      );
    }

    // 5. Save message directly into Supabase PostgreSQL
    const savedMessage = await saveContactMessage({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject || undefined,
      budget: cleanBudget || undefined,
      message: cleanMessage,
    });

    // 6. Dispatch email notification via Nodemailer to verified admin email
    await sendInquiryNotification({
      name: savedMessage.name,
      email: savedMessage.email,
      subject: savedMessage.subject,
      budget: savedMessage.budget,
      message: savedMessage.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been delivered successfully.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error handling contact form submission:", error);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Silakan coba lagi nanti.", details: error?.message },
      { status: 500 }
    );
  }
}
