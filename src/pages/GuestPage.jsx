import { useState } from "react";
import { Link } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { supabase } from "../lib/supabase";

export default function GuestPage() {
  const [searchInvoice, setSearchInvoice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Alur proses laundry standar BILAS (Sesuaikan dengan urutan status di halaman admin Anda)
  const stepsList = ["Diterima", "Dicuci", "Disetrika", "Selesai"];

  // Daftar harga statis sesuai data sistem BILAS
 // Daftar layanan untuk card
const servicesPriceList = [
  {
    name: "Cuci",
    price: "Rp 5000",
    image: "/img/cuci.png",
  },
  {
    name: "Sepatu",
    price: "Rp 30000",
    image: "/img/sepatu.png",
  },
  {
    name: "Spray",
    price: "Rp 10000",
    image: "/img/spray.png",
  },
  {
    name: "Cuci Gosok",
    price: "Rp 7000",
    image: "/img/gosok.png",
  },
];

  // Fungsi otomatis untuk mencocokkan status teks dari admin ke bulatan progress bar
  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();

    // Pemetaan kata kunci status dari inputan admin
    if (
      lowerStatus.includes("terima") ||
      lowerStatus.includes("pending") ||
      lowerStatus.includes("baru")
    )
      return 0;
    if (
      lowerStatus.includes("cuci") ||
      lowerStatus.includes("proses") ||
      lowerStatus.includes("progress")
    )
      return 1;
    if (
      lowerStatus.includes("setrika") ||
      lowerStatus.includes("gosok") ||
      lowerStatus.includes("siap")
    )
      return 2;
    if (
      lowerStatus.includes("selesai") ||
      lowerStatus.includes("ambil") ||
      lowerStatus.includes("done")
    )
      return 3;

    return 0; // default jika tidak ada yang cocok
  };

  const handleTracking = async (e) => {
    e.preventDefault();
    if (!searchInvoice.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      console.log(
        `Menghubungkan Guest ke Database Admin... Mencari Nota: ${searchInvoice}`,
      );

      // 💡 PENTING: Pastikan ".from('orders')" di bawah ini nama tabelnya SAMA
      // dengan tabel tempat Admin menyimpan/meng-CRUD data pesanan laundry.
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", searchInvoice.trim()) // atau .eq('order_id', searchInvoice.trim()) jika kolomnya bernama order_id
        .single();

      if (error) {
        console.error("Data tidak ditemukan di database admin:", error.message);
        setResult(null);
      } else if (data) {
        console.log("Data dari Admin Berhasil Ditemukan:", data);

        // Menerjemahkan data database buatan admin agar pas dengan UI Guest
        setResult({
          id: data.id || data.order_id,
          // Fallback nama kolom pelanggan jika di tabel admin namanya berbeda
          customer:
            data.customer_name ||
            data.customer ||
            data.nama_pelanggan ||
            "Pelanggan BILAS",
          status: data.status || "Diterima",
          currentStep: getCurrentStepIndex(data.status),
          steps: stepsList,
        });
      }
    } catch (err) {
      console.error("Gangguan koneksi database:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* 1. NAVBAR */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 h-8 w-8 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            <span className="text-lg">L</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Laundry<span className="text-blue-600">Go</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-slate-600 hover:text-blue-600 font-bold transition text-xs sm:text-sm"
          >
            Login Admin
          </Link>

          <Link
            to="/member/login"
            className="text-slate-600 hover:text-blue-600 font-bold transition text-xs sm:text-sm"
          >
            Login Member
          </Link>

          <Link
            to="/member/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition text-xs sm:text-sm shadow-md shadow-blue-500/10"
          >
            Daftar Akun
          </Link>
        </div>
      </nav>

      {/* 2. MAIN PORTAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full my-8">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 mb-4 uppercase tracking-widest">
          Guest Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight text-slate-900">
          Cek Status Laundry Anda <br />
          Secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real-Time</span>.
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mb-8 leading-relaxed">
          Masukkan nomor nota / ID transaksi yang diberikan oleh kasir/admin
          untuk melacak progress pakaian Anda.
        </p>

        {/* FORM PENCARIAN */}
        <form
          onSubmit={handleTracking}
          className="w-full max-w-md bg-white p-2 rounded-2xl flex items-center border border-slate-200 shadow-md mb-8 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 transition"
        >
          <input
            type="text"
            placeholder="Masukkan ID Transaksi dari Admin..."
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            className="bg-transparent flex-1 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition flex items-center justify-center font-extrabold text-sm cursor-pointer disabled:opacity-50"
          >
            <BiSearchAlt className="text-lg me-1" />{" "}
            {loading ? "Mencari..." : "Track"}
          </button>
        </form>

        {/* VISUALISASI DATA DARI PANEL ADMIN */}
        {result && (
          <div className="w-full max-w-xl p-6 rounded-2xl bg-white border border-slate-100 text-left shadow-xl mb-12 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs text-slate-400 uppercase font-black tracking-wider">
                  ID Transaksi / Nota
                </h3>
                <p className="font-mono text-xs font-bold text-blue-600 break-all">
                  {result.id}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xs text-slate-400 uppercase font-black tracking-wider">
                  Nama Pelanggan
                </h3>
                <p className="text-sm font-black text-slate-900">
                  {result.customer}
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex items-center justify-between mb-6 py-2 overflow-x-auto">
              {result.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex-1 text-center relative min-w-[65px]"
                >
                  {index !== result.steps.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-1 z-0
                        ${index < result.currentStep ? "bg-blue-600" : "bg-slate-200"}`}
                    />
                  )}

                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black z-10 relative shadow-sm transition-all duration-300
                      ${index <= result.currentStep ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"}`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-[10px] mt-2 font-bold tracking-wide ${index <= result.currentStep ? "text-blue-600" : "text-slate-400"}`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Status Update Kasir:
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-lg border border-blue-200 uppercase tracking-wider">
                {result.status}
              </span>
            </div>
          </div>
        )}

        {/* JIKA DATA TIDAK PAS */}
        {hasSearched && !result && !loading && (
          <div className="w-full max-w-md p-4 mb-8 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-xs font-bold text-left flex items-start gap-2">
            <span>⚠️</span>
            <span>ID Transaksi tidak ditemukan. Pastikan data sudah disimpan oleh Admin di panel dashboard.</span>
          </div>
        )}

        {/* 3. DAFTAR HARGA */}
        <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-lg p-6 text-left mt-4">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <MdOutlineLocalLaundryService className="text-blue-600 text-xl" />
            <h2 className="text-lg font-black text-slate-900 tracking-wide">
              Daftar Layanan & Harga / Kg
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {servicesPriceList.map((service, index) => (
              <div
                key={index}
                className="
                  relative
                  bg-slate-50
                  border border-slate-200
                  rounded-[24px]
                  p-6
                  text-center
                  overflow-hidden
                  hover:-translate-y-2
                  hover:border-blue-600
                  transition-all
                  duration-300
                  group
                "
              >
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all"></div>

                {/* Gambar */}
                <div className="relative flex justify-center mb-6">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="
                      w-20
                      h-20
                      object-contain
                      group-hover:scale-110
                      transition-transform
                      duration-300
                    "
                  />
                </div>

                {/* Nama */}
                <h3 className="text-lg font-black text-slate-900 mb-3">
                  {service.name}
                </h3>

                <div className="w-14 h-1 bg-blue-600 mx-auto rounded-full mb-5"></div>

                <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-2 font-bold">
                  Harga / Kg
                </p>

                {/* Harga */}
                <div className="bg-white rounded-xl py-3 border border-slate-200 shadow-sm">
                  <p className="text-lg font-black text-blue-600">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center p-6 border-t border-slate-100 text-xs text-slate-400 bg-white mt-12">
        &copy; {new Date().getFullYear()} LaundryGo. All rights reserved.
      </footer>
    </div>
  );
}
