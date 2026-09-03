import React from "react";
import { Metadata } from "next";
import { getCvData, getProfile } from "@/lib/storage";
import { PublicCvClient } from "@/components/cv/PublicCvClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: `Curriculum Vitae & Resume — ${profile.name || "Ary Dian Pratama"}`,
    description: `Official professional resume and CV of ${profile.name || "Ary Dian Pratama"}, ${profile.role || "Full Stack Developer"}.`,
  };
}

export default async function PublicCvPage() {
  const cv = await getCvData();
  return <PublicCvClient initialCv={cv} />;
}
