"use client";

import { useState, useEffect } from "react";
import {
  Wrench,
  Clock,
  PlayCircle,
  CheckCircle2,
  Car,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface ServiceOrder {
  id: string;
  orderNumber: string;
  plateNumber: string;
  vehicleModel: string;
  customerName: string;
  customerPhone?: string;
  complaint: string;
  mechanicNotes?: string;
  status: "MENUNGGU" | "PENGERJAAN" | "SELESAI" | "LUNAS";
  serviceFee: number;
  assignedMechanic?: { name: string };
  items: { id: string; sparepart: { id: string; name: string; sellPrice: number }; quantity: number }[];
}

interface Sparepart {
  id: string;
  name: string;
  stock: number;
  sellPrice: number;
}

export default function MekanikPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  // Edit / Update Form State
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [serviceFee, setServiceFee] = useState(0);
  const [selectedParts, setSelectedParts] = useState<{ sparepartId: string; quantity: number }[]>([]);

  const fetchOrders = async () => {
    try {
      const [resOrders, resParts] = await Promise.all([
        fetch("/api/service-orders"),
        fetch("/api/spareparts"),
      ]);
      const dataOrders = await resOrders.json();
      const dataParts = await resParts.json();
      setOrders(dataOrders.orders || []);
      setSpareparts(dataParts.spareparts || []);
    } catch {
      console.error("Gagal mengambil data servis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch("/api/service-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setMechanicNotes(order.mechanicNotes || "");
    setServiceFee(order.serviceFee || 0);
    setSelectedParts(
      order.items?.map((it) => ({
        sparepartId: it.sparepart.id,
        quantity: it.quantity,
      })) || []
    );
  };

  const handleSaveNotes = async () => {
    if (!selectedOrder) return;
    try {
      await fetch("/api/service-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedOrder.id,
          mechanicNotes,
          serviceFee,
          parts: selectedParts,
        }),
      });
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const addPartToOrder = (sparepartId: string) => {
    if (!sparepartId) return;
    setSelectedParts((prev) => {
      const existing = prev.find((p) => p.sparepartId === sparepartId);
      if (existing) {
        return prev.map((p) =>
          p.sparepartId === sparepartId ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { sparepartId, quantity: 1 }];
    });
  };

  const removePartFromOrder = (sparepartId: string) => {
    setSelectedParts((prev) => prev.filter((p) => p.sparepartId !== sparepartId));
  };

  const statusColumns = [
    { key: "MENUNGGU", label: "Antrean Menunggu", color: "border-slate-700 bg-slate-900/40 text-slate-300" },
    { key: "PENGERJAAN", label: "Sedang Dikerjakan", color: "border-amber-600/50 bg-amber-950/20 text-amber-300" },
    { key: "SELESAI", label: "Selesai (Siap Bayar)", color: "border-emerald-600/50 bg-emerald-950/20 text-emerald-300" },
    { key: "LUNAS", label: "Lunas / Selesai Kasir", color: "border-blue-700/50 bg-blue-950/20 text-blue-300" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <span>ALUR KERJA BENGKEL &amp; MEKANIK</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Papan pemantauan pengerjaan servis mobil, pemakaian suku cadang, dan catatan teknis.
          </p>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          return (
            <div
              key={col.key}
              className={`rounded-xl border p-4 flex flex-col justify-between min-h-[500px] ${col.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-mono font-bold text-xs uppercase tracking-wider">
                    {col.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-mono font-bold">
                    {colOrders.length}
                  </span>
                </div>

                {colOrders.length === 0 ? (
                  <div className="py-12 text-center text-[11px] text-slate-500 font-mono">
                    Tidak ada unit.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                    {colOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2.5 shadow-md hover:border-slate-700 transition-colors"
                      >
                        {/* Plate & Model */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-mono font-bold text-sm text-amber-400">
                              {order.plateNumber}
                            </div>
                            <div className="text-[11px] text-slate-400">{order.vehicleModel}</div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            {order.orderNumber}
                          </span>
                        </div>

                        {/* Customer & Complaint */}
                        <div className="text-xs space-y-1">
                          <div className="text-slate-300 font-medium">
                            Pemilik: <strong>{order.customerName}</strong>
                          </div>
                          <div className="p-2 bg-slate-950/70 rounded text-[11px] text-slate-400 leading-relaxed border border-slate-800/60">
                            <em>Keluhan:</em> {order.complaint}
                          </div>
                        </div>

                        {/* Mechanic Notes if any */}
                        {order.mechanicNotes && (
                          <div className="text-[11px] p-2 bg-blue-950/40 border border-blue-900/50 rounded text-blue-200">
                            <span className="font-bold">Catatan Mekanik:</span> {order.mechanicNotes}
                          </div>
                        )}

                        {/* Parts Used */}
                        {order.items && order.items.length > 0 && (
                          <div className="text-[10px] font-mono text-slate-400 space-y-0.5">
                            <span className="font-bold text-slate-300">Part Dipasang:</span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>&bull; {it.sparepart.name}</span>
                                <span>&times;{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          <button
                            onClick={() => handleOpenEdit(order)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono flex items-center space-x-1"
                          >
                            <FileText className="w-3 h-3 text-amber-400" />
                            <span>Edit Part / Catatan</span>
                          </button>

                          {order.status === "MENUNGGU" && (
                            <button
                              onClick={() => updateStatus(order.id, "PENGERJAAN")}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] font-mono flex items-center space-x-1"
                            >
                              <PlayCircle className="w-3 h-3" />
                              <span>Mulai</span>
                            </button>
                          )}

                          {order.status === "PENGERJAAN" && (
                            <button
                              onClick={() => updateStatus(order.id, "SELESAI")}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[11px] font-mono flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Selesai</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Work Order Notes & Used Parts Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Pengerjaan Servis: {selectedOrder.plateNumber}</span>
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Catatan Penanganan Teknis Mekanik:</label>
                <textarea
                  rows={3}
                  value={mechanicNotes}
                  onChange={(e) => setMechanicNotes(e.target.value)}
                  placeholder="misal: Oli lama sudah dikuras, filter oli baru terpasang. Kampas rem depan aus 80% diganti 1 set Bendix."
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Estimasi Biaya Jasa Mekanik (Rp):</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                />
              </div>

              {/* Suku cadang yang dipakai */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-slate-300 font-bold">
                  Suku Cadang yang Digunakan pada Kendaraan:
                </label>

                <div className="flex gap-2">
                  <select
                    id="part-select"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-slate-100 text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Pilih Suku Cadang dari Gudang --
                    </option>
                    {spareparts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stok: {p.stock})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById("part-select") as HTMLSelectElement;
                      if (sel && sel.value) {
                        addPartToOrder(sel.value);
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs"
                  >
                    Pasang Part
                  </button>
                </div>

                {/* List Selected Parts */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedParts.map((sp) => {
                    const info = spareparts.find((p) => p.id === sp.sparepartId);
                    return (
                      <div
                        key={sp.sparepartId}
                        className="flex items-center justify-between p-1.5 rounded bg-slate-950 border border-slate-800 text-[11px]"
                      >
                        <span className="text-slate-200">{info?.name || "Part"}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-400 font-bold">{sp.quantity} unit</span>
                          <button
                            type="button"
                            onClick={() => removePartFromOrder(sp.sparepartId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Simpan Catatan Servis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
