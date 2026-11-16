import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "onderdilengine-secret-key-super-secure-cybersec-2026-s5-key"
);

interface TokenPayload {
  userId: string;
  username: string;
  name: string;
  role: string;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  // Security Headers to attach to all outgoing responses
  const setSecurityHeaders = (res: NextResponse) => {
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );
    if (process.env.NODE_ENV === "production") {
      res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }
    return res;
  };

  // Allow public static assets and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/public") ||
    pathname === "/login" ||
    pathname === "/api/auth/login"
  ) {
    const response = NextResponse.next();
    return setSecurityHeaders(response);
  }

  // Verify auth for protected routes
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/kasir") ||
    pathname.startsWith("/mekanik") ||
    pathname.startsWith("/laporan") ||
    pathname.startsWith("/security-test") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/spareparts") ||
    pathname.startsWith("/api/service-orders") ||
    pathname.startsWith("/api/transactions") ||
    pathname.startsWith("/api/reports") ||
    pathname.startsWith("/api/security-logs");

  if (isProtectedRoute) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        const res = NextResponse.json(
          { error: "Unauthorized: Sesi tidak ditemukan. Silakan login terlebih dahulu." },
          { status: 401 }
        );
        return setSecurityHeaders(res);
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return setSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const user = payload as unknown as TokenPayload;

      // Role-Based Access Control (RBAC) checks
      if (pathname.startsWith("/admin") || pathname.startsWith("/api/security-logs")) {
        if (user.role !== "ADMIN") {
          if (pathname.startsWith("/api/")) {
            const res = NextResponse.json(
              { error: "Forbidden: Akses ditolak. Rute ini memerlukan hak akses Administrator." },
              { status: 403 }
            );
            return setSecurityHeaders(res);
          }
          // Redirect unauthorized roles to their allowed landing page
          const redirectUrl = new URL(
            user.role === "KASIR" ? "/kasir" : "/mekanik",
            request.url
          );
          return setSecurityHeaders(NextResponse.redirect(redirectUrl));
        }
      }

      // Kasir route check
      if (pathname.startsWith("/kasir") && user.role !== "ADMIN" && user.role !== "KASIR") {
        return setSecurityHeaders(NextResponse.redirect(new URL("/mekanik", request.url)));
      }

      // Mekanik route check
      if (pathname.startsWith("/mekanik") && user.role !== "ADMIN" && user.role !== "MEKANIK") {
        return setSecurityHeaders(NextResponse.redirect(new URL("/kasir", request.url)));
      }
    } catch {
      // Token expired or invalid signature
      if (pathname.startsWith("/api/")) {
        const res = NextResponse.json(
          { error: "Unauthorized: Sesi telah kedaluwarsa atau token tidak valid." },
          { status: 401 }
        );
        return setSecurityHeaders(res);
      }
      const loginUrl = new URL("/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("auth_token");
      return setSecurityHeaders(res);
    }
  }

  const response = NextResponse.next();
  return setSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
