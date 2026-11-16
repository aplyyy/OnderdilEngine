"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, Zap } from "lucide-react";

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
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-amber-500 text-slate-950 font-black text-3xl shadow-lg shadow-amber-500/20 mb-3">
            OE
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-mono">
            ONDERDIL<span className="text-amber-500">ENGINE</span>
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-mono">
            Sistem Point-of-Sale (POS) &amp; Manajemen Bengkel Mobil
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/70 border border-red-800 rounded-md flex items-start space-x-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="misal: kasir / admin / mekanik"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Sistem"}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-300">Pilih Akun Demo (1-Click):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount("admin", "AdminBengkel#2026")}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center text-xs font-mono text-slate-200 transition-colors"
            >
              <div className="text-[10px] text-red-400 font-bold">ADMIN</div>
              <div className="text-[10px] text-slate-400">admin</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("kasir", "KasirBengkel#2026")}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center text-xs font-mono text-slate-200 transition-colors"
            >
              <div className="text-[10px] text-amber-400 font-bold">KASIR</div>
              <div className="text-[10px] text-slate-400">kasir</div>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("mekanik", "MekanikBengkel#2026")}
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-center text-xs font-mono text-slate-200 transition-colors"
            >
              <div className="text-[10px] text-blue-400 font-bold">MEKANIK</div>
              <div className="text-[10px] text-slate-400">mekanik</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
