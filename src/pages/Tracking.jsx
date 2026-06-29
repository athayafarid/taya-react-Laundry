import { useState } from "react";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";
import { BiSearchAlt } from "react-icons/bi";

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Daftar alur proses laundry standar LaundryGo
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
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", trackingId.trim())
        .single();

      if (error) {
        console.error("Gagal memuat data dari Supabase:", error.message);
        setResult(null);
      } else if (data) {
        setResult({
          id: data.id,
          customer: data.customer || "Pelanggan Umum",
          status: data.status || "Order Diterima",
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
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800 font-sans antialiased">
      <PageHeader
        title="Pelacakan Status"
        breadcrumb={["Laundry", "Tracking"]}
      />

      {/* INPUT SEARCH FORM */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
        <input
          type="text"
          placeholder="Masukkan ID Transaksi (Contoh: TRX-xxxx)..."
          className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm shadow-sm"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50 transition active:scale-95 flex items-center gap-1"
        >
          <BiSearchAlt size={16} /> {loading ? "Mencari..." : "Track"}
        </button>
      </form>

      {/* SEARCH RESULTS */}
      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-xs text-slate-400 font-semibold">Sedang mencari data transaksi di Supabase...</p>
        </div>
      )}

      {!loading && result && (
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-lg mx-auto animate-fadeIn">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
            <div>
              <h3 className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                ID Transaksi
              </h3>
              <p className="font-mono text-xs font-bold text-blue-600 break-all">
                {result.id}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
                Customer
              </h3>
              <p className="text-xs font-black text-slate-900">
                {result.customer}
              </p>
            </div>
          </div>

          {/* PROGRESS BAR STEPS */}
          <div className="flex items-center justify-between mb-8 overflow-x-auto py-2">
            {result.steps.map((step, index) => (
              <div key={index} className="flex-1 text-center relative min-w-[65px]">
                {/* GARIS PENGHUBUNG */}
                {index !== result.steps.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-1 z-0
                      ${index < result.currentStep ? "bg-blue-600" : "bg-slate-200"}`}
                  />
                )}

                {/* BULATAN ANGKA */}
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black z-10 relative shadow-sm transition-all duration-300
                    ${index <= result.currentStep
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                >
                  {index + 1}
                </div>

                <p
                  className={`text-[9px] mt-2 font-black uppercase tracking-wider ${
                    index <= result.currentStep ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100/50 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 uppercase">Status Terkini:</span>
            <span className="bg-blue-100 text-blue-800 font-black px-3 py-1 rounded-lg border border-blue-200 uppercase tracking-wider text-[10px]">
              {result.status}
            </span>
          </div>
        </div>
      )}

      {!loading && hasSearched && !result && (
        <div className="max-w-lg mx-auto p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-700 text-xs font-bold text-center">
          ⚠️ ID Transaksi tidak ditemukan. Pastikan ID yang dimasukkan sesuai dengan ID Nota transaksi kasir.
        </div>
      )}
    </div>
  );
}