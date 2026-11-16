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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Katalog Stok Suku Cadang</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Kelola persediaan suku cadang, penyesuaian harga jual dan modal, serta batas stok minimum bengkel.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sparepart Baru</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-sm text-red-200 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-800 rounded-xl text-sm text-emerald-200 font-medium">
          {success}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari suku cadang (Nama part, SKU, atau jenis mobil)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all ${
                category === c
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Card List (md:hidden) */}
      <div className="md:hidden space-y-3">
        {parts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/60 rounded-2xl border border-slate-800">
            Tidak ada suku cadang yang cocok dengan pencarian.
          </div>
        ) : (
          parts.map((p) => {
            const isLow = p.stock <= p.minStock;
            const isOut = p.stock <= 0;
            return (
              <div
                key={p.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-amber-400 font-bold text-xs">{p.sku}</span>
                    <h4 className="font-bold text-white text-sm leading-snug mt-0.5">{p.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300">
                    {p.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Harga Jual:</span>
                    <span className="font-extrabold text-amber-400 text-sm">
                      Rp {p.sellPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Harga Modal:</span>
                    <span className="text-slate-300">Rp {p.buyPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-300">
                      Stok: <strong className="text-white">{p.stock}</strong> {p.unit}
                    </span>
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[11px] text-red-400 font-semibold">
                        Habis
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-400 font-semibold">
                        Menipis
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
                        Aman
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl border border-red-900/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Data Table (hidden md:block) */}
      <div className="hidden md:block bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Kode SKU</th>
                <th className="py-3.5 px-4">Nama Suku Cadang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Modal</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                <th className="py-3.5 px-4 text-center">Stok Fisik</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada suku cadang yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                parts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-amber-400">{p.sku}</td>
                      <td className="py-4 px-4 text-white font-medium">
                        {p.name}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-400">
                        Rp {p.buyPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-white">
                        Rp {p.sellPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-200">
                        {p.stock} <span className="text-xs text-slate-400 font-normal">{p.unit}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs text-red-400 font-semibold">
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs text-amber-400 font-semibold">
                            Menipis ({p.stock})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Sparepart"
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Hapus Sparepart"
                            className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg transition-colors border border-red-900/50"
                          >
                            <Trash2 className="w-4 h-4" />
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
