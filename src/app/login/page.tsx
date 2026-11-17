"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User, AlertCircle, Zap, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk ke sistem.");
        setLoading(false);
        return;
      }

      // Route by role
      if (data.user.role === "MEKANIK") {
        router.push("/mekanik");
      } else if (data.user.role === "KASIR") {
        router.push("/kasir");
      } else {
        router.push("/kasir");
      }
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan atau server.");
      setLoading(false);
    }
  };

  const setDemoAccount = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="max-w-md w-full mb-3">
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Bengkel</span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-6 bg-white border border-slate-200/90 p-8 sm:p-9 rounded-3xl shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl shadow-xs mb-3">
            AM
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            PORTAL <span className="text-amber-600">STAF BENGKEL</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            PT Anugrah Motor &bull; Sistem POS &amp; Manajemen Servis
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="misal: kasir / admin / mekanik"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-xs"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-2.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-700">Pilih Akun Demo (1-Click):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount("admin", "AdminBengkel#2026")}
              className="px-2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center text-xs transition"
            >
              <div className="text-[10px] text-red-600 font-bold">ADMIN</div>
              <div className="text-[11px] text-slate-600 font-medium">admin</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("kasir", "KasirBengkel#2026")}
              className="px-2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center text-xs transition"
            >
              <div className="text-[10px] text-amber-700 font-bold">KASIR</div>
              <div className="text-[11px] text-slate-600 font-medium">kasir</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("mekanik", "MekanikBengkel#2026")}
              className="px-2 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center text-xs transition"
            >
              <div className="text-[10px] text-blue-700 font-bold">MEKANIK</div>
              <div className="text-[11px] text-slate-600 font-medium">mekanik</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
