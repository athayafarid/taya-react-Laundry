import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";

// 🔥 CHART
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

export default function Dashboard() {

    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const o = JSON.parse(localStorage.getItem("orders")) || [];
        const c = JSON.parse(localStorage.getItem("customers")) || [];
        const s = JSON.parse(localStorage.getItem("services")) || [];

        setOrders(o);
        setCustomers(c);
        setServices(s);
    }, []);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID").format(angka);

    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalServices = services.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 🔥 LINE CHART DATA (PENDAPATAN PER TANGGAL)
    const chartData = Object.values(
        orders.reduce((acc, order) => {
            const date = order.date || "No Date";

            if (!acc[date]) {
                acc[date] = { date, total: 0 };
            }

            acc[date].total += order.total || 0;

            return acc;
        }, {})
    );

    // 🔥 PIE CHART DATA (STATUS ORDER)
    const statusData = Object.values(
        orders.reduce((acc, order) => {
            const status = order.status || "Unknown";

            if (!acc[status]) {
                acc[status] = { name: status, value: 0 };
            }

            acc[status].value += 1;

            return acc;
        }, {})
    );

    const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

    return (
        <div className="p-8 bg-[#e0e5ec] min-h-screen">

            <PageHeader 
                title="Dashboard" 
                breadcrumb={["Laundry", "Dashboard"]} 
            />

            {/* 🔥 STAT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

                {[
                    { label: "Orders", value: totalOrders },
                    { label: "Revenue", value: `Rp ${formatRupiah(totalRevenue)}` },
                    { label: "Customers", value: totalCustomers },
                    { label: "Services", value: totalServices },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-2xl bg-[#e0e5ec] 
                        shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]"
                    >
                        <p className="text-gray-500 text-sm">{item.label}</p>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">
                            {item.value}
                        </h1>
                    </div>
                ))}

            </div>

            {/* 🔥 GRAFIK + PIE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                {/* LINE CHART */}
                <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                    shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">

                    <h2 className="font-bold mb-4 text-gray-700">
                        Grafik Pendapatan
                    </h2>

                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center">
                            Belum ada data
                        </p>
                    )}
                </div>

                {/* PIE CHART */}
                <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                    shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">

                    <h2 className="font-bold mb-4 text-gray-700">
                        Status Order
                    </h2>

                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center">
                            Belum ada data
                        </p>
                    )}
                </div>

            </div>

            {/* 🔥 STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                    shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">
                    
                    <h2 className="font-bold mb-4 text-gray-700">Order Status</h2>

                    <p className="text-gray-600">
                        Diproses: {orders.filter(o => o.status === "Diproses").length}
                    </p>
                    <p className="text-gray-600">
                        Selesai: {orders.filter(o => o.status === "Selesai").length}
                    </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                    shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">
                    
                    <h2 className="font-bold mb-4 text-gray-700">Ringkasan</h2>

                    <p className="text-gray-600">Total Order: {totalOrders}</p>
                    <p className="text-gray-600">
                        Total Pendapatan: Rp {formatRupiah(totalRevenue)}
                    </p>
                </div>
            </div>

            {/* 🔥 ORDER TERBARU */}
            <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">

                <h2 className="font-bold mb-4 text-gray-700">Order Terbaru</h2>

                {orders.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="py-2">ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(-5).reverse().map((o) => (
                                <tr key={o.id} className="text-gray-700">
                                    <td className="py-2">{o.id}</td>
                                    <td>{o.customer}</td>
                                    <td>Rp {formatRupiah(o.total)}</td>
                                    <td>{o.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-400 text-center">
                        Belum ada order
                    </p>
                )}
            </div>
        </div>
    );
}