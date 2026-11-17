import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata: Metadata = {
  title: "OnderdilEngine - POS & Manajemen Operasional Bengkel Mobil",
  description: "Aplikasi Web POS dan Manajemen Operasional Bengkel Mobil.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#f8fafc] text-slate-900 min-h-screen antialiased selection:bg-amber-400 selection:text-slate-950">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
