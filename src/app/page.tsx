import Link from "next/link";
import { ShoppingCart, Wrench, Package, BarChart3, ArrowRight, Car, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>ShiftGear &bull; PT Anugrah Motor</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Selamat Datang di <span className="text-amber-600">Bengkel Anugrah Motor</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Platform digitalisasi layanan mekanik, kasir point-of-sale suku cadang, dan pemantauan antrean servis kendaraan terintegrasi.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            {session ? (
              <Link
                href="/kasir"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xs"
              >
                <span>Mulai Transaksi Kasir</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xs"
              >
                <span>Masuk ke Akun</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/spareparts"
              className="inline-flex items-center space-x-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-all"
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>Cek Stok Suku Cadang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Profil Mitra */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Profil Mitra: Bengkel Anugrah Motor</h3>
              <p className="text-xs text-slate-500">PT Anugrah Motor &bull; Universitas Kuningan (Apliy Tridiansyah Rosdiana - 20240810111)</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold w-fit">
            Wawancara: 19 Okt 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Alamat Bengkel:</span>
            <p className="font-semibold text-slate-800">
              Jl. Syeh Maulana Akbar No.88, Kuningan, Kec. Kuningan, Kab. Kuningan, Jawa Barat 45511
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Narahubung &amp; Pemilik:</span>
            <p className="font-bold text-amber-700 text-sm">Mang Acim (Pemilik)</p>
            <p className="text-slate-600 font-mono font-medium">081324735850</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Pengguna Sistem:</span>
            <p className="font-bold text-slate-800 text-sm">12 Pengguna Aktif</p>
            <p className="text-slate-500">1 Pemilik, 1 Kasir, dan 10 Mekanik</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-slate-500 font-medium">Sarana TIK di Bengkel:</span>
            <p className="text-slate-600 leading-snug">
              1 PC/Laptop di meja kasir (Wi-Fi) &amp; Smartphone Android teknisi mekanik
            </p>
          </div>
        </div>
      </section>

      {/* 4 Friendly Menu Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <span>Pilih Menu Operasional</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Kasir POS */}
          <Link
            href="/kasir"
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Kasir POS &amp; Nota
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencarian cepat sparepart, kalkulasi biaya jasa servis, dan cetak struk nota pembayaran.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
              <span>Buka Menu Kasir &rarr;</span>
            </div>
          </Link>

          {/* Card 2: Antrean Servis */}
          <Link
            href="/mekanik"
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Antrean Servis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pantau proses pengerjaan mobil dari antrean Menunggu, Pengerjaan, hingga Selesai.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Buka Alur Servis &rarr;</span>
            </div>
          </Link>

          {/* Card 3: Stok Sparepart */}
          <Link
            href="/spareparts"
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Stok Sparepart
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kelola daftar suku cadang, harga beli/jual, dan pantau barang yang stoknya menipis.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Kelola Gudang &rarr;</span>
            </div>
          </Link>

          {/* Card 4: Laporan Penjualan */}
          <Link
            href="/laporan"
            className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Laporan &amp; Rekap
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lihat ringkasan pendapatan bengkel dan unduh laporan transaksi ke format CSV / Excel.
              </p>
            </div>
            <div className="flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Lihat Laporan &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Helpful Operational Guide */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Panduan Alur Operasional Bengkel:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-amber-700 text-sm">1. Kendaraan Masuk</div>
            <p className="text-slate-600 leading-relaxed">
              Petugas kasir mendaftarkan nomor polisi dan keluhan mobil melalui tombol <em>&ldquo;+ Masukkan Kendaraan Servis&rdquo;</em> di menu Kasir POS.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-blue-700 text-sm">2. Mekanik Mengerjakan</div>
            <p className="text-slate-600 leading-relaxed">
              Teknisi membuka menu <em>&ldquo;Antrean Servis&rdquo;</em>, memilih suku cadang yang dipasang, mencatat hasil perbaikan, dan menekan tombol <em>&ldquo;Selesai&rdquo;</em>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-emerald-700 text-sm">3. Pembayaran &amp; Nota</div>
            <p className="text-slate-600 leading-relaxed">
              Kasir memilih tiket kendaraan yang telah selesai, menerima uang pembayaran konsumen, dan mencetak faktur nota pembayaran resmi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
