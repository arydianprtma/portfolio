import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  getProposalById,
  saveProposal,
  updateProposalStatus,
  deleteProposal,
} from "@/lib/storage";
import { ProposalStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) {
    return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  }

  return NextResponse.json({ proposal });
}

export async function PUT(request: Request, { params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await request.json();
    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    }
    if (!data.clientName?.trim()) {
      return NextResponse.json({ error: "Client Name is required" }, { status: 400 });
    }

    const saved = await saveProposal({ ...data, id });
    return NextResponse.json({ success: true, proposal: saved });
  } catch (error: any) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal", details: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const { status } = await request.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await updateProposalStatus(id, status as ProposalStatus);
    if (!updated) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, proposal: updated });
  } catch (error: any) {
    console.error("Error updating proposal status:", error);
    return NextResponse.json(
      { error: "Failed to update status", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const success = await deleteProposal(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting proposal:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal", details: error?.message },
      { status: 500 }
    );
  }
}
