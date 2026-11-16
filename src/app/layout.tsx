import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "OnderdilEngine - POS & Manajemen Operasional Bengkel Mobil",
  description: "Aplikasi Web POS dan Manajemen Servis Bengkel Mobil dengan Penerapan Standar Keamanan Cyber Security OWASP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500 font-mono">
          OnderdilEngine &copy; 2026 &bull; Tugas Besar Cyber Security &bull; Secure Coding &amp; OWASP Compliant
        </footer>
      </body>
    </html>
  );
}
