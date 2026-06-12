import { useState } from "react";
import { supabase } from "../lib/supabase"; // Pastikan path import ini sesuai dengan lokasi file supabase.js kamu
import PageHeader from "../components/PageHeader";

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Daftar alur proses laundry standar BILAS
  const stepsList = ["Diterima", "Dicuci", "Disetrika", "Selesai"];

  // Fungsi untuk menentukan posisi lingkaran progress berdasarkan teks status dari database
  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("terima") || lowerStatus.includes("pending")) return 0;
    if (lowerStatus.includes("cuci") || lowerStatus.includes("proses")) return 1;
    if (lowerStatus.includes("setrika") || lowerStatus.includes("siap")) return 2;
    if (lowerStatus.includes("selesai") || lowerStatus.includes("ambil")) return 3;
    return 0;
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      console.log(`Mencari ID Order: ${trackingId} di Supabase...`);

      // Mengambil data dari tabel 'orders' atau 'transactions' di Supabase
      // Jika nama tabelmu berbeda (misal 'transaksi'), silakan ganti text '.from("orders")' di bawah
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", trackingId.trim())
        .single(); // mengambil satu data saja yang cocok

      if (error) {
        console.error("Gagal memuat data dari Supabase:", error.message);
        setResult(null);
      } else if (data) {
        console.log("Data order ditemukan:", data);
        
        // Memformat data agar sesuai dengan struktur tampilan progress UI kamu
        setResult({
          id: data.id,
          customer: data.customer_name || data.customer || "Pelanggan Umum",
          status: data.status || "Diterima",
          currentStep: getCurrentStepIndex(data.status),
          steps: stepsList
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan sistem:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#e0e5ec] min-h-screen">
      <PageHeader
        title="Tracking Status"
        breadcrumb={["Laundry", "Tracking"]}
      />

      {/* INPUT SEARCH FORM */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Masukkan ID Order (contoh: masukkan ID UUID dari database)"
          className="p-3 rounded-xl w-full bg-[#e0e5ec] 
          shadow-[inset_6px_6px_10px_#b8bec6,inset_-6px_-6px_10px_#ffffff]
          outline-none text-gray-700 font-medium"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 rounded-xl bg-[#e0e5ec] font-bold text-gray-700
          shadow-[6px_6px_10px_#b8bec6,-6px_-6px_10px_#ffffff]
          active:scale-95 disabled:opacity-50 cursor-pointer transition duration-150"
        >
          {loading ? "Memuat..." : "Cek"}
        </button>
      </form>

      {/* HASIL PENCARIAN */}
      {loading && (
        <p className="text-gray-600 text-sm animate-pulse">Sedang mencari data nota di database Supabase...</p>
      )}

      {!loading && result && (
        <div className="p-6 rounded-2xl bg-[#e0e5ec] 
        shadow-[8px_8px_15px_#b8bec6,-8px_-8px_15px_#ffffff]">

          <h2 className="text-lg font-bold mb-2 text-gray-800">
            Order ID: <span className="text-blue-600 text-sm font-mono">{result.id}</span>
          </h2>
          <p className="mb-6 text-gray-600 font-medium">
            Pelanggan: <span className="text-gray-800">{result.customer}</span>
          </p>

          {/* PROGRESS BAR STEPS */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto py-2">
            {result.steps.map((step, index) => (
              <div key={index} className="flex-1 text-center relative min-w-[70px]">

                {/* GARIS PENGHUBUNG */}
                {index !== result.steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 w-full h-1 z-0
                  ${index < result.currentStep ? "bg-green-400" : "bg-gray-300"}`} />
                )}

                {/* BULATAN ANGKA */}
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white z-10 relative font-bold shadow-sm
                  ${index <= result.currentStep
                      ? "bg-green-500 shadow-green-500/20"
                      : "bg-gray-300"
                    }`}
                >
                  {index + 1}
                </div>

                <p className={`text-xs mt-2 font-bold ${index <= result.currentStep ? "text-green-600" : "text-gray-400"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white/50 rounded-xl inline-block border border-gray-200">
            <p className="font-bold text-gray-700 text-sm">
              Status Saat Ini: <span className="text-green-600 uppercase tracking-wider">{result.status}</span>
            </p>
          </div>
        </div>
      )}

      {!loading && hasSearched && !result && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-xl text-red-600 text-sm font-semibold">
          ⚠️ Order dengan ID tersebut tidak ditemukan di database. Pastikan ID yang dimasukkan sudah benar.
        </div>
      )}
    </div>
  );
}