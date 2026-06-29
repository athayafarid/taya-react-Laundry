import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabase";
import { MdSearch, MdRefresh, MdPerson } from "react-icons/md";

const getLoyaltyBadge = (points) => {
  const pts = Number(points) || 0;
  if (pts >= 100) return "bg-amber-50 text-amber-700 border-amber-200";
  if (pts >= 50) return "bg-slate-50 text-slate-600 border-slate-200";
  return "bg-orange-50 text-orange-700 border-orange-200";
};

const getLoyaltyLabel = (points) => {
  const pts = Number(points) || 0;
  if (pts >= 100) return "Gold";
  if (pts >= 50) return "Silver";
  return "Bronze";
};

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setLoading(true);
    try {
      // Mengambil dari tabel 'orders' untuk mengekstrak data pelanggan secara dinamis
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      // Ekstraksi pelanggan unik
      const customerMap = {};
      (data || []).forEach((o) => {
        if (!o.customer) return;
        const key = `${o.customer.toLowerCase().trim()}_${(o.phone || "").trim()}`;
        if (!customerMap[key]) {
          customerMap[key] = {
            id: o.id,
            name: o.customer,
            phone: o.phone || "-",
            email: `${o.customer.toLowerCase().replace(/\s+/g, "")}@example.com`,
            points: 0,
            transactionCount: 0,
          };
        }
        customerMap[key].transactionCount += 1;
        // 10 poin per transaksi laundry
        customerMap[key].points = customerMap[key].transactionCount * 10;
      });

      const uniqueCustomers = Object.values(customerMap).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setCustomers(uniqueCustomers);
    } catch (err) {
      console.error("Gagal mengambil data pelanggan:", err.message);
      alert("Gagal mengambil data pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian
  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Data Pelanggan"
        breadcrumb={["Laundry", "Customers"]}
        actionLabel="Tambah Pelanggan"
        actionLink="/add-customer"
      />

      {/* FILTER & ACTIONS */}
      <div className="flex gap-2 justify-between items-center mb-6">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <MdSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 w-full bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>
        <button
          onClick={getCustomers}
          className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition cursor-pointer text-slate-600 shadow-sm"
          title="Refresh Data"
        >
          <MdRefresh size={18} />
        </button>
      </div>

      {/* CUSTOMERS TABLE CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xs text-slate-500 font-bold">Memuat data pelanggan dari database Supabase...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-100">
                <th className="pb-4 pl-4">Pelanggan</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">No. Handphone</th>
                <th className="pb-4 text-center">Loyalty Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {filteredCustomers.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        <MdPerson size={18} />
                      </div>
                      <span className="font-black text-slate-950">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-500 font-semibold">{c.email || "-"}</td>
                  <td className="py-4 text-slate-900 font-bold">{c.phone}</td>
                  <td className="py-4 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ${getLoyaltyBadge(
                        c.points
                      )}`}
                    >
                      {getLoyaltyLabel(c.points)} ({c.transactionCount} trx)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-bold">
            Tidak ada data pelanggan yang terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}