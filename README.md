# OnderdilEngine — Sistem Point-of-Sale (POS) & Manajemen Operasional Bengkel Mobil
> Tugas Besar Mata Kuliah Cyber Security — S1 Teknik Informatika / Fakultas Ilmu Komputer Universitas Kuningan (2026)  
> **Disusun Oleh:** Apliy Tridiansyah Rosdiana (NIM: 20240810111) — Kelas TINFC-2024-01  
> **Dosen Pengampu:** Fitra Nugraha, S.Kom., M.Kom.

[![CyberSec Hardened](https://img.shields.io/badge/Security-OWASP_Top_10_Compliant-emerald.svg)](#penerapan-keamanan)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js_15_%7C_Prisma_%7C_Tailwind-amber.svg)](#teknologi)
[![License](https://img.shields.io/badge/License-MIT-slate.svg)](LICENSE)

---

## 1. Deskripsi Aplikasi
**OnderdilEngine** adalah aplikasi web *Point-of-Sale* (POS) dan manajemen alur kerja operasional bengkel mobil modern. Aplikasi ini dirancang khusus untuk memenuhi standar industri otomotif dengan antarmuka bertema *Dark Utilitarian Automotive*, efisiensi transaksi kasir, pelacakan tiket servis kendaraan, serta pengamanan ketat berbasis kaidah **Secure Software Development Life Cycle (SSDLC)** dan mitigasi risiko kerentanan **OWASP Top 10**.

---

## 2. Fitur Utama Aplikasi
1. **Autentikasi & Role-Based Access Control (RBAC):**
   - Pemisahan 3 hak akses pengguna: `ADMIN` (Manajer Bengkel), `KASIR` (Petugas Kasir/Service Advisor), dan `MEKANIK` (Teknisi Lapangan).
   - Enkripsi password menggunakan `bcrypt` dengan *cost factor* 10.
   - Manajemen sesi aman menggunakan `HttpOnly`, `Secure`, dan `SameSite=Lax` cookie.
2. **Kasir Point-of-Sale (POS):**
   - Katalog suku cadang cepat dengan filter kategori (Oli, Filter, Rem, Pengapian, dll.).
   - Penggabungan otomatis biaya suku cadang dan jasa montir.
   - Perhitungan diskon, total bayar, nominal uang tunai, dan kembalian.
   - Cetak nota transaksi digital / cetak faktur fisik (*printable thermal POS format*).
3. **Alur Kerja Servis & Antrean Kendaraan (*Work Order*):**
   - Papan status interaktif: `MENUNGGU` &rarr; `SEDANG DIKERJAKAN` &rarr; `SELESAI` &rarr; `LUNAS`.
   - Pencatatan keluhan pelanggan, nomor polisi kendaraan, dan catatan penanganan teknis mekanik.
   - Pemasangan dan pengurangan otomatis stok suku cadang fisik secara *real-time*.
4. **Master Inventaris Suku Cadang (CRUD):**
   - Pengelolaan kode SKU, harga modal, harga jual, dan stok fisik.
   - Indikator peringatan dini stok menipis (*Low Stock Alert* $\le$ batas minimum).
5. **Laporan & Rekapitulasi Finansial:**
   - Dashboard omzet harian/bulanan dan akumulasi laba suku cadang vs jasa.
   - Ekspor rekap transaksi ke format **CSV** dan tampilan siap cetak / PDF.
6. **Security Audit & Interactive Self-Testing Suite:**
   - Panel khusus untuk menguji langsung 5 skenario serangan (SQLi, XSS, IDOR, Brute Force, Security Headers) dengan tabel pembuktian *before & after*.
   - Pencatatan log peristiwa keamanan (*Security Log*) secara otomatis ke dalam database.

---

## 3. Akun Uji Coba Penguji / Dosen
Untuk mempermudah pengujian seluruh fitur oleh Dosen Penguji, akun uji coba berikut telah terdaftar (dapat juga diisi otomatis dengan tombol *1-Click Demo* di halaman `/login`):

| Peran (Role) | Username | Password | Deskripsi Wewenang |
|---|---|---|---|
| **Admin / Manajer** | `admin` | `AdminBengkel#2026` | Akses penuh master part, laporan keuangan, hapus data, & audit log |
| **Kasir** | `kasir` | `KasirBengkel#2026` | Transaksi POS kasir, input kendaraan masuk, cetak nota, lihat laporan |
| **Mekanik** | `mekanik` | `MekanikBengkel#2026` | Board servis, update status kendaraan, input part & catatan teknis |

---

## 4. Arsitektur Keamanan (Cyber Security Implementation)
Aplikasi menerapkan kaidah *secure coding* pada seluruh lapisan:
1. **Mitigasi SQL Injection (SQLi):**
   - Seluruh query database menggunakan **Prisma ORM** yang secara otomatis mengimplementasikan *Prepared Statements* / *Parameterized Queries* (`$1`, `$2`), sehingga payload seperti `' OR '1'='1' --` diperlakukan murni sebagai teks dan tidak dapat memanipulasi query database.
2. **Mitigasi Stored Cross-Site Scripting (XSS):**
   - Input teks (keluhan servis, nama suku cadang, catatan montir) melalui sanitasi dan *HTML entity encoding* di sisi backend dan proteksi rendering JSX React di sisi frontend.
3. **Proteksi IDOR & Otorisasi RBAC:**
   - Middleware memverifikasi *cryptographic signature* JWT pada setiap permintaan. Akun dengan peran `MEKANIK` atau `KASIR` otomatis diblokir dengan respons `HTTP 403 Forbidden` saat mencoba mengakses rute atau endpoint admin (`/admin`, `/api/security-logs`).
4. **Proteksi Brute-Force & Rate Limiting:**
   - Middleware *in-memory sliding window* membatasi percobaan login maksimal **5 kali per menit per IP address**. Percobaan ke-6 akan langsung ditolak dengan status `HTTP 429 Too Many Requests`.
5. **Security Headers & Cookie Hardening:**
   - `X-Frame-Options: DENY` (Mencegah serangan *Clickjacking*).
   - `X-Content-Type-Options: nosniff` (Mencegah eksploitasi *MIME-type sniffing*).
   - `Content-Security-Policy (CSP)` yang ketat.
   - Kuki sesi bertanda `HttpOnly` (tidak dapat dibaca via JavaScript/XSS), `SameSite=Lax`, dan `Secure` pada mode HTTPS.

---

## 5. Ringkasan Hasil Self-Testing Keamanan (5 Skenario Wajib)

| No | Skenario Uji | Prosedur & Payload Uji | Hasil Uji | Mekanisme Pertahanan |
|---|---|---|---|---|
| 1 | **SQL Injection (SQLi)** | Memasukkan `' OR '1'='1' --` pada pencarian suku cadang | **LOLOS (AMAN)** | *Parameterized Query Binding* (Prisma ORM) |
| 2 | **Stored XSS** | Memasukkan `<script>alert('XSS-Bengkel')</script>` pada keluhan servis | **LOLOS (AMAN)** | *HTML Entity Encoding* & React Virtual DOM Escaping |
| 3 | **Bypass Otorisasi / IDOR** | Akun `MEKANIK` mengakses endpoint audit `/api/security-logs` | **LOLOS (HTTP 403)** | Validasi token JWT & RBAC Middleware Server |
| 4 | **Brute Force Login** | Mengirimkan percobaan login salah 6 kali berturut-turut | **LOLOS (HTTP 429)** | In-Memory Sliding Window Rate Limiter (5 req/menit) |
| 5 | **Security Headers & Secrets** | Pengecekan HTTP Headers (CSP, X-Frame-Options) & Git history | **LOLOS (GRADE A)** | Next.js Response Headers & Isolasi file `.env` di `.gitignore` |

*Tangkapan layar pengujian interaktif dapat dijalankan langsung melalui menu `/security-test` di dalam aplikasi.*

---

## 6. Teknologi yang Digunakan (Tech Stack)
- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript
- **Styling & UI:** Tailwind CSS (Utilitarian Automotive Dark Palette)
- **Database ORM:** [Prisma ORM](https://www.prisma.io/) (SQLite lokal zero-config / PostgreSQL kompatibel)
- **Kriptografi & Auth:** `bcryptjs` (Hashing password), `jose` (JWT Token Signed)
- **Validasi Data:** `zod`
- **Ikonografi:** `lucide-react`

---

## 7. Panduan Instalasi & Menjalankan Secara Lokal

### Prasyarat:
- Node.js versi 20+ atau 22+ terpasang di komputer.
- Git terpasang.

### Langkah-langkah:
1. **Clone Repositori:**
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd OnderdilEngine
   ```

2. **Pasang Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin template `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Secara bawaan, aplikasi menggunakan SQLite lokal sehingga langsung dapat dijalankan tanpa perlu menginstal PostgreSQL/Docker secara manual).*

4. **Inisialisasi & Seed Database:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
   *Perintah ini akan membuat database lokal dan mengisi otomatis akun admin, kasir, mekanik, serta sampel suku cadang dan antrean kendaraan.*

5. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 8. Catatan Penggunaan AI Agent (Transparansi Sesuai Panduan Tugas)
Sesuai dengan ketentuan Tugas Besar Cyber Security (Poin 3e):
- **Alat AI yang Digunakan:** Antigravity (Google DeepMind)
- **Modul yang Dibantu:** Perancangan skema database Prisma, penulisan middleware otorisasi RBAC, implementasi in-memory rate limiting anti-brute force, layout UI kasir POS & kanban mekanik bertema otomotif, serta integrasi modul pengujian mandiri (*Self-Testing Suite*).
- **Proses Verifikasi Mahasiswa:** Kode hasil bantuan AI ditinjau secara manual (*code review*), diuji kompilasinya menggunakan `npm run build`, diverifikasi alur otorisasi tokennya, serta diuji coba secara riil terhadap skenario injeksi dan bypass akses.
