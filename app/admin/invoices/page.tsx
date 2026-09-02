import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getInvoices } from "@/lib/storage";
import { InvoiceList } from "@/components/admin/InvoiceList";
import { Receipt } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const invoices = await getInvoices();

  return (
    <div className="space-y-6 font-mono">
      <div>
        <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
          FINANCIAL & BILLING DISPATCH
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-3">
          <Receipt className="w-8 h-8 text-[#E31B23]" />
          <span>INVOICE MANAGEMENT</span>
        </h1>
      </div>

      <InvoiceList initialInvoices={invoices} />
    </div>
  );
}
