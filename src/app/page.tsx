import Link from "next/link";
import {
  ShoppingCart,
  Wrench,
  Package,
  BarChart3,
  ArrowRight,
  Car,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Lock,
  Database,
  Smartphone,
  FileText,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Cpu,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      {/* 1. STICKY TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl font-mono shadow-xs group-hover:scale-105 transition-transform">
              OE
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wide text-slate-900 flex items-center space-x-1.5">
                <span>ONDERDIL</span>
                <span className="text-amber-600">ENGINE</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  ShiftGear
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Mitra: PT Anugrah Motor Kuningan</span>
              </div>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#fitur" className="hover:text-slate-900 transition-colors">
              Fitur Utama
            </a>
            <a href="#alur-kerja" className="hover:text-slate-900 transition-colors">
              Alur Kerja
            </a>
            <a href="#keamanan" className="hover:text-slate-900 transition-colors">
              Keamanan Cyber
            </a>
            <a href="#mitra" className="hover:text-slate-900 transition-colors">
              Profil Mitra
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline-block text-xs text-slate-500">
                  Halo, <strong className="text-slate-800">{session.name}</strong> ({session.role})
                </span>
                <Link
                  href="/kasir"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka Dashboard POS</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/kasir"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1"
                >
                  <span>Coba Demo POS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Header */}
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>ShiftGear &bull; Sistem POS &amp; Manajemen Bengkel Modern</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Digitalisasi Total Operasional Bengkel Mobil dalam Satu Platform.
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Solusi cerdas bagi pemilik bengkel, kasir, dan mekanik: memantau antrean kendaraan servis real-time, transparansi suku cadang, kalkulasi tagihan otomatis, dan standar keamanan cyber enterprise.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/kasir"
                className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Mulai Transaksi Kasir POS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/mekanik"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-200 transition shadow-xs flex items-center justify-center space-x-2"
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Papan Antrean Servis Mekanik</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Divalidasi di Bengkel Anugrah Motor</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>12 Pengguna Aktif (1 Pemilik, 1 Kasir, 10 Teknisi)</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Kepatuhan Keamanan OWASP Top 10</span>
              </span>
            </div>
          </div>

          {/* Product UI Preview Mockup (Browser Window) */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
            {/* Window Top Bar */}
            <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="px-4 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-500 font-medium flex items-center space-x-1.5 shadow-2xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>https://onderdil-engine.vercel.app/kasir</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-400">Live Preview</div>
            </div>

            {/* Mockup Inside: Split Screen POS & Kanban */}
            <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
              {/* Left Side: Kasir Checkout Window (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">B 1234 ABC &bull; Toyota Avanza 2021</div>
                      <div className="text-xs text-slate-500">Tiket: ORD-2026-004 &bull; Pemilik: Pak Budi Santoso</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Selesai Dikerjakan
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">Kampas Rem Depan Bendix Avanza</div>
                      <div className="text-slate-500">1 unit x Rp 275.000 (SKU: BRK-AVZ-01)</div>
                    </div>
                    <div className="font-extrabold text-slate-900">Rp 275.000</div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">Oli Mesin Castrol Magnatec 10W-40 4L</div>
                      <div className="text-slate-500">1 galon x Rp 380.000 (SKU: OIL-CAS-1040)</div>
                    </div>
                    <div className="font-extrabold text-slate-900">Rp 380.000</div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800">Jasa Servis Rem &amp; Tune Up Mesin</div>
                      <div className="text-slate-500">Teknisi Mekanik: Kang Ujang</div>
                    </div>
                    <div className="font-extrabold text-slate-900">Rp 120.000</div>
                  </div>
                </div>

                {/* Summary Total */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Tagihan Final:</span>
                    <span className="text-xl font-black text-slate-900">Rp 775.000</span>
                  </div>
                  <Link
                    href="/kasir"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs"
                  >
                    Cetak Nota Resmi &rarr;
                  </Link>
                </div>
              </div>

              {/* Right Side: Live Kanban & Early Warning (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Mechanic Queue Pill */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      <span>Papan Alur Mekanik (Real-time)</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      4 Unit Aktif
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>E 4589 YZ</span>
                        <span className="text-amber-800 text-[11px]">Sedang Dikerjakan</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">Innova 2018 &bull; Ganti Kampas Kopling</div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>D 8888 XY</span>
                        <span className="text-slate-600 text-[11px]">Antrean Baru</span>
                      </div>
                      <div className="text-slate-600 text-[11px] mt-0.5">Honda CR-V &bull; Cek Kaki-kaki Depan</div>
                    </div>
                  </div>
                </div>

                {/* Stock Early Warning Alert Card */}
                <div className="bg-white rounded-2xl border border-red-200 p-4 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-bold">Peringatan Stok Gudang</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Filter Oli Avanza sisa <strong>3 unit</strong> (Batas minimum: 5 unit). Sistem otomatis mengirim sinyal pengadaan ke manajer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. METRIC IMPACT RIBBON */}
      <section className="bg-white border-y border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">12 Pengguna</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">Mitra Terdaftar</div>
              <div className="text-xs text-slate-500">1 Pemilik, 1 Kasir, 10 Teknisi</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">&lt; 2 Menit</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">Pencatatan Servis</div>
              <div className="text-xs text-slate-500">Dari plat masuk sampai nota cetak</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">100% Paperless</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">Alokasi Sparepart</div>
              <div className="text-xs text-slate-500">Sinkron otomatis dengan stok fisik</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">OWASP Top 10</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-700">Standar Proteksi</div>
              <div className="text-xs text-slate-500">Anti-SQL Injection &amp; RBAC ketat</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FITUR UTAMA (CORE MODULES) */}
      <section id="fitur" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Fitur Unggulan Sistem</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dirancang Sesuai Ritme Kerja Nyata di Bengkel Mobil
          </h2>
          <p className="text-sm text-slate-600">
            Mengatasi kendala hilangnya nota kertas, ketidakcocokan stok suku cadang, dan kesulitan pelacakan komisi mekanik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Kasir POS &amp; Cetak Nota</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pencarian kilat suku cadang via nama atau SKU, kalkulasi diskon, hitung kembalian instan, dan cetak faktur invoice PDF/thermal resmi.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-600 flex items-center space-x-1">
              <Link href="/kasir" className="hover:underline">Buka Kasir POS &rarr;</Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Kanban Alur Servis Mekanik</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Papan pemantauan 4 status (*Menunggu, Pengerjaan, Selesai, Lunas*). Teknisi dapat memasukkan sparepart terpakai langsung dari smartphone.
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center space-x-1">
              <Link href="/mekanik" className="hover:underline">Lihat Alur Servis &rarr;</Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Katalog &amp; Early Alert Stok</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pencatatan harga modal, harga jual eceran, dan peringatan otomatis ketika stok barang fisik berada di bawah ambang batas kritis.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-600 flex items-center space-x-1">
              <Link href="/spareparts" className="hover:underline">Kelola Sparepart &rarr;</Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Laporan &amp; Ekspor Excel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rekapitulasi omzet penjualan suku cadang, total pendapatan jasa teknisi, dan fitur ekspor data transaksi ke format CSV / Microsoft Excel.
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center space-x-1">
              <Link href="/laporan" className="hover:underline">Lihat Laporan &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ALUR KERJA OPERASIONAL (WORKFLOW 3 LANGKAH) */}
      <section id="alur-kerja" className="bg-white border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Sederhana &amp; Efisien</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Alur Operasional Bengkel 3 Langkah
            </h2>
            <p className="text-sm text-slate-600">
              Proses kerja terstruktur dari kendaraan masuk bengkel hingga serah terima kunci dan faktur lunas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-7 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Pendaftaran Kendaraan Masuk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kasir memasukkan nomor polisi (plat kendaraan), tipe mobil, nama pemilik, dan keluhan kerusakan. Sistem secara otomatis membuat tiket servis dengan nomor unik.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                &rarr; Tiket: <strong>ORD-2026-004</strong> dibuat status <em>Menunggu</em>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-7 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Mekanik Menangani &amp; Alokasi Part</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teknisi mekanik memindahkan status ke <em>Sedang Dikerjakan</em>, memilih suku cadang yang dipasang dari gudang, dan mengisi catatan teknis perbaikan.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                &rarr; Pasang: <strong>Kampas Rem Bendix</strong> (Stok gudang -1 otomatis)
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-7 space-y-4 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Pembayaran Kasir &amp; Cetak Nota</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kendaraan yang telah selesai langsung muncul di modul kasir siap bayar. Kasir menerima pembayaran (Tunai/QRIS/Transfer) dan langsung mencetak faktur nota resmi.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-600">
                &rarr; Status <strong>Lunas</strong> &amp; Faktur dicetak untuk pelanggan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KEAMANAN CYBER & KEPATUHAN AKADEMIK (CYBERSECURITY COMPLIANCE) */}
      <section id="keamanan" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mata Kuliah: Keamanan Cyber (TINFC-2024-01)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Arsitektur Keamanan Siber Berstandar Industri
          </h2>
          <p className="text-sm text-slate-600">
            Dosen Pengampu: <strong>Fitra Nugraha, S.Kom., M.Kom.</strong> &bull; Disusun oleh: <strong>Apliy Tridiansyah Rosdiana (20240810111)</strong>, Universitas Kuningan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Parameterized Queries</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mencegah serangan <strong>SQL Injection (SQLi)</strong> menggunakan Prisma ORM. Input pengguna dienkapsulasi dan dipisahkan dari logika query database.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Role-Based Access (RBAC)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pemisahan wewenang ketat: Teknisi Mekanik tidak dapat memodifikasi harga jual part/menghapus data kasir, dan Kasir dibatasi dari pengaturan manajerial.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Secure Cookie &amp; Hashing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Password di-hash dengan standar kriptografi modern ber-salt. Sesi otentikasi disimpan dalam cookie dengan atribut <code>HttpOnly</code>, <code>SameSite</code>, dan <code>Secure</code>.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Security Audit Logging</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap aksi kritis seperti login gagal, transaksi penjualan, dan percobaan akses tanpa izin dicatat ke dalam audit trail database secara permanen.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SPOTLIGHT MITRA LAPANGAN (BENGKEL ANUGRAH MOTOR) */}
      <section id="mitra" className="bg-white border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Studi Kasus Lapangan Nyata</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Profil Mitra: Bengkel Anugrah Motor Kuningan
              </h2>
            </div>
            <span className="text-xs px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold w-fit">
              Hasil Wawancara: 19 Oktober 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Lokasi Bengkel:</span>
              <p className="font-bold text-slate-900 text-sm leading-snug">
                Jl. Syeh Maulana Akbar No.88, Kuningan
              </p>
              <p className="text-slate-500">Kec. Kuningan, Kab. Kuningan, Jawa Barat 45511</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Pemilik / Narahubung:</span>
              <p className="font-bold text-amber-700 text-sm">Mang Acim (Pemilik)</p>
              <p className="text-slate-700 font-mono font-bold">081324735850</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Total Personel Bengkel:</span>
              <p className="font-bold text-slate-900 text-sm">12 Pengguna Aktif</p>
              <p className="text-slate-500">1 Pemilik Usaha, 1 Petugas Kasir, dan 10 Teknisi Mekanik</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-slate-500 font-semibold block text-[11px] uppercase tracking-wider">Sarana TIK yang Digunakan:</span>
              <p className="font-semibold text-slate-800">
                1 PC/Laptop Kasir (Wi-Fi) &amp; Smartphone Android Mekanik
              </p>
              <p className="text-slate-500">Aplikasi web responsif diakses lancar via browser Chrome mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Siap Menjalankan Operasional Bengkel Lebih Cepat &amp; Aman?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Akses sistem kasir POS, papan antrean teknisi, dan pemantauan stok suku cadang secara langsung sekarang.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/kasir"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
            >
              Mulai Kasir POS Sekarang &rarr;
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </section>

      {/* 9. COMPREHENSIVE FOOTER */}
      <footer className="mt-auto bg-white border-t border-slate-200/80 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
            {/* Brand Info */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base font-mono">
                  OE
                </div>
                <div className="font-extrabold text-slate-900 tracking-wide">
                  ONDERDIL<span className="text-amber-600">ENGINE</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                ShiftGear &bull; Sistem Point-of-Sale dan Manajemen Operasional Bengkel Mobil terpadu dengan standar keamanan siber enterprise.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                Mitra Lapangan: <strong>PT Anugrah Motor</strong> (Kuningan, Jawa Barat).
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Aplikasi POS</div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li><Link href="/kasir" className="hover:text-slate-900 transition">Kasir POS &amp; Nota</Link></li>
                <li><Link href="/mekanik" className="hover:text-slate-900 transition">Antrean Servis Mekanik</Link></li>
                <li><Link href="/spareparts" className="hover:text-slate-900 transition">Katalog Stok Suku Cadang</Link></li>
                <li><Link href="/laporan" className="hover:text-slate-900 transition">Laporan &amp; Rekapitulasi</Link></li>
                <li><Link href="/login" className="hover:text-slate-900 transition">Masuk Akun Pengguna</Link></li>
              </ul>
            </div>

            {/* Academic Information */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Informasi Akademik</div>
              <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                <p><strong>Penyusun:</strong> Apliy Tridiansyah Rosdiana</p>
                <p><strong>NIM:</strong> 20240810111 (TINFC-2024-01)</p>
                <p><strong>Dosen:</strong> Fitra Nugraha, S.Kom., M.Kom.</p>
                <p>Mata Kuliah Keamanan Cyber &bull; Universitas Kuningan (2026)</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              &copy; 2026 ShiftGear / OnderdilEngine. Seluruh hak cipta dilindungi.
            </div>
            <div>
              Disusun untuk Ujian/Tugas Projek Keamanan Cyber Fakultas Ilmu Komputer UNIKU.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
