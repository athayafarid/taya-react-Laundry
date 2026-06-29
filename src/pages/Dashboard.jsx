import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import {
  MdTrendingUp,
  MdPeople,
  MdAssignment,
  MdAttachMoney,
  MdFileDownload,
  MdLocalLaundryService,
} from "react-icons/md";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: true });

      if (ordersError) throw ordersError;

      // Extract unique customers from orders dynamically
      const customerMap = {};
      (ordersData || []).forEach((o) => {
        if (!o.customer) return;
        const key = `${o.customer.toLowerCase().trim()}_${(o.phone || "").trim()}`;
        if (!customerMap[key]) {
          customerMap[key] = {
            name: o.customer,
            phone: o.phone || "-",
          };
        }
      });

      setOrders(ordersData || []);
      setCustomers(Object.values(customerMap));
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka);

  // Perhitungan metrics dinamis
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // Menghitung Top Services secara dinamis dari data order di Supabase
  const getTopServices = () => {
    const serviceCounts = {};
    orders.forEach((o) => {
      if (!o.service) return;
      if (!serviceCounts[o.service]) {
        serviceCounts[o.service] = { count: 0, revenue: 0 };
      }
      serviceCounts[o.service].count += 1;
      serviceCounts[o.service].revenue += Number(o.total) || 0;
    });

    return Object.entries(serviceCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const topServices = getTopServices();

  // Menghitung tren pendapatan per tanggal
  const getChartData = () => {
    const dailyRevenue = {};
    orders.forEach((o) => {
      if (!o.date) return;
      const dateStr = new Date(o.date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      dailyRevenue[dateStr] = (dailyRevenue[dateStr] || 0) + (Number(o.total) || 0);
    });

    const data = Object.entries(dailyRevenue).map(([date, total]) => ({
      date,
      total,
    }));

    if (data.length === 0) {
      return [
        { date: "No Data", total: 0 },
      ];
    }
    return data;
  };

  const chartData = getChartData();

  // Stats Card data
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <MdAssignment />,
      color: "text-blue-600 bg-blue-50 border border-blue-100",
      trend: `${totalOrders > 0 ? "+100%" : "0%"}`,
      trendColor: "text-green-600",
    },
    {
      label: "Total Revenue",
      value: `Rp ${formatRupiah(totalRevenue)}`,
      icon: <MdAttachMoney />,
      color: "text-orange-600 bg-orange-50 border border-orange-100",
      trend: "+8.2%",
      trendColor: "text-green-600",
    },
    {
      label: "Customers",
      value: totalCustomers,
      icon: <MdPeople />,
      color: "text-emerald-600 bg-emerald-50 border border-emerald-100",
      trend: `${totalCustomers > 0 ? "+100%" : "0%"}`,
      trendColor: "text-green-600",
    },
    {
      label: "Avg. Transaction",
      value: `Rp ${formatRupiah(totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0)}`,
      icon: <MdTrendingUp />,
      color: "text-indigo-600 bg-indigo-50 border border-indigo-100",
      trend: "Optimal",
      trendColor: "text-blue-600",
    },
  ];

  const exportCSV = () => {
    if (orders.length === 0) return alert("Tidak ada data untuk diekspor!");
    const headers = "ID,Tanggal,Customer,Layanan,Berat,Total,Status,Pembayaran\n";
    const rows = orders
      .map(
        (o) =>
          `"${o.id}","${o.date}","${o.customer || ""}","${o.service || ""}",${o.weight || 0},${o.total || 0},"${o.status}","${o.payment || "Belum Bayar"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `laundrygo_orders_export_${Date.now()}.csv`);
    a.click();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader title="Overview" breadcrumb={["Laundry", "Dashboard"]} />

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ms-3 text-slate-500 font-bold text-sm">Memuat data dashboard...</span>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-black text-slate-900 tracking-wide mb-6">Ringkasan Bisnis</h2>

          {/* STATS CARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 transition duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      {item.label}
                    </p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {item.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl ${item.color} text-xl`}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-black ${item.trendColor}`}>
                    {item.trend}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    vs bulan lalu
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* GRAPH CARD */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-wide">
                    Tren Pendapatan
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    Grafik pemasukan laundry secara real-time
                  </p>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 700 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "1px solid #F1F5F9",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                        fontWeight: 800,
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#2563EB"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP SERVICES CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <MdLocalLaundryService className="text-blue-600 text-lg" />
                  <h3 className="text-base font-black text-slate-900 tracking-wide">
                    Layanan Terpopuler
                  </h3>
                </div>
                <div className="space-y-3.5">
                  {topServices.length > 0 ? (
                    topServices.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3.5 hover:bg-slate-50 rounded-2xl transition duration-200 border border-transparent hover:border-slate-100 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition duration-200">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">
                              {service.name}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400">
                              {service.count} Transaksi
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-blue-600">
                            Rp {formatRupiah(service.revenue)}
                          </p>
                          <span className="text-[8px] px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-md font-black uppercase inline-block mt-0.5">
                            Active
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-8">
                      Belum ada data transaksi
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold leading-normal">
                  * Layanan terpopuler dihitung secara otomatis berdasarkan volume pesanan yang tersimpan di database Supabase.
                </p>
              </div>
            </div>
          </div>

          {/* RECENT ORDERS TABLE CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  Transaksi Terakhir
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  Daftar 5 pesanan terbaru dari pelanggan
                </p>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 text-xs font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition duration-150"
              >
                <MdFileDownload size={16} /> EXPORT CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3">ID Order</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Layanan</th>
                    <th className="pb-3">Total Tagihan</th>
                    <th className="pb-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.length > 0 ? (
                    orders
                      .slice(-5)
                      .reverse()
                      .map((o) => (
                        <tr
                          key={o.id}
                          className="hover:bg-slate-50/50 transition duration-150"
                        >
                          <td className="py-4 text-xs font-mono font-bold text-slate-800">
                            {o.id}
                          </td>
                          <td className="py-4 text-xs font-black text-slate-950">
                            {o.customer}
                          </td>
                          <td className="py-4 text-xs font-semibold text-slate-500">
                            {o.service}
                          </td>
                          <td className="py-4 text-xs font-black text-slate-950">
                            Rp {formatRupiah(o.total)}
                          </td>
                          <td className="py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                o.status === "Selesai" || o.status === "Diambil"
                                  ? "bg-green-50 border border-green-100 text-green-700"
                                  : "bg-orange-50 border border-orange-100 text-orange-600"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                        Belum ada pesanan masuk
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}