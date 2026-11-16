import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.serviceOrder.findMany({
      where,
      include: {
        assignedMechanic: {
          select: { id: true, name: true, username: true },
        },
        items: {
          include: { sparepart: true },
        },
        transaction: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching service orders:", error);
    return NextResponse.json({ error: "Gagal mengambil data servis." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { plateNumber, vehicleModel, customerName, customerPhone, complaint, serviceFee, assignedMechanicId } = body;

    if (!plateNumber || !vehicleModel || !customerName || !complaint) {
      return NextResponse.json({ error: "Informasi kendaraan dan keluhan wajib diisi." }, { status: 400 });
    }

    // Generate unique order number (e.g., WO-YYYYMMDD-XXXX)
    const count = await prisma.serviceOrder.count();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderNumber = `WO-${dateStr}-${String(count + 1).padStart(3, "0")}`;

    // Sanitize user inputs against Stored XSS
    const safePlate = sanitizeString(plateNumber).toUpperCase().trim();
    const safeModel = sanitizeString(vehicleModel).trim();
    const safeCustomer = sanitizeString(customerName).trim();
    const safePhone = sanitizeString(customerPhone || "").trim();
    const safeComplaint = sanitizeString(complaint).trim();

    const order = await prisma.serviceOrder.create({
      data: {
        orderNumber,
        plateNumber: safePlate,
        vehicleModel: safeModel,
        customerName: safeCustomer,
        customerPhone: safePhone,
        complaint: safeComplaint,
        serviceFee: Number(serviceFee) || 0,
        status: "MENUNGGU",
        assignedMechanicId: assignedMechanicId || null,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Error creating service order:", error);
    return NextResponse.json({ error: "Gagal membuat tiket servis." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, mechanicNotes, serviceFee, assignedMechanicId, parts } = body;

    if (!id) {
      return NextResponse.json({ error: "ID tiket servis diperlukan." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (mechanicNotes !== undefined) updateData.mechanicNotes = sanitizeString(mechanicNotes).trim();
    if (serviceFee !== undefined) updateData.serviceFee = Number(serviceFee);
    if (assignedMechanicId !== undefined) updateData.assignedMechanicId = assignedMechanicId;

    // Optional: add or update used parts
    if (Array.isArray(parts)) {
      // Clear existing items and insert updated parts
      await prisma.serviceOrderItem.deleteMany({ where: { serviceOrderId: id } });
      for (const p of parts) {
        if (p.sparepartId && p.quantity > 0) {
          const partInfo = await prisma.sparepart.findUnique({ where: { id: p.sparepartId } });
          if (partInfo) {
            await prisma.serviceOrderItem.create({
              data: {
                serviceOrderId: id,
                sparepartId: p.sparepartId,
                quantity: Number(p.quantity),
                priceAtTime: partInfo.sellPrice,
              },
            });
          }
        }
      }
    }

    const updated = await prisma.serviceOrder.update({
      where: { id },
      data: updateData,
      include: {
        assignedMechanic: true,
        items: { include: { sparepart: true } },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Error updating service order:", error);
    return NextResponse.json({ error: "Gagal memperbarui tiket servis." }, { status: 500 });
  }
}
