import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getInvoices, saveInvoice } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await getInvoices();
  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.clientName?.trim()) {
      return NextResponse.json({ error: "Client Name is required" }, { status: 400 });
    }

    const saved = await saveInvoice(data);
    return NextResponse.json({ success: true, invoice: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice", details: error?.message },
      { status: 500 }
    );
  }
}
