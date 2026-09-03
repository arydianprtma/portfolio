import React from "react";
import { notFound } from "next/navigation";
import { getProposalById, getProfile } from "@/lib/storage";
import { PublicProposalClient } from "@/components/proposal/PublicProposalClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProposalPageProps): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposalById(id);

  if (!proposal) {
    return {
      title: "Proposal Not Found | ARDP",
    };
  }

  return {
    title: `Project Proposal ${proposal.proposalNumber} - ${proposal.title} | ARDP`,
    description: `Official Project Proposal ${proposal.proposalNumber} for ${proposal.clientName}: ${proposal.title}`,
  };
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const [proposal, profile] = await Promise.all([
    getProposalById(id),
    getProfile(),
  ]);

  if (!proposal) {
    notFound();
  }

  return <PublicProposalClient proposal={proposal} profile={profile} />;
}
