# AGENT DIRECTIVE: SISTEM POS & MANAJEMEN SERVIS BENGKEL MOBIL

Panduan operasional dan instruksi teknis AI Agent dalam merancang, menulis kode, menguji, dan mendokumentasikan aplikasi web "Sistem Point-of-Sale (POS) & Manajemen Operasional Bengkel Mobil" untuk pemenuhan Tugas Besar Mata Kuliah Cyber Security.

## 1. IDENTITAS & PERAN AGENT

* **Peran:** AI Assistant / Senior Fullstack Developer & Application Security Specialist.
* **Tanggung Jawab:** Merancang arsitektur sistem, memandu penulisan kode fungsional, membantu *debugging*, menyusun skenario *self-testing* keamanan, dan menyiapkan format dokumentasi teknis.
* **Batasan Privasi & Keamanan Secret:** Dilarang keras meminta, menerima, mencatat, atau menyematkan rahasia produksi nyata (*production secret*, kunci API, password database riil, atau data pelanggan pribadi) ke dalam *prompt* maupun kode sumber. Seluruh kredensial wajib dipisahkan ke *environment variables*.
* **Transparansi Kerja:** Seluruh modul yang dibantu oleh Agent dan contoh *prompt* utama wajib dicatat secara terstruktur untuk dilaporkan pada file `README.md` dan berkas Laporan Akhir (PDF).

## 2. PANDUAN DESAIN UI/UX (AUTOMOTIVE WORKSHOP POS THEME)

Antarmuka dirancang khusus untuk lingkungan operasional bengkel mobil dengan mengedepankan efisiensi, keterbacaan tinggi di layar sentuh/desktop, dan nuansa industri otomotif:

* **Palet Warna Industri Otomotif:** Warna dasar gelap/netral (Slate/Charcoal `#1E293B` dan `#0F172A`) dipadukan dengan aksen khas keselamatan/mekanikal seperti Amber/Hazard Yellow (`#F59E0B`), Racing Red (`#EF4444`), dan Signal Green (`#10B981`) untuk status servis dan transaksi.
* **Tata Letak POS Cepat (Utilitarian Layout):**
  * *Halaman Kasir/Transaksi:* Panel kiri menampilkan katalog/pencarian suku cadang & jasa servis, panel kanan berupa keranjang tagihan/nota *real-time* dengan kalkulasi otomatis (subtotal, diskon/pajak, total bayar, kembalian).
  * *Halaman Alur Kerja Servis:* Tampilan berbasis kartu status (*Kanban board* atau tabel interaktif) untuk memantau kendaraan: `Menunggu` $\rightarrow$ `Sedang Dikerjakan` $\rightarrow$ `Selesai/Siap Ambil` $\rightarrow$ `Lunas`.
* **Keterbacaan & Ergonomi Tombol:** Tombol aksi kasir (seperti "Bayar", "Cetak Nota", "Tambah Item") berukuran besar, kontras tinggi, dan mudah diklik oleh petugas kasir maupun mekanik.
* **Tipografi & Ikonografi:** Font modern sans-serif yang bersih (misal *Inter*, *Roboto*, atau font monospaced untuk nomor nota dan nominal harga), dilengkapi indikator visual status servis yang jelas.

## 3. SPESIFIKASI FITUR MINIMUM APLIKASI

Aplikasi wajib beroperasi secara nyata (*fully functioning web app*), terhubung ke database, dan bukan sekadar prototipe antarmuka statis:

### A. Autentikasi & Kontrol Akses Berbasis Peran (RBAC)
* **Pemisahan Peran Pengguna:**
  * `Admin / Manajer Bengkel`: Memiliki kendali penuh terhadap master data suku cadang, penyesuaian harga, data pengguna/karyawan, serta seluruh laporan keuangan dan rekap transaksi.
  * `Kasir / Service Advisor`: Mencatat pendaftaran pelanggan & kendaraan, membuat faktur/transaksi penjualan sparepart dan jasa servis, memproses pembayaran, serta mencetak nota transaksi.
  * `Mekanik / User Operasional`: Melihat daftar antrean kendaraan dan memperbarui status pengerjaan servis serta catatan teknis penanganan kendaraan.

### B. Pengelolaan Data (CRUD Lengkap Tersimpan di Database)
1. **Master Suku Cadang (Sparepart) & Jasa Servis:**
   * Tambah suku cadang baru (kode SKU, nama barang, kategori: oli/mesin/rem/ban, harga modal, harga jual, stok fisik).
   * Edit harga dan update stok barang masuk.
   * Hapus atau arsipkan suku cadang yang sudah tidak digunakan.
2. **Manajemen Servis & Kendaraan:**
   * Input data kendaraan masuk (Nomor Polisi, model kendaraan, nama pelanggan, keluhan kerusakan).
   * Pembaruan status perbaikan dan pencatatan penggantian *part* yang digunakan.
3. **Pencatatan Transaksi Kasir (POS):**
   * Pembuatan tiket pembayaran yang menggabungkan biaya jasa montir dan akumulasi suku cadang yang digunakan.

### C. Fitur Laporan & Rekapitulasi Data
* **Dashboard Rekapitulasi:** Ringkasan pendapatan bengkel harian/bulanan, total unit mobil yang diservis, serta daftar stok suku cadang yang berada di bawah batas minimum (*low stock alert*).
* **Ekspor Dokumen:** Kemampuan mencetak/mengunduh nota transaksi servis ke format digital serta fitur ekspor rekap laporan penjualan/transaksi ke format **PDF** atau **CSV**.

## 4. STANDAR PENERAPAN KEAMANAN (WAJIB)

Agent wajib menerapkan prinsip *Secure Software Development Life Cycle* (SSDLC) dan kaidah *secure coding* pada seluruh lapisan:

1. **Password Hashing:**
   * Password seluruh akun karyawan (Admin, Kasir, Mekanik) disimpan menggunakan fungsi hashing kriptografi yang aman (`bcrypt` dengan cost factor $\ge 10$ atau `argon2id`). Dilarang menyimpan password dalam bentuk *plaintext* atau enkripsi dua arah.
2. **Validasi & Sanitasi Input (Mitigasi SQLi & XSS):**
   * Seluruh query database wajib menggunakan mekanisme *Parameterized Queries* / *Prepared Statements* (atau ORM yang aman) guna mencegah **SQL Injection** pada kolom pencarian sparepart, nomor polisi, maupun filter tanggal.
   * Setiap data teks dari form (catatan teknis mekanik, nama pelanggan, keterangan keluhan) harus disanitasi dan di-*encode* saat dirender di antarmuka web untuk mencegah serangan **Cross-Site Scripting (XSS)**.
3. **Manajemen Sesi & Token:**
   * Sesi login dikelola menggunakan session cookie dengan penanda wajib `HttpOnly`, `Secure`, dan `SameSite=Strict/Lax`, atau menggunakan JWT dengan penanganan kedaluwarsa (*token expiration*) yang ketat.
   * Menyediakan fungsi logout yang benar-benar membatalkan token/menghancurkan sesi server.
4. **Otorisasi & Proteksi IDOR (Insecure Direct Object Reference):**
   * Validasi otorisasi di level server/API rute: Akun Kasir atau Mekanik tidak boleh dapat mengubah rute URL/API untuk memodifikasi laporan keuangan atau data milik cabang/akun lain (misal manipulasi `PATCH /api/transaksi/id/harga`).
   * Rute modul administrasi dan manajemen user wajib dilindungi middleware RBAC.
5. **Pengelolaan Secret & Kredensial:**
   * Kredensial koneksi database, kunci enkripsi sesi, dan variabel sensitif lainnya wajib diletakkan pada file `.env`.
   * File `.env` wajib didaftarkan di dalam `.gitignore` agar tidak pernah terkirim ke riwayat *commit* repositori Git.
6. **Keamanan Tambahan:**
   * Terapkan proteksi *Rate Limiting* pada form login kasir/admin guna mencegah serangan *brute force*.
   * Konfigurasikan *Security Headers* (seperti `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`).

## 5. RENCANA PENGUJIAN MANDIRI (SELF-TESTING KEAMANAN)

Agent wajib memandu pelaksanaan dan pembuatan tabel hasil *self-testing* minimal 5 skenario uji berikut untuk dimasukkan ke dalam laporan:

| No | Skenario Uji | Prosedur & Payload Uji | Ekspektasi Hasil (Lolos) | Mitigasi / Tindakan Perbaikan |
|---|---|---|---|---|
| 1 | **SQL Injection (SQLi) pada Pencarian Suku Cadang** | Memasukkan payload `' OR '1'='1' --` pada kolom pencarian kode SKU / nama part | Lolos (Sistem merespons pencarian tidak ditemukan / input dianggap literal text, struktur database aman) | Memastikan pencarian database menggunakan *parameterized binding*. |
| 2 | **Stored XSS pada Catatan Keluhan Servis** | Memasukkan payload `<script>alert('XSS-Bengkel')</script>` pada kolom keluhan pelanggan | Lolos (Script tidak tereksekusi di halaman kasir maupun cetak nota, karakter ter-escape sempurna) | Terapkan sanitasi input dan context output encoding pada view/template. |
| 3 | **Bypass Otorisasi & IDOR pada Laporan Finansial** | Login sebagai akun Mekanik, lalu mencoba mengakses langsung endpoint URL `/admin/laporan-keuangan` atau `DELETE /api/transaksi/99` | Lolos (Server mengembalikan respons HTTP 403 Forbidden / Akses Ditolak) | Penambahan pengecekan middleware otorisasi berbasis peran di level rute controller. |
| 4 | **Brute Force Login & Rate Limiting** | Mengirimkan percobaan login salah secara beruntun (> 5 kali dalam 1 menit) | Lolos (Sistem mengembalikan HTTP 429 Too Many Requests dan mengunci percobaan login sementara) | Implementasi middleware rate limiting pada rute autentikasi. |
| 5 | **Audit Secret & Header Keamanan (HTTPS)** | Menjalankan `git log` untuk memastikan tidak ada credential `.env` bocor dan melakukan pemindaian header via securityheaders.com / SSL Labs | Lolos (Repositori bersih dari secret, sertifikat SSL aktif valid, security headers minimal grade B/A) | Pengecekan ketat `.gitignore` dan penambahan header keamanan HTTP standar. |

## 6. KETENTUAN DEPLOYMENT & STRUKTUR REPOSITORI

* **Hosting & Domain:** Aplikasi harus di-deploy pada platform hosting publik (misal: Railway, Render, Vercel, dsb.) dengan FQDN atau subdomain publik yang aktif menggunakan protokol **HTTPS** dengan sertifikat SSL/TLS valid (bukan IP address mentah / localhost).
* **Repositori Git:** Source code diunggah ke GitHub/GitLab dengan commit log bertahap yang menunjukkan progres pengerjaan mahasiswa.
* **Format File `README.md` Repositori:**
  1. *Deskripsi Proyek:* Penjelasan ringkas sistem POS & manajemen servis bengkel mobil.
  2. *Daftar Fitur:* Rincian fitur autentikasi, transaksi kasir, inventaris part, dan laporan.
  3. *Tech Stack:* Bahasa, framework, database, dan platform hosting.
  4. *Panduan Instalasi:* Langkah kloning repositori, setup database, dan cara menjalankan server lokal.
  5. *Konfigurasi Environment:* Panduan variabel `.env.example` tanpa nilai rahasia.
  6. *URL Deployment:* Tautan aplikasi web yang aktif secara publik.
  7. *Penggunaan AI Agent:* Rincian tool AI yang digunakan, bagian kode yang dibantu, dan contoh *prompt* utamanya.
  8. *Ringkasan Pengujian Keamanan:* Ikhtisar singkat tabel pengujian *self-testing*.

## 7. STRUKTUR BERKAS PENGUMPULAN (LAPORAN PDF)

Agent wajib membantu penyiapan draf berkas laporan tunggal dengan penamaan `TugasProject_CyberSec_Nama Lengkap_NIM.pdf` sesuai urutan wajib:

1. **Identitas Pengusul:** Nama lengkap, NIM, kelas.
2. **URL Aplikasi Aktif:** Tautan FQDN dengan sertifikat SSL/TLS valid.
3. **URL Repositori Git:** Tautan ke GitHub/GitLab proyek.
4. **Akun Uji Coba:** Kredensial akun uji coba (User Kasir/Mekanik dan Admin) agar dosen dapat memverifikasi seluruh fitur.
5. **Penjelasan Aplikasi:** Latar belakang bengkel mobil, rincian fitur utama (CRUD sparepart & tiket servis, kasir, laporan ekspor), arsitektur teknologi (diagram alur data), dan dokumentasi aspek pengamanan yang diterapkan.
6. **Potensi Pengembangan ke Skripsi (Tingkat 4):**
   * *Rumusan Masalah Penelitian:*
     1. Bagaimana merancang algoritma peramalan (*forecasting*) kebutuhan suku cadang bengkel menggunakan metode seperti *Exponential Smoothing* atau *Moving Average* berdasarkan data riwayat transaksi POS?
     2. Bagaimana menerapkan sistem deteksi anomali transaksi kasir berbasis algoritma machine learning untuk memitigasi potensi manipulasi pencatatan servis dan kasir?
   * *Rencana Fitur Lanjutan:* Integrasi pengingat servis otomatis via WhatsApp API berdasarkan kilometer kendaraan, modul peramalan stok barang otomatis, dan telemetri integrasi OBD-II scanner.
7. **Penggunaan AI Agent:** Laporan alat AI yang digunakan, peran/bagian modul yang dibantu, daftar contoh prompt utama, dan cara verifikasi validitas kode.
8. **Hasil Self-Testing Keamanan:** Tabel komprehensif berisi 5 skenario pengujian, metodologi, status kelulusan, serta tangkapan layar/bukti perbaikan sebelum dan sesudah mitigasi.
9. **Lampiran Tangkapan Layar:**
   * Halaman login & dashboard POS bengkel.
   * Halaman CRUD suku cadang & manajemen tiket servis kendaraan.
   * Halaman rekap transaksi & ekspor dokumen nota/laporan.
   * Bukti gembok HTTPS valid pada peramban web.
   * Bukti pengaturan domain/hosting.
   * Bukti keluaran uji keamanan (terminal scan, audit dependency, atau respons security headers).
10. **Kendala & Rencana Tindak Lanjut** *(opsional)*.