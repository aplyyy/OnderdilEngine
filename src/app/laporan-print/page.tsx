"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LaporanPrintPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 print:p-0 print:bg-white font-sans">
      {/* Action Bar (Hidden when printed) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-slate-900 text-xs">
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-slate-500 font-medium">Format Baku Laporan A4 &bull; Times New Roman</span>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan Sebagai PDF</span>
          </button>
        </div>
      </div>

      {/* A4 Paper Container */}
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-16 rounded-xl shadow-xl print:shadow-none print:p-0 print:m-0 font-serif text-[12pt] leading-[1.5]">
        {/* COVER PAGE */}
        <div className="min-h-[85vh] flex flex-col justify-between text-center pb-12 print:page-break-after">
          <div>
            <div className="text-xl font-bold uppercase tracking-wider">
              LAPORAN PROJEK MANDIRI
            </div>
            <div className="text-lg font-bold mt-1">MATA KULIAH KEAMANAN CYBER</div>
            <div className="text-sm mt-3 font-normal">
              Dosen Pengampu: Fitra Nugraha, S.Kom., M.Kom.
            </div>
          </div>

          <div className="my-12">
            <img
              src="/logo-uniku.png"
              alt="Logo Universitas Kuningan"
              className="w-44 h-auto mx-auto"
            />
          </div>

          <div>
            <div className="text-sm mb-8 space-y-1">
              <p>Disusun Oleh:</p>
              <p className="font-bold text-base">
                Apliy Tridiansyah Rosdiana
              </p>
              <p>NIM: 20240810111</p>
              <p>Kelas: TINFC-2024-01</p>
            </div>

            <div className="font-bold text-base uppercase leading-snug">
              PROGRAM STUDI TEKNIK INFORMATIKA
              <br />
              FAKULTAS ILMU KOMPUTER
              <br />
              UNIVERSITAS KUNINGAN
              <br />
              2026
            </div>
          </div>
        </div>

        {/* ISI LAPORAN */}
        <div className="pt-8 border-t print:border-none space-y-6">
          <section>
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              1. URL APLIKASI AKTIF (ONLINE &amp; HTTPS)
            </h2>
            <p className="text-justify text-[11pt] mb-2">
              Aplikasi telah saya pasang dan jalankan secara online sehingga dapat diakses dan diuji langsung melalui browser dengan koneksi aman (HTTPS):
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>URL Publik Utama (Deployment Vercel Cloud):</strong>
                <br />
                <a
                  href="https://onderdil-engine.vercel.app/"
                  target="_blank"
                  className="text-blue-700 underline"
                >
                  https://onderdil-engine.vercel.app/
                </a>
              </li>
              <li>
                <strong>URL Alternatif (Mirror Cloudflare Tunnel):</strong>
                <br />
                <a
                  href="https://onderdil-engine.trycloudflare.com/"
                  target="_blank"
                  className="text-blue-700 underline"
                >
                  https://onderdil-engine.trycloudflare.com/
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              2. URL REPOSITORY SOURCE CODE (GITHUB)
            </h2>
            <p className="text-justify text-[11pt] mb-2">
              Seluruh kode sumber aplikasi, riwayat commit pengerjaan, dan konfigurasi sistem tersimpan secara rapi pada repositori GitHub publik:
            </p>
            <ul className="list-disc pl-6 text-[11pt]">
              <li>
                <strong>Tautan Repositori GitHub:</strong>
                <br />
                <a
                  href="https://github.com/aplyyy/OnderdilEngine"
                  target="_blank"
                  className="text-blue-700 underline"
                >
                  https://github.com/aplyyy/OnderdilEngine
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              3. AKUN UJI COBA (TESTING CREDENTIALS)
            </h2>
            <p className="text-justify text-[11pt] mb-2">
              Untuk memudahkan Bapak Dosen dalam menguji pembagian hak akses (Role-Based Access Control) pada aplikasi ini, saya menyediakan tiga akun pengujian sesuai tingkatan perannya. Selain memasukkan secara manual, pada halaman <code>/login</code> juga sudah saya sediakan tombol <em>1-Click Demo</em> agar proses masuk ke akun uji coba dapat dilakukan dengan cepat:
            </p>
            <table className="w-full border-collapse border border-black text-[10pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-2 text-left">Peran (Role)</th>
                  <th className="border border-black p-2 text-left">Username</th>
                  <th className="border border-black p-2 text-left">Password</th>
                  <th className="border border-black p-2 text-left">Hak Akses &amp; Wewenang</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold">Administrator</td>
                  <td className="border border-black p-2 font-mono">admin</td>
                  <td className="border border-black p-2 font-mono">admin / AdminBengkel#2026</td>
                  <td className="border border-black p-2">
                    Akses penuh master suku cadang, rekap laporan omzet, audit log, dan hapus data.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Kasir</td>
                  <td className="border border-black p-2 font-mono">kasir</td>
                  <td className="border border-black p-2 font-mono">kasir / KasirBengkel#2026</td>
                  <td className="border border-black p-2">
                    Transaksi kasir POS, input servis mobil masuk, hitung kembalian, dan cetak faktur.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Mekanik</td>
                  <td className="border border-black p-2 font-mono">mekanik</td>
                  <td className="border border-black p-2 font-mono">mekanik / MekanikBengkel#2026</td>
                  <td className="border border-black p-2">
                    Antrean pengerjaan servis (Kanban), catatan teknis montir, dan pemakaian sparepart.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              4. PENJELASAN APLIKASI (ONDERDILENGINE)
            </h2>
            <p className="text-justify text-[11pt]">
              <strong>• Latar Belakang dan Tujuan:</strong>
              <br />
              Ide pembuatan aplikasi <strong>OnderdilEngine</strong> ini berawal dari pengamatan saya terhadap masalah operasional yang sering dihadapi bengkel mobil konvensional. Pencatatan menggunakan nota kertas seringkali tercecer, stok barang fisik di gudang kerap tidak cocok dengan buku catatan, dan kasir kesulitan merekap pembagian antara biaya suku cadang dengan ongkos kerja mekanik.
            </p>
            <p className="text-justify text-[11pt]">
              Sebagai mahasiswa Teknik Informatika yang mengambil mata kuliah Keamanan Cyber, fokus utama saya adalah memastikan sistem kasir ini tidak hanya berjalan lancar, namun juga aman dari serangan siber umum berbasis OWASP Top 10. Data transaksi dan katalog suku cadang merupakan aset penting, sehingga saya mengimplementasikan proteksi terhadap SQL Injection pada pencarian part, pencegahan pencurian token sesi kasir (anti-XSS), pengamanan hak akses antar peran (RBAC), serta rate limiting untuk mencegah serangan brute force.
            </p>

            <p className="text-justify text-[11pt]">
              <strong>• Fitur-Fitur Utama Aplikasi:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[11pt] text-justify">
              <li>
                <strong>Sistem Autentikasi &amp; RBAC:</strong> Memisahkan hak akses 3 level (Admin, Kasir, Mekanik). Password di-hash menggunakan <code>bcrypt</code>, dan sesi diamankan menggunakan token JWT yang disimpan pada cookie berstatus <em>HttpOnly</em> dan <em>Secure</em>.
              </li>
              <li>
                <strong>Kasir Point-of-Sale (POS) &amp; Cetak Faktur:</strong> Pencarian suku cadang kilat, penggabungan otomatis biaya part dengan ongkos jasa montir, hitung kembalian instan, dan pencetakan nota digital/thermal receipt.
              </li>
              <li>
                <strong>Papan Alur Servis Mekanik (Kanban):</strong> Pemantauan status kendaraan dari <em>Menunggu</em> &rarr; <em>Sedang Dikerjakan</em> &rarr; <em>Selesai</em> &rarr; <em>Lunas</em>, dilengkapi input catatan teknis dan pengurangan stok part otomatis.
              </li>
              <li>
                <strong>Manajemen Stok Suku Cadang:</strong> Pengelolaan SKU, harga beli, harga jual, dan fitur <em>Low Stock Alert</em> jika kuantitas barang menipis (&le; 5 unit).
              </li>
              <li>
                <strong>Laporan Penjualan &amp; Ekspor CSV:</strong> Menampilkan ringkasan total omzet bengkel, rincian laba part dan jasa montir, serta ekspor file data transaksi ke format CSV untuk Excel.
              </li>
            </ul>

            <p className="text-justify text-[11pt]">
              <strong>• Arsitektur dan Teknologi yang Digunakan:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>Framework:</strong> Next.js versi 16 (App Router) berbasis Node.js dan TypeScript.
              </li>
              <li>
                <strong>Database &amp; ORM:</strong> SQLite yang dikelola via Prisma ORM dengan prepared statements otomatis untuk menangkal SQL Injection.
              </li>
              <li>
                <strong>Kriptografi:</strong> bcryptjs (Password Hashing) dan jose (Signed JWT Token).
              </li>
              <li>
                <strong>Proteksi Header:</strong> Middleware Next.js (Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff).
              </li>
              <li>
                <strong>Desain Antarmuka:</strong> Tailwind CSS dengan tampilan modern, kontras bersih, dan responsif dari layar handphone hingga desktop.
              </li>
            </ul>

            <p className="text-justify text-[11pt]">
              <strong>• Penerapan Aspek Keamanan pada Aplikasi:</strong>
            </p>
            <table className="w-full border-collapse border border-black text-[10pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-2 text-left">Aspek Keamanan</th>
                  <th className="border border-black p-2 text-left">Komponen / File</th>
                  <th className="border border-black p-2 text-left">Tujuan &amp; Mekanisme Pengamanan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold">Password Hashing</td>
                  <td className="border border-black p-2 font-mono">src/app/api/auth/login</td>
                  <td className="border border-black p-2">
                    Password disimpan dalam bentuk digest hash searah dengan salt via bcrypt; tahan serangan rainbow table.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">JWT HttpOnly Cookie</td>
                  <td className="border border-black p-2 font-mono">src/lib/auth.ts</td>
                  <td className="border border-black p-2">
                    Token otentikasi disimpan di cookie HttpOnly sehingga kebal dari pencurian script JavaScript (anti-XSS).
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Prepared Statements</td>
                  <td className="border border-black p-2 font-mono">prisma/schema.prisma</td>
                  <td className="border border-black p-2">
                    Memisahkan logika query SQL dari parameter input pengguna; 100% kebal terhadap SQL Injection.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">RBAC Middleware</td>
                  <td className="border border-black p-2 font-mono">src/middleware.ts</td>
                  <td className="border border-black p-2">
                    Mencegah eskalasi hak akses; peran non-admin langsung diblokir (HTTP 403) jika memanggil endpoint administratif.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Rate Limiting</td>
                  <td className="border border-black p-2 font-mono">src/lib/rate-limit.ts</td>
                  <td className="border border-black p-2">
                    Membatasi percobaan login maksimal 5 kali per menit per IP untuk menangkal brute force tebak kata sandi.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Security Headers</td>
                  <td className="border border-black p-2 font-mono">src/middleware.ts</td>
                  <td className="border border-black p-2">
                    X-Frame-Options: DENY (anti-clickjacking), nosniff, dan Content-Security-Policy terpasang aktif.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI
            </h2>
            <p className="text-justify text-[11pt]">
              Projek ini memiliki potensi yang sangat baik untuk saya kembangkan lebih lanjut menjadi topik Skripsi / Tugas Akhir di semester akhir nanti, dengan usulan judul:
            </p>
            <p className="text-center font-bold text-[11pt] my-2">
              &ldquo;Rancang Bangun Sistem Informasi Kasir dan Antrean Servis Bengkel Mobil Berbasis Web dengan Penerapan Role-Based Access Control dan Analisis Pengendalian Stok Suku Cadang&rdquo;
            </p>

            <p className="font-bold text-[11pt]">Rumusan Masalah yang Direncanakan:</p>
            <ol className="list-decimal pl-6 space-y-1 text-[11pt] text-justify">
              <li>
                Bagaimana merancang sistem kasir dan antrean servis kendaraan yang saling terintegrasi agar meminimalisir kesalahan perhitungan biaya serta mencegah selisih stok suku cadang fisik di gudang?
              </li>
              <li>
                Bagaimana menerapkan mekanisme keamanan Role-Based Access Control (RBAC) dan perlindungan SQL Injection untuk memastikan data transaksi keuangan dan hak akses bengkel terlindungi dengan baik?
              </li>
              <li>
                Bagaimana merancang fitur rekapitulasi data penjualan suku cadang agar dapat membantu pemilik bengkel dalam memantau omzet serta merencanakan pengadaan barang secara tepat waktu?
              </li>
            </ol>

            <p className="text-justify text-[11pt]">
              <strong>Rencana Fitur Tambahan untuk Skripsi:</strong>
              <br />
              Integrasi pengiriman bukti nota servis langsung ke WhatsApp pelanggan secara otomatis saat transaksi lunas, penambahan metode pembayaran QRIS dinamis, dan fitur cetak nota langsung ke printer thermal bluetooth kasir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)
            </h2>
            <p className="text-justify text-[11pt]">
              Sesuai ketentuan pedoman tugas (Poin 3e), dalam pengerjaan projek mandiri ini saya memanfaatkan bantuan asisten AI (Google Antigravity) secara terbuka dan etis sebagai sarana belajar serta pembantu penulisan kode:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>Bagian Pengerjaan yang Dibantu AI:</strong> Merancang struktur relasi tabel database di Prisma ORM (User, Sparepart, ServiceOrder, Transaction, SecurityLog), mencari contoh implementasi fungsi hashing password bcrypt dan token JWT, serta menyusun layout antarmuka kasir dengan Tailwind CSS.
              </li>
              <li>
                <strong>Contoh Prompt yang Saya Gunakan:</strong>
                <br />
                <em>
                  &ldquo;Tolong bantu buatkan rute API kasir di Next.js menggunakan Prisma transaction: hitung total harga suku cadang ditambah ongkos servis, kurangi stok fisik suku cadang secara aman dari race condition, buatkan nomor faktur nota unik, dan tolak pembayaran jika uang yang dibayarkan kurang.&rdquo;
                </em>
              </li>
              <li>
                <strong>Metode Verifikasi Mahasiswa:</strong> Setiap baris kode yang disarankan AI diperiksa kembali secara manual untuk memastikan fungsinya benar, query database aman dari injeksi, tidak ada celah keamanan atau kredensial yang bocor, serta divalidasi melalui perintah <code>npm run build</code> dengan hasil seluruh rute (18/18) terkompilasi tanpa kesalahan.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              7. HASIL SELF-TESTING KEAMANAN (7 SKENARIO PENGUJIAN)
            </h2>
            <table className="w-full border-collapse border border-black text-[9.5pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-1.5 text-center">No</th>
                  <th className="border border-black p-1.5 text-left">Skenario Pengujian</th>
                  <th className="border border-black p-1.5 text-left">Metode &amp; Payload Uji</th>
                  <th className="border border-black p-1.5 text-center">Hasil</th>
                  <th className="border border-black p-1.5 text-left">Analisis &amp; Mitigasi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1.5 text-center">1</td>
                  <td className="border border-black p-1.5">SQL Injection pada pencarian part</td>
                  <td className="border border-black p-1.5 font-mono">Payload: &apos; OR &apos;1&apos;=&apos;1&apos; --</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Parameterized query Prisma ORM memperlakukan payload sebagai teks string murni.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">2</td>
                  <td className="border border-black p-1.5">Stored Cross-Site Scripting (XSS)</td>
                  <td className="border border-black p-1.5 font-mono">Payload: &lt;script&gt;alert(1)&lt;/script&gt;</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    HTML entity encoding dan React JSX escaping mencegah script berbahaya dieksekusi browser.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">3</td>
                  <td className="border border-black p-1.5">Broken Access Control &amp; IDOR</td>
                  <td className="border border-black p-1.5">Akun Mekanik panggil rute admin /api/security-logs</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Middleware otorisasi memeriksa role pada JWT dan memblokir dengan status HTTP 403 Forbidden.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">4</td>
                  <td className="border border-black p-1.5">Brute Force Login &amp; Rate Limit</td>
                  <td className="border border-black p-1.5">Percobaan login salah 6x berurutan &lt; 1 menit</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Rate limiter in-memory memblokir request ke-6 dengan respon HTTP 429 Too Many Requests.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">5</td>
                  <td className="border border-black p-1.5">Validasi Kata Sandi Lemah</td>
                  <td className="border border-black p-1.5">Pendaftaran sandi pendek (&quot;123&quot;)</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Validasi skema Zod pada backend menolak pendaftaran kata sandi kurang dari 8 karakter.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">6</td>
                  <td className="border border-black p-1.5">Audit Security Headers</td>
                  <td className="border border-black p-1.5 font-mono">curl.exe -s -I http://localhost:3000</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Server menyertakan proteksi lengkap: X-Frame-Options: DENY, nosniff, dan CSP aktif.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">7</td>
                  <td className="border border-black p-1.5">Pencegahan Kebocoran Secret</td>
                  <td className="border border-black p-1.5">Audit git log &amp; .gitignore</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    File .env berisi kredensial dan JWT secret tidak ikut terunggah ke repositori publik GitHub.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-[11pt]">
              <li>
                <strong>Bukti HTTPS &amp; Domain Aktif:</strong> Aplikasi telah online dengan protokol aman HTTPS pada URL Vercel.
              </li>
              <li>
                <strong>Bukti Fungsional Kasir POS &amp; Cetak Nota:</strong> Modul kasir berhasil memproses transaksi suku cadang dan ongkos jasa montir secara real-time serta menghasilkan nota siap cetak.
              </li>
              <li>
                <strong>Bukti Papan Kanban Servis &amp; Master Stok:</strong> Mekanik dapat memperbarui status pengerjaan mobil, dan master suku cadang menampilkan indikator <em>Low Stock Alert</em> ketika kuantitas menipis.
              </li>
              <li>
                <strong>Bukti Repository &amp; Commit Bertahap:</strong> Histori commit bertahap telah terverifikasi pada repositori GitHub <code>https://github.com/aplyyy/OnderdilEngine</code>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              9. KENDALA DAN RENCANA PERBAIKAN
            </h2>
            <p className="font-bold text-[11pt]">
              • Kendala yang Dihadapi Selama Pengerjaan:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <em>Kompilasi CSS Tailwind v4:</em> Terjadi kendala rendering styling utilitas pada awal konfigurasi Next.js 16. Kendala ini diselesaikan dengan memasang paket <code>@tailwindcss/postcss</code> serta menyesuaikan konfigurasi PostCSS.
              </li>
              <li>
                <em>Pencegahan Selisih Stok (Race Condition):</em> Mengatasi potensi selisih stok barang jika terjadi transaksi bersamaan dengan menerapkan transaksi atomik <code>prisma.$transaction</code>.
              </li>
            </ul>

            <p className="font-bold text-[11pt]">
              • Rencana Perbaikan Mendatang:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <em>Integrasi Pembayaran QRIS:</em> Menambahkan gerbang pembayaran otomatis berbasis QRIS dinamis.
              </li>
              <li>
                <em>Kirim Nota via WhatsApp:</em> Mengirimkan bukti faktur transaksi servis langsung ke kontak WhatsApp pelanggan sesaat setelah pembayaran lunas.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
