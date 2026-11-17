import Link from "next/link";
import {
  Wrench,
  Car,
  Clock,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Package,
  Calendar,
  Fuel,
  Settings,
  BatteryCharging,
  Disc,
  Flame,
  Award,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  const services = [
    {
      title: "Tune Up & Perawatan Berkala",
      desc: "Pembersihan sistem pembakaran, throttle body, injector cleaner, kalibrasi busi, dan pemeriksaan 20 titik komponen vital kendaraan.",
      icon: Settings,
      tag: "Populer",
    },
    {
      title: "Ganti Oli & Filter Mesin",
      desc: "Pilihan oli mesin berkualitas terbaik (Mineral, Semi & Full Synthetic 10W-40, 5W-30) lengkap dengan penggantian filter oli original.",
      icon: Fuel,
      tag: "Rutin",
    },
    {
      title: "Sistem Pengereman & Kaki-kaki",
      desc: "Penggantian kampas rem, kuras minyak rem, servis kaliper, tierod, ball joint, bearing roda, dan shock absorber untuk kenyamanan jalan.",
      icon: Disc,
      tag: "Keselamatan",
    },
    {
      title: "Overhaul Mesin & Transmisi",
      desc: "Penanganan turun mesin parsial/total, skir klep, pergantian gasket silinder, kampas kopling, dan servis transmisi manual maupun matik.",
      icon: Wrench,
      tag: "Spesialis",
    },
    {
      title: "Kelistrikan, Starter & Aki",
      desc: "Pengecekan dinamo ampere (alternator), motor starter, lampu & kelistrikan bodi, serta pengujian daya dan penggantian aki bergaransi.",
      icon: BatteryCharging,
      tag: "Elektrikal",
    },
    {
      title: "AC Mobil & Sistem Pendingin Mesin",
      desc: "Kuras freon, flushing oli kompresor, pembersihan evaporator/kondensor, perbaikan radiator bocor, dan sirkulasi water pump.",
      icon: Sparkles,
      tag: "Kenyamanan",
    },
  ];

  const advantages = [
    {
      title: "10 Mekanik Ahli & Berpengalaman",
      desc: "Dikerjakan langsung oleh teknisi mekanik senior yang memahami spesifikasi mesin berbagai merk mobil (Toyota, Honda, Daihatsu, Suzuki, Mitsubishi, dll).",
      icon: Users,
    },
    {
      title: "Diagnosa Jujur & Transparan",
      desc: "Kerusakan dijelaskan secara terbuka sebelum pengerjaan. Kami hanya mengganti suku cadang yang benar-benar memerlukan perbaikan.",
      icon: CheckCircle2,
    },
    {
      title: "Suku Cadang Asli & Bergaransi",
      desc: "Menyediakan stok suku cadang genuine (OEM) dan opsi aftermarket berkualitas tinggi yang bergaransi untuk keandalan jarak jauh.",
      icon: ShieldCheck,
    },
    {
      title: "Pencatatan Servis Terkomputerisasi",
      desc: "Didukung sistem kasir dan antrean digital ShiftGear, riwayat servis mobil dan kalkulasi biaya tercatat transparan tanpa nota hilang.",
      icon: Award,
    },
  ];

  const popularParts = [
    { name: "Oli Mesin Castrol Magnatec 10W-40 (4L)", category: "Oli & Pelumas", status: "Stok Ready" },
    { name: "Kampas Rem Depan Bendix Avanza / Xenia", category: "Pengereman", status: "Stok Ready" },
    { name: "Filter Oli Original Toyota / Daihatsu", category: "Filter", status: "Stok Ready" },
    { name: "Minyak Rem Prestone DOT 3 & DOT 4", category: "Pengereman", status: "Stok Ready" },
    { name: "Busi Iridium & Standar NGK / Denso", category: "Pengapian", status: "Stok Ready" },
    { name: "Filter Udara Avanza / Innova / Rush", category: "Filter", status: "Stok Ready" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-amber-400 selection:text-slate-950 flex flex-col font-sans">
      {/* MAIN HEADER & NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center space-x-3 group min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl font-mono shadow-xs group-hover:scale-105 transition-transform shrink-0">
              AM
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-tight truncate">
                BENGKEL <span className="text-amber-600">ANUGRAH MOTOR</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0" />
                <span className="truncate">PT Anugrah Motor Kuningan</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600 shrink-0">
            <a href="#tentang" className="hover:text-slate-900 transition-colors">
              Tentang Kami
            </a>
            <a href="#layanan" className="hover:text-slate-900 transition-colors">
              Layanan Servis
            </a>
            <a href="#keunggulan" className="hover:text-slate-900 transition-colors">
              Keunggulan
            </a>
            <a href="#spareparts" className="hover:text-slate-900 transition-colors">
              Suku Cadang
            </a>
            <a href="#lokasi" className="hover:text-slate-900 transition-colors">
              Lokasi &amp; Kontak
            </a>
          </nav>

          {/* Direct Contact Button */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <a
              href="https://wa.me/6281324735850?text=Halo%20Bengkel%20Anugrah%20Motor,%20saya%20ingin%20konsultasi%20jadwal%20servis%20mobil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Mang Acim</span>
            </a>

            {session ? (
              <Link
                href="/kasir"
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
              >
                <span>Buka POS</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition"
              >
                <span>Login Staf</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading, Value Prop, CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs">
                <Car className="w-3.5 h-3.5 text-amber-600" />
                <span>Bengkel Spesialis Perawatan &amp; Perbaikan Mobil Kuningan</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Solusi Terpercaya untuk Performa Maksimal Mobil Anda.
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bengkel Anugrah Motor melayani tune up berkala, ganti oli, perbaikan kaki-kaki, transmisi, pengereman, hingga turun mesin. Ditangani langsung oleh tim 10 teknisi mekanik berpengalaman dengan transparansi suku cadang berkualitas.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <a
                  href="https://wa.me/6281324735850?text=Halo%20Bengkel%20Anugrah%20Motor,%20saya%20mau%20tanya%20estimasi%20biaya%20servis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi &amp; Booking Servis</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#layanan"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-sm border border-slate-200 transition shadow-xs flex items-center justify-center space-x-2"
                >
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>Lihat Layanan Kami</span>
                </a>
              </div>

              {/* Key Trust Signals */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-slate-700 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>10 Mekanik Ahli</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Diagnosa Transparan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Suku Cadang Asli</span>
                </div>
              </div>
            </div>

            {/* Right Column: Workshop Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-6 shadow-xl relative">
                {/* Header Profile Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg font-mono">
                      AM
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">PT Anugrah Motor</h3>
                      <p className="text-xs text-slate-500">Bengkel Mobil &amp; Toko Suku Cadang</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Buka Hari Ini
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="text-slate-500 font-medium">Alamat Bengkel:</div>
                    <div className="font-bold text-slate-900 text-sm">
                      Jl. Syeh Maulana Akbar No.88, Kuningan
                    </div>
                    <div className="text-slate-500">Kec. Kuningan, Kab. Kuningan, Jawa Barat 45511</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="text-slate-500 font-medium">Pemilik / Pengelola:</div>
                      <div className="font-extrabold text-amber-700 text-sm">Mang Acim</div>
                      <div className="text-slate-500">0813-2473-5850</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="text-slate-500 font-medium">Tenaga Kerja:</div>
                      <div className="font-extrabold text-slate-900 text-sm">12 Personel</div>
                      <div className="text-slate-500">1 Kasir, 10 Teknisi Mekanik</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-amber-900">
                    <div className="font-bold flex items-center space-x-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Manajemen Servis Terintegrasi</span>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Bengkel kami menggunakan sistem kasir dan papan antrean digital <em>ShiftGear</em>, memastikan riwayat pengerjaan mobil Anda terdokumentasi akurat dan transparan.
                    </p>
                  </div>
                </div>

                {/* Direct Action */}
                <a
                  href="https://wa.me/6281324735850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hubungi Bengkel Langsung (Telepon / WA)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TENTANG BENGKEL KAMI */}
      <section id="tentang" className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Mengenal Lebih Dekat</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bengkel Anugrah Motor: Dedikasi Merawat Kendaraan Anda Sejak Puluhan Tahun
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Berlokasi strategis di <strong>Jl. Syeh Maulana Akbar No.88, Kuningan</strong>, Bengkel Anugrah Motor (PT Anugrah Motor) hadir sebagai mitra andalan pemilik kendaraan roda empat di wilayah Kabupaten Kuningan dan sekitarnya.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dipimpin oleh <strong>Mang Acim</strong> bersama tim 10 orang teknisi mekanik berpengalaman, bengkel kami mengutamakan diagnosa kerusakan yang akurat, penanganan mekanis yang teliti, dan transparansi suku cadang tanpa biaya terselubung.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                <div className="text-2xl font-black text-slate-900">10+ Mekanik</div>
                <div className="text-slate-500 font-medium">Teknisi berpengalaman menangani berbagai tipe mobil</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
                <div className="text-2xl font-black text-amber-600">100% Terbuka</div>
                <div className="text-slate-500 font-medium">Konsultasi kerusakan gratis dan estimasi biaya sebelum kerja</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-7 space-y-5 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Prinsip Layanan Bengkel Anugrah Motor</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Kejujuran Diagnosa</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Kami tidak pernah mengada-ada kerusakan. Jika suku cadang masih layak pakai dan cukup dibersihkan, kami sampaikan apa adanya kepada pemilik mobil.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Jaminan Kualitas Suku Cadang</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Suku cadang yang kami sediakan berasal dari suplier resmi dan distributor terpercaya, mulai dari oli mesin, kampas rem, hingga part transmisi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Pelayanan Ramah &amp; Nyaman</h4>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">
                      Staf kasir dan mekanik kami siap mendengarkan keluhan kendaraan Anda dengan ramah serta memberikan solusi perawatan berkala yang paling hemat dan tepat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LAYANAN SERVIS KAMI */}
      <section id="layanan" className="bg-white border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Pelayanan Lengkap</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Layanan Perbaikan &amp; Servis Berkala Mobil
            </h2>
            <p className="text-sm text-slate-600">
              Menangani berbagai keluhan kendaraan harian, mobil keluarga, maupun armada niaga dengan peralatan bengkel memadai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-4 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-semibold">
                        {svc.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-amber-700">
                    <a
                      href={`https://wa.me/6281324735850?text=Halo%20Bengkel%20Anugrah%20Motor,%20saya%20mau%20tanya%20layanan:%20${encodeURIComponent(svc.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center space-x-1"
                    >
                      <span>Tanya Biaya Servis Ini &rarr;</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. KEUNGGULAN KAMI */}
      <section id="keunggulan" className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Kenapa Memilih Kami</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Alasan Pemilik Mobil di Kuningan Mempercayakan Kendaraannya pada Kami
          </h2>
          <p className="text-sm text-slate-600">
            Kombinasi keahlian teknisi berpengalaman, ketersediaan suku cadang, dan pemanfaatan sistem manajemen digital modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{adv.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{adv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. KATALOG SUKU CADANG TRANSPARAN */}
      <section id="spareparts" className="bg-white border-y border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Transparansi Stok &amp; Komponen</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Katalog Suku Cadang &amp; Pelumas Original
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kami menyediakan suku cadang fast-moving maupun komponen khusus dengan kualitas terjamin.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="https://wa.me/6281324735850?text=Halo%20Bengkel%20Anugrah%20Motor,%20apakah%20ada%20stok%20sparepart..."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs flex items-center space-x-1.5"
              >
                <span>Tanya Ketersediaan Part via WA</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularParts.map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">{p.category}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1.5">{p.name}</h4>
                </div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kualitas: Original OEM</span>
                  <a
                    href={`https://wa.me/6281324735850?text=Halo,%20apakah%20${encodeURIComponent(p.name)}%20ready%20di%20Bengkel%20Anugrah%20Motor?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 font-bold hover:underline"
                  >
                    Cek Harga &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            * Butuh suku cadang untuk mobil merk atau tahun tertentu? Kami memiliki jaringan suplier suku cadang resmi terlengkap di wilayah Kuningan.
          </div>
        </div>
      </section>

      {/* 8. LOKASI, JAM OPERASIONAL & KONTAK */}
      <section id="lokasi" className="py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-widest">Kunjungi Kami</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lokasi Bengkel &amp; Jam Operasional
          </h2>
          <p className="text-sm text-slate-600">
            Mudah diakses dari jalan utama pusat kota Kuningan. Silakan datang langsung atau hubungi kami terlebih dahulu untuk janji temu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-7 space-y-6 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Lengkap:</div>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    Jl. Syeh Maulana Akbar No.88, Kuningan
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kec. Kuningan, Kab. Kuningan, Jawa Barat 45511
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telepon &amp; WhatsApp:</div>
                  <p className="font-bold text-slate-900 text-base mt-0.5 font-mono">
                    0813-2473-5850
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Narahubung &amp; Pemilik: <strong>Mang Acim</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Buka Bengkel:</div>
                  <div className="text-xs text-slate-700 mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Senin – Sabtu:</span>
                      <strong className="text-slate-900">08.00 – 17.00 WIB</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Minggu &amp; Libur Nasional:</span>
                      <span className="font-medium">Tutup / Janji Khusus</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href="https://wa.me/6281324735850?text=Halo%20Mang%20Acim,%20saya%20mau%20tanya%20jadwal%20servis%20mobil%20di%20Bengkel%20Anugrah%20Motor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat WhatsApp Mang Acim</span>
              </a>

              <a
                href="https://maps.google.com/?q=Jl.+Syeh+Maulana+Akbar+No.88+Kuningan+Jawa+Barat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Buka Rute di Google Maps</span>
              </a>
            </div>
          </div>

          {/* Interactive Workshop Service Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-7 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Car className="w-5 h-5 text-amber-500" />
                <span>Alur Kunjungan &amp; Penerimaan Kendaraan</span>
              </h3>
              <span className="text-xs text-slate-500">Prosedur Cepat</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">1</span>
                  <span>Kendaraan Tiba di Bengkel</span>
                </div>
                <p className="text-slate-600 pl-8 leading-relaxed">
                  Tim kami menyambut Anda, mencatat plat nomor, tipe mobil, serta keluhan kerusakan kendaraan secara teliti di sistem digital.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                  <span>Pengecekan &amp; Estimasi Biaya</span>
                </div>
                <p className="text-slate-600 pl-8 leading-relaxed">
                  Mekanik memeriksa komponen fisik. Kami menyampaikan rincian pekerjaan dan kebutuhan suku cadang beserta estimasi biaya sebelum membongkar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                  <span>Pengerjaan &amp; Uji Coba (Test Drive)</span>
                </div>
                <p className="text-slate-600 pl-8 leading-relaxed">
                  10 teknisi kami bekerja cepat dan rapi. Setelah servis selesai, mobil diuji coba untuk memastikan kendaraan aman dibawa pulang.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs flex items-center justify-between">
              <div>
                <strong>Ingin booking jadwal servis agar tidak antre?</strong>
                <p className="text-amber-800 text-[11px] mt-0.5">Kirim pesan WhatsApp sekarang untuk reservasi slot servis mobil Anda.</p>
              </div>
              <a
                href="https://wa.me/6281324735850"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shrink-0 shadow-2xs"
              >
                Booking WA &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PORTAL STAF & MANAJEMEN INTERNAL (SHIFTGEAR ACCESS) */}
      <section className="bg-slate-900 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-slate-950/80 border border-slate-800">
            <div className="space-y-2 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>Portal Khusus Karyawan &amp; Teknisi Bengkel</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Akses Sistem Digital Kasir POS &amp; Papan Alur Mekanik (ShiftGear)
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Khusus untuk 12 personel internal Bengkel Anugrah Motor: pencatatan nota kasir, antrean servis mobil, dan update suku cadang gudang.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/kasir"
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-xs flex items-center space-x-1.5"
              >
                <Car className="w-4 h-4" />
                <span>Masuk Kasir POS</span>
              </Link>
              <Link
                href="/mekanik"
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition flex items-center space-x-1.5"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Papan Mekanik</span>
              </Link>
              <Link
                href="/login"
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-medium rounded-xl text-xs border border-slate-800 transition"
              >
                <span>Login Akun</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
            {/* Col 1: Identity */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg font-mono">
                  AM
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm tracking-wide">
                    BENGKEL ANUGRAH MOTOR
                  </div>
                  <div className="text-[11px] text-slate-500">PT Anugrah Motor &bull; Kuningan, Jawa Barat</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Pusat perawatan dan perbaikan kendaraan bermotor roda empat profesional. Melayani servis berkala, tune up, ganti oli, pengereman, kaki-kaki, dan suku cadang original.
              </p>
              <p className="text-xs text-slate-500">
                Alamat: Jl. Syeh Maulana Akbar No.88, Kuningan (Narahubung: Mang Acim / 0813-2473-5850)
              </p>
            </div>

            {/* Col 2: Layanan */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Layanan Servis</div>
              <ul className="space-y-1.5 text-slate-600">
                <li>Tune Up &amp; Servis Berkala</li>
                <li>Ganti Oli Mesin &amp; Filter</li>
                <li>Perbaikan Kaki-kaki &amp; Rem</li>
                <li>Overhaul Mesin &amp; Kopling</li>
                <li>Kelistrikan &amp; AC Mobil</li>
              </ul>
            </div>

            {/* Col 3: Informasi Akademik */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kredit Sistem Digital</div>
              <div className="space-y-1 text-slate-600 leading-relaxed">
                <p><strong>Aplikasi:</strong> ShiftGear / OnderdilEngine</p>
                <p><strong>Penyusun:</strong> Apliy Tridiansyah Rosdiana</p>
                <p><strong>NIM:</strong> 20240810111 (TINFC-2024-01)</p>
                <p><strong>Dosen:</strong> Fitra Nugraha, S.Kom., M.Kom.</p>
                <p className="text-[11px] text-slate-500">Teknik Informatika &bull; Universitas Kuningan (2026)</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2 text-center sm:text-left">
            <div>
              &copy; 2026 PT Anugrah Motor / Bengkel Anugrah Motor Kuningan. All rights reserved.
            </div>
            <div>
              Didukung oleh Sistem Manajemen Bengkel Digital ShiftGear.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
