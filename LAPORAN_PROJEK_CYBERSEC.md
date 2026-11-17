# LAPORAN PROJEK MANDIRI KEAMANAN CYBER
**PENGEMBANGAN DAN PENGAMANAN APLIKASI WEB SISTEM KASIR (POINT-OF-SALE) DAN ANTREAN SERVIS BENGKEL MOBIL "ONDERDILENGINE"**

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
Aplikasi telah saya pasang dan jalankan secara online sehingga dapat diakses dan diuji langsung melalui browser dengan koneksi aman (HTTPS):
* **URL Publik Utama (Deployment Vercel Cloud):**  
  [https://onderdil-engine.vercel.app/](https://onderdil-engine.vercel.app/)
* **URL Alternatif (Mirror Cloudflare Tunnel):**  
  [https://onderdil-engine.trycloudflare.com/](https://onderdil-engine.trycloudflare.com/)

---

## 2. URL REPOSITORY SOURCE CODE (GITHUB)
Seluruh kode sumber aplikasi, riwayat commit pengerjaan, dan konfigurasi sistem tersimpan secara rapi pada repositori GitHub publik:
* **Tautan Repositori GitHub:**  
  [https://github.com/aplyyy/OnderdilEngine](https://github.com/aplyyy/OnderdilEngine)

---

## 3. AKUN UJI COBA (TESTING CREDENTIALS)
Untuk memudahkan Bapak Dosen dalam menguji pembagian hak akses (*Role-Based Access Control*) pada aplikasi ini, saya menyediakan tiga akun pengujian sesuai tingkatan perannya. Selain memasukkan secara manual, pada halaman `/login` juga sudah saya sediakan tombol *1-Click Demo* agar proses masuk ke akun uji coba dapat dilakukan dengan cepat:

| Peran (Role) | Username | Password | Hak Akses & Wewenang |
|---|---|---|---|
| **Administrator** | `admin` | `admin` *(atau `AdminBengkel#2026`)* | Memiliki akses penuh untuk menambah, mengedit, dan menghapus stok suku cadang, melihat audit log keamanan, serta memeriksa rekapitulasi laporan keuangan. |
| **Kasir** | `kasir` | `kasir` *(atau `KasirBengkel#2026`)* | Dapat mendaftarkan kendaraan servis baru, memilih suku cadang, menggabungkan ongkos jasa montir, menghitung kembalian, dan mencetak nota pembayaran (faktur). |
| **Mekanik** | `mekanik` | `mekanik` *(atau `MekanikBengkel#2026`)* | Dapat memantau antrean kendaraan servis (Kanban), memperbarui status pengerjaan, menulis catatan perbaikan fisik, dan mengalokasikan suku cadang yang digunakan. |

---

## 4. PENJELASAN APLIKASI (ONDERDILENGINE)

### A. Latar Belakang dan Tujuan
Ide pembuatan aplikasi **OnderdilEngine** ini berawal dari pengamatan saya terhadap masalah operasional yang sering ditemui pada bengkel kendaraan roda empat. Banyak bengkel konvensional yang masih menggunakan pencatatan buku nota manual. Akibatnya, nota belanja kerap terselip, pencatatan stok suku cadang di gudang sering tidak cocok dengan stok fisik, dan kasir kesulitan merekap pembagian antara biaya suku cadang dengan ongkos kerja mekanik.

Sebagai mahasiswa Teknik Informatika yang mengambil mata kuliah Keamanan Cyber, fokus utama saya bukan hanya membuat sistem kasir yang berjalan lancar, melainkan juga memastikan aplikasi ini tahan terhadap celah keamanan web yang umum terjadi. Sistem kasir dan bengkel menyimpan data sensitif berupa riwayat transaksi keuangan dan data suku cadang. Jika tidak diamankan dengan benar, aplikasi kasir rentan diserang menggunakan SQL Injection pada kolom pencarian barang, pencurian cookie sesi kasir melalui celah XSS, atau manipulasi nomor faktur belanja (IDOR). Oleh karena itu, saya merancang aplikasi ini dengan menerapkan praktik *secure coding* berbasis panduan OWASP Top 10.

### B. Fitur-Fitur Utama Aplikasi
1. **Sistem Autentikasi dan Pembagian Peran (RBAC):** Sistem memisahkan hak akses menjadi tiga peran (Administrator, Kasir, dan Mekanik). Kata sandi diamankan menggunakan fungsi hash `bcrypt`, dan sesi pengguna dikelola dengan token JWT yang disimpan pada cookie beratribut `HttpOnly` dan `Secure` agar kebal dari pencurian script berbahaya.
2. **Kasir Point-of-Sale (POS) & Cetak Faktur:** Petugas kasir dapat mencari suku cadang dengan cepat, menambahkan barang ke keranjang belanja, menggabungkan biaya jasa mekanik, menghitung nominal kembalian otomatis, dan langsung mencetak nota pembayaran berformat rapi.
3. **Papan Alur Kerja Servis Mekanik (Kanban):** Halaman antrean kerja montir menampilkan status kendaraan secara bertahap: *Menunggu* &rarr; *Sedang Dikerjakan* &rarr; *Selesai* &rarr; *Lunas*. Mekanik dapat memilih suku cadang yang dipasang, yang secara otomatis akan memotong jumlah stok fisik di gudang.
4. **Manajemen Persediaan Suku Cadang:** Memuat data kode SKU, harga modal/beli, harga jual konsumen, serta fitur *Low Stock Alert* yang memberikan tanda peringatan jika stok barang tersisa di bawah ambang batas minimal (5 unit).
5. **Laporan Penjualan & Ekspor Data CSV:** Halaman laporan menampilkan total omzet bengkel, perbandingan keuntungan suku cadang dengan jasa montir, serta fitur unduh data transaksi ke format CSV untuk pembukuan di Microsoft Excel.

### C. Arsitektur dan Teknologi yang Digunakan
* **Framework Aplikasi:** Next.js versi 16 (App Router) berbasis runtime Node.js dan bahasa pemrograman TypeScript.
* **Database & ORM:** SQLite yang dikelola menggunakan Prisma ORM. Penggunaan Prisma ORM memastikan seluruh query database otomatis menggunakan *Parameterized Queries / Prepared Statements* sehingga kebal terhadap serangan SQL Injection.
* **Keamanan Kriptografi:** Pustaka `bcryptjs` untuk hashing kata sandi akun dan pustaka `jose` untuk penandatanganan kriptografis token sesi JWT.
* **Validasi Input:** Pustaka `zod` untuk memastikan data yang dikirim ke server sesuai dengan skema tipe data yang valid.
* **Tampilan Antarmuka:** Tailwind CSS dengan desain modern bergaya bersih (*clean SaaS*), kontras warna yang nyaman dibaca, serta tata letak responsif untuk layar handphone mekanik maupun laptop kasir.
* **Pengamanan Header HTTP:** Middleware Next.js untuk menyematkan HTTP Security Headers seperti `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, dan `Content-Security-Policy`.

### D. Penerapan Aspek Keamanan pada Aplikasi
Penerapan pengamanan yang saya bangun pada source code dirangkum dalam tabel berikut:

| Aspek Keamanan | Letak File / Komponen | Tujuan & Mekanisme Pengamanan |
|---|---|---|
| **Password Hashing (bcrypt)** | `src/app/api/auth/login/route.ts` | Password pengguna disimpan dalam bentuk digest hash searah dengan salt, sehingga kata sandi asli tidak dapat diketahui meskipun database bocor. |
| **JWT HttpOnly Cookie** | `src/lib/auth.ts` | Token login disimpan pada cookie dengan atribut `HttpOnly`, sehingga script jahat di browser tidak dapat membaca atau mencuri token sesi kasir (anti-XSS). |
| **Prepared Statements (Anti-SQLi)** | `prisma/schema.prisma` | Prisma ORM memisahkan logika query SQL dari parameter input pengguna. Karakter aneh seperti tanda kutip pada kolom pencarian part hanya dianggap teks string biasa. |
| **Role-Based Access Control (RBAC)** | `src/middleware.ts` | Membatasi hak akses antar peran. Jika akun mekanik atau kasir mencoba mengakses URL atau endpoint administrator, sistem langsung menolak dengan status HTTP 403 Forbidden. |
| **Rate Limiting (Anti-Brute Force)** | `src/lib/rate-limit.ts` | Membatasi percobaan login maksimal 5 kali per menit per alamat IP. Percobaan ke-6 otomatis diblokir dengan respon HTTP 429 Too Many Requests. |
| **Sanitasi Input (Anti-XSS)** | `src/lib/security.ts` | Melakukan entity encoding pada teks input keluhan servis, ditambah perlindungan bawaan React JSX escaping agar tag HTML/script tidak dapat dieksekusi. |
| **Security Headers** | `src/middleware.ts` | Menambahkan header proteksi browser seperti `X-Frame-Options: DENY` untuk mencegah clickjacking dan `nosniff` untuk mencegah manipulasi MIME-type. |
| **Proteksi Kredensial (.gitignore)** | `.gitignore`, `.env.example` | Memastikan kunci rahasia (JWT secret dan konfigurasi database) tidak ikut terunggah ke repositori publik GitHub. |

---

## 5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI
Projek ini memiliki potensi yang sangat baik untuk saya kembangkan lebih lanjut menjadi topik Skripsi / Tugas Akhir pada semester akhir nanti. Rencana usulan judul skripsi yang berkaitan dengan projek ini adalah:

> **"Rancang Bangun Sistem Informasi Kasir dan Antrean Servis Bengkel Mobil Berbasis Web dengan Penerapan Role-Based Access Control dan Analisis Pengendalian Stok Suku Cadang"**

### Rumusan Masalah yang Direncanakan:
1. Bagaimana merancang sistem kasir dan antrean servis kendaraan yang saling terintegrasi agar meminimalisir kesalahan perhitungan biaya serta mencegah selisih stok suku cadang fisik di gudang?
2. Bagaimana menerapkan mekanisme keamanan Role-Based Access Control (RBAC) dan perlindungan SQL Injection untuk memastikan data transaksi keuangan dan hak akses bengkel terlindungi dengan baik?
3. Bagaimana merancang fitur rekapitulasi data penjualan suku cadang agar dapat membantu pemilik bengkel dalam memantau omzet serta merencanakan pengadaan barang secara tepat waktu?

### Rencana Fitur Tambahan untuk Skripsi:
* Integrasi pengiriman bukti nota servis langsung ke nomor WhatsApp pelanggan secara otomatis saat status transaksi dinyatakan lunas.
* Integrasi metode pembayaran digital berbasis QRIS dinamis untuk mempermudah konsumen dalam bertransaksi non-tunai.
* Penambahan fitur cetak nota langsung ke printer kasir thermal (Bluetooth / USB).

---

## 6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)
Sesuai ketentuan pedoman tugas (Poin 3e), dalam pengerjaan projek mandiri ini saya memanfaatkan bantuan asisten AI (Google Antigravity) secara terbuka dan etis sebagai sarana belajar serta pembantu penulisan kode:

* **Bagian Pengerjaan yang Dibantu AI:**
  * Membantu merancang struktur relasi tabel database di Prisma ORM (`User`, `Sparepart`, `ServiceOrder`, `Transaction`, dan `SecurityLog`).
  * Membantu mencari contoh implementasi fungsi hashing password bcrypt dan pembuatan token JWT pada framework Next.js App Router.
  * Membantu menyusun tata letak antarmuka kasir dan komponen kanban mekanik menggunakan utility class Tailwind CSS agar rapi dan responsif.
  * Membantu menyelesaikan kendala konfigurasi PostCSS saat menggunakan Next.js versi 16.
* **Contoh Prompt yang Saya Gunakan:**  
  *“Tolong bantu buatkan rute API kasir di Next.js menggunakan Prisma transaction: hitung total harga suku cadang ditambah ongkos servis, kurangi stok fisik suku cadang secara aman dari race condition, buatkan nomor faktur nota unik, dan tolak pembayaran jika uang yang dibayarkan kurang.”*
* **Cara Saya Menguji dan Memverifikasi Hasil AI:**  
  Setiap baris kode yang disarankan oleh asisten AI tidak langsung saya pakai begitu saja. Saya memeriksa kembali logika alur programnya, memastikan query database menggunakan parameter binding yang aman, memastikan tidak ada celah keamanan atau kunci rahasia yang tertulis langsung di kode program, serta menguji langsung fungsinya di browser lokal dan menjalankan `npm run build` untuk memastikan tidak ada error kompilasi.

---

## 7. HASIL SELF-TESTING KEAMANAN (7 SKENARIO PENGUJIAN)
Untuk memastikan proteksi berjalan sesuai rencana, saya melakukan pengujian mandiri terhadap 7 skenario serangan web dengan hasil sebagai berikut:

| No | Skenario Pengujian | Metode & Payload Uji | Hasil Uji | Analisis & Mitigasi |
|---|---|---|:---:|---|
| 1 | SQL Injection pada Form Pencarian | Memasukkan payload injeksi SQL: `' OR '1'='1' --` pada kolom pencarian suku cadang. | **LOLOS** | Prisma ORM menerapkan prepared statements; payload diperlakukan sebagai teks string biasa sehingga query SQL tidak bocor. |
| 2 | Stored XSS pada Catatan Servis | Memasukkan tag script jahat: `<script>alert(1)</script>` pada kolom keluhan pelanggan. | **LOLOS** | Karakter di-encode menjadi entitas aman dan dirender secara aman oleh React JSX, script tidak dieksekusi browser. |
| 3 | Broken Access Control / IDOR | Login menggunakan akun Mekanik, lalu mencoba mengakses endpoint data admin `/api/security-logs`. | **LOLOS** | Middleware otorisasi memeriksa role pada JWT dan langsung memblokir akses dengan kode respon HTTP 403 Forbidden. |
| 4 | Brute Force Login & Rate Limiting | Mengirimkan 6 kali percobaan login dengan password salah secara berturut-turut dalam waktu 1 menit. | **LOLOS** | Sistem rate limiter memblokir percobaan ke-6 dengan respon HTTP 429 Too Many Requests (cooldown 60 detik). |
| 5 | Validasi Password Lemah | Mencoba input password pendek kurang dari 8 karakter pada form registrasi. | **LOLOS** | Skema validasi Zod pada backend menolak data dan memberikan pesan error bahwa password minimal 8 karakter. |
| 6 | Pemeriksaan Security Headers | Memeriksa respon header web menggunakan perintah `curl -I` di terminal. | **LOLOS** | Respon server menyertakan header proteksi lengkap: `X-Frame-Options: DENY`, `nosniff`, dan CSP. |
| 7 | Pencegahan Kebocoran Secret | Memeriksa status git dan berkas `.gitignore`. | **LOLOS** | File `.env` yang berisi JWT secret dan database credentials tidak terunggah ke repositori GitHub. |

---

## 8. BUKTI OPERASIONAL DAN IMPLEMENTASI
Seluruh bagian aplikasi telah berhasil diuji dan berjalan normal dengan rincian bukti sebagai berikut:
* **Koneksi HTTPS Aktif:** Aplikasi dapat diakses secara publik pada domain Vercel dengan sertifikat SSL/TLS aktif.
* **Fungsi Kasir POS Berjalan Lancar:** Kasir dapat memproses transaksi pembelian suku cadang maupun jasa servis secara real-time serta mencetak nota bukti pembayaran.
* **Alur Antrean Mekanik Berfungsi:** Mekanik dapat memperbarui status pengerjaan mobil dan stok barang fisik otomatis berkurang saat suku cadang dipasang.
* **Riwayat Git Commit Terstruktur:** Proses pengerjaan tercatat bertahap pada commit log repositori GitHub mahasiswa.

---

## 9. KENDALA DAN RENCANA PERBAIKAN

**Kendala yang Dihadapi Selama Pengerjaan:**
1. *Konfigurasi CSS pada Versi Framework Terbaru:* Pada awal pengerjaan, sempat terjadi kendala styling Tailwind CSS v4 pada Next.js 16. Masalah ini berhasil diselesaikan dengan menyesuaikan dependensi PostCSS.
2. *Pencegahan Selisih Stok (Race Condition):* Untuk mencegah kesalahan pengurangan stok jika ada transaksi bersamaan, query database dibungkus menggunakan transaksi atomik `prisma.$transaction`.
3. *Penyesuaian Tampilan Mobile:* Mengatur tampilan agar antarmuka kasir dan mekanik tetap mudah digunakan saat dibuka melalui smartphone di area bengkel.

**Rencana Perbaikan ke Depan:**
1. Menambahkan integrasi pembayaran QRIS dinamis agar pembayaran non-tunai bisa langsung terverifikasi otomatis.
2. Mengembangkan fitur pengiriman bukti nota digital langsung ke kontak WhatsApp pelanggan.
