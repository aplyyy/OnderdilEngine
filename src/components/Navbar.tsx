"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Wrench,
  ShoppingCart,
  Package,
  BarChart3,
  ShieldCheck,
  LogOut,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface UserSession {
  userId: string;
  username: string;
  name: string;
  role: "ADMIN" | "KASIR" | "MEKANIK";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return { user: null };
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  if (pathname === "/login") return null;

  const navItems = [
    { href: "/kasir", label: "Kasir POS", icon: ShoppingCart, roles: ["ADMIN", "KASIR"] },
    { href: "/mekanik", label: "Antrean Servis", icon: Wrench, roles: ["ADMIN", "MEKANIK"] },
    { href: "/spareparts", label: "Stok Sparepart", icon: Package, roles: ["ADMIN", "KASIR"] },
    { href: "/laporan", label: "Laporan & Rekap", icon: BarChart3, roles: ["ADMIN", "KASIR"] },
    { href: "/security-test", label: "Security Self-Test", icon: ShieldCheck, roles: ["ADMIN", "KASIR", "MEKANIK"] },
  ];

  const roleBadgeColor = {
    ADMIN: "bg-red-950/80 text-red-300 border-red-700/50",
    KASIR: "bg-amber-950/80 text-amber-300 border-amber-700/50",
    MEKANIK: "bg-blue-950/80 text-blue-300 border-blue-700/50",
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-md shadow-amber-500/20 group-hover:bg-amber-400 transition-colors">
                OE
              </div>
              <div>
                <span className="font-extrabold text-slate-100 tracking-wider text-sm sm:text-base font-mono">
                  ONDERDIL<span className="text-amber-500">ENGINE</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-mono tracking-tight">
                  POS &amp; WORKSHOP CYBERSEC SYSTEM
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              if (user && !item.roles.includes(user.role)) return null;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-slate-800 text-amber-400 border border-slate-700 shadow-sm"
                      : "text-slate-300 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Session Info & Action */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                  <div className="flex items-center justify-end space-x-1">
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        roleBadgeColor[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
