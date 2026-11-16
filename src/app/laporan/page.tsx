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
    return <div className="py-12 text-center text-slate-500 font-mono text-sm">Memuat rekapitulasi data bengkel...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-950/60 border border-red-800 rounded-md text-red-200 text-sm">{error}</div>;
  }

  const { summary, lowStockParts, recentTransactions } = data;

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <span>LAPORAN &amp; REKAPITULASI BENGKEL</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ringkasan omzet finansial, margin suku cadang vs jasa, serta log stok kritis.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono font-bold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Total Omzet</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            {summary.transactionCount} total transaksi diproses
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Pendapatan Suku Cadang</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-400">
            Rp {summary.totalPartsIncome.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Akumulasi penjualan part
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Pendapatan Jasa Servis</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            Rp {summary.totalServiceIncome.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Dari {summary.totalOrders} tiket kendaraan servis
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span>Peringatan Stok Rendah</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-red-400">
            {summary.lowStockCount} Part
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Di bawah batas minimum aman
          </div>
        </div>
      </div>

      {/* Low Stock Warning Table */}
      {lowStockParts && lowStockParts.length > 0 && (
        <div className="bg-slate-900 border border-red-900/60 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-sm text-red-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Daftar Suku Cadang Menipis (Low Stock Alert)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Segera lakukan *restock* / pengadaan barang
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Nama Suku Cadang</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Sisa Stok</th>
                  <th className="py-2.5 px-3 text-center">Batas Minimum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lowStockParts.map((p: any) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">{p.sku}</td>
                    <td className="py-2.5 px-3 text-slate-200 font-sans font-semibold">{p.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{p.category}</td>
                    <td className="py-2.5 px-3 text-center text-red-400 font-bold">
                      {p.stock} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-400">
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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center space-x-2">
          <span>Riwayat Transaksi Kasir Terakhir</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">No. Faktur</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Kendaraan</th>
                <th className="py-3 px-3">Pelanggan</th>
                <th className="py-3 px-3 text-right">Suku Cadang</th>
                <th className="py-3 px-3 text-right">Jasa Servis</th>
                <th className="py-3 px-3 text-right">Total Bayar</th>
                <th className="py-3 px-3 text-center">Metode</th>
                <th className="py-3 px-3">Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentTransactions.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-amber-400 font-bold">{t.invoiceNumber}</td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(t.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-bold">
                    {t.serviceOrder?.plateNumber || "-"}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {t.serviceOrder?.customerName || "Langsung"}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    Rp {t.totalParts.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    Rp {t.totalService.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    Rp {t.grandTotal.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{t.cashier?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
