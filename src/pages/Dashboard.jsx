import { useEffect, useState } from "react";
import { Button, Card, Input, Badge, Table } from "../components/Anatomy";
import PageHeader from "../components/PageHeader";
import {
    MdTrendingUp, MdPeople, MdAssignment, MdAttachMoney,
    MdFileDownload, MdFilterList
} from "react-icons/md";

// 🔥 CHART
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

    useEffect(() => {
        const o = JSON.parse(localStorage.getItem("orders")) || [];
        const c = JSON.parse(localStorage.getItem("customers")) || [];
        setOrders(o);
        setCustomers(c);
    }, []);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID").format(angka);

    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    // 🔥 DESIGN SYSTEM: COLORS & TYPOGRAPHY
    const colors = {
        primary: "#5D5FEF",       // Brand
        success: "#05CD99",       // Semantic Success
        warning: "#FFB547",       // Semantic Warning
        error: "#EE5D50",         // Semantic Error
        navy: "#1B254B",          // Natural Navy (H1, H2, Body)
        blueGray: "#A3AED0",      // Natural Blue Gray (Caption)
        bg: "#F4F7FE"             // Background
    };

    const stats = [
        { label: "Total Orders", value: totalOrders, icon: <MdAssignment />, color: "text-[#5D5FEF]", trend: "+15%", trendColor: "text-[#05CD99]" },
        { label: "Total Revenue", value: `Rp ${formatRupiah(totalRevenue)}`, icon: <MdAttachMoney />, color: "text-[#FFB547]", trend: "+8.2%", trendColor: "text-[#05CD99]" },
        { label: "New Customer", value: totalCustomers, icon: <MdPeople />, color: "text-[#05CD99]", trend: "+10%", trendColor: "text-[#05CD99]" },
        { label: "Growth", value: "82%", icon: <MdTrendingUp />, color: "text-[#EE5D50]", trend: "-2.4%", trendColor: "text-[#EE5D50]" },
    ];

    return (
        <div className="p-8 bg-[#F4F7FE] min-h-screen text-[#1B254B] font-sans">
            <PageHeader title="Overview" breadcrumb={["Laundry", "Dashboard"]} />

            {/* H2 - SECTION TITLE */}
            <h2 className="text-2xl font-extrabold tracking-tight mb-8">Business Summary</h2>

            {/* 🔥 TOP SERVICES (NATURAL STYLE) */}
            <div className="bg-white rounded-[2.5rem] p-7 mb-8 shadow-[0px_18px_40px_rgba(112,144,176,0.08)]">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A3AED0] mb-5">Top Services</h3>
                <div className="space-y-4">
                    {[1, 2].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-[#F4F7FE]/50 rounded-[1.5rem] transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#5D5FEF]/10 flex items-center justify-center text-[#5D5FEF] font-black text-lg group-hover:bg-[#5D5FEF] group-hover:text-white transition-colors">S</div>
                                <div>
                                    <p className="text-sm font-bold text-[#1B254B]">Layanan Premium</p>
                                    <p className="text-xs font-semibold text-[#A3AED0]">120 Orders</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-[#5D5FEF]">Rp {formatRupiah(500000)}</p>
                                <span className="hidden md:inline-block text-[10px] px-3 py-1 bg-[#05CD99]/10 text-[#05CD99] rounded-lg font-black uppercase mt-1">Best Seller</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 STAT CARDS (H3 + CAPTION) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((item, index) => (
                    <div key={index} className="bg-white p-7 rounded-[2.5rem] shadow-[0px_18px_40px_rgba(112,144,176,0.08)] flex flex-col hover:scale-[1.02] transition-transform">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#A3AED0] mb-1">{item.label}</p>
                                <h3 className="text-2xl font-black text-[#1B254B] tracking-tight">{item.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl bg-[#F4F7FE] ${item.color} text-xl`}>
                                {item.icon}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-black ${item.trendColor}`}>
                                {item.trend}
                            </span>
                            <span className="text-[11px] text-[#A3AED0] font-bold">Since last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-[0px_18px_40px_rgba(112,144,176,0.08)]">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[#1B254B] tracking-tight">Revenue Trends</h3>
                            <p className="text-xs font-semibold text-[#A3AED0]">Monthly laundry income</p>
                        </div>
                        <button className="p-2.5 bg-[#F4F7FE] rounded-xl text-[#A3AED0] hover:text-[#5D5FEF] transition-colors"><MdFilterList size={20} /></button>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={orders.length > 0 ? orders : [{ id: 1, total: 200000 }, { id: 2, total: 500000 }]}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#A3AED0', fontSize: 11, fontWeight: 700 }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 800 }} />
                            <Area type="monotone" dataKey="total" stroke={colors.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* TARGET CARD (H1 + BODY) */}
                <div className="bg-[#5D5FEF] p-10 rounded-[3.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Monthly Target</p>
                        <h1 className="text-5xl font-black mb-6 tracking-tighter">82% <span className="text-lg font-medium text-white/50">Done</span></h1>
                        <div className="space-y-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-[#5D5FEF] shadow-lg" alt="avatar" />
                                ))}
                            </div>
                            <p className="text-xs font-bold tracking-wide text-white/90 leading-relaxed">
                                Queue Status: <span className="text-[#05CD99] font-black underline decoration-2 underline-offset-4">HEALTHY</span>
                            </p>
                        </div>
                    </div>
                    <div className="absolute bottom-[-40px] right-[-40px] w-56 h-56 bg-white/10 rounded-full blur-[80px]"></div>
                </div>
            </div>

            {/* 🔥 RECENT ORDERS (TABLE SCALE) */}
            <div className="bg-white p-8 rounded-[3rem] shadow-[0px_18px_40px_rgba(112,144,176,0.08)]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black text-[#1B254B] tracking-tight">Recent Orders</h3>
                    <button className="flex items-center gap-2 text-[10px] font-black text-[#5D5FEF] bg-[#5D5FEF]/5 px-5 py-2.5 rounded-2xl hover:bg-[#5D5FEF] hover:text-white transition-all">
                        <MdFileDownload size={18} /> EXPORT CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[#A3AED0] text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <th className="pb-5">ID Order</th>
                                <th className="pb-5">Customer</th>
                                <th className="pb-5">Total Amount</th>
                                <th className="pb-5 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.slice(-5).reverse().map((o) => (
                                <tr key={o.id} className="group hover:bg-[#F4F7FE]/50 transition-colors">
                                    <td className="py-5 text-sm font-black text-[#1B254B]">#{o.id}</td>
                                    <td className="py-5 text-sm font-bold text-[#A3AED0]">{o.customer}</td>
                                    <td className="py-5 text-sm font-black text-[#1B254B]">Rp {formatRupiah(o.total)}</td>
                                    <td className="py-5 text-center">
                                        <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${o.status === "Selesai"
                                            ? "bg-[#05CD99]/10 text-[#05CD99]"
                                            : "bg-[#FFB547]/10 text-[#FFB547]"
                                            }`}>
                                            {o.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}