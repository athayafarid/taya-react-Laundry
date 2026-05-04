// OrderHistory.jsx
import { useState } from "react";

const initialOrders = [
  {
    id: 1,
    customerName: "Budi",
    phone: "08123456789",
    service: "Cuci Kering",
    date: "2026-05-01",
    status: "Selesai",
    paymentStatus: "Belum Bayar",
    total: 15000,
  },
  {
    id: 2,
    customerName: "Siti",
    phone: "08987654321",
    service: "Setrika",
    date: "2026-05-02",
    status: "Proses",
    paymentStatus: "Sudah Bayar",
    total: 10000,
  },
];

export default function OrderHistory() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const togglePayment = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              paymentStatus:
                o.paymentStatus === "Sudah Bayar"
                  ? "Belum Bayar"
                  : "Sudah Bayar",
            }
          : o
      )
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);

    const matchFilter =
      filter === "all"
        ? true
        : o.paymentStatus === (filter === "paid" ? "Sudah Bayar" : "Belum Bayar");

    return matchSearch && matchFilter;
  });

  const totalOrders = orders.length;
  const paid = orders.filter((o) => o.paymentStatus === "Sudah Bayar").length;
  const unpaid = orders.filter((o) => o.paymentStatus === "Belum Bayar").length;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Order & Pembayaran</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Total: {totalOrders}</div>
        <div className="bg-green-100 p-4 rounded shadow">Sudah Bayar: {paid}</div>
        <div className="bg-red-100 p-4 rounded shadow">Belum Bayar: {unpaid}</div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari nama / nomor"
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="paid">Sudah Bayar</option>
          <option value="unpaid">Belum Bayar</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Nama</th>
            <th>Layanan</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Pembayaran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o.id} className="text-center border-t">
              <td>{o.customerName}</td>
              <td>{o.service}</td>
              <td>{o.date}</td>
              <td>{o.status}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    o.paymentStatus === "Sudah Bayar"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {o.paymentStatus}
                </span>
              </td>
              <td className="flex gap-2 justify-center py-2">
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Detail
                </button>
                <button
                  onClick={() => togglePayment(o.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Toggle Bayar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-2">Detail Order</h2>
            <p>Nama: {selectedOrder.customerName}</p>
            <p>Layanan: {selectedOrder.service}</p>
            <p>Total: Rp {selectedOrder.total}</p>
            <p>Status: {selectedOrder.status}</p>
            <p>Pembayaran: {selectedOrder.paymentStatus}</p>

            <button
              onClick={() => togglePayment(selectedOrder.id)}
              className="mt-3 bg-green-500 text-white px-3 py-1 rounded"
            >
              Toggle Pembayaran
            </button>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-2 block text-red-500"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
