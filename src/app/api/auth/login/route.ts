import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const userAgent = req.headers.get("user-agent") || "unknown";

  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Rate Limiting Protection (Anti Brute-Force)
    const rateLimit = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!rateLimit.success) {
      await logSecurityEvent({
        event: "RATE_LIMIT_EXCEEDED",
        details: `IP ${ip} melebihi batas percobaan login (${rateLimit.resetInSeconds}s cooldown). Target user: ${username}`,
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        {
          error: `Terlalu banyak percobaan login gagal. Mohon tunggu ${rateLimit.resetInSeconds} detik sebelum mencoba kembali.`,
        },
        { status: 429 }
      );
    }

    // 2. Query with Parameterized Binding (Anti-SQLi)
    // Prisma internally uses prepared statements: SELECT * FROM users WHERE username = $1
    const user = await prisma.user.findUnique({
      where: { username: String(username).trim() },
    });

    if (!user || !user.active) {
      await logSecurityEvent({
        event: "LOGIN_FAILED",
        details: `Percobaan login gagal untuk username tidak terdaftar: ${username}`,
        ipAddress: ip,
        userAgent,
      });

      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // 3. Password Verification (Bcrypt Hashing)
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await logSecurityEvent({
        event: "LOGIN_FAILED",
        details: `Password salah untuk user: ${username}`,
        ipAddress: ip,
        userAgent,
        userId: user.id,
      });

      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    // 4. Generate Session Token (Signed JWT)
    const token = await signToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    });

    await logSecurityEvent({
      event: "LOGIN_SUCCESS",
      details: `User ${user.username} (${user.role}) berhasil masuk.`,
      ipAddress: ip,
      userAgent,
      userId: user.id,
    });

    // 5. Set Secure HttpOnly Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
