import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";

export default function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(data);
    }, []);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID").format(angka);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Selesai":
                return "bg-green-100 text-green-700";
            case "Diproses":
                return "bg-yellow-100 text-yellow-700";
            case "Diambil":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="p-8 bg-[#e0e5ec] min-h-screen">

            <PageHeader 
                title="Orders" 
                breadcrumb={["Laundry", "Orders"]} 
                actionLabel="Add Order" 
                actionTo="/add-order"
            />

            <div className="p-6 rounded-2xl bg-[#e0e5ec] 
                shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff] overflow-x-auto">

                {orders.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">ID</th>
                                <th>Customer</th>
                                <th>Layanan</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="text-gray-700 border-t">
                                    <td className="py-3 font-semibold">{o.id}</td>
                                    <td>{o.customer}</td>
                                    <td>{o.service}</td>
                                    <td>Rp {formatRupiah(o.total)}</td>

                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>

                                    <td>{o.date}</td>
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