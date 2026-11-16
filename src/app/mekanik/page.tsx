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
  const [mobileTab, setMobileTab] = useState<string>("MENUNGGU");

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
    { key: "MENUNGGU", label: "1. Antrean Baru", color: "border-slate-800 bg-slate-900/60 text-slate-200" },
    { key: "PENGERJAAN", label: "2. Sedang Dikerjakan", color: "border-amber-600/40 bg-amber-950/20 text-amber-300" },
    { key: "SELESAI", label: "3. Selesai (Siap Bayar)", color: "border-emerald-600/40 bg-emerald-950/20 text-emerald-300" },
    { key: "LUNAS", label: "4. Lunas (Selesai Kasir)", color: "border-blue-700/40 bg-blue-950/20 text-blue-300" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Alur Kerja &amp; Antrean Mekanik</span>
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Papan pemantauan alur servis mobil secara langsung, alokasi suku cadang, dan catatan teknis mekanik.
          </p>
        </div>
      </div>

      {/* Mobile Tab Selector for Android / Smartphone View */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-2 -mx-1 px-1 scrollbar-none">
        {statusColumns.map((col) => {
          const count = orders.filter((o) => o.status === col.key).length;
          const isActive = mobileTab === col.key;
          return (
            <button
              key={col.key}
              onClick={() => setMobileTab(col.key)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-2 transition-all ${
                isActive
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
              }`}
            >
              <span>{col.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isActive
                    ? "bg-slate-950 text-amber-400"
                    : "bg-slate-800 text-slate-200 border border-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Grid: On Mobile shows active mobileTab column, on Desktop shows full 4 columns side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statusColumns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          const isMobileHidden = mobileTab !== col.key ? "hidden md:flex" : "flex";
          return (
            <div
              key={col.key}
              className={`rounded-2xl border p-4 sm:p-5 flex-col justify-between min-h-[460px] shadow-lg ${col.color} ${isMobileHidden}`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm tracking-tight">
                    {col.label}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-white border border-slate-700">
                    {colOrders.length}
                  </span>
                </div>

                {colOrders.length === 0 ? (
                  <div className="py-20 text-center text-xs text-slate-400">
                    Belum ada antrean di kolom ini.
                  </div>
                ) : (
                  <div className="space-y-3.5 pr-1">
                    {colOrders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md hover:border-slate-700 transition-all"
                      >
                        {/* Plate & Model */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-extrabold text-base text-amber-400 tracking-tight">
                              {order.plateNumber}
                            </div>
                            <div className="text-xs text-slate-300 font-medium">{order.vehicleModel}</div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {order.orderNumber}
                          </span>
                        </div>

                        {/* Customer & Complaint */}
                        <div className="text-xs space-y-1.5">
                          <div className="text-slate-200">
                            Pemilik: <strong className="text-white">{order.customerName}</strong>
                          </div>
                          <div className="p-2.5 bg-slate-950/80 rounded-lg text-xs text-slate-300 leading-relaxed border border-slate-800">
                            <span className="font-semibold text-amber-300/90">Keluhan:</span> {order.complaint}
                          </div>
                        </div>

                        {/* Mechanic Notes if any */}
                        {order.mechanicNotes && (
                          <div className="text-xs p-2.5 bg-blue-950/50 border border-blue-900/60 rounded-lg text-blue-200">
                            <span className="font-bold text-blue-300">Catatan Mekanik:</span> {order.mechanicNotes}
                          </div>
                        )}

                        {/* Parts Used */}
                        {order.items && order.items.length > 0 && (
                          <div className="text-xs text-slate-300 space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                            <span className="font-bold text-amber-400 text-xs">Suku Cadang Digunakan:</span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-300">
                                <span>• {it.sparepart.name}</span>
                                <span className="font-bold text-white">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenEdit(order)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all border border-slate-700"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit Part / Catatan</span>
                          </button>

                          {order.status === "MENUNGGU" && (
                            <button
                              onClick={() => updateStatus(order.id, "PENGERJAAN")}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 transition-all shadow-sm"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Mulai</span>
                            </button>
                          )}

                          {order.status === "PENGERJAAN" && (
                            <button
                              onClick={() => updateStatus(order.id, "SELESAI")}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 transition-all shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
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
