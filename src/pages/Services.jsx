import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { MdAdd, MdDelete, MdLocalLaundryService } from "react-icons/md";

const defaultServices = [
  { id: "s1", name: "Cuci Kering Setrika", price: 7000 },
  { id: "s2", name: "Cuci Kering", price: 5000 },
  { id: "s3", name: "Setrika Saja", price: 4000 },
  { id: "s4", name: "Cuci Bed Cover", price: 15000 },
  { id: "s5", name: "Cuci Sepatu", price: 30000 },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("services")) || [];
    if (data.length === 0) {
      data = defaultServices;
      localStorage.setItem("services", JSON.stringify(defaultServices));
    }
    setServices(data);
  }, []);

  const addService = (e) => {
    e.preventDefault();
    if (!name || !price) return alert("Semua kolom harus diisi!");
    if (Number(price) <= 0) return alert("Harga harus lebih dari 0!");

    const newService = {
      id: `s-${Date.now()}`,
      name,
      price: Number(price),
    };

    const updated = [...services, newService];
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));

    setName("");
    setPrice("");
  };

  const deleteService = (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka);

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Layanan & Harga"
        breadcrumb={["Laundry", "Services"]}
        actionLabel=""
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ADD SERVICE FORM */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <MdLocalLaundryService className="text-blue-600 text-lg" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Tambah Layanan</h2>
          </div>

          <form onSubmit={addService} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Nama Layanan</label>
              <input
                type="text"
                placeholder="Contoh: Cuci Karpet"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500">Harga / Kg (Rp)</label>
              <input
                type="number"
                placeholder="Contoh: 12000"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm font-bold"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl transition duration-150 shadow-lg shadow-blue-500/10 cursor-pointer text-xs flex items-center justify-center gap-1"
            >
              <MdAdd size={16} /> Tambah Layanan
            </button>
          </form>
        </div>

        {/* SERVICES LIST TABLE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
                <th className="pb-4 pl-4">Jenis Layanan</th>
                <th className="pb-4">Harga / Kg</th>
                <th className="pb-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-bold">
              {services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 pl-4 font-black text-slate-950">{s.name}</td>
                    <td className="py-4 text-blue-600 font-extrabold">Rp {formatRupiah(s.price)}</td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => deleteService(s.id)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition border border-red-150 cursor-pointer active:scale-95"
                        title="Hapus Layanan"
                      >
                        <MdDelete size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-slate-400">
                    Belum ada layanan laundry terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}