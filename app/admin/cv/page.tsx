import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCvData } from "@/lib/storage";
import { CvBuilderClient } from "@/components/admin/CvBuilderClient";

export const dynamic = "force-dynamic";

export default async function AdminCvBuilderPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const cv = await getCvData();

  return <CvBuilderClient initialCv={cv} />;
}
