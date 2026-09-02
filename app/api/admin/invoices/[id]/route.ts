import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getInvoiceById, saveInvoice, deleteInvoice, updateInvoiceStatus } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({ invoice });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Quick status update only
    if (body.status && Object.keys(body).length === 1) {
      const updated = await updateInvoiceStatus(id, body.status);
      if (!updated) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, invoice: updated });
    }

    const saved = await saveInvoice({ ...body, id });
    return NextResponse.json({ success: true, invoice: saved });
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const ok = await deleteInvoice(id);
    if (!ok) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice", details: error?.message },
      { status: 500 }
    );
  }
}
