import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ProposalForm } from "@/components/admin/ProposalForm";

export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return <ProposalForm />;
}
