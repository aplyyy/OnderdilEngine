"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  Car,
  CheckCircle,
  AlertCircle,
  Tag,
  CreditCard,
  Banknote,
  QrCode,
  X,
} from "lucide-react";

interface Sparepart {
  id: string;
  sku: string;
  name: string;
  category: string;
  sellPrice: number;
  stock: number;
  unit: string;
}

interface ServiceOrder {
  id: string;
  orderNumber: string;
  plateNumber: string;
  vehicleModel: string;
  customerName: string;
  complaint: string;
  status: string;
  serviceFee: number;
  items: { sparepartId: string; quantity: number }[];
}

interface CartItem {
  part: Sparepart;
  quantity: number;
}

export default function KasirPOSPage() {
  const [spareparts, setSpareparts] = useState<Sparepart[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("SEMUA");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedTransaction, setCompletedTransaction] = useState<any>(null);

  // New Work Order Modal State
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    plateNumber: "",
    vehicleModel: "",
    customerName: "",
    customerPhone: "",
    complaint: "",
    serviceFee: 50000,
  });

  const fetchData = async () => {
    try {
      const [resParts, resOrders] = await Promise.all([
        fetch(`/api/spareparts?q=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`),
        fetch("/api/service-orders?status=SELESAI"),
      ]);
      const dataParts = await resParts.json();
      const dataOrders = await resOrders.json();
      setSpareparts(dataParts.spareparts || []);
      setOrders(dataOrders.orders || []);
    } catch {
      setError("Gagal memuat data katalog atau servis.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category]);

  // Handle adding part to cart
  const addToCart = (part: Sparepart) => {
    if (part.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        if (existing.quantity >= part.stock) return prev;
        return prev.map((item) =>
          item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const updateQuantity = (partId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.part.id === partId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.part.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  // Select a completed service order to bill
  const handleSelectOrder = (order: ServiceOrder) => {
    setSelectedOrder(order);
    setServiceFee(order.serviceFee || 0);

    // Populate cart with parts from this order if any
    if (order.items && order.items.length > 0) {
      const newCart: CartItem[] = [];
      order.items.forEach((item) => {
        const found = spareparts.find((p) => p.id === item.sparepartId);
        if (found) {
          newCart.push({ part: found, quantity: item.quantity });
        }
      });
      if (newCart.length > 0) setCart(newCart);
    }
  };

  // Calculations
  const totalParts = cart.reduce((acc, item) => acc + item.part.sellPrice * item.quantity, 0);
  const subtotal = totalParts + Number(serviceFee || 0);
  const grandTotal = Math.max(0, subtotal - Number(discount || 0));
  const changeAmount = Math.max(0, Number(paidAmount || 0) - grandTotal);

  // Submit Transaction
  const handleCheckout = async () => {
    setError("");
    if (cart.length === 0 && Number(serviceFee) <= 0) {
      setError("Keranjang belanja dan biaya jasa tidak boleh kosong.");
      return;
    }
    if (Number(paidAmount) < grandTotal) {
      setError(`Jumlah bayar kurang. Total tagihan: Rp ${grandTotal.toLocaleString("id-ID")}`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        serviceOrderId: selectedOrder?.id || null,
        items: cart.map((c) => ({ sparepartId: c.part.id, quantity: c.quantity })),
        serviceFee: Number(serviceFee || 0),
        discount: Number(discount || 0),
        tax: 0,
        paidAmount: Number(paidAmount),
        paymentMethod,
      };

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memproses transaksi.");
        setLoading(false);
        return;
      }

      setCompletedTransaction(data.transaction);
      setCart([]);
      setSelectedOrder(null);
      setServiceFee(0);
      setDiscount(0);
      setPaidAmount(0);
      fetchData(); // refresh stock
    } catch {
      setError("Terjadi kesalahan saat memproses transaksi.");
    } finally {
      setLoading(false);
    }
  };

  // Create New Service Order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/service-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrderData),
      });
      if (res.ok) {
        setShowNewOrderModal(false);
        setNewOrderData({
          plateNumber: "",
          vehicleModel: "",
          customerName: "",
          customerPhone: "",
          complaint: "",
          serviceFee: 50000,
        });
        fetchData();
      }
    } catch {
      setError("Gagal mendaftarkan servis baru.");
    }
  };

  const categories = ["SEMUA", "Oli & Pelumas", "Filter", "Pengereman", "Pengapian", "Kelistrikan", "Aksesoris"];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-2">
            <span>KASIR POINT-OF-SALE</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Pencatatan suku cadang, kalkulasi tagihan servis, dan cetak faktur kasir.
          </p>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded transition-colors"
        >
          <Car className="w-4 h-4 text-amber-400" />
          <span>+ Masukkan Kendaraan Servis</span>
        </button>
      </div>

      {/* Pending Orders Notice (if any vehicles ready to pay) */}
      {orders.length > 0 && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Ada <strong>{orders.length} kendaraan</strong> berstatus <em>SELESAI</em> yang siap ditagihkan:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => handleSelectOrder(o)}
                className={`px-2 py-1 rounded font-mono text-xs border transition-colors ${
                  selectedOrder?.id === o.id
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                    : "bg-slate-900 text-amber-300 border-amber-700/60 hover:bg-slate-800"
                }`}
              >
                {o.plateNumber} ({o.customerName})
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/70 border border-red-800 rounded-md flex items-center space-x-2 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Catalog (Left) + Cart/Receipt (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Cari suku cadang (Nama / SKU)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 text-xs rounded-full font-mono transition-colors ${
                  category === c
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Part Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {spareparts.map((part) => {
              const isLowStock = part.stock <= 5;
              const isOut = part.stock <= 0;
              return (
                <div
                  key={part.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col justify-between ${
                    isOut
                      ? "bg-slate-900/40 border-slate-800 opacity-60"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>{part.sku}</span>
                      <span className="text-slate-500">{part.category}</span>
                    </div>
                    <h3 className="font-semibold text-slate-100 text-sm leading-tight line-clamp-2">
                      {part.name}
                    </h3>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-amber-400 font-bold font-mono text-sm">
                        Rp {part.sellPrice.toLocaleString("id-ID")}
                      </div>
                      <div className="text-[10px] font-mono">
                        {isOut ? (
                          <span className="text-red-400 font-bold">Stok Habis</span>
                        ) : isLowStock ? (
                          <span className="text-amber-400">Sisa: {part.stock} {part.unit} (Menipis)</span>
                        ) : (
                          <span className="text-slate-400">Stok: {part.stock} {part.unit}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(part)}
                      disabled={isOut}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Checkout Ticket / POS Bill */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100 font-mono flex items-center space-x-2">
                  <span>TAGIHAN KASIR</span>
                </h2>
                {selectedOrder && (
                  <div className="text-xs font-mono text-amber-400 mt-0.5">
                    Tiket: {selectedOrder.orderNumber} ({selectedOrder.plateNumber})
                  </div>
                )}
              </div>
              {selectedOrder && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setServiceFee(0);
                  }}
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  Lepas Tiket
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  Belum ada suku cadang di keranjang.
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.part.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-semibold text-slate-200 line-clamp-1">{item.part.name}</div>
                      <div className="text-[11px] text-amber-400 font-mono">
                        Rp {item.part.sellPrice.toLocaleString("id-ID")} &times; {item.quantity} = Rp{" "}
                        {(item.part.sellPrice * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.part.id, -1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.part.id, 1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.part.id)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-red-950/60 hover:bg-red-900 text-red-400 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Extra Charges / Adjustments */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Suku Cadang:</span>
                <span className="text-slate-200 font-bold">Rp {totalParts.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Biaya Jasa Servis / Montir:</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-28 text-right bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Potongan Diskon:</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-28 text-right bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Grand Total Display */}
            <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Total Pembayaran:
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                {["CASH", "QRIS", "TRANSFER", "DEBIT"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-1.5 rounded border text-center transition-colors ${
                      paymentMethod === m
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Tendered & Change */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Uang Diterima (Rp):</label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Kembalian (Rp):</label>
                <div className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-emerald-400 font-bold font-mono">
                  Rp {changeAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Denomination Pills */}
          <div className="flex gap-1.5 pt-3">
            {[grandTotal, 50000, 100000, 200000, 500000].map((amount, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPaidAmount(amount)}
                className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 rounded border border-slate-700"
              >
                {amount === grandTotal ? "Pas" : `${amount / 1000}k`}
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-4 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
          >
            {loading ? "Memproses Transaksi..." : "Bayar & Cetak Nota Transaksi"}
          </button>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {completedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Transaksi Berhasil Disimpan</span>
              </h3>
              <button
                onClick={() => setCompletedTransaction(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Preview (Target of Print) */}
            <div
              id="printable-receipt"
              className="bg-white text-slate-950 p-6 rounded font-mono text-xs space-y-3 border shadow-inner"
            >
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <div className="font-extrabold text-base tracking-wider">BENGKEL ONDERDIL ENGINE</div>
                <div className="text-[10px] text-slate-600">Jl. Otomotif Cyber No. 5, S5 Tech Center</div>
                <div className="text-[10px] text-slate-600">Telp: (021) 8899-7700</div>
              </div>

              <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <div className="flex justify-between">
                  <span>No. Faktur:</span>
                  <span className="font-bold">{completedTransaction.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{new Date(completedTransaction.createdAt).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>{completedTransaction.cashier?.name}</span>
                </div>
                {completedTransaction.serviceOrder && (
                  <>
                    <div className="flex justify-between">
                      <span>No. Polisi:</span>
                      <span className="font-bold">{completedTransaction.serviceOrder.plateNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pelanggan:</span>
                      <span>{completedTransaction.serviceOrder.customerName}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1 border-b border-dashed border-slate-400 pb-2">
                {completedTransaction.serviceOrder?.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <div>{it.sparepart.name}</div>
                      <div className="text-[10px] text-slate-600">
                        {it.quantity} x Rp {it.priceAtTime.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="font-bold">
                      Rp {(it.quantity * it.priceAtTime).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}

                {completedTransaction.totalService > 0 && (
                  <div className="flex justify-between pt-1">
                    <span>Jasa Servis / Mekanik:</span>
                    <span className="font-bold">
                      Rp {completedTransaction.totalService.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1 font-bold">
                <div className="flex justify-between">
                  <span>Total Tagihan:</span>
                  <span>Rp {completedTransaction.grandTotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bayar ({completedTransaction.paymentMethod}):</span>
                  <span>Rp {completedTransaction.paidAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Kembalian:</span>
                  <span>Rp {completedTransaction.changeAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-400 text-[10px] text-slate-600">
                Terima kasih atas kepercayaan Anda merawat kendaraan di Bengkel OnderdilEngine!
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center space-x-1.5 font-mono"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Service Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-mono font-bold text-slate-100 text-sm flex items-center space-x-1.5">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Pendaftaran Kendaraan Servis Baru</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nomor Polisi (Plat):</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: B 1234 ABC"
                    value={newOrderData.plateNumber}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, plateNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Model / Tipe Mobil:</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Avanza 2021"
                    value={newOrderData.vehicleModel}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, vehicleModel: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Pemilik / Pelanggan:</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Pak Budi"
                    value={newOrderData.customerName}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, customerName: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">No. WhatsApp / Telepon:</label>
                  <input
                    type="text"
                    placeholder="misal: 08123456789"
                    value={newOrderData.customerPhone}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, customerPhone: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Keluhan Kerusakan / Permintaan Servis:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="misal: Rem depan bunyi berdecit saat pelan, ganti oli mesin 10W-40"
                  value={newOrderData.complaint}
                  onChange={(e) =>
                    setNewOrderData({ ...newOrderData, complaint: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded"
                >
                  Simpan Tiket Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
