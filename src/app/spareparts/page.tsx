"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

interface Sparepart {
  id: string;
  sku: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  unit: string;
}

export default function SparepartsPage() {
  const [parts, setParts] = useState<Sparepart[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("SEMUA");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPart, setEditPart] = useState<Sparepart | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Oli & Pelumas",
    buyPrice: 0,
    sellPrice: 0,
    stock: 10,
    minStock: 5,
    unit: "Pcs",
  });

  const fetchParts = async () => {
    try {
      const res = await fetch(
        `/api/spareparts?q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      setParts(data.spareparts || []);
    } catch {
      setError("Gagal mengambil data suku cadang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [search, category]);

  const handleOpenCreate = () => {
    setEditPart(null);
    setFormData({
      sku: `PART-${Date.now().toString().slice(-4)}`,
      name: "",
      category: "Oli & Pelumas",
      buyPrice: 0,
      sellPrice: 0,
      stock: 10,
      minStock: 5,
      unit: "Pcs",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Sparepart) => {
    setEditPart(p);
    setFormData({
      sku: p.sku,
      name: p.name,
      category: p.category,
      buyPrice: p.buyPrice,
      sellPrice: p.sellPrice,
      stock: p.stock,
      minStock: p.minStock,
      unit: p.unit,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const method = editPart ? "PUT" : "POST";
      const payload = editPart ? { id: editPart.id, ...formData } : formData;

      const res = await fetch("/api/spareparts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menyimpan suku cadang.");
        return;
      }

      setSuccess(editPart ? "Suku cadang diperbarui!" : "Suku cadang berhasil ditambahkan!");
      setModalOpen(false);
      fetchParts();
    } catch {
      setError("Terjadi kesalahan jaringan.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus suku cadang '${name}'? Tindakan ini hanya diizinkan untuk Admin.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/spareparts?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal menghapus suku cadang.");
        return;
      }
      setSuccess("Suku cadang berhasil dihapus.");
      fetchParts();
    } catch {
      setError("Gagal menghapus suku cadang.");
    }
  };

  const categories = ["SEMUA", "Oli & Pelumas", "Filter", "Pengereman", "Pengapian", "Kelistrikan", "Aksesoris"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <span>MASTER STOK SUKU CADANG</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manajemen inventaris, penetapan harga jual/modal, dan peringatan batas stok minimum (*low stock alert*).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded transition-colors shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sparepart Baru</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/70 border border-red-800 rounded-md text-xs text-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-md text-xs text-emerald-200">
          {success}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan SKU atau Nama Part..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs rounded-md font-mono transition-colors ${
                category === c
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kode SKU</th>
                <th className="py-3 px-4">Nama Suku Cadang</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Harga Modal</th>
                <th className="py-3 px-4 text-right">Harga Jual</th>
                <th className="py-3 px-4 text-center">Stok Fisik</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Tidak ada suku cadang yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                parts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-amber-400">{p.sku}</td>
                      <td className="py-3 px-4 text-slate-200 font-sans font-semibold text-sm">
                        {p.name}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{p.category}</td>
                      <td className="py-3 px-4 text-right text-slate-400">
                        Rp {p.buyPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-100">
                        Rp {p.sellPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold">{p.stock}</span> {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 text-[10px] font-bold">
                            HABIS
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-bold">
                            MENIPIS (&le; {p.minStock})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px]">
                            AMAN
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Hapus"
                            className="p-1.5 rounded bg-slate-800 hover:bg-red-950 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-amber-400" />
                <span>{editPart ? "Edit Suku Cadang" : "Tambah Suku Cadang Baru"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kode SKU:</label>
                  <input
                    type="text"
                    required
                    disabled={!!editPart}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Kategori:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  >
                    {categories.filter((c) => c !== "SEMUA").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Suku Cadang:</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Kampas Rem Depan Bendix Avanza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Harga Modal / Beli (Rp):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga Jual Konsumen (Rp):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Stok Fisik:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Min. Alert Stok:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Satuan:</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Simpan Suku Cadang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
