import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Akses ditolak. Log keamanan hanya dapat diakses oleh Administrator." }, { status: 403 });
  }

  try {
    const logs = await prisma.securityLog.findMany({
      include: {
        user: { select: { username: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching security logs:", error);
    return NextResponse.json({ error: "Gagal mengambil audit log." }, { status: 500 });
  }
}
