import { useCallback, useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { 
  MdNotifications, 
  MdSearch, 
  MdRefresh, 
  MdHistory, 
  MdLocalLaundryService,
  MdCheckCircle,
  MdPayment
} from "react-icons/md";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" or "history"
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const generateNotifications = useCallback((orderList) => {
    const list = [];
    orderList.slice(0, 10).forEach((o) => {
      if (o.status === "Selesai") {
        list.push({
          id: `notif-ready-${o.id}`,
          message: `Cucian #${o.id} milik ${o.customer} sudah Selesai & siap diambil!`,
          time: "Baru saja",
          icon: <MdCheckCircle className="text-green-500" />
        });
      }
      if (o.payment === "Belum Bayar") {
        list.push({
          id: `notif-pay-${o.id}`,
          message: `Pesanan #${o.id} belum menyelesaikan pembayaran (Rp ${o.total.toLocaleString("id-ID")}).`,
          time: "Perlu konfirmasi",
          icon: <MdPayment className="text-red-500" />
        });
      }
    });
    setNotifications(list.slice(0, 5));
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      generateNotifications(data || []);
    } catch (err) {
      console.error("Gagal mengambil data order:", err.message);
      alert("Gagal memuat data order.");
    } finally {
      setLoading(false);
    }
  }, [generateNotifications]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Update state local
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Gagal mengupdate status:", err.message);
      alert("Gagal mengupdate status pesanan.");
    }
  };

  const togglePaymentStatus = async (orderId, currentPayment) => {
    const nextPayment = currentPayment === "Sudah Bayar" ? "Belum Bayar" : "Sudah Bayar";
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment: nextPayment })
        .eq("id", orderId);

      if (error) throw error;

      // Update state local
      setOrders(orders.map(o => o.id === orderId ? { ...o, payment: nextPayment } : o));
    } catch (err) {
      console.error("Gagal mengupdate status pembayaran:", err.message);
      alert("Gagal mengupdate status pembayaran.");
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka);

  // Filter pencarian dan tab
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customer?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.service?.toLowerCase().includes(search.toLowerCase());

    const isFinished = o.status === "Diambil";
    const matchTab = activeTab === "active" ? !isFinished : isFinished;

    return matchSearch && matchTab;
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased relative">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <PageHeader
            title="Manajemen Order"
            breadcrumb={["Laundry", "Orders"]}
            actionLabel="Pemesanan Baru"
            actionLink="/add-order"
          />
        </div>

        {/* NOTIFICATION BELL */}
        <div className="relative mt-2 z-30">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition shadow-sm relative cursor-pointer"
          >
            <MdNotifications className="text-xl text-slate-600" />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-40 animate-fadeIn">
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-100">
                <span className="text-xs font-black text-slate-900">Notifikasi Aktivitas</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Real-Time</span>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="flex gap-3 text-xs items-start p-1.5 hover:bg-slate-50 rounded-xl transition">
                      <div className="mt-0.5 text-base">{n.icon}</div>
                      <div>
                        <p className="text-slate-700 font-bold leading-normal">{n.message}</p>
                        <p className="text-[9px] text-slate-400 mt-1 font-semibold">{n.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Tidak ada notifikasi penting.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FILTER & TAB SECTION */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        {/* TABS */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition duration-150 cursor-pointer flex items-center justify-center gap-1.5
              ${activeTab === "active" ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <MdLocalLaundryService size={16} /> Pesanan Aktif
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black transition duration-150 cursor-pointer flex items-center justify-center gap-1.5
              ${activeTab === "history" ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <MdHistory size={16} /> Riwayat Diambil
          </button>
        </div>

        {/* SEARCH BAR & REFRESH */}
        <div className="flex gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MdSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Cari ID / Nama / Layanan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full sm:w-64 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition cursor-pointer text-slate-600 shadow-sm"
            title="Refresh Data"
          >
            <MdRefresh size={18} />
          </button>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xs text-slate-500 font-bold">Memuat data order dari database Supabase...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
                <th className="pb-4 pl-4">ID Nota</th>
                <th className="pb-4">Tanggal Masuk</th>
                <th className="pb-4">Nama Customer</th>
                <th className="pb-4">Jenis Layanan</th>
                <th className="pb-4">Berat</th>
                <th className="pb-4">Total</th>
                <th className="pb-4 text-center">Status Pembayaran</th>
                <th className="pb-4 text-center">Status Pengerjaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 pl-4 font-mono font-bold text-slate-800">{o.id}</td>
                  <td className="py-4 text-slate-500 font-semibold">
                    {new Date(o.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="py-4 font-black text-slate-900">{o.customer || "Umum"}</td>
                  <td className="py-4 font-bold text-slate-500">{o.service}</td>
                  <td className="py-4 font-bold text-slate-800">{o.weight} kg</td>
                  <td className="py-4 font-black text-slate-950">Rp {formatRupiah(o.total)}</td>
                  
                  {/* PEMBAYARAN TOGGLE BADGE */}
                  <td className="py-4 text-center">
                    <button
                      onClick={() => togglePaymentStatus(o.id, o.payment)}
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer transition active:scale-95 border
                        ${o.payment === "Sudah Bayar"
                          ? "bg-green-50 text-green-700 border-green-150 hover:bg-green-100"
                          : "bg-red-50 text-red-700 border-red-150 hover:bg-red-100"}`}
                      title="Klik untuk mengubah status pembayaran"
                    >
                      {o.payment || "Belum Bayar"}
                    </button>
                  </td>

                  {/* STATUS DROPDOWN */}
                  <td className="py-4 text-center">
                    <select
                      value={o.status || "Order Diterima"}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 text-[10px] rounded-xl px-2.5 py-1.5 font-black uppercase tracking-wider text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Order Diterima">Order Diterima</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                      <option value="Diambil">Diambil</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-bold">
            Tidak ada pesanan laundry yang ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
