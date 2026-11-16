import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  ShadingType,
  convertInchesToTwip,
} from "docx";
import fs from "fs";
import path from "path";

async function generateFullDocx() {
  const logoPath = path.resolve("public/logo-uniku.png");
  let logoImageRun = null;
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    logoImageRun = new ImageRun({
      data: logoBuffer,
      transformation: {
        width: 140,
        height: 140,
      },
    });
  }

  const borderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: "auto" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
    left: { style: BorderStyle.NONE, size: 0, color: "auto" },
    right: { style: BorderStyle.NONE, size: 0, color: "auto" },
  };

  const tableBorderSolid = {
    top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
  };

  const createCell = (text, isHeader = false, widthPercent = 25, isCenter = false, isBold = false) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      borders: tableBorderSolid,
      shading: isHeader
        ? { fill: "F0F0F0", type: ShadingType.SOLID, color: "auto" }
        : undefined,
      margins: { top: 120, bottom: 120, left: 140, right: 140 },
      children: [
        new Paragraph({
          alignment: isCenter || isHeader ? AlignmentType.CENTER : AlignmentType.LEFT,
          spacing: { line: 280, before: 40, after: 40 },
          children: [
            new TextRun({
              text,
              font: "Times New Roman",
              size: 21, // ~10.5pt
              bold: isHeader || isBold,
            }),
          ],
        }),
      ],
    });
  };

  const pText = (text, options = {}) => {
    return new Paragraph({
      alignment: options.align || AlignmentType.JUSTIFY,
      spacing: { line: 360, before: options.before || 60, after: options.after || 60 },
      indent: options.indent ? { firstLine: 720 } : undefined, // 1cm indent
      children: [
        new TextRun({
          text,
          font: "Times New Roman",
          size: options.size || 24, // 12pt
          bold: options.bold || false,
          italics: options.italics || false,
        }),
      ],
    });
  };

  const heading1 = (text) => {
    return new Paragraph({
      spacing: { before: 280, after: 120 },
      children: [
        new TextRun({
          text,
          font: "Times New Roman",
          size: 24,
          bold: true,
        }),
      ],
    });
  };

  const heading2 = (text) => {
    return new Paragraph({
      spacing: { before: 180, after: 80 },
      children: [
        new TextRun({
          text,
          font: "Times New Roman",
          size: 24,
          bold: true,
        }),
      ],
    });
  };

  const bullet = (text, boldPrefix = "") => {
    const children = [];
    if (boldPrefix) {
      children.push(new TextRun({ text: boldPrefix + " ", font: "Times New Roman", size: 24, bold: true }));
    }
    children.push(new TextRun({ text, font: "Times New Roman", size: 24 }));
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { line: 360, before: 40, after: 40 },
      alignment: AlignmentType.JUSTIFY,
      children,
    });
  };

  const numbered = (num, text, boldPrefix = "") => {
    const children = [];
    children.push(new TextRun({ text: `${num}. `, font: "Times New Roman", size: 24, bold: true }));
    if (boldPrefix) {
      children.push(new TextRun({ text: boldPrefix + " ", font: "Times New Roman", size: 24, bold: true }));
    }
    children.push(new TextRun({ text, font: "Times New Roman", size: 24 }));
    return new Paragraph({
      spacing: { line: 360, before: 60, after: 60 },
      indent: { left: 400, hanging: 400 },
      alignment: AlignmentType.JUSTIFY,
      children,
    });
  };

  // 1. Table Akun Uji Coba
  const tableCredentials = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorderSolid,
    rows: [
      new TableRow({
        children: [
          createCell("Peran (Role)", true, 22),
          createCell("Username", true, 20),
          createCell("Password", true, 23),
          createCell("Hak Akses Utama", true, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Administrator", false, 22, false, true),
          createCell("admin", false, 20, true),
          createCell("AdminBengkel#2026", false, 23, true),
          createCell("Kelola master barang, laporan keuangan, audit log, dan hapus data.", false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Kasir (POS)", false, 22, false, true),
          createCell("kasir", false, 20, true),
          createCell("KasirBengkel#2026", false, 23, true),
          createCell("Transaksi POS kasir, input kendaraan masuk, kalkulasi nota, cetak faktur.", false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Mekanik", false, 22, false, true),
          createCell("mekanik", false, 20, true),
          createCell("MekanikBengkel#2026", false, 23, true),
          createCell("Melihat antrean servis (Kanban), update catatan teknis, pasang sparepart.", false, 35),
        ],
      }),
    ],
  });

  // 2. Table Rincian Penerapan Aspek Keamanan
  const tableSecuritySpecs = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorderSolid,
    rows: [
      new TableRow({
        children: [
          createCell("Mekanisme Keamanan", true, 25),
          createCell("Letak Komponen / Berkas", true, 32),
          createCell("Tujuan & Alasan Penerapan", true, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Password Hashing (bcrypt)", false, 25, false, true),
          createCell("src/app/api/auth/login/route.ts", false, 32),
          createCell("Menyimpan sandi dalam bentuk digest hash searah (cost factor 10) sehingga tetap aman bila database bocor.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("JWT HttpOnly Cookie", false, 25, false, true),
          createCell("src/lib/auth.ts", false, 32),
          createCell("Mencegah pencurian token otentikasi kasir melalui serangan XSS karena cookie tidak dapat dibaca JavaScript peramban.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Prepared Statements (Anti-SQLi)", false, 25, false, true),
          createCell("prisma/schema.prisma", false, 32),
          createCell("Memisahkan kode query database dan data input pengguna; 100% kebal serangan SQL Injection pada pencarian part.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Otorisasi RBAC Middleware", false, 25, false, true),
          createCell("src/middleware.ts", false, 32),
          createCell("Mencegah eskalasi hak akses dan IDOR; peran Mekanik atau Kasir ditolak (HTTP 403) jika mengakses rute administrasi.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Rate Limiting (5x/menit)", false, 25, false, true),
          createCell("src/lib/rate-limit.ts", false, 32),
          createCell("Membatasi percobaan login maksimal 5 kali dalam 1 menit per alamat IP guna menahan serangan brute-force.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Sanitasi Input (Anti-XSS)", false, 25, false, true),
          createCell("src/lib/security.ts", false, 32),
          createCell("Mengubah tag HTML pada catatan keluhan konsumen menjadi entitas karakter aman agar script peramban tidak dieksekusi.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Security Headers (CSP, Anti-Clickjacking)", false, 25, false, true),
          createCell("src/middleware.ts", false, 32),
          createCell("Memasang header X-Frame-Options: DENY (anti Clickjacking), nosniff, dan CSP untuk memastikan integritas sesi.", false, 43),
        ],
      }),
      new TableRow({
        children: [
          createCell("Penyembunyian Rahasia (.gitignore)", false, 25, false, true),
          createCell(".gitignore, .env.example", false, 32),
          createCell("Memastikan file .env yang berisi kunci rahasia dan database URL tidak pernah terunggah ke repositori GitHub publik.", false, 43),
        ],
      }),
    ],
  });

  // 3. Table Hasil Self-Testing Keamanan
  const tableSelfTesting = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorderSolid,
    rows: [
      new TableRow({
        children: [
          createCell("No", true, 6),
          createCell("Skenario Uji", true, 26),
          createCell("Cara Pengujian & Payload", true, 28),
          createCell("Hasil", true, 13),
          createCell("Tindakan / Mitigasi", true, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("1", false, 6, true),
          createCell("SQL Injection pada pencarian part", false, 26),
          createCell("Payload: ' OR '1'='1' -- pada kolom pencarian SKU.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("Prisma ORM menerapkan prepared statements; payload diperlakukan sebagai string teks murni.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("2", false, 6, true),
          createCell("Stored XSS pada catatan servis", false, 26),
          createCell("Payload: <script>alert(1)</script> pada keluhan konsumen.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("HTML entity encoding dan rendering JSX React mengubah tag menjadi karakter aman sehingga script tidak berjalan.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("3", false, 6, true),
          createCell("Bypass Otorisasi / IDOR", false, 26),
          createCell("Login sebagai akun Mekanik, lalu mencoba memanggil API admin /api/security-logs.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("Middleware otorisasi memeriksa role pada JWT dan mengembalikan respon HTTP 403 Forbidden.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("4", false, 6, true),
          createCell("Brute Force Login & Rate Limiter", false, 26),
          createCell("Mengirimkan 6 kali percobaan login salah berurutan dalam waktu kurang dari 1 menit.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("In-memory rate limiter memblokir percobaan ke-6 dengan respon HTTP 429 Too Many Requests.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("5", false, 6, true),
          createCell("Validasi Password Lemah", false, 26),
          createCell("Mencoba membuat akun dengan kata sandi terlalu pendek (\"123\").", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("Validasi skema Zod menolak pendaftaran kata sandi di bawah 8 karakter.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("6", false, 6, true),
          createCell("Pemeriksaan Security Headers", false, 26),
          createCell("Memeriksa respon header server menggunakan perintah curl.exe -s -I.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("Server menyertakan header proteksi X-Frame-Options: DENY, nosniff, dan CSP aktif.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("7", false, 6, true),
          createCell("Pencegahan Kebocoran Secret", false, 26),
          createCell("Memeriksa isi riwayat git log dan berkas .gitignore.", false, 28),
          createCell("LOLOS", false, 13, true, true),
          createCell("Berkas .env tidak ikut terunggah ke repositori Git; hanya berkas .env.example yang dikirim.", false, 27),
        ],
      }),
    ],
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1.18),    // 3.0 cm
              bottom: convertInchesToTwip(1.18), // 3.0 cm
              left: convertInchesToTwip(1.38),   // 3.5 cm
              right: convertInchesToTwip(0.98),  // 2.5 cm
            },
          },
        },
        children: [
          // COVER PAGE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({ text: "LAPORAN PROJEK", bold: true, size: 32, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({ text: "KEAMANAN CYBER", bold: true, size: 28, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 400 },
            children: [
              new TextRun({ text: "Dosen pengampu: Fitra Nugraha, S.Kom., M.Kom.", size: 24, font: "Times New Roman" }),
            ],
          }),

          // Logo UNIKU
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 400 },
            children: logoImageRun ? [logoImageRun] : [],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 40 },
            children: [
              new TextRun({ text: "Disusun oleh:", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: "Apliy Tridiansyah Rosdiana (20240810111)", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 600 },
            children: [
              new TextRun({ text: "TINFC-2024-01", size: 24, font: "Times New Roman" }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 40 },
            children: [
              new TextRun({ text: "PROGRAM STUDI TEKNIK INFORMATIKA", bold: true, size: 25, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: "FAKULTAS ILMU KOMPUTER", bold: true, size: 25, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: "UNIVERSITAS KUNINGAN", bold: true, size: 25, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({ text: "2026", bold: true, size: 25, font: "Times New Roman" }),
            ],
          }),

          // BREAK KE HALAMAN ISI
          new Paragraph({ children: [new PageBreak()] }),

          // 1. URL APLIKASI AKTIF
          heading1("1. URL APLIKASI AKTIF (ONLINE & HTTPS)"),
          bullet("https://onderdil-engine.vercel.app/", "• URL Publik Utama:"),
          bullet("https://onderdil-engine.trycloudflare.com/", "• URL Alternatif (Mirror Tunnel):"),

          // 2. URL REPOSITORY SOURCE CODE
          heading1("2. URL REPOSITORY SOURCE CODE (GITHUB)"),
          bullet("https://github.com/aplyyy/OnderdilEngine", "• Repository Publik GitHub:"),

          // 3. AKUN UJI COBA
          heading1("3. AKUN UJI COBA (TESTING CREDENTIALS)"),
          pText("Untuk mempermudah dosen penguji dalam menguji seluruh hak akses sistem secara bergantian, telah disediakan akun uji coba bawaan sebagai berikut:"),
          tableCredentials,

          // 4. PENJELASAN APLIKASI
          heading1("4. PENJELASAN APLIKASI (ONDERDILENGINE)"),
          heading2("A. Latar Belakang dan Tujuan"),
          pText(
            "Aplikasi OnderdilEngine dibuat untuk menangani kebutuhan operasional transaksi dan servis pada bengkel mobil. Selama ini, pencatatan transaksi kasir dan pengerjaan mekanik masih sering dilakukan secara manual atau menggunakan aplikasi kasir sederhana yang belum memperhatikan celah keamanan web.",
            { indent: true }
          ),
          pText(
            "Pada aplikasi kasir dan bengkel, data suku cadang dan transaksi keuangan merupakan data penting. Jika sistem tidak diamankan dengan benar, penyerang dapat memanfaatkan kelemahan validasi input untuk melakukan SQL Injection pada form pencarian barang, mencuri token sesi kasir melalui celah XSS, atau memanipulasi nomor faktur dan harga servis (IDOR). Oleh karena itu, aplikasi OnderdilEngine dibangun dengan menerapkan prinsip penulisan kode aman (secure coding) guna mencegah serangan umum pada OWASP Top 10 tanpa memperlambat alur kerja kasir dan montir.",
            { indent: true }
          ),

          heading2("B. Fitur Utama Sistem"),
          numbered("1", "Sistem memisahkan tiga hak akses pengguna, yaitu Administrator, Kasir, dan Mekanik. Kata sandi disimpan menggunakan fungsi hash bcrypt. Sesi login dikelola menggunakan token JWT yang disimpan di dalam cookie berstatus HttpOnly dan Secure agar tidak bisa dibaca oleh script JavaScript peramban.", "Autentikasi & Kontrol Akses (RBAC):"),
          numbered("2", "Kasir dapat mencari suku cadang dengan cepat, menambahkan barang ke keranjang belanja, menggabungkan biaya jasa servis montir, menghitung diskon dan nominal kembalian, serta mencetak nota pembayaran (faktur) dalam format cetak thermal receipt.", "Transaksi Kasir POS & Cetak Nota:"),
          numbered("3", "Halaman montir menampilkan tahapan kendaraan mulai dari status Menunggu, Sedang Dikerjakan, hingga Selesai. Montir dapat menuliskan catatan perbaikan dan memilih suku cadang yang dipasang, yang secara otomatis akan mengurangi stok barang di gudang.", "Alur Kerja Antrean Servis (Kanban Board):"),
          numbered("4", "Pengelolaan data barang meliputi kode SKU, nama barang, kategori, harga modal, harga jual, dan jumlah stok fisik. Sistem dilengkapi penanda stok menipis (Low Stock Alert) jika persediaan barang berada di bawah batas minimum (5 unit).", "Master Data Suku Cadang (CRUD):"),
          numbered("5", "Rekapitulasi transaksi kasir menampilkan total pendapatan, perbandingan omzet suku cadang dengan jasa montir, serta fitur unduh laporan transaksi ke berkas CSV.", "Laporan Penjualan & Ekspor CSV:"),

          // BREAK
          new Paragraph({ children: [new PageBreak()] }),

          heading2("C. Arsitektur dan Teknologi yang Digunakan"),
          bullet("Next.js versi 15 (App Router) berbasis runtime Node.js v24 dan bahasa pemrograman TypeScript.", "• Framework Utama:"),
          bullet("SQLite untuk lingkungan pengembangan lokal dan PostgreSQL untuk lingkungan server produksi, dikelola melalui Prisma ORM yang secara otomatis menggunakan Parameterized Queries.", "• Basis Data & ORM:"),
          bullet("Modul bcryptjs untuk hashing kata sandi dan modul jose untuk pembuatan serta verifikasi cryptographic signature token JWT.", "• Kriptografi & Manajemen Sesi:"),
          bullet("Pustaka zod untuk memastikan tipe data yang dikirimkan ke server sesuai dengan skema yang diizinkan.", "• Validasi Input:"),
          bullet("Tailwind CSS v4 dengan tata letak dashboard sidebar profesional bertema otomotif gelap (dark slate).", "• Antarmuka Pengguna:"),
          bullet("Next.js Edge Middleware untuk memasang HTTP Security Headers seperti Content-Security-Policy (CSP), X-Frame-Options: DENY, dan X-Content-Type-Options: nosniff.", "• Keamanan HTTP:"),

          heading2("D. Rincian Penerapan Aspek Keamanan"),
          pText("Penerapan kontrol keamanan pada kode program dirangkum pada tabel berikut:"),
          tableSecuritySpecs,

          // 5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI
          heading1("5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI"),
          pText(
            "Proyek aplikasi OnderdilEngine ini memiliki landasan teknis yang dapat dikembangkan lebih lanjut menjadi topik Skripsi atau Tugas Akhir di tingkat 4 dengan usulan judul:",
            { indent: true }
          ),
          pText(
            "\"Rancang Bangun Sistem Point-of-Sale dan Operasional Bengkel Mobil Menggunakan Arsitektur Zero-Trust dengan Penerapan Algoritma Peramalan Stok Barang dan Audit Trail Anti-Manipulasi\"",
            { align: AlignmentType.CENTER, bold: true, before: 100, after: 100 }
          ),

          heading2("Rumusan Masalah yang Diusulkan:"),
          numbered("1", "Bagaimana merancang struktur pencatatan riwayat transaksi kasir dan servis yang tidak dapat dimanipulasi (anti-tamper log) menggunakan metode verifikasi hash berantai (cryptographic hash chaining)?"),
          numbered("2", "Bagaimana menerapkan algoritma peramalan deret waktu (time-series forecasting, seperti Single Exponential Smoothing atau Moving Average) pada data historis transaksi kasir guna memperkirakan kebutuhan stok suku cadang berkala secara akurat?"),
          numbered("3", "Bagaimana mendeteksi anomali pada pencatatan transaksi servis (misalnya manipulasi waktu pengerjaan mekanik atau pemberian diskon tidak wajar) menggunakan algoritma pembelajaran mesin (machine learning)?"),

          heading2("Rencana Fitur Lanjutan:"),
          bullet("Integrasi pengingat servis otomatis berbasis pesan WhatsApp ke nomor telepon pelanggan berdasarkan perkiraan jarak tempuh kendaraan (kilometer)."),
          bullet("Integrasi pembaca data OBD-II melalui koneksi Bluetooth untuk membaca kode kerusakan mobil (Diagnostic Trouble Code) langsung ke formulir keluhan teknis."),

          // BREAK
          new Paragraph({ children: [new PageBreak()] }),

          // 6. PENGGUNAAN ASISTEN AI
          heading1("6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)"),
          pText(
            "Sesuai dengan pedoman tugas poin 3e, pengembangan aplikasi ini dibantu oleh AI Agent (Antigravity by Google DeepMind) secara bertanggung jawab dan terbuka.",
            { indent: true }
          ),
          bullet("Perancangan struktur relasi tabel basis data Prisma, penyusunan fungsi hashing sandi bcrypt, pembuatan signed token JWT, fungsi sanitasi karakter XSS, in-memory sliding window rate limiter, serta layout sidebar modern.", "• Bagian Pekerjaan yang Dibantu AI:"),
          bullet("\"Buatkan API rute transaksi kasir POS bengkel di Next.js menggunakan Prisma $transaction: hitung total harga suku cadang dan biaya jasa mekanik, kurangi stok fisik suku cadang secara aman dari race condition, generate nomor nota invoice unik, dan tolak pembayaran jika uang yang diterima kurang.\"", "• Contoh Prompt Utama yang Digunakan:"),
          bullet("Setiap baris kode yang disarankan oleh asisten AI diperiksa kembali secara manual untuk memastikan fungsinya benar, tidak terdapat celah keamanan yang terlewat, tidak ada kunci rahasia yang tertulis langsung pada kode, serta diuji kelayakannya melalui perintah npm run build dengan hasil seluruh rute (18/18) terkompilasi tanpa kesalahan.", "• Cara Mahasiswa Menguji dan Memverifikasi Hasil:"),

          // 7. HASIL SELF-TESTING KEAMANAN
          heading1("7. HASIL SELF-TESTING KEAMANAN (MINIMAL 5 SKENARIO)"),
          pText("Pengujian mandiri telah dilakukan pada sistem dan dicatat hasilnya dalam tabel berikut:"),
          tableSelfTesting,

          // 8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN
          heading1("8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN"),
          bullet("Aplikasi telah siap dijalankan pada lingkungan hosting publik menggunakan sertifikat SSL/TLS yang valid.", "• Bukti HTTPS & Domain Aktif:"),
          bullet("Modul kasir berhasil memproses transaksi suku cadang dan ongkos servis montir secara real-time serta menghasilkan nota siap cetak.", "• Bukti Fungsi Kasir POS & Cetak Nota:"),
          bullet("Status pengerjaan kendaraan dapat diperbarui oleh mekanik, dan master barang otomatis menampilkan penanda peringatan jika stok berada pada batas minimum.", "• Bukti Alur Servis & Peringatan Stok:"),
          bullet("Pengerjaan aplikasi dilakukan secara bertahap dan tercatat pada riwayat commit repositori GitHub mahasiswa.", "• Bukti Riwayat Git Commit:"),
          bullet("Uji respon terminal memastikan server menyertakan header keamanan lengkap untuk mencegah clickjacking dan eksploitasi MIME-type.", "• Bukti Respon Header Keamanan:"),

          // 9. KENDALA DAN RENCANA PERBAIKAN
          heading1("9. KENDALA DAN RENCANA PERBAIKAN"),
          heading2("Kendala Teknis yang Berhasil Diatasi:"),
          bullet("Pada saat awal inisialisasi, styling utilitas belum terkompilasi karena Next.js 16 memerlukan konfigurasi khusus PostCSS. Kendala ini diselesaikan dengan menambahkan paket @tailwindcss/postcss dan konfigurasi postcss.config.mjs.", "• Kompilasi Styling Tailwind v4:"),
          bullet("Untuk mencegah kesalahan pengurangan stok saat beberapa kasir memproses transaksi pada detik yang sama, query database dibungkus ke dalam transaksi atomik prisma.$transaction.", "• Pencegahan Selisih Stok (Race Condition):"),

          heading2("Rencana Perbaikan Mendatang:"),
          bullet("Menambahkan integrasi payment gateway otomatis agar konsumen dapat membayar nota servis melalui scan kode QRIS.", "• Integrasi Pembayaran QRIS:"),
          bullet("Mengirimkan struk transaksi dalam bentuk PDF secara langsung ke nomor WhatsApp konsumen sesaat setelah pembayaran selesai.", "• Kirim Nota Digital:"),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve("TugasProject_CyberSec_ApliyTridiansyahRosdiana_20240810111.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Full DOCX report successfully generated at:", outPath);
}

generateFullDocx().catch((err) => {
  console.error("Error generating DOCX:", err);
  process.exit(1);
});
