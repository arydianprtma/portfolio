import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateProposalWithAi } from "@/lib/gemini";

export async function POST(request: Request) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectTitle, clientName, clientCompany, briefDescription, estimatedBudget, language } = body;

    if (!projectTitle?.trim()) {
      return NextResponse.json({ error: "Project Title is required" }, { status: 400 });
    }
    if (!clientName?.trim()) {
      return NextResponse.json({ error: "Client Name is required" }, { status: 400 });
    }
    if (!briefDescription?.trim()) {
      return NextResponse.json({ error: "Brief Description / Requirements are required" }, { status: 400 });
    }

    const draft = await generateProposalWithAi({
      projectTitle,
      clientName,
      clientCompany,
      briefDescription,
      estimatedBudget: estimatedBudget ? Number(estimatedBudget) : undefined,
      language: language || "id",
    });

    return NextResponse.json({ success: true, draft });
  } catch (error: any) {
    console.error("AI Proposal Generation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate proposal draft with AI" },
      { status: 500 }
    );
  }
}
