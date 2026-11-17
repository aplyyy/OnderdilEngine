"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  AlertTriangle,
  TrendingUp,
  Car,
  Package,
  Calendar,
  Printer,
  CheckCircle,
} from "lucide-react";

export default function LaporanPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Gagal memuat laporan.");
        return;
      }
      setData(result);
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    window.location.href = "/api/reports?format=csv";
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Memuat rekapitulasi data bengkel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium">
        {error}
      </div>
    );
  }

  const { summary, lowStockParts, recentTransactions } = data;

  return (
    <div className="space-y-8">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Laporan &amp; Rekapitulasi Bengkel</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau total omzet finansial, margin penjualan suku cadang, jasa montir, dan status suku cadang.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-sm font-bold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor ke Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Omzet Penjualan</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-slate-500">
            Total {summary.transactionCount} transaksi selesai diproses
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Pendapatan Suku Cadang</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Rp {summary.totalPartsIncome.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-slate-500">
            Dari suku cadang yang terjual
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Pendapatan Jasa Servis</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Rp {summary.totalServiceIncome.toLocaleString("id-ID")}
          </div>
          <div className="text-xs text-slate-500">
            Dari {summary.totalOrders} kendaraan yang diservis
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Peringatan Stok Menipis</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600">
            {summary.lowStockCount} Part
          </div>
          <div className="text-xs text-slate-500">
            Di bawah batas stok aman
          </div>
        </div>
      </div>

      {/* Low Stock Warning Table */}
      {lowStockParts && lowStockParts.length > 0 && (
        <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-red-900">
                  Daftar Suku Cadang Menipis (Perlu Pengadaan)
                </h3>
                <p className="text-xs text-slate-500">
                  Barang-barang ini sudah melewati batas aman dan perlu segera dipesan ulang ke suplier.
                </p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold w-fit">
              {lowStockParts.length} barang kritis
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode SKU</th>
                  <th className="py-3 px-4">Nama Suku Cadang</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Sisa Stok</th>
                  <th className="py-3 px-4 text-center">Batas Minimum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockParts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-900 font-bold font-mono">{p.sku}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-medium">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3.5 px-4 text-center text-red-600 font-bold">
                      {p.stock} {p.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500">
                      {p.minStock} {p.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            Riwayat Transaksi Penjualan Kasir Terakhir
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar transaksi kasir yang telah berhasil dicetak dan dibayar oleh pelanggan.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">No. Faktur</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">No. Polisi</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4 text-right">Part</th>
                <th className="py-3.5 px-4 text-right">Jasa Servis</th>
                <th className="py-3.5 px-4 text-right">Total Bayar</th>
                <th className="py-3.5 px-4 text-center">Metode</th>
                <th className="py-3.5 px-4">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 text-slate-900 font-bold font-mono">{t.invoiceNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(t.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold">
                    {t.serviceOrder?.plateNumber || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {t.serviceOrder?.customerName || "Langsung"}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600">
                    Rp {t.totalParts.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600">
                    Rp {t.totalService.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-900 font-bold">
                    Rp {t.grandTotal.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{t.cashier?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
