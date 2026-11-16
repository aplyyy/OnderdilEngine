import Link from "next/link";
import { ShoppingCart, Wrench, Package, ArrowRight, BarChart3 } from "lucide-react";
import { getSession } from "@/lib/auth";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>SISTEM POINT-OF-SALE &amp; WORKSHOP MOBIL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-100 font-mono">
            ONDERDIL<span className="text-amber-500">ENGINE</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Aplikasi operasional bengkel mobil modern: kasir POS cepat, manajemen antrean servis
            kendaraan, kontrol inventaris suku cadang, serta rekapitulasi laporan penjualan dan laba.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {session ? (
              <Link
                href="/kasir"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Buka Kasir POS ({session.role})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                <span>Masuk ke Kasir</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/spareparts"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold rounded-md text-sm uppercase tracking-wider transition-all"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Lihat Stok Sparepart</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/kasir"
          className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-amber-500/50 hover:bg-slate-900 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Kasir POS &amp; Cetak Nota</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pencarian suku cadang cepat, kalkulasi biaya jasa servis otomatis, penanganan diskon, dan cetak faktur/nota kasir.
          </p>
        </Link>

        <Link
          href="/mekanik"
          className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-blue-500/50 hover:bg-slate-900 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-colors">
            <Wrench className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Antrean Servis Mobil</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pemantauan alur kendaraan dari antrean <em>Menunggu</em>, <em>Pengerjaan</em>, hingga <em>Selesai</em> dengan pengurangan stok suku cadang otomatis.
          </p>
        </Link>

        <Link
          href="/laporan"
          className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-100 font-mono">Laporan &amp; Ekspor CSV</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ringkasan omzet finansial harian/bulanan, akumulasi pendapatan suku cadang vs jasa montir, dan ekspor data penjualan.
          </p>
        </Link>
      </section>
    </div>
  );
}
