import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";
import { BiSearchAlt } from "react-icons/bi";
import {
  MdCheckCircle,
  MdInventory2,
  MdIron,
  MdLocalLaundryService,
  MdLocationOn,
  MdOutlineReceiptLong,
  MdSchedule,
} from "react-icons/md";

const stepsList = [
  { label: "Diterima", icon: MdOutlineReceiptLong },
  { label: "Dicuci", icon: MdLocalLaundryService },
  { label: "Disetrika", icon: MdIron },
  { label: "Selesai", icon: MdCheckCircle },
];

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("terima") || lowerStatus.includes("pending")) return 0;
    if (lowerStatus.includes("cuci") || lowerStatus.includes("proses")) return 1;
    if (lowerStatus.includes("setrika") || lowerStatus.includes("siap")) return 2;
    if (lowerStatus.includes("selesai") || lowerStatus.includes("ambil")) return 3;
    return 0;
  };

  const searchOrder = useCallback(async (id) => {
    if (!id.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id.trim())
        .single();

      if (error) {
        console.error("Gagal memuat data dari Supabase:", error.message);
        setResult(null);
      } else if (data) {
        setResult({
          id: data.id,
          customer: data.customer || "Pelanggan Umum",
          phone: data.phone || "-",
          status: data.status || "Order Diterima",
          service: data.service || "-",
          weight: data.weight || 0,
          total: data.total || 0,
          date: data.date || "-",
          currentStep: getCurrentStepIndex(data.status),
        });
      }
    } catch (err) {
      console.error("Terjadi kesalahan sistem:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const trxId = searchParams.get("trx");
    if (!trxId) return;

    setTrackingId(trxId);
    searchOrder(trxId);
  }, [searchParams, searchOrder]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    await searchOrder(trackingId);
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(Number(angka) || 0);

  const displayStep = result?.currentStep ?? 0;

  return (
    <div>
      <PageHeader
        title="Tracking Status"
        breadcrumb={["Laundry", "Tracking Status"]}
        actionLabel=""
        description="Pantau posisi cucian pelanggan dari nota transaksi dan berikan informasi status yang lebih jelas."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-7">
          <div className="mb-6 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-700 p-6 text-white">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-50">
                  <MdLocationOn size={16} />
                  Live order lookup
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-tight">
                  Cari status cucian dengan cepat
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-blue-100">
                  Masukkan ID transaksi dari nota kasir untuk melihat progres cucian, detail pelanggan, dan total tagihan.
                </p>
              </div>

              <form onSubmit={handleSearch} className="rounded-3xl bg-white p-3 shadow-xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: TRX-xxxx"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50"
                  >
                    <BiSearchAlt size={18} />
                    {loading ? "Cari" : "Track"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {loading && (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-b-blue-600" />
              <p className="text-sm font-black text-slate-700">Mencari data transaksi...</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Sistem sedang membaca data dari Supabase.
              </p>
            </div>
          )}

          {!loading && !result && !hasSearched && (
            <div className="grid min-h-[320px] place-items-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
                  <MdInventory2 size={34} />
                </div>
                <h3 className="text-xl font-black text-slate-950">Belum ada nota dipilih</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-relaxed text-slate-500">
                  Gunakan ID transaksi untuk menampilkan progress cucian pelanggan di area ini.
                </p>
              </div>
            </div>
          )}

          {!loading && hasSearched && !result && (
            <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 text-center">
              <h3 className="text-lg font-black text-orange-800">
                ID Transaksi tidak ditemukan
              </h3>
              <p className="mt-2 text-sm font-semibold text-orange-700">
                Pastikan ID nota sudah benar, termasuk huruf besar, angka, dan tanda hubung.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                  ["ID Transaksi", result.id],
                  ["Customer", result.customer],
                  ["Layanan", result.service],
                  ["Total", `Rp ${formatRupiah(result.total)}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 break-words text-sm font-black text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">
                      Progress Pengerjaan
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Status terkini: {result.status}
                    </p>
                  </div>
                  <span className="w-fit rounded-2xl bg-blue-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-700 ring-1 ring-blue-100">
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {stepsList.map((step, index) => {
                    const Icon = step.icon;
                    const active = index <= displayStep;

                    return (
                      <div key={step.label} className="relative">
                        {index !== stepsList.length - 1 && (
                          <div
                            className={`absolute left-12 top-8 hidden h-1 w-full md:block ${
                              index < displayStep ? "bg-blue-600" : "bg-slate-200"
                            }`}
                          />
                        )}
                        <div
                          className={`relative z-10 rounded-3xl border p-4 ${
                            active
                              ? "border-blue-100 bg-blue-50 text-blue-700"
                              : "border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                              active ? "bg-blue-600 text-white" : "bg-white text-slate-400"
                            }`}
                          >
                            <Icon size={24} />
                          </div>
                          <p className="text-sm font-black">{step.label}</p>
                          <p className="mt-1 text-xs font-semibold opacity-70">
                            {active ? "Sudah tercatat" : "Menunggu proses"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/70">
            <h3 className="text-lg font-black text-slate-950">Detail Operasional</h3>
            <div className="mt-5 space-y-4">
              {[
                ["Estimasi Normal", "1-2 hari kerja", <MdSchedule size={22} />],
                ["Update Status", "Real-time dari database", <MdLocationOn size={22} />],
                ["Kanal Info", "Nota kasir dan dashboard", <MdOutlineReceiptLong size={22} />],
              ].map(([label, value, icon]) => (
                <div key={label} className="flex gap-3 rounded-3xl bg-slate-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-300/60">
            <h3 className="text-lg font-black">Alur Standar LaundryGo</h3>
            <div className="mt-5 space-y-4">
              {stepsList.map((step, index) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-sm font-black">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black">{step.label}</p>
                    <p className="text-xs font-semibold text-slate-400">
                      {index === 0 && "Pesanan diterima operator"}
                      {index === 1 && "Cucian masuk proses cuci"}
                      {index === 2 && "Cucian dirapikan dan dicek"}
                      {index === 3 && "Siap diserahkan ke pelanggan"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
