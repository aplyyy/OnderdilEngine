"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LaporanPrintPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 print:p-0 print:bg-white">
      {/* Action Bar (Hidden when printed) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-slate-900 text-xs">
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>

        <div className="flex items-center space-x-3">
          <span className="text-slate-500 font-medium">Siap Cetak A4 / Export PDF</span>
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
      <div className="max-w-4xl mx-auto bg-white p-12 sm:p-16 rounded-xl shadow-2xl print:shadow-none print:p-0 print:m-0 font-serif text-[12pt] leading-[1.6]">
        {/* COVER PAGE */}
        <div className="min-h-[85vh] flex flex-col justify-between text-center pb-12 print:page-break-after">
          <div>
            <div className="text-xl font-bold uppercase tracking-wider">
              LAPORAN PROJEK
            </div>
            <div className="text-lg font-bold mt-1">KEAMANAN CYBER</div>
            <div className="text-sm mt-3 font-normal">
              Dosen pengampu: Fitra Nugraha, S.Kom., M.Kom.
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
              <p>Disusun oleh:</p>
              <p className="font-bold text-base">
                Apliy Tridiansyah Rosdiana (20240810111)
              </p>
              <p>TINFC-2024-01</p>
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
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>URL Publik Utama (Cloud Hosting):</strong>
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
                <strong>URL Alternatif (Cloudflare Tunnel Mirror):</strong>
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
            <ul className="list-disc pl-6 text-[11pt]">
              <li>
                <strong>Repository Publik GitHub:</strong>
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
            <table className="w-full border-collapse border border-black text-[10pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-2 text-left">Peran (Role)</th>
                  <th className="border border-black p-2 text-left">Username</th>
                  <th className="border border-black p-2 text-left">Password</th>
                  <th className="border border-black p-2 text-left">Wewenang Akses</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold">Administrator</td>
                  <td className="border border-black p-2 font-mono">admin</td>
                  <td className="border border-black p-2 font-mono">AdminBengkel#2026</td>
                  <td className="border border-black p-2">
                    Akses penuh master part, laporan keuangan, hapus data
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Kasir (POS)</td>
                  <td className="border border-black p-2 font-mono">kasir</td>
                  <td className="border border-black p-2 font-mono">KasirBengkel#2026</td>
                  <td className="border border-black p-2">
                    Transaksi POS kasir, input kendaraan servis, cetak nota
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Mekanik</td>
                  <td className="border border-black p-2 font-mono">mekanik</td>
                  <td className="border border-black p-2 font-mono">MekanikBengkel#2026</td>
                  <td className="border border-black p-2">
                    Board antrean servis (Kanban), catatan teknis, pasang part
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
              OnderdilEngine (Automotive Point-of-Sale &amp; Workshop Management
              System) dikembangkan untuk menjawab kebutuhan digitalisasi operasional
              bengkel otomotif modern yang rentan terhadap ancaman siber. Banyak sistem
              kasir konvensional rentan terhadap ancaman seperti kebocoran basis data
              suku cadang melalui SQL Injection (SQLi), manipulasi nota dan harga servis
              (IDOR), pencurian token sesi kasir melalui Cross-Site Scripting (XSS),
              serta serangan brute force pada formulir login. OnderdilEngine dibangun
              dengan paradigma <em>Security by Design</em> berbasis standar OWASP Top
              10 untuk menjamin kerahasiaan, integritas data transaksi, dan ketersediaan
              layanan tanpa mengorbankan kecepatan transaksi kasir.
            </p>

            <p className="text-justify text-[11pt]">
              <strong>• Fitur Utama Aplikasi:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-[11pt] text-justify">
              <li>
                <strong>Autentikasi &amp; Otorisasi RBAC:</strong> Pembagian wewenang
                ketat untuk 3 level pengguna (Admin, Kasir, Mekanik) menggunakan signed
                JWT yang disimpan pada cookie bertanda <em>HttpOnly</em>, <em>Secure</em>,
                dan <em>SameSite=Lax</em>. Kata sandi diamankan menggunakan fungsi
                hashing kriptografi <em>bcrypt</em> (cost factor 10), serta proteksi
                rate limiting untuk mencegah serangan brute force.
              </li>
              <li>
                <strong>Kasir Point-of-Sale (POS) &amp; Cetak Faktur:</strong> Pencarian
                suku cadang instan, kalkulasi otomatis penggabungan biaya part dan ongkos
                jasa montir, perhitungan kembalian uang tunai, serta modul pencetakan
                nota digital/cetak fisik berstandar printer struk kasir (thermal
                receipt).
              </li>
              <li>
                <strong>Sirkulasi Antrean Servis Kendaraan (Kanban Board):</strong>{" "}
                Manajemen status kendaraan dari antrean <em>Menunggu</em> &rarr;{" "}
                <em>Sedang Dikerjakan</em> &rarr; <em>Selesai</em> &rarr; <em>Lunas</em>,
                dilengkapi catatan penanganan teknis montir dan pengurangan stok
                sparepart fisik secara otomatis.
              </li>
              <li>
                <strong>Master Inventaris Suku Cadang:</strong> Pengelolaan data suku
                cadang (SKU, harga beli/jual, kuantitas) dilengkapi fitur peringatan
                dini suku cadang menipis (<em>Low Stock Alert</em> &le; 5 unit).
              </li>
              <li>
                <strong>Laporan &amp; Ekspor Finansial:</strong> Ringkasan omzet
                harian/bulanan, akumulasi margin keuntungan, serta fitur ekspor laporan
                penjualan resmi ke dalam format CSV dan PDF.
              </li>
            </ul>

            <p className="text-justify text-[11pt]">
              <strong>• Arsitektur &amp; Tumpukan Teknologi (Technology Stack):</strong>
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>Backend Runtime:</strong> Node.js (v24 LTS) dengan framework
                Next.js 15 (App Router) berbasis TypeScript.
              </li>
              <li>
                <strong>Basis Data:</strong> SQLite (Lokal) / PostgreSQL (Cloud) yang
                dikelola menggunakan Prisma ORM dengan <em>Prepared Statements</em>{" "}
                otomatis.
              </li>
              <li>
                <strong>Kriptografi &amp; Sesi:</strong> bcryptjs (Password Hashing)
                dan jose (Signed JWT).
              </li>
              <li>
                <strong>Keamanan HTTP:</strong> Next.js Edge Middleware (HTTP Security
                Headers: CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff,
                HSTS) dan sliding window rate limiter.
              </li>
              <li>
                <strong>Desain Antarmuka:</strong> Desain modern utilitarian bertema
                gelap dengan Tailwind CSS v4.
              </li>
            </ul>

            <p className="text-justify text-[11pt]">
              <strong>• Rincian Penerapan Aspek Keamanan:</strong>
            </p>
            <table className="w-full border-collapse border border-black text-[10pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-2 text-left">Mekanisme</th>
                  <th className="border border-black p-2 text-left">Komponen / File</th>
                  <th className="border border-black p-2 text-left">Alasan &amp; Tujuan Proteksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold">Password Hashing</td>
                  <td className="border border-black p-2 font-mono">src/app/api/auth/login</td>
                  <td className="border border-black p-2">
                    Mencegah pencurian kredensial jika basis data bocor; tahan Rainbow Table.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">JWT HttpOnly Cookie</td>
                  <td className="border border-black p-2 font-mono">src/lib/auth.ts</td>
                  <td className="border border-black p-2">
                    Menangkal eksfiltrasi token otentikasi melalui serangan Cross-Site Scripting (XSS).
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Prepared Statements</td>
                  <td className="border border-black p-2 font-mono">prisma/schema.prisma</td>
                  <td className="border border-black p-2">
                    Memisahkan kode query database dan data input pengguna; 100% kebal SQL Injection.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">RBAC Middleware</td>
                  <td className="border border-black p-2 font-mono">src/middleware.ts</td>
                  <td className="border border-black p-2">
                    Mencegah eskalasi hak akses (Privilege Escalation) dan manipulasi parameter IDOR.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Rate Limiting</td>
                  <td className="border border-black p-2 font-mono">src/lib/rate-limit.ts</td>
                  <td className="border border-black p-2">
                    Menangkal serangan Brute Force pada login (maks. 5 percobaan per menit).
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Security Headers</td>
                  <td className="border border-black p-2 font-mono">src/middleware.ts</td>
                  <td className="border border-black p-2">
                    X-Frame-Options: DENY (anti Clickjacking), nosniff, dan CSP ketat.
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
              Aplikasi OnderdilEngine memiliki fondasi ilmiah dan fungsional yang kuat
              untuk dilanjutkan menjadi topik tugas akhir atau skripsi tingkat 4 dengan
              usulan judul:{" "}
              <strong>
                &quot;Rancang Bangun Sistem Point-of-Sale &amp; Manajemen Operasional
                Bengkel Otomotif Berbasis Zero-Trust Architecture dengan Algoritma
                Peramalan Kebutuhan Suku Cadang dan Audit Trail Anti-Tamper&quot;
              </strong>.
            </p>

            <p className="font-bold text-[11pt]">Rumusan Masalah yang Diangkat:</p>
            <ol className="list-decimal pl-6 space-y-1 text-[11pt] text-justify">
              <li>
                Bagaimana merancang mekanisme integritas catatan transaksi kasir dan
                alokasi suku cadang yang tahan manipulasi (anti-tamper log) menggunakan
                teknik <em>Cryptographic Hash Chaining</em> sehingga setiap potensi
                kecurangan pencatatan dapat diverifikasi secara matematis?
              </li>
              <li>
                Bagaimana mengimplementasikan algoritma peramalan deret waktu (
                <em>time-series forecasting</em>, seperti{" "}
                <em>Single Exponential Smoothing</em> atau{" "}
                <em>Weighted Moving Average</em>) berdasarkan riwayat data transaksi POS
                untuk memprediksi kebutuhan restock suku cadang musiman secara presisi?
              </li>
              <li>
                Bagaimana menerapkan algoritma pembelajaran mesin (
                <em>machine learning</em>) untuk mendeteksi anomali transaksi kasir
                (fraud detection) pada jam kerja montir dan selisih stok suku cadang?
              </li>
            </ol>

            <p className="text-justify text-[11pt]">
              <strong>Rencana Fitur Lanjutan:</strong>
              <br />
              Integrasi WhatsApp Gateway API resmi untuk pengingat servis berkala
              otomatis ke pelanggan, integrasi scanner OBD-II Bluetooth untuk
              diagnosis kode kerusakan mobil langsung ke tiket servis, serta payment
              gateway QRIS dinamis.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)
            </h2>
            <p className="text-justify text-[11pt]">
              Sesuai dengan ketentuan pedoman tugas (Poin 3e), pembuatan aplikasi ini
              memanfaatkan bantuan{" "}
              <strong>AI Agent (Antigravity by Google DeepMind)</strong> secara
              bertanggung jawab:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <strong>Rincian Pemanfaatan AI:</strong> Merancang skema relasional tabel
                Prisma, menulis middleware enkripsi JWT, verifikasi password bcrypt,
                sanitasi XSS, serta arsitektur layout sidebar modern.
              </li>
              <li>
                <strong>Contoh Prompt Utama:</strong>
                <br />
                <em>
                  &quot;Buatkan API checkout transaksi kasir POS bengkel mobil yang aman
                  di Next.js menggunakan Prisma $transaction: hitung otomatis akumulasi
                  suku cadang dan jasa montir, kurangi stok fisik suku cadang secara
                  aman dari race condition, generate nomor faktur unik, dan tolak jika
                  uang pembayaran kurang.&quot;
                </em>
              </li>
              <li>
                <strong>Metode Verifikasi Mahasiswa:</strong> Seluruh kode yang dihasilkan
                AI diverifikasi secara manual baris demi baris, diuji terhadap input
                berbahaya (SQLi &amp; XSS), serta divalidasi melalui{" "}
                <code>npm run build</code> dengan hasil{" "}
                <strong>18/18 routes lulus kompilasi tanpa error</strong>.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              7. HASIL SELF-TESTING KEAMANAN (MINIMAL 5 SKENARIO)
            </h2>
            <table className="w-full border-collapse border border-black text-[9.5pt] my-2">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-black p-1.5 text-center">No</th>
                  <th className="border border-black p-1.5 text-left">Skenario Uji</th>
                  <th className="border border-black p-1.5 text-left">Metode &amp; Payload Uji</th>
                  <th className="border border-black p-1.5 text-center">Hasil</th>
                  <th className="border border-black p-1.5 text-left">Tindakan / Mitigasi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1.5 text-center">1</td>
                  <td className="border border-black p-1.5">SQL Injection pada pencarian part</td>
                  <td className="border border-black p-1.5 font-mono">Payload: &apos; OR &apos;1&apos;=&apos;1&apos; --</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Parameterized query binding via Prisma ORM; input dianggap teks murni.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">2</td>
                  <td className="border border-black p-1.5">Stored Cross-Site Scripting (XSS)</td>
                  <td className="border border-black p-1.5 font-mono">Payload: &lt;script&gt;alert(1)&lt;/script&gt;</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    HTML entity encoding dan React Virtual DOM escaping mencegah eksekusi skrip.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">3</td>
                  <td className="border border-black p-1.5">Broken Access Control &amp; IDOR</td>
                  <td className="border border-black p-1.5">Akun Mekanik panggil rute admin /api/security-logs</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Middleware memverifikasi role JWT dan memblokir dengan status HTTP 403 Forbidden.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">4</td>
                  <td className="border border-black p-1.5">Brute Force Login &amp; Rate Limit</td>
                  <td className="border border-black p-1.5">Percobaan login salah 6x berurutan &lt; 1 menit</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    In-memory rate limiter memblokir request ke-6 dengan HTTP 429 Too Many Requests.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">5</td>
                  <td className="border border-black p-1.5">Validasi Kata Sandi Lemah</td>
                  <td className="border border-black p-1.5">Pendaftaran sandi pendek (&quot;123&quot;)</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Validasi skema Zod menolak pendaftaran kata sandi kurang dari 8 karakter.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">6</td>
                  <td className="border border-black p-1.5">Audit Security Headers</td>
                  <td className="border border-black p-1.5 font-mono">curl.exe -s -I http://localhost:3000</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Server menyematkan X-Frame-Options: DENY, nosniff, CSP, dan HSTS aktif.
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-1.5 text-center">7</td>
                  <td className="border border-black p-1.5">Pencegahan Kebocoran Secret</td>
                  <td className="border border-black p-1.5">Audit git log &amp; .gitignore</td>
                  <td className="border border-black p-1.5 text-center font-bold">LOLOS</td>
                  <td className="border border-black p-1.5">
                    Berkas .env berisi kredensial dikecualikan secara ketat dari repositori Git.
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
                <strong>Bukti HTTPS &amp; Domain Aktif:</strong> Aplikasi dihosting dengan
                protokol TLS 1.3 ber-sertifikat valid dan terenkripsi.
              </li>
              <li>
                <strong>Bukti Fungsional Kasir POS &amp; Cetak Nota:</strong> Transaksi
                kasir berhasil memproses kalkulasi harga sparepart dan ongkos servis
                montir secara real-time, dilengkapi pencetakan nota fisik.
              </li>
              <li>
                <strong>Bukti Papan Kanban Servis &amp; Master Stok:</strong> Mekanik
                dapat memperbarui status pengerjaan unit mobil, dan master suku cadang
                menampilkan indikator <em>Low Stock Alert</em> ketika kuantitas menipis.
              </li>
              <li>
                <strong>Bukti Repository &amp; Commit Bertahap:</strong> Histori commit
                bertahap telah terverifikasi pada repositori GitHub{" "}
                <code>https://github.com/aplyyy/OnderdilEngine</code>.
              </li>
              <li>
                <strong>Bukti Security Headers (Terminal):</strong> Hasil audit respon
                header <code>curl.exe -s -I http://localhost:3000/login</code>{" "}
                membuktikan seluruh header proteksi (CSP, X-Frame-Options, nosniff)
                aktif menyertai setiap respon server.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2">
              9. KENDALA DAN RENCANA PERBAIKAN
            </h2>
            <p className="font-bold text-[11pt]">
              • Kendala Teknis yang Berhasil Diatasi:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <em>Kompilasi CSS Tailwind v4:</em> Terjadi kegagalan render styling
                utility class pada awal integrasi Next.js 16. Kendala ini diselesaikan
                secara tuntas dengan memasang paket <code>@tailwindcss/postcss</code>{" "}
                serta mengonfigurasi berkas <code>postcss.config.mjs</code>.
              </li>
              <li>
                <em>Proteksi Stok dari Race Condition:</em> Mengatasi potensi selisih
                kuantitas stok barang saat kasir memproses transaksi secara simultan
                dengan menerapkan transaksi atomik <code>prisma.$transaction</code>.
              </li>
            </ul>

            <p className="font-bold text-[11pt]">
              • Rencana Perbaikan Mendatang:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-[11pt]">
              <li>
                <em>Integrasi Payment Gateway:</em> Menambahkan gerbang pembayaran
                otomatis menggunakan QRIS dinamis dan Virtual Account via Midtrans.
              </li>
              <li>
                <em>Kirim Nota via WhatsApp:</em> Mengirimkan salinan faktur transaksi
                servis langsung ke kontak WhatsApp pelanggan sesaat setelah pembayaran
                berhasil dikonfirmasi.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
