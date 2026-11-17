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
  ChevronRight,
  Clock,
  PlusCircle,
  HelpCircle,
  Car,
  Home,
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

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
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

  if (pathname === "/" || pathname === "/login" || pathname === "/laporan-print") {
    return <>{children}</>;
  }

  const navGroups = [
    {
      title: "Menu Utama",
      items: [
        { href: "/", label: "Beranda", icon: Home, desc: "Ringkasan Bengkel", roles: ["ADMIN", "KASIR", "MEKANIK"] },
        { href: "/kasir", label: "Kasir POS", icon: ShoppingCart, desc: "Transaksi & Cetak Nota", roles: ["ADMIN", "KASIR"] },
        { href: "/mekanik", label: "Antrean Servis", icon: Wrench, desc: "Alur Perbaikan Mobil", roles: ["ADMIN", "MEKANIK"] },
      ],
    },
    {
      title: "Manajemen & Data",
      items: [
        { href: "/spareparts", label: "Stok Sparepart", icon: Package, desc: "Inventaris & Suku Cadang", roles: ["ADMIN", "KASIR"] },
        { href: "/laporan", label: "Laporan Penjualan", icon: BarChart3, desc: "Rekap Omzet & Laba", roles: ["ADMIN", "KASIR"] },
      ],
    },
  ];

  const roleBadgeStyle = {
    ADMIN: "bg-rose-50 text-rose-700 border-rose-200/80",
    KASIR: "bg-amber-50 text-amber-800 border-amber-200/80",
    MEKANIK: "bg-blue-50 text-blue-700 border-blue-200/80",
  };

  const roleLabelMap = {
    ADMIN: "Administrator (Manajer)",
    KASIR: "Petugas Kasir",
    MEKANIK: "Teknisi Mekanik",
  };

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    "/": { title: "Beranda Utama", subtitle: "Selamat datang di Sistem Kasir & Manajemen Bengkel" },
    "/kasir": { title: "Kasir Point-of-Sale (POS)", subtitle: "Pencatatan suku cadang, jasa servis, dan cetak faktur" },
    "/mekanik": { title: "Papan Alur Servis Kendaraan", subtitle: "Pantau antrean perbaikan unit mobil dan alokasi part" },
    "/spareparts": { title: "Inventaris Suku Cadang", subtitle: "Manajemen persediaan barang fisik dan harga jual" },
    "/laporan": { title: "Laporan & Rekapitulasi", subtitle: "Ringkasan omzet finansial dan ekspor data transaksi" },
  };

  const currentMeta = pageMeta[pathname] || { title: "Panel Bengkel", subtitle: "OnderdilEngine Management System" };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Modern, Clean & High-Taste Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-xl lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Brand Header */}
          <div className="h-20 px-6 border-b border-slate-200/80 flex items-center justify-between bg-white">
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl font-mono shadow-sm group-hover:scale-105 transition-transform">
                OE
              </div>
              <div>
                <div className="font-extrabold text-base tracking-wide text-slate-900 flex items-center space-x-1">
                  <span>ONDERDIL</span>
                  <span className="text-amber-600">ENGINE</span>
                </div>
                <div className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>PT Anugrah Motor</span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <div className="px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    if (user && !item.roles.includes(user.role)) return null;
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                          isActive
                            ? "bg-slate-900 text-white font-bold shadow-sm"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                        }`}
                      >
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive
                                ? "bg-slate-800 text-amber-400"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold leading-snug">{item.label}</div>
                            <div
                              className={`text-[11px] ${
                                isActive ? "text-slate-300" : "text-slate-400"
                              }`}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${
                            isActive ? "text-amber-400" : "text-slate-400"
                          }`}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile Card in Sidebar Footer */}
          <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
            {user ? (
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-800 font-bold text-sm shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${roleBadgeStyle[user.role]}`}>
                        {roleLabelMap[user.role] || user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Keluar dari Akun"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider block text-center shadow-sm"
              >
                Masuk / Login
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header / Bar */}
        <header className="sticky top-0 z-30 min-h-16 py-3 bg-white/90 border-b border-slate-200/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page Header Title */}
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                {currentMeta.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block truncate">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Header Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {currentTime && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentTime}</span>
              </div>
            )}

            {user && pathname !== "/kasir" && (
              <Link
                href="/kasir"
                className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all shadow-sm shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Buka Kasir POS</span>
                <span className="sm:hidden font-bold">Kasir</span>
              </Link>
            )}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* Friendly Clean Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-5 px-8 text-center text-xs text-slate-500">
          ShiftGear / OnderdilEngine &copy; 2026 &bull; Mitra: Bengkel Anugrah Motor (Jl. Syeh Maulana Akbar No.88, Kuningan &bull; Narahubung: Mang Acim / 081324735850)
        </footer>
      </div>
    </div>
  );
}
