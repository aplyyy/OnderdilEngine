import Link from "next/link";
import { ShoppingCart, Wrench, Package, ShieldCheck, ArrowRight, BarChart3 } from "lucide-react";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SISTEM POINT-OF-SALE &amp; WORKSHOP AUTOMOTIVE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 font-mono">
            ONDERDIL<span className="text-amber-500">ENGINE</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Platform operasional bengkel mobil modern: kasir POS cepat, manajemen alur kerja servis
            kendaraan, kontrol stok suku cadang, dan audit rekapitulasi finansial dengan penerapan
            ketat standar keamanan <strong>Cyber Security &amp; OWASP Top 10</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {session ? (
              <Link
                href="/kasir"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Buka Dashboard ({session.role})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Masuk ke Sistem POS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/security-test"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-md text-sm uppercase tracking-wider transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security Self-Testing</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Kasir POS &amp; Nota Cepat</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Katalog suku cadang interaktif, kalkulasi jasa mekanik otomatis, penanganan diskon/pajak, serta cetak nota pembayaran instan.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Manajemen Servis &amp; Part</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pelacakan status kendaraan dari antrean <em>Menunggu</em>, <em>Pengerjaan</em>, hingga <em>Selesai</em> dengan pengurangan stok suku cadang otomatis.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-slate-700 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Hardened Security Architecture</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Proteksi menyeluruh terhadap SQL Injection, Stored XSS, Broken Access Control / IDOR, Rate Limiting anti-brute force, dan Security Headers.
          </p>
        </div>
      </section>
    </div>
  );
}
