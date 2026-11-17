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
    { key: "MENUNGGU", label: "1. Antrean Baru", color: "border-slate-200 bg-slate-100/70 text-slate-800" },
    { key: "PENGERJAAN", label: "2. Sedang Dikerjakan", color: "border-amber-200 bg-amber-50/50 text-amber-900" },
    { key: "SELESAI", label: "3. Selesai (Siap Bayar)", color: "border-emerald-200 bg-emerald-50/50 text-emerald-900" },
    { key: "LUNAS", label: "4. Lunas (Selesai Kasir)", color: "border-blue-200 bg-blue-50/50 text-blue-900" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Alur Kerja &amp; Antrean Mekanik</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
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
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>{col.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statusColumns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          const isMobileHidden = mobileTab !== col.key ? "hidden md:flex" : "flex";
          return (
            <div
              key={col.key}
              className={`rounded-2xl border p-4 sm:p-5 flex-col justify-between min-h-[460px] shadow-xs ${col.color} ${isMobileHidden}`}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <span className="font-bold text-sm tracking-tight">
                    {col.label}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-xs font-bold text-slate-700 border border-slate-200 shadow-xs">
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
                        className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all text-slate-900"
                      >
                        {/* Plate & Model */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-extrabold text-base text-slate-900 tracking-tight">
                              {order.plateNumber}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{order.vehicleModel}</div>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-medium border border-slate-200">
                            {order.orderNumber}
                          </span>
                        </div>

                        {/* Customer & Complaint */}
                        <div className="text-xs space-y-1.5">
                          <div className="text-slate-600">
                            Pemilik: <strong className="text-slate-900">{order.customerName}</strong>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200/70">
                            <span className="font-semibold text-amber-700">Keluhan:</span> {order.complaint}
                          </div>
                        </div>

                        {/* Mechanic Notes if any */}
                        {order.mechanicNotes && (
                          <div className="text-xs p-2.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-blue-900">
                            <span className="font-bold text-blue-700">Catatan Mekanik:</span> {order.mechanicNotes}
                          </div>
                        )}

                        {/* Parts Used */}
                        {order.items && order.items.length > 0 && (
                          <div className="text-xs text-slate-700 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                            <span className="font-bold text-slate-900 text-xs">Suku Cadang Digunakan:</span>
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between text-slate-600">
                                <span>• {it.sparepart.name}</span>
                                <span className="font-bold text-slate-900">x{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenEdit(order)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border border-slate-200"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Part / Catatan</span>
                          </button>

                          {order.status === "MENUNGGU" && (
                            <button
                              onClick={() => updateStatus(order.id, "PENGERJAAN")}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 transition-all shadow-xs"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              <span>Mulai</span>
                            </button>
                          )}

                          {order.status === "PENGERJAAN" && (
                            <button
                              onClick={() => updateStatus(order.id, "SELESAI")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1 transition-all shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>Pengerjaan Servis: {selectedOrder.plateNumber}</span>
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Penanganan Teknis Mekanik:</label>
                <textarea
                  rows={3}
                  value={mechanicNotes}
                  onChange={(e) => setMechanicNotes(e.target.value)}
                  placeholder="misal: Oli lama sudah dikuras, filter oli baru terpasang. Kampas rem depan aus 80% diganti 1 set Bendix."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Estimasi Biaya Jasa Mekanik (Rp):</label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Suku cadang yang dipakai */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-slate-900 font-bold">
                  Suku Cadang yang Digunakan pada Kendaraan:
                </label>

                <div className="flex gap-2">
                  <select
                    id="part-select"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-amber-500 transition"
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
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-xs transition"
                  >
                    Pasang
                  </button>
                </div>

                {/* List Selected Parts */}
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedParts.map((sp) => {
                    const info = spareparts.find((p) => p.id === sp.sparepartId);
                    return (
                      <div
                        key={sp.sparepartId}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <span className="text-slate-800 font-medium">{info?.name || "Part"}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-700 font-bold">{sp.quantity} unit</span>
                          <button
                            type="button"
                            onClick={() => removePartFromOrder(sp.sparepartId)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition"
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
