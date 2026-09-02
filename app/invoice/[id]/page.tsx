import React from "react";
import { notFound } from "next/navigation";
import { getInvoiceById } from "@/lib/storage";
import { InvoiceViewClient } from "@/components/invoice/InvoiceViewClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    return {
      title: "Invoice Not Found | ARDP",
    };
  }

  return {
    title: `Invoice ${invoice.invoiceNumber} - ${invoice.clientName} | ARDP`,
    description: `Official Digital Invoice ${invoice.invoiceNumber} for ${invoice.clientName}`,
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return <InvoiceViewClient invoice={invoice} />;
}
