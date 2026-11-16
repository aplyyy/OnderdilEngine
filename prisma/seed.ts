import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Hash passwords with bcrypt (cost factor = 10)
  const adminPassword = await bcrypt.hash("AdminBengkel#2026", 10);
  const kasirPassword = await bcrypt.hash("KasirBengkel#2026", 10);
  const mekanikPassword = await bcrypt.hash("MekanikBengkel#2026", 10);

  // 2. Upsert Users
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "Bambang Sudiro (Manajer)",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const kasir = await prisma.user.upsert({
    where: { username: "kasir" },
    update: {},
    create: {
      username: "kasir",
      name: "Rina Wijaya (Kasir POS)",
      passwordHash: kasirPassword,
      role: "KASIR",
    },
  });

  const mekanik = await prisma.user.upsert({
    where: { username: "mekanik" },
    update: {},
    create: {
      username: "mekanik",
      name: "Agus Pratama (Senior Mechanic)",
      passwordHash: mekanikPassword,
      role: "MEKANIK",
    },
  });

  console.log("Users created:", { admin: admin.username, kasir: kasir.username, mekanik: mekanik.username });

  // 3. Upsert Spareparts
  const partsData = [
    { sku: "PART-OIL-001", name: "Oli Shell Helix HX7 10W-40 (4 Liter)", category: "Oli & Pelumas", buyPrice: 280000, sellPrice: 350000, stock: 15, minStock: 5, unit: "Galon" },
    { sku: "PART-FLT-002", name: "Filter Oli Denso (Avanza / Xenia / Rush)", category: "Filter", buyPrice: 28000, sellPrice: 45000, stock: 25, minStock: 5, unit: "Pcs" },
    { sku: "PART-BRK-003", name: "Kampas Rem Depan Bendix (Avanza / Xenia)", category: "Pengereman", buyPrice: 190000, sellPrice: 265000, stock: 8, minStock: 4, unit: "Set" },
    { sku: "PART-SPK-004", name: "Busi Denso Iridium Power IK20", category: "Pengapian", buyPrice: 70000, sellPrice: 95000, stock: 3, minStock: 6, unit: "Pcs" }, // Low stock alert!
    { sku: "PART-BAT-005", name: "Aki GS Astra Maintenance Free 46B24R", category: "Kelistrikan", buyPrice: 750000, sellPrice: 920000, stock: 4, minStock: 2, unit: "Unit" },
    { sku: "PART-OIL-006", name: "Minyak Rem Seiken DOT 4 (300ml)", category: "Oli & Pelumas", buyPrice: 32000, sellPrice: 50000, stock: 12, minStock: 5, unit: "Botol" },
    { sku: "PART-WPR-007", name: "Wiper Blade Bosch Advantage 20+16 inch", category: "Aksesoris", buyPrice: 75000, sellPrice: 110000, stock: 10, minStock: 3, unit: "Set" },
  ];

  for (const part of partsData) {
    await prisma.sparepart.upsert({
      where: { sku: part.sku },
      update: {},
      create: part,
    });
  }

  // 4. Sample Service Orders
  const oilPart = await prisma.sparepart.findUnique({ where: { sku: "PART-OIL-001" } });
  const filterPart = await prisma.sparepart.findUnique({ where: { sku: "PART-FLT-002" } });
  const brakePart = await prisma.sparepart.findUnique({ where: { sku: "PART-BRK-003" } });

  const order1 = await prisma.serviceOrder.upsert({
    where: { orderNumber: "WO-202611-001" },
    update: {},
    create: {
      orderNumber: "WO-202611-001",
      plateNumber: "B 1420 SKT",
      vehicleModel: "Toyota Avanza 1.3 G 2021",
      customerName: "Budi Santoso",
      customerPhone: "081234567890",
      complaint: "Ganti oli mesin berkala dan periksa bunyi dengung di roda depan.",
      mechanicNotes: "Oli mesin sudah diganti Shell HX7, filter oli baru. Bearing roda depan aman.",
      status: "MENUNGGU",
      serviceFee: 75000,
      assignedMechanicId: mekanik.id,
    },
  });

  const order2 = await prisma.serviceOrder.upsert({
    where: { orderNumber: "WO-202611-002" },
    update: {},
    create: {
      orderNumber: "WO-202611-002",
      plateNumber: "D 1899 ZYX",
      vehicleModel: "Honda Jazz RS 2019",
      customerName: "Siti Rahma",
      customerPhone: "085678901234",
      complaint: "Rem berdecit saat diinjak pada kecepatan rendah.",
      mechanicNotes: "Kampas rem depan aus tersisa 15%. Perlu penggantian satu set.",
      status: "PENGERJAAN",
      serviceFee: 100000,
      assignedMechanicId: mekanik.id,
    },
  });

  // 5. Sample LUNAS order with Transaction
  const completedOrder = await prisma.serviceOrder.upsert({
    where: { orderNumber: "WO-202611-000" },
    update: {},
    create: {
      orderNumber: "WO-202611-000",
      plateNumber: "B 9182 ABC",
      vehicleModel: "Mitsubishi Xpander Ultimate 2022",
      customerName: "Hendra Wijaya",
      customerPhone: "081399887766",
      complaint: "Servis rem & ganti kampas rem depan.",
      mechanicNotes: "Pemasangan kampas rem baru selesai dan dites pengereman.",
      status: "LUNAS",
      serviceFee: 100000,
      assignedMechanicId: mekanik.id,
    },
  });

  if (brakePart) {
    const existingItem = await prisma.serviceOrderItem.findFirst({
      where: { serviceOrderId: completedOrder.id, sparepartId: brakePart.id },
    });
    if (!existingItem) {
      await prisma.serviceOrderItem.create({
        data: {
          serviceOrderId: completedOrder.id,
          sparepartId: brakePart.id,
          quantity: 1,
          priceAtTime: brakePart.sellPrice,
        },
      });
    }
  }

  // Create transaction for completed order
  await prisma.transaction.upsert({
    where: { invoiceNumber: "INV-202611-0001" },
    update: {},
    create: {
      invoiceNumber: "INV-202611-0001",
      serviceOrderId: completedOrder.id,
      totalParts: 265000,
      totalService: 100000,
      subtotal: 365000,
      discount: 0,
      tax: 0,
      grandTotal: 365000,
      paidAmount: 400000,
      changeAmount: 35000,
      paymentMethod: "CASH",
      cashierId: kasir.id,
    },
  });

  // 6. Initial Security Log
  await prisma.securityLog.create({
    data: {
      event: "SYSTEM_INIT",
      details: "Sistem OnderdilEngine berhasil diinisialisasi dengan data awal.",
      ipAddress: "127.0.0.1",
      userAgent: "Server Startup",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
