import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const where: Record<string, unknown> = {};
    if (query.trim()) {
      where.OR = [
        { invoiceNumber: { contains: query.trim() } },
        { serviceOrder: { plateNumber: { contains: query.trim() } } },
        { serviceOrder: { customerName: { contains: query.trim() } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        cashier: { select: { id: true, name: true, username: true } },
        serviceOrder: {
          include: {
            items: { include: { sparepart: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Gagal mengambil data transaksi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "KASIR")) {
    return NextResponse.json({ error: "Akses ditolak. Transaksi hanya dapat diproses oleh Kasir atau Admin." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      serviceOrderId,
      items, // array of { sparepartId, quantity }
      serviceFee = 0,
      discount = 0,
      tax = 0,
      paidAmount,
      paymentMethod = "CASH",
    } = body;

    // 1. Calculate items total and check stock availability
    let totalParts = 0;
    const partsToUpdate: { id: string; newStock: number; name: string }[] = [];

    if (Array.isArray(items)) {
      for (const item of items) {
        const part = await prisma.sparepart.findUnique({ where: { id: item.sparepartId } });
        if (!part) {
          return NextResponse.json({ error: `Suku cadang dengan ID ${item.sparepartId} tidak ditemukan.` }, { status: 400 });
        }
        if (part.stock < item.quantity) {
          return NextResponse.json(
            { error: `Stok ${part.name} tidak mencukupi (Tersisa: ${part.stock}, Diminta: ${item.quantity}).` },
            { status: 400 }
          );
        }
        totalParts += part.sellPrice * item.quantity;
        partsToUpdate.push({
          id: part.id,
          newStock: part.stock - item.quantity,
          name: part.name,
        });
      }
    }

    const totalService = Number(serviceFee) || 0;
    const subtotal = totalParts + totalService;
    const grandTotal = Math.max(0, subtotal - Number(discount) + Number(tax));

    if (Number(paidAmount) < grandTotal) {
      return NextResponse.json(
        { error: `Jumlah pembayaran kurang. Total: Rp ${grandTotal.toLocaleString()}, Diterima: Rp ${Number(paidAmount).toLocaleString()}` },
        { status: 400 }
      );
    }

    const changeAmount = Number(paidAmount) - grandTotal;

    // 2. Generate unique Invoice Number (INV-YYYYMMDD-XXXX)
    const count = await prisma.transaction.count();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const invoiceNumber = `INV-${dateStr}-${String(count + 1).padStart(4, "0")}`;

    // 3. Execute atomic transaction (Safe stock deduction & creation)
    const result = await prisma.$transaction(async (tx) => {
      // Deduct spareparts stock
      for (const part of partsToUpdate) {
        await tx.sparepart.update({
          where: { id: part.id },
          data: { stock: part.newStock },
        });
      }

      // If tied to a service order, create items and set status to LUNAS
      if (serviceOrderId) {
        // Upsert order items
        if (Array.isArray(items)) {
          await tx.serviceOrderItem.deleteMany({ where: { serviceOrderId } });
          for (const item of items) {
            const part = await tx.sparepart.findUnique({ where: { id: item.sparepartId } });
            if (part) {
              await tx.serviceOrderItem.create({
                data: {
                  serviceOrderId,
                  sparepartId: part.id,
                  quantity: item.quantity,
                  priceAtTime: part.sellPrice,
                },
              });
            }
          }
        }

        await tx.serviceOrder.update({
          where: { id: serviceOrderId },
          data: {
            status: "LUNAS",
            serviceFee: totalService,
          },
        });
      }

      // Create Transaction record
      const newTransaction = await tx.transaction.create({
        data: {
          invoiceNumber,
          serviceOrderId: serviceOrderId || null,
          totalParts,
          totalService,
          subtotal,
          discount: Number(discount),
          tax: Number(tax),
          grandTotal,
          paidAmount: Number(paidAmount),
          changeAmount,
          paymentMethod,
          cashierId: session.userId,
        },
        include: {
          cashier: { select: { id: true, name: true } },
          serviceOrder: {
            include: {
              items: { include: { sparepart: true } },
            },
          },
        },
      });

      return newTransaction;
    });

    await logSecurityEvent({
      event: "TRANSACTION_COMPLETED",
      details: `Transaksi ${invoiceNumber} senilai Rp ${grandTotal.toLocaleString()} berhasil diproses oleh ${session.username}`,
      userId: session.userId,
    });

    return NextResponse.json({ success: true, transaction: result }, { status: 201 });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json({ error: "Gagal memproses transaksi kasir." }, { status: 500 });
  }
}
