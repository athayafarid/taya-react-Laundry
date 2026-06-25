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
    <div className="min-h-screen bg-[#0B132B] text-white flex flex-col">
      {/* 1. NAVBAR */}
      <nav className="border-b border-gray-800 bg-[#1C2541]/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 h-8 w-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
            <span className="text-lg">O</span>
          </div>
          <h1 className="text-xl font-black tracking-wider">
            BILAS<span className="text-blue-400">.</span>
          </h1>
        </div>
       <div className="flex items-center gap-4">

  <Link
    to="/login"
    className="text-gray-300 hover:text-white font-semibold"
  >
    Login (Admin)
  </Link>

  <Link
    to="/member/login"
    className="text-gray-300 hover:text-[#00E676] font-semibold"
  >
    Login Member
  </Link>

  <Link
    to="/member/register"
    className="bg-[#00E676] hover:bg-[#00C853] text-white px-6 py-3 rounded-2xl font-bold transition"
  >
    Daftar Akun
  </Link>

</div>
      </nav>

      {/* 2. MAIN PORTAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto w-full my-8">
        <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 mb-4 uppercase tracking-widest">
          Guest Portal
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          Cek Status Laundry Anda <br />
          Secara <span className="text-[#00E676]">Real-Time</span>.
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mb-8">
          Masukkan nomor nota / ID transaksi yang diberikan oleh kasir/admin
          untuk melacak progress pakaian Anda.
        </p>

        {/* FORM PENCARIAN */}
        <form
          onSubmit={handleTracking}
          className="w-full max-w-md bg-[#1C2541] p-2 rounded-2xl flex items-center border border-gray-800 shadow-xl mb-8"
        >
          <input
            type="text"
            placeholder="Masukkan ID Transaksi dari Admin..."
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            className="bg-transparent flex-1 px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition flex items-center justify-center font-bold text-sm cursor-pointer disabled:opacity-50"
          >
            <BiSearchAlt className="text-lg me-1" />{" "}
            {loading ? "Mencari..." : "Track"}
          </button>
        </form>

        {/* VISUALISASI DATA DARI PANEL ADMIN */}
        {result && (
          <div className="w-full max-w-xl p-6 rounded-2xl bg-[#1C2541] border border-gray-800 text-left shadow-2xl mb-12 animate-fadeIn">
            <div className="flex justify-between items-start border-b border-gray-800 pb-3 mb-4">
              <div>
                <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  ID Transaksi / Nota
                </h3>
                <p className="font-mono text-xs font-bold text-blue-400 break-all">
                  {result.id}
                </p>
              </div>
              <div className="text-right">
                <h3 className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                  Nama Pelanggan
                </h3>
                <p className="text-sm font-bold text-gray-200">
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
                                        ${index < result.currentStep ? "bg-[#00E676]" : "bg-gray-700"}`}
                    />
                  )}

                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black z-10 relative shadow-md transition-all duration-300
                                        ${index <= result.currentStep ? "bg-[#00E676] text-[#0B132B]" : "bg-gray-700 text-gray-400"}`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-[10px] mt-2 font-bold tracking-wide ${index <= result.currentStep ? "text-[#00E676]" : "text-gray-500"}`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-[#131A30] p-3 rounded-xl border border-gray-800 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Status Update Kasir:
              </span>
              <span className="bg-green-500/10 text-[#00E676] text-xs font-black px-3 py-1 rounded-lg border border-green-500/20 uppercase tracking-wider">
                {result.status}
              </span>
            </div>
          </div>
        )}

        {/* JIKA DATA TIDAK PAS */}
        {hasSearched && !result && !loading && (
          <div className="w-full max-w-md p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
            ⚠️ ID Transaksi tidak ditemukan. Pastikan data sudah disimpan oleh
            Admin di panel dashboard.
          </div>
        )}

        {/* 3. DAFTAR HARGA */}
        <div className="w-full max-w-2xl bg-[#1C2541]/50 border border-gray-800 rounded-2xl shadow-2xl p-6 text-left mt-4">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
            <MdOutlineLocalLaundryService className="text-[#00E676] text-xl" />
            <h2 className="text-lg font-bold text-gray-200 tracking-wide">
              Daftar Layanan & Harga / Kg
            </h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-800/80 bg-[#131A30]/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
  {servicesPriceList.map((service, index) => (
    <div
      key={index}
      className="
        relative
        bg-[#131A30]
        border border-gray-800
        rounded-[30px]
        p-6
        text-center
        overflow-hidden
        hover:-translate-y-3
        hover:border-[#00E676]
        transition-all
        duration-300
        group
      "
    >
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-[#00E676]/10 blur-3xl rounded-full group-hover:bg-[#00E676]/20 transition-all"></div>

      {/* Gambar */}
      <div className="relative flex justify-center mb-6">
        <img
          src={service.image}
          alt={service.name}
          className="
            w-28
            h-28
            object-contain
            group-hover:scale-110
            transition-transform
            duration-300
          "
        />
      </div>

      {/* Nama */}
      <h3 className="text-xl font-bold text-white mb-3">
        {service.name}
      </h3>

      <div className="w-14 h-1 bg-[#00E676] mx-auto rounded-full mb-5"></div>

      <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
        Harga / Kg
      </p>

      {/* Harga */}
      <div className="bg-[#1C2541] rounded-2xl py-4 border border-gray-800">
        <p className="text-2xl font-black text-[#00E676]">
          {service.price}
        </p>
      </div>
    </div>
  ))}
</div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center p-4 border-t border-gray-800 text-xs text-gray-500 bg-[#131A30]/30">
        &copy; {new Date().getFullYear()} BILAS Laundry. All rights reserved.
      </footer>
    </div>
  );
}
