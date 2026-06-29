import { useState } from "react";
import PageHeader from "../components/PageHeader";

export default function OrderHistory() {
  const [orders, setOrders] = useState(
    () => JSON.parse(localStorage.getItem("orders")) || []
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka);

  // 🔥 TOGGLE PEMBAYARAN + SIMPAN
  const togglePayment = (id) => {
    const updated = orders.map((o) =>
      o.id === id
        ? {
          ...o,
          payment:
            o.payment === "Sudah Bayar"
              ? "Belum Bayar"
              : "Sudah Bayar",
        }
        : o
    );

    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // 🔥 FILTER DATA
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : o.payment === (filter === "paid" ? "Sudah Bayar" : "Belum Bayar");

    return matchSearch && matchFilter;
  });

  // 🔥 SUMMARY
  const totalOrders = orders.length;
  const paid = orders.filter((o) => o.payment === "Sudah Bayar").length;
  const unpaid = orders.filter((o) => o.payment !== "Sudah Bayar").length;

  return (
    <div className="p-8 bg-[#e0e5ec] min-h-screen">

      <PageHeader
        title="Riwayat Order & Pembayaran"
        breadcrumb={["Laundry", "Riwayat"]}
      />

      {/* 🔥 SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 rounded-xl bg-white shadow">
          Total: {totalOrders}
        </div>
        <div className="p-4 rounded-xl bg-green-100 shadow">
          Sudah Bayar: {paid}
        </div>
        <div className="p-4 rounded-xl bg-red-100 shadow">
          Belum Bayar: {unpaid}
        </div>
      </div>

      {/* 🔥 FILTER */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari ID / nama customer"
          className="p-3 rounded-xl w-full border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 rounded-xl border"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="paid">Sudah Bayar</option>
          <option value="unpaid">Belum Bayar</option>
        </select>
      </div>

      {/* 🔥 TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">ID</th>
              <th>Customer</th>
              <th>Layanan</th>
              <th>Total</th>
              <th>Status</th>
              <th>Pembayaran</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t text-sm">
                <td className="p-3 font-semibold">{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.service}</td>
                <td>Rp {formatRupiah(o.total)}</td>
                <td>{o.status}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${o.payment === "Sudah Bayar"
                        ? "bg-green-500"
                        : "bg-red-500"
                      }`}
                  >
                    {o.payment || "Belum Bayar"}
                  </span>
                </td>

                <td className="flex gap-2 p-2">
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
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="p-6 text-center text-gray-400">
            Tidak ada data
          </p>
        )}
      </div>

      {/* 🔥 MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-lg font-bold mb-3">Detail Order</h2>

            <p><b>ID:</b> {selectedOrder.id}</p>
            <p><b>Customer:</b> {selectedOrder.customer}</p>
            <p><b>Layanan:</b> {selectedOrder.service}</p>
            <p><b>Total:</b> Rp {formatRupiah(selectedOrder.total)}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Pembayaran:</b> {selectedOrder.payment}</p>

            <button
              onClick={() => togglePayment(selectedOrder.id)}
              className="mt-4 bg-green-500 text-white px-3 py-1 rounded w-full"
            >
              Toggle Pembayaran
            </button>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-2 text-red-500 w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
