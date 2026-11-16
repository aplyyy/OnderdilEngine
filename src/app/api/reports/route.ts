import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "KASIR")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const format = req.nextUrl.searchParams.get("format");

  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        cashier: { select: { name: true } },
        serviceOrder: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const lowStockParts = await prisma.sparepart.findMany({
      where: {
        stock: { lte: prisma.sparepart.fields.minStock },
      },
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.grandTotal, 0);
    const totalPartsIncome = transactions.reduce((acc, curr) => acc + curr.totalParts, 0);
    const totalServiceIncome = transactions.reduce((acc, curr) => acc + curr.totalService, 0);
    const totalOrders = await prisma.serviceOrder.count();

    // Export to CSV if requested
    if (format === "csv") {
      const csvHeader = "Nomor Faktur,Tanggal,No Polisi,Pelanggan,Total Suku Cadang,Total Jasa,Total Bayar,Metode,Kasir\n";
      const csvRows = transactions.map((t) => {
        const date = new Date(t.createdAt).toLocaleDateString("id-ID");
        const plate = t.serviceOrder?.plateNumber || "-";
        const customer = `"${t.serviceOrder?.customerName || "-"}"`;
        return `${t.invoiceNumber},${date},${plate},${customer},${t.totalParts},${t.totalService},${t.grandTotal},${t.paymentMethod},"${t.cashier.name}"`;
      });

      const csvContent = csvHeader + csvRows.join("\n");
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="rekap-transaksi-bengkel-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalPartsIncome,
        totalServiceIncome,
        transactionCount: transactions.length,
        totalOrders,
        lowStockCount: lowStockParts.length,
      },
      lowStockParts,
      recentTransactions: transactions.slice(0, 10),
    });
  } catch (error) {
    console.error("Error generating reports:", error);
    return NextResponse.json({ error: "Gagal mengambil data laporan." }, { status: 500 });
  }
}
