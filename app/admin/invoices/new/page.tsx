import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { InvoiceForm } from "@/components/admin/InvoiceForm";

export const dynamic = "force-dynamic";

export default async function AdminNewInvoicePage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return <InvoiceForm />;
}
