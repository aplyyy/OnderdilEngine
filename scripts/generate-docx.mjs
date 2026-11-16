import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle } from "docx";
import fs from "fs";
import path from "path";

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cover
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: "LAPORAN PROJEK", bold: true, size: 32, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 100 },
            children: [
              new TextRun({ text: "KEAMANAN CYBER", bold: true, size: 28, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 600 },
            children: [
              new TextRun({ text: "Dosen pengampu: Fitra Nugraha, S.Kom., M.Kom.", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 100 },
            children: [
              new TextRun({ text: "Disusun oleh:", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({ text: "Apliy Tridiansyah Rosdiana (20240810111)", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 800 },
            children: [
              new TextRun({ text: "TINFC-2024-01", size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 1000, after: 50 },
            children: [
              new TextRun({ text: "PROGRAM STUDI TEKNIK INFORMATIKA", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({ text: "FAKULTAS ILMU KOMPUTER", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 50 },
            children: [
              new TextRun({ text: "UNIVERSITAS KUNINGAN", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 400 },
            pageBreakBefore: true,
            children: [
              new TextRun({ text: "2026", bold: true, size: 26, font: "Times New Roman" }),
            ],
          }),

          // Section 1
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "1. URL APLIKASI AKTIF (ONLINE & HTTPS)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• URL Publik Utama: https://onderdil-engine.vercel.app/\n• URL Alternatif: https://onderdil-engine.trycloudflare.com/", size: 24, font: "Times New Roman" }),
            ],
          }),

          // Section 2
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "2. URL REPOSITORY SOURCE CODE (GITHUB)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Repository GitHub: https://github.com/Apliy3Dyansyah/OnderdilEngine", size: 24, font: "Times New Roman" }),
            ],
          }),

          // Section 3
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "3. AKUN UJI COBA (TESTING CREDENTIALS)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Administrator: admin / AdminBengkel#2026 (Akses penuh master part, laporan, audit log)\n2. Kasir POS: kasir / KasirBengkel#2026 (Transaksi POS kasir, input kendaraan, cetak nota)\n3. Mekanik: mekanik / MekanikBengkel#2026 (Board antrean servis Kanban, catatan teknis)", size: 24, font: "Times New Roman" }),
            ],
          }),

          // Section 4
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "4. PENJELASAN APLIKASI (ONDERDILENGINE)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "OnderdilEngine (Automotive Point-of-Sale & Workshop Management System) dikembangkan untuk memenuhi kebutuhan operasional bengkel mobil modern yang mengintegrasikan transaksi kasir cepat, keandalan alur kerja servis kendaraan, dan pengawasan inventaris suku cadang. Banyak sistem kasir web konvensional rentan terhadap ancaman siber seperti injeksi basis data (SQLi), pemalsuan atau manipulasi parameter nota pembayaran (IDOR), pencurian token otentikasi melalui Cross-Site Scripting (XSS), serta serangan penebakan kata sandi berulang (brute-force). OnderdilEngine dibangun dengan paradigma Security by Design berbasis standar OWASP Top 10 guna menjamin kerahasiaan, keutuhan data transaksi, dan ketersediaan sistem tanpa mengorbankan kenyamanan staf kasir maupun teknisi bengkel.",
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),

          // Section 5
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "5. POTENSI PENGEMBANGAN SEBAGAI TOPIK SKRIPSI", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Judul Usulan Skripsi: \"Rancang Bangun Sistem Point-of-Sale & Manajemen Operasional Bengkel Otomotif Berbasis Zero-Trust Architecture dengan Algoritma Peramalan Kebutuhan Suku Cadang dan Audit Trail Anti-Tamper\".\n\nRumusan Masalah:\n1. Bagaimana merancang mekanisme integritas catatan transaksi kasir dan alokasi suku cadang yang tahan manipulasi (anti-tamper log) menggunakan teknik Cryptographic Hash Chaining sehingga setiap kecurangan dapat diverifikasi secara matematis?\n2. Bagaimana mengimplementasikan algoritma peramalan deret waktu (Single Exponential Smoothing / Moving Average) pada riwayat data transaksi POS untuk memprediksi restock suku cadang secara presisi?\n3. Bagaimana menerapkan algoritma machine learning untuk mendeteksi anomali transaksi kasir (fraud detection) pada jam kerja montir dan selisih stok suku cadang?",
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),

          // Section 6
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "6. PENGGUNAAN ASISTEN AI (AI AGENT TRANSPARENCY)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFY,
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: "Pengembangan sistem ini dibantu oleh AI Agent (Antigravity by Google DeepMind) secara bertanggung jawab. Bantuan AI mencakup perancangan skema relasional tabel Prisma, penulisan middleware enkripsi JWT, verifikasi password bcrypt, sanitasi XSS, serta arsitektur layout sidebar modern. Seluruh kode yang dihasilkan AI diverifikasi baris demi baris, diuji terhadap input berbahaya (SQLi & XSS), dan divalidasi dengan npm run build dengan hasil 18/18 routes lulus kompilasi tanpa error.",
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),

          // Section 7
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({ text: "7. HASIL SELF-TESTING KEAMANAN (MINIMAL 5 SKENARIO)", bold: true, size: 24, font: "Times New Roman" }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. SQL Injection pada Pencarian Part: LOLOS (Prepared Statements via Prisma ORM)\n2. Stored Cross-Site Scripting (XSS): LOLOS (HTML Entity Encoding & Virtual DOM Escaping)\n3. Broken Access Control & IDOR: LOLOS (Role-based JWT Middleware memblokir non-admin HTTP 403)\n4. Brute Force Login & Rate Limiting: LOLOS (In-memory rate limiter memblokir percobaan ke-6 HTTP 429)\n5. Validasi Kata Sandi Lemah: LOLOS (Skema Zod menolak password pendek < 8 karakter)\n6. Audit Security Headers: LOLOS (CSP, nosniff, X-Frame-Options: DENY aktif)\n7. Pencegahan Kebocoran Secret: LOLOS (.env dikecualikan dari Git commit)",
                size: 24,
                font: "Times New Roman",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve("TugasProject_CyberSec_ApliyTridiansyahRosdiana_20240810111.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("DOCX generated at:", outPath);
}

generateDocx().catch(console.error);
