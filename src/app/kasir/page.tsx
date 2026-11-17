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
  X,
  CreditCard,
  Banknote,
  QrCode,
  ArrowRight,
  PackageCheck,
  Receipt,
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
    <div className="space-y-6 pb-24 lg:pb-0">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2.5">
            <span>Kasir &amp; Pembayaran</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Siap Transaksi
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pilih suku cadang dari katalog atau pilih kendaraan yang sudah selesai servis untuk ditagihkan.
          </p>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
        >
          <Car className="w-4 h-4" />
          <span>+ Masukkan Kendaraan Servis</span>
        </button>
      </div>

      {/* Pending Orders Notice (if any vehicles ready to pay) */}
      {orders.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <Car className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Ada {orders.length} Mobil Selesai Diservis!</span>
              <p className="text-slate-600 text-[11px]">Klik salah satu kendaraan untuk memuat rincian tagihannya ke kasir:</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => handleSelectOrder(o)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedOrder?.id === o.id
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm"
                    : "bg-white text-slate-800 border-amber-300 hover:bg-amber-100/70"
                }`}
              >
                {o.plateNumber} &bull; {o.customerName}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-xs text-red-700 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Catalog (Left) + Cart/Receipt (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Category Filter */}
          <div className="space-y-3 bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari suku cadang (Ketik Nama Barang / Kode SKU)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    category === c
                      ? "bg-slate-900 text-white font-bold shadow-sm"
                      : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Part Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[640px] overflow-y-auto pr-1">
            {spareparts.map((part) => {
              const isLowStock = part.stock <= 5;
              const isOut = part.stock <= 0;
              return (
                <div
                  key={part.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isOut
                      ? "bg-slate-50 border-slate-200 opacity-60"
                      : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-700 font-semibold">
                        {part.sku}
                      </span>
                      <span className="text-slate-500 text-[11px]">{part.category}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {part.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-slate-900 font-extrabold text-base">
                        Rp {part.sellPrice.toLocaleString("id-ID")}
                      </div>
                      <div className="text-xs mt-0.5">
                        {isOut ? (
                          <span className="text-red-600 font-bold">Stok Habis</span>
                        ) : isLowStock ? (
                          <span className="text-amber-700 font-medium">Sisa {part.stock} {part.unit} (Menipis)</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">Stok: {part.stock} {part.unit}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(part)}
                      disabled={isOut}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs"
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
        <div
          id="pos-checkout-box"
          className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-sm lg:sticky lg:top-24 scroll-mt-24"
        >
          <div className="space-y-4">
            <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  <span>Rincian Tagihan Kasir</span>
                </h3>
                {selectedOrder && (
                  <div className="text-xs text-amber-700 mt-1 font-semibold">
                    Tiket: {selectedOrder.orderNumber} ({selectedOrder.plateNumber} - {selectedOrder.customerName})
                  </div>
                )}
              </div>
              {selectedOrder && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    setServiceFee(0);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                >
                  Lepas Tiket
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                  <p className="text-slate-500 font-medium">Keranjang transaksi masih kosong.</p>
                  <p className="text-[11px] text-slate-400">Klik tombol &ldquo;Tambah&rdquo; pada katalog suku cadang di sebelah kiri.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.part.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div className="flex-1 pr-3">
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.part.name}</div>
                      <div className="text-xs text-amber-700 font-bold mt-0.5">
                        Rp {item.part.sellPrice.toLocaleString("id-ID")} &times; {item.quantity} = Rp{" "}
                        {(item.part.sellPrice * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.part.id, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-slate-900 text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.part.id, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.part.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Extra Charges / Adjustments */}
            <div className="space-y-2.5 pt-3 border-t border-slate-200/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Total Suku Cadang:</span>
                <span className="text-slate-900 font-bold text-sm">Rp {totalParts.toLocaleString("id-ID")}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Biaya Jasa Servis / Montir:</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={serviceFee}
                  onChange={(e) => setServiceFee(Number(e.target.value))}
                  className="w-32 text-right bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-medium">Potongan Diskon:</span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-32 text-right bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Grand Total Display */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Total Tagihan:
              </span>
              <span className="text-2xl font-black text-amber-400">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {["CASH", "QRIS", "TRANSFER", "DEBIT"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-lg border text-center transition-all ${
                      paymentMethod === m
                        ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Tendered & Change */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Uang Diterima (Rp):</label>
                <input
                  type="number"
                  min="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Kembalian (Rp):</label>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800 font-extrabold text-sm">
                  Rp {changeAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Denomination Shortcuts */}
          <div className="flex gap-2 pt-3">
            {[grandTotal, 50000, 100000, 200000, 500000].map((amount, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPaidAmount(amount)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                {amount === grandTotal ? "Uang Pas" : `${amount / 1000}k`}
              </button>
            ))}
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-5 w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            {loading ? "Memproses Transaksi..." : "Bayar & Cetak Nota Transaksi"}
          </button>
        </div>
      </div>

      {/* Mobile Sticky Floating Cart Bar (for Android/Smartphone) */}
      {(cart.length > 0 || serviceFee > 0) && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 p-3.5 backdrop-blur-md flex items-center justify-between shadow-xl">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Item di Keranjang
            </div>
            <div className="text-base font-extrabold text-slate-900">
              Rp {grandTotal.toLocaleString("id-ID")}
            </div>
          </div>
          <button
            onClick={() => {
              document.getElementById("pos-checkout-box")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs active:scale-95 transition-transform"
          >
            <span>Lihat Tagihan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {completedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Transaksi Berhasil Disimpan</span>
              </h3>
              <button
                onClick={() => setCompletedTransaction(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Preview (Target of Print) */}
            <div
              id="printable-receipt"
              className="bg-white text-slate-950 p-6 rounded-xl font-mono text-xs space-y-3 border shadow-inner"
            >
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <div className="font-extrabold text-base tracking-wider uppercase">BENGKEL ANUGRAH MOTOR</div>
                <div className="text-[11px] font-bold text-slate-800">PT Anugrah Motor</div>
                <div className="text-[11px] text-slate-600">Jl. Syeh Maulana Akbar No.88, Kuningan, Jawa Barat 45511</div>
                <div className="text-[11px] text-slate-600">Telp / WA: 081324735850 (Mang Acim)</div>
              </div>

              <div className="text-xs space-y-1 border-b border-dashed border-slate-400 pb-2">
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
              <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-2 text-xs">
                {completedTransaction.serviceOrder?.items?.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <div className="font-semibold">{it.sparepart.name}</div>
                      <div className="text-[11px] text-slate-600">
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
              <div className="space-y-1 font-bold text-xs">
                <div className="flex justify-between text-sm">
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

              <div className="text-center pt-3 border-t border-dashed border-slate-400 text-[11px] text-slate-600">
                Terima kasih atas kunjungan Anda merawat kendaraan di Bengkel OnderdilEngine!
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setCompletedTransaction(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-2 shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota / Unduh PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Service Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Car className="w-5 h-5 text-amber-500" />
                <span>Pendaftaran Kendaraan Servis Baru</span>
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nomor Polisi (Plat):</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: B 1234 ABC"
                    value={newOrderData.plateNumber}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, plateNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Model / Tipe Mobil:</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Avanza 2021"
                    value={newOrderData.vehicleModel}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, vehicleModel: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nama Pemilik:</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Pak Budi"
                    value={newOrderData.customerName}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, customerName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">No. WhatsApp / HP:</label>
                  <input
                    type="text"
                    placeholder="misal: 08123456789"
                    value={newOrderData.customerPhone}
                    onChange={(e) =>
                      setNewOrderData({ ...newOrderData, customerPhone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Keluhan Kerusakan / Permintaan Servis:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="misal: Rem depan bunyi berdecit saat pelan, ganti oli mesin 10W-40"
                  value={newOrderData.complaint}
                  onChange={(e) =>
                    setNewOrderData({ ...newOrderData, complaint: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 leading-relaxed transition"
                />
              </div>

              <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-xs transition"
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
