import React from "react";
import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getInvoiceById } from "@/lib/storage";
import { InvoiceForm } from "@/components/admin/InvoiceForm";

export const dynamic = "force-dynamic";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditInvoicePage({ params }: EditInvoicePageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceForm initialData={invoice} />;
}
