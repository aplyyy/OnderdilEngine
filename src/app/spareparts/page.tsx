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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Katalog Stok Suku Cadang</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola persediaan suku cadang, penyesuaian harga jual dan modal, serta batas stok minimum bengkel.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sparepart Baru</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 font-medium">
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
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-all shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-2 text-xs sm:text-sm rounded-xl font-medium transition-all ${
                category === c
                  ? "bg-slate-900 text-white font-bold shadow-xs"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
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
          <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-xs">
            Tidak ada suku cadang yang cocok dengan pencarian.
          </div>
        ) : (
          parts.map((p) => {
            const isLow = p.stock <= p.minStock;
            const isOut = p.stock <= 0;
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-amber-700 font-bold text-xs font-mono">{p.sku}</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">{p.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600">
                    {p.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Harga Jual:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      Rp {p.sellPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Harga Modal:</span>
                    <span className="text-slate-600">Rp {p.buyPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-600">
                      Stok: <strong className="text-slate-900">{p.stock}</strong> {p.unit}
                    </span>
                    {isOut ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-[11px] text-red-700 font-semibold">
                        Habis
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-semibold">
                        Menipis
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-semibold">
                        Aman
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition"
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
      <div className="hidden md:block bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Tidak ada suku cadang yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                parts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  const isOut = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 font-mono">{p.sku}</td>
                      <td className="py-4 px-4 text-slate-900 font-medium">
                        {p.name}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-slate-500">
                        Rp {p.buyPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-slate-900">
                        Rp {p.sellPrice.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800">
                        {p.stock} <span className="text-xs text-slate-500 font-normal">{p.unit}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {isOut ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                            Menipis ({p.stock})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Sparepart"
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Hapus Sparepart"
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors border border-red-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Package className="w-4 h-4 text-amber-500" />
                <span>{editPart ? "Edit Suku Cadang" : "Tambah Suku Cadang Baru"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kode SKU:</label>
                  <input
                    type="text"
                    required
                    disabled={!!editPart}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 disabled:opacity-50 font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kategori:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  >
                    {categories.filter((c) => c !== "SEMUA").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Suku Cadang:</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Kampas Rem Depan Bendix Avanza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga Modal / Beli (Rp):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.buyPrice}
                    onChange={(e) => setFormData({ ...formData, buyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga Jual Konsumen (Rp):</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.sellPrice}
                    onChange={(e) => setFormData({ ...formData, sellPrice: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Stok Fisik:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Min. Alert Stok:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Satuan:</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition"
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
