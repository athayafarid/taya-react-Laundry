import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import {
  MdArrowBack,
  MdCalendarToday,
  MdCheckCircle,
  MdLocalLaundryService,
  MdPersonAdd,
  MdReceiptLong,
  MdSave,
} from "react-icons/md";

const defaultServices = [
  { id: "s1", name: "Cuci Kering Setrika", price: 7000 },
  { id: "s2", name: "Cuci Kering", price: 5000 },
  { id: "s3", name: "Setrika Saja", price: 4000 },
  { id: "s4", name: "Cuci Bed Cover", price: 15000 },
  { id: "s5", name: "Cuci Sepatu", price: 30000 },
];

const statusOptions = ["Order Diterima", "Diproses", "Selesai"];

export default function AddOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(1);
  const [customerType, setCustomerType] = useState("existing");
  const [selectedCustomer, setSelectedCustomer] = useState("");
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
    let serviceData = JSON.parse(localStorage.getItem("services")) || [];
    if (serviceData.length === 0) {
      serviceData = defaultServices;
      localStorage.setItem("services", JSON.stringify(defaultServices));
    }
    setServices(serviceData);
    fetchCustomers();

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

      const customerMap = {};
      (data || []).forEach((o) => {
        if (!o.customer) return;
        const key = `${o.customer.toLowerCase().trim()}_${(o.phone || "").trim()}`;
        if (!customerMap[key]) {
          customerMap[key] = {
            id: key,
            name: o.customer,
            phone: o.phone || "",
          };
        }
      });

      setCustomers(
        Object.values(customerMap).sort((a, b) => a.name.localeCompare(b.name))
      );
    } catch (err) {
      console.error("Gagal mengambil data customer:", err?.message || err);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);

    const selected = services.find((s) => s.id?.toString() === serviceId);
    setPrice(selected ? Number(selected.price) || 0 : 0);
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
  const activeService = services.find((s) => s.id?.toString() === selectedService);

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
        if (!newCustomerForm.name || !newCustomerForm.phone) {
          alert("Isi Nama dan No HP pelanggan baru!");
          setLoading(false);
          return;
        }

        customerName = newCustomerForm.name;
        customerPhone = newCustomerForm.phone;
      }

      const newOrder = {
        id: form.id || `TRX-${Date.now()}`,
        date: form.date,
        customer: customerName,
        phone: customerPhone,
        service: activeService?.name || "Layanan Custom",
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
    <div>
      <PageHeader
        title="Pemesanan Baru"
        breadcrumb={["Laundry", "Orders", "Pemesanan Baru"]}
        actionLabel=""
        description="Input transaksi baru dengan detail pelanggan, layanan, berat cucian, dan status awal dalam satu layar kerja."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7"
        >
          <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                ID Nota
              </label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                placeholder="Otomatis jika kosong"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                Tanggal Masuk
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          <section className="border-t border-slate-100 py-7">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Informasi Pelanggan
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Pilih pelanggan lama atau buat data pelanggan baru langsung.
                </p>
              </div>

              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-xs font-black">
                {[
                  ["existing", "Terdaftar"],
                  ["new", "Baru"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCustomerType(value)}
                    className={`rounded-xl px-4 py-2 transition ${
                      customerType === value
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {customerType === "existing" ? (
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                  Pilih Pelanggan
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required={customerType === "existing"}
                >
                  <option value="">-- Pilih customer terdaftar --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.phone}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 rounded-3xl border border-blue-100 bg-blue-50/60 p-5 md:grid-cols-2">
                {[
                  ["name", "Nama Lengkap", "Contoh: Budi Santoso", "text"],
                  ["phone", "Nomor Handphone", "Contoh: 08123456789", "text"],
                  ["email", "Email", "Contoh: budi@gmail.com", "email"],
                  ["address", "Alamat", "Alamat pelanggan", "text"],
                ].map(([name, label, placeholder, type]) => (
                  <div key={name}>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={newCustomerForm[name]}
                      onChange={handleNewCustomerChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder={placeholder}
                      required={customerType === "new" && ["name", "phone"].includes(name)}
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                    Loyalty Member
                  </label>
                  <select
                    name="loyalty"
                    value={newCustomerForm.loyalty}
                    onChange={handleNewCustomerChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>
              </div>
            )}
          </section>

          <section className="border-t border-slate-100 py-7">
            <div className="mb-5">
              <h2 className="text-lg font-black text-slate-950">Detail Cucian</h2>
              <p className="text-xs font-semibold text-slate-500">
                Tentukan layanan, berat cucian, dan status awal pengerjaan.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                  Jenis Layanan
                </label>
                <select
                  value={selectedService}
                  onChange={handleServiceChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">-- Pilih layanan --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - Rp {(Number(s.price) || 0).toLocaleString("id-ID")}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                  Berat Cucian
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, Math.round(Number(e.target.value))))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-400">
                  Status Awal
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100"
            >
              <MdArrowBack size={18} />
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-50"
            >
              <MdSave size={18} />
              {loading ? "Menyimpan..." : "Simpan Pesanan"}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="rounded-[28px] bg-gradient-to-br from-blue-700 to-indigo-700 p-6 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <MdReceiptLong size={26} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                  Preview Nota
                </p>
                <h3 className="text-xl font-black">Ringkasan Tagihan</h3>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
              <div className="flex justify-between text-sm font-bold text-blue-50">
                <span>Layanan</span>
                <span className="text-right">{activeService?.name || "-"}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-blue-50">
                <span>Tarif</span>
                <span>Rp {formatRupiah(price)} / kg</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-blue-50">
                <span>Berat</span>
                <span>{weight} kg</span>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold text-blue-100">Total</span>
                <span className="text-3xl font-black">Rp {formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/70">
            <h3 className="text-lg font-black text-slate-950">Checklist Operator</h3>
            <div className="mt-5 space-y-4">
              {[
                ["Data pelanggan jelas", <MdPersonAdd size={20} />],
                ["Tanggal masuk sesuai", <MdCalendarToday size={20} />],
                ["Layanan dan berat terisi", <MdLocalLaundryService size={20} />],
                ["Nota siap dikirim", <MdCheckCircle size={20} />],
              ].map(([text, icon]) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-slate-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
