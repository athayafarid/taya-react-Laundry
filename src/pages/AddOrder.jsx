import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Button, Card, Input, Badge, Table } from "../components/Anatomy";

export default function AddOrder() {

    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [selectedService, setSelectedService] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");

    const [price, setPrice] = useState(0);
    const [weight, setWeight] = useState(1);

    const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);

    const [form, setForm] = useState({
        id: "",
        date: "",
        status: "",
    });

    useEffect(() => {
        const serviceData = JSON.parse(localStorage.getItem("services")) || [];
        const customerData = JSON.parse(localStorage.getItem("customers")) || [];

        setServices(serviceData);
        setCustomers(customerData);
    }, []);

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        setSelectedService(serviceId);

        const selected = services.find(s => s.id.toString() === serviceId);
        if (selected) setPrice(selected.price);
    };

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        setSelectedCustomer(customerId);

        const selected = customers.find(c => c.id.toString() === customerId);
        setSelectedCustomerDetail(selected);
    };

    const total = price * weight;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newOrder = {
            id: form.id || "TRX" + Date.now(),
            date: form.date,
            customer: selectedCustomerDetail?.name,
            phone: selectedCustomerDetail?.phone,
            service: services.find(s => s.id.toString() === selectedService)?.name,
            price,
            weight,
            total,
            status: form.status || "Order Diterima",
            payment: "Belum Bayar",
            steps: ["Order Diterima", "Diproses", "Selesai", "Diambil"],
            currentStep: 0,
        };

        const existing = JSON.parse(localStorage.getItem("orders")) || [];
        localStorage.setItem("orders", JSON.stringify([...existing, newOrder]));

        alert("Order berhasil disimpan!");

        // reset
        setForm({ id: "", date: "", status: "" });
        setSelectedService("");
        setSelectedCustomer("");
        setSelectedCustomerDetail(null);
        setPrice(0);
        setWeight(1);
    };

    return (
        <div className="p-8">
            <PageHeader
                title="Add New Order"
                breadcrumb={["Laundry", "Orders", "Add Order"]}
                actionLabel="Back to Orders"
                actionTo="/orders"
            />

            <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-4xl">
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Order ID */}
                        <div className="flex flex-col gap-2">
                            <label>Order ID</label>
                            <input
                                name="id"
                                value={form.id}
                                onChange={handleChange}
                                className="border p-3 rounded-xl bg-gray-50"
                                placeholder="Auto jika kosong"
                            />
                        </div>

                        {/* Date */}
                        <div className="flex flex-col gap-2">
                            <label>Order Date</label>
                            <input
                                name="date"
                                type="date"
                                value={form.date}
                                onChange={handleChange}
                                className="border p-3 rounded-xl"
                                required
                            />
                        </div>

                        {/* CUSTOMER DROPDOWN */}
                        <div className="flex flex-col gap-2">
                            <label>Customer</label>
                            <select
                                value={selectedCustomer}
                                onChange={handleCustomerChange}
                                className="border p-3 rounded-xl"
                                required
                            >
                                <option value="">Pilih Customer</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} - {c.phone}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-2">
                            <label>Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="border p-3 rounded-xl"
                            >
                                <option value="">Default</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Diambil">Diambil</option>
                            </select>
                        </div>

                        {/* Layanan */}
                        <div className="flex flex-col gap-2">
                            <label>Layanan</label>
                            <select
                                value={selectedService}
                                onChange={handleServiceChange}
                                className="border p-3 rounded-xl"
                                required
                            >
                                <option value="">Pilih Layanan</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} - Rp {s.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Berat */}
                        <div className="flex flex-col gap-2">
                            <label>Berat (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="border p-3 rounded-xl"
                                min="1"
                            />
                        </div>
                    </div>

                    {/* DETAIL CUSTOMER */}
                    {selectedCustomerDetail && (
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <p><b>Nama:</b> {selectedCustomerDetail.name}</p>
                            <p><b>Phone:</b> {selectedCustomerDetail.phone}</p>
                            <p><b>Email:</b> {selectedCustomerDetail.email}</p>
                        </div>
                    )}

                    {/* Harga */}
                    <input
                        value={`Rp ${price}`}
                        disabled
                        className="border p-3 rounded-xl bg-gray-100"
                    />

                    {/* Total */}
                    <input
                        value={`Rp ${total}`}
                        disabled
                        className="border p-3 rounded-xl bg-gray-100 font-bold"
                    />

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => window.history.back()}>
                            Cancel
                        </button>
                        <button className="bg-blue-500 text-white px-6 py-3 rounded-xl">
                            Save Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}