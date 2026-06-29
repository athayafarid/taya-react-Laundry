import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { MdArrowForward, MdArrowBack } from "react-icons/md";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    loyalty: "Bronze",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Nama Lengkap dan Nomor Handphone wajib diisi!");
      return;
    }

    // Mengarahkan ke halaman buat order baru dengan pre-populate data customer baru
    navigate("/add-order", { state: { newCustomer: form } });
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Tambah Pelanggan"
        breadcrumb={["Laundry", "Customers", "Add Customer"]}
        actionLabel=""
      />

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto">
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-blue-800 text-xs font-bold leading-relaxed mb-6">
          ℹ️ Registrasi pelanggan baru akan otomatis disimpan ke database saat Anda membuat transaksi order pertama untuk mereka. Mengklik "Lanjutkan" akan mengarahkan Anda ke halaman Pemesanan Baru dengan data ini.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-bold"
              placeholder="Masukkan nama lengkap pelanggan"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Nomor Handphone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-mono"
              placeholder="Contoh: 08123456789"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Email (Opsional)</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
              placeholder="Contoh: pelanggan@gmail.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Alamat Lengkap</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
              placeholder="Masukkan alamat lengkap pelanggan"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500">Tingkat Loyalty</label>
            <select
              name="loyalty"
              value={form.loyalty}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            >
              <option value="Bronze">Bronze (Standard)</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold (VVIP)</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 transition text-xs font-bold cursor-pointer flex items-center gap-1"
            >
              <MdArrowBack size={16} /> Batal
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/10 transition cursor-pointer flex items-center gap-1.5"
            >
              Lanjutkan <MdArrowForward size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}