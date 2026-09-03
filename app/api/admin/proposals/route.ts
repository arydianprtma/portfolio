import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getProposals, saveProposal } from "@/lib/storage";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const proposals = await getProposals();
  return NextResponse.json({ proposals });
}

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    }
    if (!data.clientName?.trim()) {
      return NextResponse.json({ error: "Client Name is required" }, { status: 400 });
    }

    const saved = await saveProposal(data);
    return NextResponse.json({ success: true, proposal: saved }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal", details: error?.message },
      { status: 500 }
    );
  }
}
