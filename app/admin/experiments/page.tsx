import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getExperiments } from "@/lib/storage";
import { ExperimentsManager } from "@/components/admin/ExperimentsManager";

export const dynamic = "force-dynamic";

export default async function AdminExperimentsPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const experiments = await getExperiments();

  return (
    <div className="space-y-6 font-mono">
      <div>
        <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
          LAB REPOSITORY
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          EXPERIMENTS MANAGEMENT
        </h1>
      </div>

      <ExperimentsManager initialExperiments={experiments} />
    </div>
  );
}
