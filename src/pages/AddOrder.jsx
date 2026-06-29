import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { 
  MdSave, 
  MdArrowBack, 
  MdPersonAdd
} from "react-icons/md";

// Layanan default untuk inisialisasi fallback
const defaultServices = [
  { id: "s1", name: "Cuci Kering Setrika", price: 7000 },
  { id: "s2", name: "Cuci Kering", price: 5000 },
  { id: "s3", name: "Setrika Saja", price: 4000 },
  { id: "s4", name: "Cuci Bed Cover", price: 15000 },
  { id: "s5", name: "Cuci Sepatu", price: 30000 },
];

export default function AddOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // States form
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(1);

  // Opsi pemilihan tipe customer: "existing" atau "new"
  const [customerType, setCustomerType] = useState("existing");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Input customer baru
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    loyalty: "Bronze",
  });

  const [form, setForm] = useState({
    id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Order Diterima",
  });

  useEffect(() => {
    // Muat layanan (dari localstorage fallback ke default)
    let serviceData = JSON.parse(localStorage.getItem("services")) || [];
    if (serviceData.length === 0) {
      serviceData = defaultServices;
      localStorage.setItem("services", JSON.stringify(defaultServices));
    }
    setServices(serviceData);

    // Muat pelanggan dari Supabase orders
    fetchCustomers();

    // Check if new customer details are passed from AddCustomer
    if (location.state?.newCustomer) {
      const newCust = location.state.newCustomer;
      setCustomerType("new");
      setNewCustomerForm({
        name: newCust.name || "",
        phone: newCust.phone || "",
        email: newCust.email || "",
        address: newCust.address || "",
        loyalty: newCust.loyalty || "Bronze",
      });
    }
  }, [location.state]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      // Ekstraksi pelanggan unik untuk dropdown
      const customerMap = {};
      (data || []).forEach((o) => {
        if (!o.customer) return;
        const key = `${o.customer.toLowerCase().trim()}_${(o.phone || "").trim()}`;
        if (!customerMap[key]) {
          customerMap[key] = {
            id: key, // Menggunakan key gabungan sebagai identifier
            name: o.customer,
            phone: o.phone || "",
          };
        }
      });

      const uniqueCustomers = Object.values(customerMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCustomers(uniqueCustomers);
    } catch (err) {
      console.error("Gagal mengambil data customer:", err?.message || err);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);

    const selected = services.find((s) => s.id?.toString() === serviceId);
    if (selected) setPrice(Number(selected.price) || 0);
  };

  const handleNewCustomerChange = (e) => {
    setNewCustomerForm({
      ...newCustomerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(Number(angka) || 0);

  const total = price * weight;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let customerName = "";
      let customerPhone = "";

      if (customerType === "existing") {
        if (!selectedCustomer) {
          alert("Pilih pelanggan terlebih dahulu!");
          setLoading(false);
          return;
        }
        const selected = customers.find((c) => c.id === selectedCustomer);
        customerName = selected?.name || "Umum";
        customerPhone = selected?.phone || "";
      } else {
        // Tipe new: validasi form customer baru
        if (!newCustomerForm.name || !newCustomerForm.phone) {
          alert("Isi Nama dan No HP pelanggan baru!");
          setLoading(false);
          return;
        }

        customerName = newCustomerForm.name;
        customerPhone = newCustomerForm.phone;
      }

      // Simpan order baru ke Supabase orders table
      const newOrder = {
        id: form.id || `TRX-${Date.now()}`,
        date: form.date,
        customer: customerName,
        phone: customerPhone,
        service: services.find((s) => s.id.toString() === selectedService)?.name || "Layanan Custom",
        price: Math.round(price),
        weight: Math.round(weight),
        total: Math.round(total),
        status: form.status,
        payment: "Belum Bayar",
      };

      const { error: orderError } = await supabase
        .from("orders")
        .insert([newOrder]);

      if (orderError) throw orderError;

      alert("Transaksi laundry berhasil disimpan!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Pemesanan Baru"
        breadcrumb={["Laundry", "Orders", "Add Order"]}
        actionLabel=""
      />

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order ID */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">ID Nota (Opsional)</label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-mono"
                placeholder="Otomatis jika kosong"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">Tanggal Masuk</label>
              <div className="relative">
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* PILIHAN PELANGGAN */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Informasi Customer</h3>
            
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                <input
                  type="radio"
                  name="customerType"
                  value="existing"
                  checked={customerType === "existing"}
                  onChange={() => setCustomerType("existing")}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                Pelanggan Terdaftar
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                <input
                  type="radio"
                  name="customerType"
                  value="new"
                  checked={customerType === "new"}
                  onChange={() => setCustomerType("new")}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="flex items-center gap-1 text-blue-600">
                  <MdPersonAdd size={14} /> Pelanggan Baru (Input Langsung)
                </span>
              </label>
            </div>

            {customerType === "existing" ? (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">Pilih Pelanggan</label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
                  required={customerType === "existing"}
                >
                  <option value="">-- Pilih Customer Terdaftar --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    value={newCustomerForm.name}
                    onChange={handleNewCustomerChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    placeholder="Contoh: Budi Santoso"
                    required={customerType === "new"}
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500">Nomor Handphone</label>
                  <input
                    type="text"
                    name="phone"
                    value={newCustomerForm.phone}
                    onChange={handleNewCustomerChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    placeholder="Contoh: 08123456789"
                    required={customerType === "new"}
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500">Email (Opsional)</label>
                  <input
                    type="email"
                    name="email"
                    value={newCustomerForm.email}
                    onChange={handleNewCustomerChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                    placeholder="Contoh: budi@gmail.com"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-500">Loyalty Member</label>
                  <select
                    name="loyalty"
                    value={newCustomerForm.loyalty}
                    onChange={handleNewCustomerChange}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
                  >
                    <option value="Bronze">Bronze (Default)</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* DETIL PESANAN */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Informasi Cucian</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Layanan */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">Jenis Layanan</label>
                <select
                  value={selectedService}
                  onChange={handleServiceChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
                  required
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Rp {(Number(s.price) || 0).toLocaleString("id-ID")}/kg
                    </option>
                  ))}
                </select>
              </div>

              {/* Berat */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">Berat (Kg - Bulatkan)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, Math.round(Number(e.target.value))))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-bold"
                  min="1"
                  step="1"
                  required
                />
              </div>

              {/* Status Pengerjaan Awal */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">Status Pengerjaan</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
                >
                  <option value="Order Diterima">Order Diterima</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rincian Pembayaran */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Tarif Layanan</span>
              <span>Rp {formatRupiah(price)} / Kg</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Berat Cucian</span>
              <span>{weight} Kg</span>
            </div>
            <div className="h-px bg-slate-200 my-1"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black text-slate-800">Total Tagihan</span>
              <span className="text-lg font-black text-blue-600">Rp {formatRupiah(total)}</span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition text-xs font-bold cursor-pointer flex items-center gap-1"
            >
              <MdArrowBack size={16} /> Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/10 transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <MdSave size={16} /> {loading ? "Menyimpan..." : "Simpan Pesanan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}