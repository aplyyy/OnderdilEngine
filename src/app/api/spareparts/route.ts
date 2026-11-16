import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";

  try {
    // Safe parameterized Prisma query (Mitigates SQL Injection)
    const whereClause: Record<string, unknown> = {};

    if (query.trim()) {
      whereClause.OR = [
        { name: { contains: query.trim() } },
        { sku: { contains: query.trim() } },
      ];
    }

    if (category.trim() && category !== "SEMUA") {
      whereClause.category = category.trim();
    }

    const spareparts = await prisma.sparepart.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ spareparts });
  } catch (error) {
    console.error("Error fetching spareparts:", error);
    return NextResponse.json({ error: "Gagal mengambil data sparepart." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "KASIR")) {
    return NextResponse.json({ error: "Akses ditolak. Perlu peran Admin atau Kasir." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { sku, name, category, buyPrice, sellPrice, stock, minStock, unit } = body;

    if (!sku || !name || buyPrice === undefined || sellPrice === undefined) {
      return NextResponse.json({ error: "Data suku cadang tidak lengkap." }, { status: 400 });
    }

    // Input sanitization (Anti-XSS)
    const safeSku = sanitizeString(sku).toUpperCase().trim();
    const safeName = sanitizeString(name).trim();
    const safeCategory = sanitizeString(category || "Umum").trim();
    const safeUnit = sanitizeString(unit || "Pcs").trim();

    const existing = await prisma.sparepart.findUnique({ where: { sku: safeSku } });
    if (existing) {
      return NextResponse.json({ error: "Kode SKU sudah terdaftar." }, { status: 400 });
    }

    const newPart = await prisma.sparepart.create({
      data: {
        sku: safeSku,
        name: safeName,
        category: safeCategory,
        buyPrice: Number(buyPrice) || 0,
        sellPrice: Number(sellPrice) || 0,
        stock: Number(stock) || 0,
        minStock: Number(minStock) || 5,
        unit: safeUnit,
      },
    });

    return NextResponse.json({ success: true, sparepart: newPart }, { status: 201 });
  } catch (error) {
    console.error("Error creating sparepart:", error);
    return NextResponse.json({ error: "Gagal menambahkan suku cadang." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSession(req);
  if (!session || (session.role !== "ADMIN" && session.role !== "KASIR")) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, category, buyPrice, sellPrice, stock, minStock, unit } = body;

    if (!id) {
      return NextResponse.json({ error: "ID sparepart wajib disertakan." }, { status: 400 });
    }

    const updated = await prisma.sparepart.update({
      where: { id },
      data: {
        name: sanitizeString(name).trim(),
        category: sanitizeString(category).trim(),
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        stock: Number(stock),
        minStock: Number(minStock),
        unit: sanitizeString(unit).trim(),
      },
    });

    return NextResponse.json({ success: true, sparepart: updated });
  } catch (error) {
    console.error("Error updating sparepart:", error);
    return NextResponse.json({ error: "Gagal memperbarui suku cadang." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  // IDOR & RBAC Protection: Only Admin can delete spareparts
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Hanya Administrator yang berwenang menghapus suku cadang." }, { status: 403 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID suku cadang diperlukan." }, { status: 400 });
    }

    await prisma.sparepart.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Suku cadang berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting sparepart:", error);
    return NextResponse.json({ error: "Gagal menghapus suku cadang. Mungkin terkait data transaksi." }, { status: 500 });
  }
}
