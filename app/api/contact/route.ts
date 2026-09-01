import { NextResponse } from "next/server";
import { saveContactMessage } from "@/lib/storage";
import { sendInquiryNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, budget, message } = body;

    // Validate inputs
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // 1. Save message directly into Supabase PostgreSQL
    const savedMessage = await saveContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || undefined,
      budget: budget?.trim() || undefined,
      message: message.trim(),
    });

    // 2. Dispatch email notification via Nodemailer
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
      { error: "Failed to send message", details: error?.message },
      { status: 500 }
    );
  }
}
