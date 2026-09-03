import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const year = new Date().getFullYear();
    const count = await prisma.proposal.count();

    // Check latest proposal number to increment correctly
    const latest = await prisma.proposal.findFirst({
      orderBy: { createdAt: "desc" },
    });

    let nextIndex = count + 1;
    if (latest && latest.proposalNumber) {
      const match = latest.proposalNumber.match(/PROP-\d{4}-(\d+)/);
      if (match) {
        nextIndex = Math.max(nextIndex, parseInt(match[1], 10) + 1);
      }
    }

    const proposalNumber = `PROP-${year}-${String(nextIndex).padStart(3, "0")}`;
    return NextResponse.json({ proposalNumber });
  } catch (error: any) {
    console.error("Error generating next proposal number:", error);
    const fallback = `PROP-${new Date().getFullYear()}-001`;
    return NextResponse.json({ proposalNumber: fallback });
  }
}
