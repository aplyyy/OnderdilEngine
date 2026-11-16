# LAPORAN PROJEK KEAMANAN CYBER
**PENGEMBANGAN & PENGAMANAN APLIKASI WEB SISTEM POINT-OF-SALE (POS) & MANAJEMEN OPERASIONAL BENGKEL MOBIL "ONDERDILENGINE"**

* **Mata Kuliah:** Keamanan Cyber
* **Dosen Pengampu:** Fitra Nugraha, S.Kom., M.Kom.
* **Disusun Oleh:**
  * **Nama:** Apliy Tridiansyah Rosdiana
  * **NIM:** 20240810111
  * **Kelas:** TINFC-2024-01
* **Program Studi:** Teknik Informatika
* **Fakultas:** Fakultas Ilmu Komputer
* **Institusi:** Universitas Kuningan
* **Tahun:** 2026

---

## 1. URL APLIKASI AKTIF (ONLINE & HTTPS)
* **URL Publik Utama (Cloud Hosting):**  
  `https://onderdil-engine.vercel.app/`
* **URL Alternatif (Cloudflare Tunnel Mirror):**  
  `https://onderdil-engine.trycloudflare.com/`

---

## 2. URL REPOSITORY SOURCE CODE (GITHUB)
* **Repository Publik GitHub:**  
  `https://github.com/Apliy3Dyansyah/OnderdilEngine`

---

## 3. AKUN UJI COBA (TESTING CREDENTIALS)
Untuk mempermudah dosen penguji dalam menguji seluruh fungsi hak akses (*Role-Based Access Control*), disediakan akun uji coba berikut (tersedia pula fitur *1-Click Demo Login* pada antarmuka `/login`):

| Peran (Role) | Username | Password | Wewenang & Hak Akses |
|---|---|---|---|
| **Administrator (Manajer)** | `admin` | `AdminBengkel#2026` | Kontrol penuh master inventaris suku cadang, rekap laporan finansial, audit log, serta penghapusan data |
| **Kasir (Service Advisor)** | `kasir` | `KasirBengkel#2026` | Transaksi kasir POS, pendaftaran kendaraan servis masuk, kalkulasi total belanja & kembalian, cetak nota |
| **Mekanik (Teknisi)** | `mekanik` | `MekanikBengkel#2026` | Papan antrean servis (Kanban), update status kendaraan, input catatan teknis montir, & pemasangan sparepart |

---

## 4. PENJELASAN APLIKASI (ONDERDILENGINE)

### A. Latar Belakang dan Tujuan
**OnderdilEngine** (*Automotive Point-of-Sale & Workshop Management System*) dikembangkan untuk menjawab kebutuhan digitalisasi operasional bengkel mobil modern yang mengutamakan kecepatan transaksi kasir, kepastian stok suku cadang, dan pelacakan unit servis. Dalam praktiknya, banyak aplikasi web kasir konvensional rentan terhadap ancaman siber seperti injeksi basis data (*SQL Injection*), manipulasi nota dan harga servis (*Insecure Direct Object Reference* / IDOR), pencurian token sesi kasir melalui *Cross-Site Scripting* (XSS), serta serangan *brute force* pada formulir login.

OnderdilEngine dirancang menggunakan prinsip **Security by Design** dan standar mitigasi **OWASP Top 10**. Sistem menerapkan perlindungan berlapis pada seluruh tingkatan (*defense-in-depth*) mulai dari validasi ketat, sanitasi input, tokenisasi sesi berbasis *cryptographic signature*, hingga konfigurasi *security headers* tanpa mengorbankan kenyamanan kasir dan mekanik.

### B. Fitur Utama Aplikasi
1. **Autentikasi & Otorisasi Berbasis Peran (RBAC):**
   - Pemisahan 3 hak akses (`ADMIN`, `KASIR`, `MEKANIK`).
   - Password di-hash menggunakan algoritma `bcrypt` dengan *cost factor* $\ge 10$.
   - Sesi login terisolasi dalam *Signed JWT* yang disimpan pada *Cookie* bertanda `HttpOnly`, `Secure`, dan `SameSite=Lax`.
   - Proteksi *Rate Limiting* (maksimal 5 percobaan gagal per menit) untuk menangkal serangan *brute force*.
2. **Kasir Point-of-Sale (POS) Cepat:**
   - Katalog suku cadang interaktif dengan pencarian instan dan filter kategori (Oli, Filter, Rem, Pengapian, Kelistrikan, Aksesoris).
   - Penggabungan otomatis biaya pembelian sparepart dengan ongkos jasa servis mekanik.
   - Perhitungan diskon, total tagihan, uang tunai diterima, dan nominal kembalian secara otomatis.
   - Pembuatan faktur digital dengan nomor unik (`INV-YYYYMMDD-XXXX`) dan modal siap cetak (*thermal printable POS format*).
3. **Manajemen Servis Kendaraan (Kanban Board):**
   - Pelacakan alur kerja kendaraan: `MENUNGGU` &rarr; `SEDANG DIKERJAKAN` &rarr; `SELESAI` &rarr; `LUNAS`.
   - Pencatatan nomor polisi kendaraan, tipe mobil, nama pemilik, nomor kontak, serta keluhan kerusakan.
   - Form pencatatan teknis mekanik dan alokasi pemakaian suku cadang fisik yang secara otomatis mengurangi stok gudang.
4. **Master Inventaris Suku Cadang (CRUD):**
   - Pengelolaan kode SKU, harga modal/beli, harga jual konsumen, serta batas peringatan stok minimum (*Low Stock Alert* $\le$ batas aman).
5. **Laporan Rekapitulasi & Ekspor Data:**
   - Dashboard ringkasan omzet, margin penjualan suku cadang vs pendapatan jasa montir, dan daftar barang kritis.
   - Kemampuan **Ekspor Data Transaksi ke Format CSV** dan cetak rekapitulasi penjualan.
6. **Desain Antarmuka Utilitarian Otomotif:**
   - Navigasi *Sidebar* tetap profesional bertema *dark slate* (`#0B0F19`) dengan aksen mekanikal *amber* dan *racing red*, tipografi monospaced untuk angka dan nomor nota, serta tata letak responsif ponsel hingga desktop.

### C. Arsitektur & Tumpukan Teknologi (Technology Stack)
* **Backend & Runtime:** Node.js v24 LTS dengan framework **Next.js 15 (App Router)** berbasis TypeScript.
* **Basis Data:** SQLite (Development) / PostgreSQL (Production) dikelola menggunakan **Prisma ORM** dengan *Parameterized Queries* / *Prepared Statements*.
* **Kriptografi & Sesi:** `bcryptjs` (Password Hashing) dan `jose` (Signed JWT Token).
* **Validasi Skema:** `zod` untuk memastikan integritas tipe data input API.
* **Desain Antarmuka:** Tailwind CSS v4 dengan PostCSS compiler dan `lucide-react` icons.
* **Keamanan HTTP:** Next.js Edge Middleware menginjeksi header proteksi (CSP, X-Frame-Options, nosniff, HSTS).

### D. Rincian Penerapan Aspek Keamanan

| No | Mekanisme Keamanan | Komponen / Lokasi File | Alasan & Tujuan Proteksi |
|---|---|---|---|
| 1 | **Password Hashing (bcrypt)** | `src/app/api/auth/login/route.ts` | Menyimpan kata sandi dalam bentuk digest searah yang tahan terhadap serangan *Rainbow Table* dan *dictionary attack*. |
| 2 | **JWT HttpOnly & Secure Cookie** | `src/lib/auth.ts` | Mencegah pembacaan dan eksfiltrasi token sesi pengguna melalui serangan JavaScript berbahaya (XSS document.cookie). |
| 3 | **Prepared Statements (Anti-SQLi)** | `prisma/schema.prisma` & API routes | Memisahkan query database dari input user; 100% kebal terhadap injeksi SQL pada kolom pencarian part dan nomor polisi. |
| 4 | **Role-Based Access Control (RBAC)** | `src/middleware.ts` | Mencegah eskalasi hak akses (*Privilege Escalation*) dan IDOR; peran non-admin diblokir (HTTP 403) dari rute sensitif. |
| 5 | **Rate Limiting (5 req / menit)** | `src/lib/rate-limit.ts` | Mengunci sementara percobaan login berulang untuk menangkal serangan *Brute Force* dan *Credential Stuffing*. |
| 6 | **Input Sanitization & Output Encoding** | `src/lib/security.ts` | Melakukan *HTML entity encoding* pada keluhan servis guna mencegah eksekusi skrip berbahaya (*Stored XSS*). |
| 7 | **Security Headers (CSP, Anti-Clickjacking)** | `src/middleware.ts` | Mengonfigurasi `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan `Content-Security-Policy` ketat. |
| 8 | **Isolasi Secret (.gitignore)** | `.gitignore`, `.env.example` | Mencegah kebocoran kredensial database dan JWT secret ke repositori Git publik. |
| 9 | **Atomic Database Transactions** | `src/app/api/transactions/route.ts` | Menggunakan `prisma.$transaction` untuk menjamin integritas pengurangan stok dan penerbitan faktur dari *race condition*. |

---

## 5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI

Aplikasi OnderdilEngine memiliki fondasi ilmiah dan praktis yang kuat untuk dilanjutkan sebagai topik Tugas Akhir / Skripsi tingkat 4 dengan usulan judul:

> **"Rancang Bangun Sistem Point-of-Sale & Manajemen Operasional Bengkel Otomotif Berbasis Zero-Trust Architecture dengan Algoritma Peramalan Stok Suku Cadang dan Audit Trail Anti-Tamper"**

### Rumusan Masalah yang Diangkat:
1. **Integritas Transaksi & Audit Trail Anti-Manipulasi:**  
   Bagaimana merancang mekanisme pencatatan log transaksi kasir dan alokasi suku cadang yang tahan manipulasi (*anti-tamper log*) menggunakan teknik *Cryptographic Hash Chaining* sehingga setiap kecurangan pencatatan dapat diverifikasi secara matematis?
2. **Peramalan Kebutuhan Suku Cadang (*Demand Forecasting*):**  
   Bagaimana mengimplementasikan algoritma peramalan deret waktu (*time-series forecasting*, misal *Single Exponential Smoothing* atau *Weighted Moving Average*) berdasarkan riwayat transaksi POS untuk memprediksi kebutuhan restock suku cadang musiman secara presisi?
3. **Deteksi Anomali Transaksi Kasir (*Fraud Detection*):**  
   Bagaimana menerapkan algoritma pembelajaran mesin (*Isolation Forest* atau *K-Means Clustering*) untuk mengidentifikasi anomali transaksi kasir yang mencurigakan (misal manipulasi jam kerja montir atau diskon tidak wajar)?

### Rencana Fitur Lanjutan:
* Integrasi *WhatsApp Gateway API* otomatis untuk pengingat servis kendaraan berkala berdasarkan kilometer mobil konsumen.
* Integrasi scanner *OBD-II Bluetooth* untuk diagnosis kode kerusakan kendaraan (*Diagnostic Trouble Code* / DTC) langsung ke formulir servis.

---

## 6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)
Sesuai ketentuan pedoman tugas (Poin 3e), pembuatan aplikasi ini memanfaatkan bantuan **AI Agent (Antigravity by Google DeepMind)** secara etis dan bertanggung jawab:

* **Rincian Pemanfaatan AI:**
  * **Perancangan Skema Basis Data:** Merancang skema relasional tabel Prisma (`User`, `Sparepart`, `ServiceOrder`, `Transaction`, `SecurityLog`).
  * **Penulisan Kode Keamanan:** Membantu penulisan fungsi hashing bcrypt, verifikasi token JWT jose, sanitasi XSS, serta in-memory sliding window rate limiter.
  * **Penyusunan Antarmuka Modern:** Menerapkan pedoman desain visual otomotif anti-slop, arsitektur sidebar responsif, dan modal cetak nota kasir.
  * **Debugging & Kompilasi:** Mengatasi kendala kompilasi CSS Tailwind v4 dan Next.js Turbopack engine.
* **Contoh Prompt Utama:**  
  *"Buatkan API checkout transaksi kasir POS bengkel mobil yang aman di Next.js menggunakan Prisma $transaction: hitung otomatis akumulasi suku cadang dan jasa montir, kurangi stok fisik suku cadang secara aman dari race condition, generate nomor faktur unik, dan tolak jika uang pembayaran kurang."*
* **Metode Verifikasi Mahasiswa:**  
  Seluruh kode yang dihasilkan AI diverifikasi baris demi baris, diuji terhadap input berbahaya (SQLi & XSS), dipastikan tidak memuat *hardcoded credentials*, serta diuji kelayakan *production build*-nya menggunakan `npm run build` dengan hasil **18/18 routes lulus kompilasi tanpa error**.

---

## 7. HASIL SELF-TESTING KEAMANAN (MINIMAL 5 SKENARIO)

| No | Skenario Uji Keamanan | Metode & Payload Uji | Hasil Uji | Tindakan / Mitigasi |
|---|---|---|---|---|
| 1 | **SQL Injection (SQLi) pada Pencarian Part** | Payload: `' OR '1'='1' --` pada kolom SKU/nama part | **LOLOS** | *Parameterized query binding* Prisma ORM memperlakukan payload sebagai teks literal. |
| 2 | **Stored Cross-Site Scripting (XSS)** | Payload: `<script>alert('XSS-Bengkel')</script>` pada keluhan pelanggan | **LOLOS** | Sanitasi input & *Context-aware HTML Entity Encoding* pada Virtual DOM React. |
| 3 | **Broken Access Control & IDOR** | Akun `MEKANIK` mencoba memanggil API laporan audit `/api/security-logs` | **LOLOS** | Middleware memverifikasi klaim role pada JWT dan mengembalikan HTTP 403 Forbidden. |
| 4 | **Brute Force Login & Rate Limiting** | Mengirimkan 6 percobaan login salah beruntun dalam $< 1$ menit | **LOLOS** | *In-memory rate limiter* memblokir percobaan ke-6 dengan respons HTTP 429 Too Many Requests. |
| 5 | **Validasi Kata Sandi Lemah** | Mencoba mendaftarkan user dengan password pendek (`"123"`) | **LOLOS** | Validasi skema Zod menolak pendaftaran dan mewajibkan password kompleks minimal 8 karakter. |
| 6 | **Audit Security Headers** | Pemindaian header respons HTTP menggunakan `curl -I` | **LOLOS** | Server menyematkan `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan CSP ketat. |
| 7 | **Pencegahan Kebocoran Secret** | Audit riwayat `git log` dan berkas `.gitignore` | **LOLOS** | Berkas kredensial `.env` dikecualikan dari Git; hanya `.env.example` yang di-push. |
| 8 | **Integritas Transaksi Finansial** | Mengirimkan nilai tagihan negatif atau manipulasi kuantitas belanja | **LOLOS** | Validasi matematis sisi server menolak transaksi yang tidak sesuai master harga. |
| 9 | **Audit Dependensi (npm audit)** | Eksekusi perintah `npm audit` pada terminal proyek | **LOLOS** | Seluruh pustaka dependensi inti terverifikasi stabil dan bebas kerentanan kritis. |

---

## 8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN

*(Bagian ini berisi tangkapan layar pembuktian visual):*

### A. Bukti HTTPS & Domain Aktif
Aplikasi telah siap pakai dan beroperasi secara penuh di lingkungan publik dengan enkripsi sertifikat SSL/TLS valid:
* Domain aktif: `https://onderdil-engine.vercel.app`
* Protokol: TLS 1.3 diterbitkan oleh Let's Encrypt / Vercel SSL.

### B. Bukti Fungsional Kasir POS & Cetak Nota
Operasi transaksi kasir berhasil memadukan katalog sparepart, perhitungan biaya jasa montir, serta pencetakan faktur nota kasir (*printable format*).

### C. Bukti Alur Servis Mobil (Kanban) & Master Suku Cadang
Mekanik dapat memperbarui status unit dari *Menunggu*, *Pengerjaan*, hingga *Selesai*, serta master suku cadang menampilkan badge *Low Stock Alert* secara otomatis.

### D. Bukti Riwayat Git Commit Bertahap
Riwayat pengerjaan mahasiswa tercermin rapi melalui *commit log* bertahap pada repositori GitHub `https://github.com/Apliy3Dyansyah/OnderdilEngine`.

### E. Bukti Respons Security Headers (Terminal)
Eksekusi perintah `curl.exe -s -I http://localhost:3000/login` membuktikan server menyematkan header proteksi tingkat tinggi:
* `X-Frame-Options: DENY`
* `X-Content-Type-Options: nosniff`
* `Content-Security-Policy: default-src 'self' ...`
* `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 9. KENDALA DAN RENCANA PERBAIKAN

### A. Kendala Teknis yang Berhasil Diatasi:
1. **Kompilasi CSS Tailwind v4:** Terjadi *unrendered styles* pada awal inisialisasi Next.js 16 akibat transisi Turbopack engine. Kendala ini diselesaikan dengan menginstal `@tailwindcss/postcss` serta mengonfigurasi berkas `postcss.config.mjs`.
2. **Proteksi Stok dari Race Condition:** Mengatasi potensi selisih stok saat beberapa kasir bertransaksi serentak dengan menggunakan transaksi atomik `prisma.$transaction`.

### B. Rencana Perbaikan Mendatang:
1. **Integrasi Payment Gateway:** Menambahkan integrasi gateway pembayaran otomatis (QRIS Dinamis, Transfer Virtual Account) via Midtrans.
2. **Fitur Pengiriman Nota Digital:** Mengirimkan salinan faktur servis secara otomatis ke WhatsApp pelanggan dalam format PDF sesaat setelah kasir menekan tombol bayar.
