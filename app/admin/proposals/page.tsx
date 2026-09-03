import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProposals } from "@/lib/storage";
import { ProposalList } from "@/components/admin/ProposalList";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProposalsPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const proposals = await getProposals();

  return (
    <div className="space-y-6 font-mono">
      <div>
        <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
          PROJECT SCOPING & CLIENT PITCHING
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#E31B23]" />
          <span>PROJECT PROPOSALS</span>
        </h1>
      </div>

      <ProposalList initialProposals={proposals} />
    </div>
  );
}
