import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count();
    
    // Find highest invoice number with current year format if any
    const latestInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV-${year}-`,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let nextNumber = `INV-${year}-${String(count + 1).padStart(3, "0")}`;

    if (latestInvoice) {
      const match = latestInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
      if (match && match[1]) {
        const nextSerial = parseInt(match[1], 10) + 1;
        nextNumber = `INV-${year}-${String(nextSerial).padStart(3, "0")}`;
      }
    }

    return NextResponse.json({ nextNumber });
  } catch (error: any) {
    console.error("Error generating next invoice number:", error);
    const year = new Date().getFullYear();
    const fallback = `INV-${year}-${Date.now().toString().slice(-4)}`;
    return NextResponse.json({ nextNumber: fallback });
  }
}
