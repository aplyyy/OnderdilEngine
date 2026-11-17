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
      indent: options.indent ? { firstLine: 720 } : undefined, // ~1.27cm
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
          createCell("Peran (Role)", true, 20),
          createCell("Username", true, 18),
          createCell("Password", true, 27),
          createCell("Hak Akses & Wewenang", true, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Administrator", false, 20, false, true),
          createCell("admin", false, 18, true),
          createCell("admin / AdminBengkel#2026", false, 27, true),
          createCell("Memiliki akses penuh untuk menambah, mengedit, dan menghapus stok suku cadang, melihat audit log keamanan, serta memeriksa rekapitulasi laporan keuangan.", false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Kasir", false, 20, false, true),
          createCell("kasir", false, 18, true),
          createCell("kasir / KasirBengkel#2026", false, 27, true),
          createCell("Dapat mendaftarkan kendaraan servis baru, memilih suku cadang, menggabungkan ongkos jasa montir, menghitung kembalian, dan mencetak nota pembayaran (faktur).", false, 35),
        ],
      }),
      new TableRow({
        children: [
          createCell("Mekanik", false, 20, false, true),
          createCell("mekanik", false, 18, true),
          createCell("mekanik / MekanikBengkel#2026", false, 27, true),
          createCell("Dapat memantau antrean kendaraan servis (Kanban), memperbarui status pengerjaan, menulis catatan perbaikan fisik, dan mengalokasikan suku cadang yang digunakan.", false, 35),
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
          createCell("Aspek Keamanan", true, 25),
          createCell("Letak File / Komponen", true, 30),
          createCell("Tujuan & Mekanisme Pengamanan", true, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Password Hashing (bcrypt)", false, 25, false, true),
          createCell("src/app/api/auth/login/route.ts", false, 30),
          createCell("Password pengguna disimpan dalam bentuk digest hash searah dengan salt, sehingga kata sandi asli tidak dapat diketahui meskipun database bocor.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("JWT HttpOnly Cookie", false, 25, false, true),
          createCell("src/lib/auth.ts", false, 30),
          createCell("Token login disimpan pada cookie dengan atribut HttpOnly, sehingga script jahat di browser tidak dapat membaca atau mencuri token sesi kasir (anti-XSS).", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Prepared Statements (Anti-SQLi)", false, 25, false, true),
          createCell("prisma/schema.prisma", false, 30),
          createCell("Prisma ORM memisahkan logika query SQL dari parameter input pengguna. Karakter aneh seperti tanda kutip pada kolom pencarian part hanya dianggap teks string biasa.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Role-Based Access Control (RBAC)", false, 25, false, true),
          createCell("src/middleware.ts", false, 30),
          createCell("Membatasi hak akses antar peran. Jika akun mekanik atau kasir mencoba mengakses URL atau endpoint administrator, sistem langsung menolak dengan status HTTP 403 Forbidden.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Rate Limiting (Anti-Brute Force)", false, 25, false, true),
          createCell("src/lib/rate-limit.ts", false, 30),
          createCell("Membatasi percobaan login maksimal 5 kali per menit per alamat IP. Percobaan ke-6 otomatis diblokir dengan respon HTTP 429 Too Many Requests.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Sanitasi Input (Anti-XSS)", false, 25, false, true),
          createCell("src/lib/security.ts", false, 30),
          createCell("Melakukan entity encoding pada teks input keluhan servis, ditambah perlindungan bawaan React JSX escaping agar tag HTML/script tidak dapat dieksekusi.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Security Headers", false, 25, false, true),
          createCell("src/middleware.ts", false, 30),
          createCell("Menambahkan header proteksi browser seperti X-Frame-Options: DENY untuk mencegah clickjacking dan nosniff untuk mencegah manipulasi MIME-type.", false, 45),
        ],
      }),
      new TableRow({
        children: [
          createCell("Proteksi Kredensial (.gitignore)", false, 25, false, true),
          createCell(".gitignore, .env.example", false, 30),
          createCell("Memastikan kunci rahasia (JWT secret dan konfigurasi database) tidak ikut terunggah ke repositori publik GitHub.", false, 45),
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
          createCell("Skenario Pengujian", true, 25),
          createCell("Metode & Payload Uji", true, 28),
          createCell("Hasil Uji", true, 14),
          createCell("Analisis & Mitigasi", true, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("1", false, 6, true),
          createCell("SQL Injection pada Form Pencarian", false, 25),
          createCell("Payload: ' OR '1'='1' -- pada kolom pencarian suku cadang.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Prisma ORM menerapkan prepared statements; payload diperlakukan sebagai teks string biasa sehingga query SQL tidak bocor.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("2", false, 6, true),
          createCell("Stored XSS pada Catatan Servis", false, 25),
          createCell("Payload: <script>alert(1)</script> pada kolom keluhan pelanggan.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Karakter di-encode menjadi entitas aman dan dirender secara aman oleh React JSX, script tidak dieksekusi browser.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("3", false, 6, true),
          createCell("Broken Access Control / IDOR", false, 25),
          createCell("Login menggunakan akun Mekanik, lalu mencoba mengakses endpoint data admin /api/security-logs.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Middleware otorisasi memeriksa role pada JWT dan langsung memblokir akses dengan kode respon HTTP 403 Forbidden.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("4", false, 6, true),
          createCell("Brute Force Login & Rate Limiting", false, 25),
          createCell("Mengirimkan 6 kali percobaan login dengan password salah secara berturut-turut dalam waktu 1 menit.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Sistem rate limiter memblokir percobaan ke-6 dengan respon HTTP 429 Too Many Requests (cooldown 60 detik).", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("5", false, 6, true),
          createCell("Validasi Password Lemah", false, 25),
          createCell("Mencoba input password pendek kurang dari 8 karakter pada form registrasi.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Skema validasi Zod pada backend menolak data dan memberikan pesan error bahwa password minimal 8 karakter.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("6", false, 6, true),
          createCell("Pemeriksaan Security Headers", false, 25),
          createCell("Memeriksa respon header web menggunakan perintah curl -I di terminal.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("Respon server menyertakan header proteksi lengkap: X-Frame-Options: DENY, nosniff, dan CSP.", false, 27),
        ],
      }),
      new TableRow({
        children: [
          createCell("7", false, 6, true),
          createCell("Pencegahan Kebocoran Secret", false, 25),
          createCell("Memeriksa status git dan berkas .gitignore.", false, 28),
          createCell("LOLOS", false, 14, true, true),
          createCell("File .env yang berisi JWT secret dan database credentials tidak terunggah ke repositori GitHub.", false, 27),
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
            spacing: { before: 80, after: 60 },
            children: [
              new TextRun({ text: "LAPORAN PROJEK MANDIRI", bold: true, size: 30, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: "MATA KULIAH KEAMANAN CYBER", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 360 },
            children: [
              new TextRun({ text: "Dosen Pengampu: Fitra Nugraha, S.Kom., M.Kom.", size: 24, font: "Times New Roman" }),
            ],
          }),

          // Logo UNIKU
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 360 },
            children: logoImageRun ? [logoImageRun] : [],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 360, after: 40 },
            children: [
              new TextRun({ text: "Disusun Oleh:", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: "Apliy Tridiansyah Rosdiana", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: "NIM: 20240810111", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 500 },
            children: [
              new TextRun({ text: "Kelas: TINFC-2024-01", size: 24, font: "Times New Roman" }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 40 },
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
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({ text: "2026", bold: true, size: 25, font: "Times New Roman" }),
            ],
          }),

          // BREAK KE HALAMAN ISI
          new Paragraph({ children: [new PageBreak()] }),

          // 1. URL APLIKASI AKTIF
          heading1("1. URL APLIKASI AKTIF (ONLINE & HTTPS)"),
          pText("Aplikasi telah saya pasang dan jalankan secara online sehingga dapat diakses dan diuji langsung melalui browser dengan koneksi aman (HTTPS):"),
          bullet("https://onderdil-engine.vercel.app/", "• URL Publik Utama (Deployment Vercel Cloud):"),
          bullet("https://onderdil-engine.trycloudflare.com/", "• URL Alternatif (Mirror Cloudflare Tunnel):"),

          // 2. URL REPOSITORY SOURCE CODE
          heading1("2. URL REPOSITORY SOURCE CODE (GITHUB)"),
          pText("Seluruh kode sumber aplikasi, riwayat commit pengerjaan, dan konfigurasi sistem tersimpan secara rapi pada repositori GitHub publik:"),
          bullet("https://github.com/aplyyy/OnderdilEngine", "• Tautan Repositori GitHub:"),

          // 3. AKUN UJI COBA
          heading1("3. AKUN UJI COBA (TESTING CREDENTIALS)"),
          pText("Untuk memudahkan Bapak Dosen dalam menguji pembagian hak akses (Role-Based Access Control) pada aplikasi ini, saya menyediakan tiga akun pengujian sesuai tingkatan perannya. Selain memasukkan secara manual, pada halaman /login juga sudah saya sediakan tombol 1-Click Demo agar proses masuk ke akun uji coba dapat dilakukan dengan cepat:"),
          tableCredentials,

          // 4. PENJELASAN APLIKASI
          heading1("4. PENJELASAN APLIKASI (ONDERDILENGINE)"),
          heading2("A. Latar Belakang dan Tujuan"),
          pText(
            "Ide pembuatan aplikasi OnderdilEngine ini berawal dari pengamatan saya terhadap masalah operasional yang sering ditemui pada bengkel kendaraan roda empat. Banyak bengkel konvensional yang masih menggunakan pencatatan buku nota manual. Akibatnya, nota belanja kerap terselip, pencatatan stok suku cadang di gudang sering tidak cocok dengan stok fisik, dan kasir kesulitan merekap pembagian antara biaya suku cadang dengan ongkos kerja mekanik.",
            { indent: true }
          ),
          pText(
            "Sebagai mahasiswa Teknik Informatika yang mengambil mata kuliah Keamanan Cyber, fokus utama saya bukan hanya membuat sistem kasir yang berjalan lancar, melainkan juga memastikan aplikasi ini tahan terhadap celah keamanan web yang umum terjadi. Sistem kasir dan bengkel menyimpan data sensitif berupa riwayat transaksi keuangan dan data suku cadang. Jika tidak diamankan dengan benar, aplikasi kasir rentan diserang menggunakan SQL Injection pada kolom pencarian barang, pencurian cookie sesi kasir melalui celah XSS, atau manipulasi nomor faktur belanja (IDOR). Oleh karena itu, saya merancang aplikasi ini dengan menerapkan praktik secure coding berbasis panduan OWASP Top 10.",
            { indent: true }
          ),

          heading2("B. Fitur-Fitur Utama Aplikasi"),
          numbered("1", "Sistem memisahkan hak akses menjadi tiga peran (Administrator, Kasir, dan Mekanik). Kata sandi diamankan menggunakan fungsi hash bcrypt, dan sesi pengguna dikelola dengan token JWT yang disimpan pada cookie beratribut HttpOnly dan Secure agar kebal dari pencurian script berbahaya.", "Sistem Autentikasi dan Pembagian Peran (RBAC):"),
          numbered("2", "Petugas kasir dapat mencari suku cadang dengan cepat, menambahkan barang ke keranjang belanja, menggabungkan biaya jasa mekanik, menghitung nominal kembalian otomatis, dan langsung mencetak nota pembayaran berformat rapi.", "Kasir Point-of-Sale (POS) & Cetak Faktur:"),
          numbered("3", "Halaman antrean kerja montir menampilkan status kendaraan secara bertahap: Menunggu -> Sedang Dikerjakan -> Selesai -> Lunas. Mekanik dapat memilih suku cadang yang dipasang, yang secara otomatis akan memotong jumlah stok fisik di gudang.", "Papan Alur Kerja Servis Mekanik (Kanban):"),
          numbered("4", "Memuat data kode SKU, harga modal/beli, harga jual konsumen, serta fitur Low Stock Alert yang memberikan tanda peringatan jika stok barang tersisa di bawah ambang batas minimal (5 unit).", "Manajemen Persediaan Suku Cadang:"),
          numbered("5", "Halaman laporan menampilkan total omzet bengkel, perbandingan keuntungan suku cadang dengan jasa montir, serta fitur unduh data transaksi ke format CSV untuk pembukuan di Microsoft Excel.", "Laporan Penjualan & Ekspor Data CSV:"),

          // BREAK
          new Paragraph({ children: [new PageBreak()] }),

          heading2("C. Arsitektur dan Teknologi yang Digunakan"),
          bullet("Next.js versi 16 (App Router) berbasis runtime Node.js dan bahasa pemrograman TypeScript.", "• Framework Aplikasi:"),
          bullet("SQLite yang dikelola menggunakan Prisma ORM. Penggunaan Prisma ORM memastikan seluruh query database otomatis menggunakan Parameterized Queries / Prepared Statements sehingga kebal terhadap serangan SQL Injection.", "• Database & ORM:"),
          bullet("Pustaka bcryptjs untuk hashing kata sandi akun dan pustaka jose untuk penandatanganan kriptografis token sesi JWT.", "• Keamanan Kriptografi:"),
          bullet("Pustaka zod untuk memastikan data yang dikirim ke server sesuai dengan skema tipe data yang valid.", "• Validasi Input:"),
          bullet("Tailwind CSS dengan desain modern bergaya bersih (clean SaaS), kontras warna yang nyaman dibaca, serta tata letak responsif untuk layar handphone mekanik maupun laptop kasir.", "• Tampilan Antarmuka:"),
          bullet("Middleware Next.js untuk menyematkan HTTP Security Headers seperti X-Frame-Options: DENY, X-Content-Type-Options: nosniff, dan Content-Security-Policy.", "• Pengamanan Header HTTP:"),

          heading2("D. Penerapan Aspek Keamanan pada Aplikasi"),
          pText("Penerapan pengamanan yang saya bangun pada source code dirangkum dalam tabel berikut:"),
          tableSecuritySpecs,

          // 5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI
          heading1("5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI"),
          pText(
            "Projek ini memiliki potensi yang sangat baik untuk saya kembangkan lebih lanjut menjadi topik Skripsi / Tugas Akhir pada semester akhir nanti. Rencana usulan judul skripsi yang berkaitan dengan projek ini adalah:",
            { indent: true }
          ),
          pText(
            "\"Rancang Bangun Sistem Informasi Kasir dan Antrean Servis Bengkel Mobil Berbasis Web dengan Penerapan Role-Based Access Control dan Analisis Pengendalian Stok Suku Cadang\"",
            { align: AlignmentType.CENTER, bold: true, before: 120, after: 120 }
          ),

          heading2("Rumusan Masalah yang Direncanakan:"),
          numbered("1", "Bagaimana merancang sistem kasir dan antrean servis kendaraan yang saling terintegrasi agar meminimalisir kesalahan perhitungan biaya serta mencegah selisih stok suku cadang fisik di gudang?"),
          numbered("2", "Bagaimana menerapkan mekanisme keamanan Role-Based Access Control (RBAC) dan perlindungan SQL Injection untuk memastikan data transaksi keuangan dan hak akses bengkel terlindungi dengan baik?"),
          numbered("3", "Bagaimana merancang fitur rekapitulasi data penjualan suku cadang agar dapat membantu pemilik bengkel dalam memantau omzet serta merencanakan pengadaan barang secara tepat waktu?"),

          heading2("Rencana Fitur Tambahan untuk Skripsi:"),
          bullet("Integrasi pengiriman bukti nota servis langsung ke nomor WhatsApp pelanggan secara otomatis saat status transaksi dinyatakan lunas."),
          bullet("Integrasi metode pembayaran digital berbasis QRIS dinamis untuk mempermudah konsumen dalam bertransaksi non-tunai."),
          bullet("Penambahan fitur cetak nota langsung ke printer kasir thermal (Bluetooth / USB)."),

          // BREAK
          new Paragraph({ children: [new PageBreak()] }),

          // 6. PENGGUNAAN ASISTEN AI
          heading1("6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)"),
          pText(
            "Sesuai ketentuan pedoman tugas (Poin 3e), dalam pengerjaan projek mandiri ini saya memanfaatkan bantuan asisten AI (Google Antigravity) secara terbuka dan etis sebagai sarana belajar serta pembantu penulisan kode:",
            { indent: true }
          ),
          bullet("Membantu merancang struktur relasi tabel database di Prisma ORM (User, Sparepart, ServiceOrder, Transaction, dan SecurityLog), membantu mencari contoh implementasi fungsi hashing password bcrypt dan pembuatan token JWT pada framework Next.js App Router, membantu menyusun tata letak antarmuka kasir dan komponen kanban mekanik menggunakan utility class Tailwind CSS, serta membantu menyelesaikan kendala konfigurasi PostCSS saat menggunakan Next.js versi 16.", "• Bagian Pengerjaan yang Dibantu AI:"),
          bullet("\"Tolong bantu buatkan rute API kasir di Next.js menggunakan Prisma transaction: hitung total harga suku cadang ditambah ongkos servis, kurangi stok fisik suku cadang secara aman dari race condition, buatkan nomor faktur nota unik, dan tolak pembayaran jika uang yang dibayarkan kurang.\"", "• Contoh Prompt yang Saya Gunakan:"),
          bullet("Setiap baris kode yang disarankan oleh asisten AI tidak langsung saya pakai begitu saja. Saya memeriksa kembali logika alur programnya, memastikan query database menggunakan parameter binding yang aman, memastikan tidak ada celah keamanan atau kunci rahasia yang tertulis langsung di kode program, serta menguji langsung fungsinya di browser lokal dan menjalankan npm run build untuk memastikan tidak ada error kompilasi.", "• Cara Saya Menguji dan Memverifikasi Hasil AI:"),

          // 7. HASIL SELF-TESTING KEAMANAN
          heading1("7. HASIL SELF-TESTING KEAMANAN (7 SKENARIO PENGUJIAN)"),
          pText("Untuk memastikan proteksi berjalan sesuai rencana, saya melakukan pengujian mandiri terhadap 7 skenario serangan web dengan hasil sebagai berikut:"),
          tableSelfTesting,

          // 8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN
          heading1("8. BUKTI OPERASIONAL DAN IMPLEMENTASI KEAMANAN"),
          pText("Seluruh bagian aplikasi telah berhasil diuji dan berjalan normal dengan rincian bukti sebagai berikut:"),
          bullet("Aplikasi dapat diakses secara publik pada domain Vercel dengan sertifikat SSL/TLS aktif.", "• Koneksi HTTPS Aktif:"),
          bullet("Kasir dapat memproses transaksi pembelian suku cadang maupun jasa servis secara real-time serta mencetak nota bukti pembayaran.", "• Fungsi Kasir POS Berjalan Lancar:"),
          bullet("Mekanik dapat memperbarui status pengerjaan mobil dan stok barang fisik otomatis berkurang saat suku cadang dipasang.", "• Alur Antrean Mekanik Berfungsi:"),
          bullet("Proses pengerjaan tercatat bertahap pada commit log repositori GitHub mahasiswa.", "• Riwayat Git Commit Terstruktur:"),

          // 9. KENDALA DAN RENCANA PERBAIKAN
          heading1("9. KENDALA DAN RENCANA PERBAIKAN"),
          heading2("Kendala yang Dihadapi Selama Pengerjaan:"),
          bullet("Pada awal pengerjaan, sempat terjadi kendala styling Tailwind CSS v4 pada Next.js 16. Masalah ini berhasil diselesaikan dengan menyesuaikan dependensi PostCSS.", "• Konfigurasi CSS pada Versi Framework Terbaru:"),
          bullet("Untuk mencegah kesalahan pengurangan stok jika ada transaksi bersamaan, query database dibungkus menggunakan transaksi atomik prisma.$transaction.", "• Pencegahan Selisih Stok (Race Condition):"),
          bullet("Mengatur tampilan agar antarmuka kasir dan mekanik tetap mudah digunakan saat dibuka melalui smartphone di area bengkel.", "• Penyesuaian Tampilan Mobile:"),

          heading2("Rencana Perbaikan ke Depan:"),
          bullet("Menambahkan integrasi pembayaran QRIS dinamis agar pembayaran non-tunai bisa langsung terverifikasi otomatis.", "• Pembayaran Digital QRIS:"),
          bullet("Mengembangkan fitur pengiriman bukti nota digital langsung ke kontak WhatsApp pelanggan.", "• Pengiriman Nota WhatsApp:"),
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
