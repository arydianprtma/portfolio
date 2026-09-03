import React from "react";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProposalById } from "@/lib/storage";
import { ProposalForm } from "@/components/admin/ProposalForm";

export const dynamic = "force-dynamic";

interface EditProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProposalPage({
  params,
}: EditProposalPageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const proposal = await getProposalById(id);

  if (!proposal) {
    notFound();
  }

  return <ProposalForm initialData={proposal} />;
}
