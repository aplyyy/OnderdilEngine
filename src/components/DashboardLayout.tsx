"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Wrench,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Clock,
  Gauge,
  Store,
} from "lucide-react";

interface UserSession {
  userId: string;
  username: string;
  name: string;
  role: "ADMIN" | "KASIR" | "MEKANIK";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => {});

    // Clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  // If on login page, render bare without sidebar
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const navGroups = [
    {
      title: "OPERASIONAL",
      items: [
        { href: "/kasir", label: "Kasir POS", icon: ShoppingCart, desc: "Faktur & Transaksi", roles: ["ADMIN", "KASIR"] },
        { href: "/mekanik", label: "Antrean Servis", icon: Wrench, desc: "Alur Kerja Mobil", roles: ["ADMIN", "MEKANIK"] },
      ],
    },
    {
      title: "MANAJEMEN GUDANG",
      items: [
        { href: "/spareparts", label: "Stok Sparepart", icon: Package, desc: "Katalog & Alert Stok", roles: ["ADMIN", "KASIR"] },
      ],
    },
    {
      title: "KEUANGAN & ANALITIK",
      items: [
        { href: "/laporan", label: "Laporan & Rekap", icon: BarChart3, desc: "Omzet & Ekspor CSV", roles: ["ADMIN", "KASIR"] },
      ],
    },
  ];

  const roleBadgeStyle = {
    ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
    KASIR: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    MEKANIK: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const currentTitle =
    pathname === "/"
      ? "Dashboard Utama"
      : pathname.startsWith("/kasir")
      ? "Kasir Point-of-Sale"
      : pathname.startsWith("/mekanik")
      ? "Alur Servis Kendaraan"
      : pathname.startsWith("/spareparts")
      ? "Inventaris Suku Cadang"
      : pathname.startsWith("/laporan")
      ? "Laporan Rekapitulasi"
      : "Panel Bengkel";

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Modern Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F19] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xl font-mono shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                OE
              </div>
              <div>
                <div className="font-mono font-black text-sm tracking-wider text-slate-100">
                  ONDERDIL<span className="text-amber-500">ENGINE</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 tracking-tight flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>SISTEM POS BENGKEL</span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                  {group.title}
                </div>
                <div className="space-y-0.5 pt-1">
                  {group.items.map((item) => {
                    if (user && !item.roles.includes(user.role)) return null;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all ${
                          isActive
                            ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10"
                            : "text-slate-300 hover:text-slate-100 hover:bg-slate-900/90"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? "text-slate-950" : "text-amber-400/80 group-hover:text-amber-400"
                            }`}
                          />
                          <div>
                            <div className="leading-tight">{item.label}</div>
                            <div
                              className={`text-[10px] ${
                                isActive ? "text-slate-900" : "text-slate-500"
                              }`}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isActive ? "text-slate-950 translate-x-0.5" : "text-slate-600 group-hover:text-slate-400"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile & Logout Box in Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
            {user ? (
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold font-mono text-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                        roleBadgeStyle[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Keluar / Logout"
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono uppercase tracking-wider block text-center shadow-md shadow-amber-500/20"
              >
                Masuk / Login
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0B0F19]/90 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb info */}
            <div>
              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
                <span>Bengkel Utama</span>
                <span>/</span>
                <span className="text-amber-500">{currentTitle}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-100 font-mono hidden sm:block">
                {currentTitle}
              </h2>
            </div>
          </div>

          {/* Right Status Indicators */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {currentTime && (
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentTime}</span>
              </div>
            )}

            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Bengkel Online</span>
            </div>

            {user && (
              <Link
                href="/kasir"
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Buka Kasir</span>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-[#090D16] py-4 px-6 text-center text-xs text-slate-500 font-mono">
          OnderdilEngine &copy; 2026 &bull; Sistem POS &amp; Manajemen Operasional Bengkel Mobil
        </footer>
      </div>
    </div>
  );
}
