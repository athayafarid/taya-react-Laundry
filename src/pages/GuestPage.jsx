import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import { 
  MdOutlineLocalLaundryService,
  MdOutlineLightMode,
  MdOutlineDarkMode
} from "react-icons/md";
import { 
  Calculator, 
  Sparkles, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  HelpCircle, 
  Info, 
  Lightbulb, 
  TrendingUp,
  Clock,
  ShieldCheck,
  UserPlus,
  Users,
  Shield
} from "lucide-react";
import { supabase } from "../lib/supabase";

const servicesPriceList = [
  {
    name: "Cuci Kering Setrika",
    price: "Rp 7.000",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=400&q=80",
    description: "Cuci bersih, dikeringkan wangi, lalu disetrika rapi."
  },
  {
    name: "Cuci Kering",
    price: "Rp 5.000",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80",
    description: "Cuci bersih dan dikeringkan tanpa setrika (lipat)."
  },
  {
    name: "Setrika Saja",
    price: "Rp 4.000",
    image: "https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=400&q=80",
    description: "Pakaian kusut disetrika dengan pelembut premium."
  },
  {
    name: "Cuci Bed Cover",
    price: "Rp 15.000",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80",
    description: "Cuci bersih selimut & bed cover tebal harum segar."
  },
  {
    name: "Cuci Sepatu",
    price: "Rp 30.000",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    description: "Perawatan deep cleaning sepatu noda & kotoran."
  }
];

const laundryTips = [
  {
    title: "Menjaga Kaos Putih Tetap Cerah",
    desc: "Selalu pisahkan pakaian putih saat mencuci. Campurkan sedikit baking soda ke dalam deterjen untuk memutihkan serat kain secara alami.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Mengatasi Noda Kopi Membandel",
    desc: "Bilas noda segar dari belakang kain menggunakan air dingin. Totol dengan sedikit cuka putih dan sabun cuci piring sebelum dicuci biasa.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80"
  },
  {
    title: "Perawatan Pakaian Wol & Rajut",
    desc: "Jangan menggantung rajutan basah agar seratnya tidak melar. Cuci dengan putaran lambat dan keringkan mendatar di atas handuk.",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80"
  }
];

export default function GuestPage() {
  const [searchInvoice, setSearchInvoice] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // State Tema Gelap/Terang
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || document.documentElement.classList.contains("dark");
  });

  // State Kalkulator Estimasi
  const [calcService, setCalcService] = useState("cuci_setrika");
  const [calcWeight, setCalcWeight] = useState(3);
  const [calcExpress, setCalcExpress] = useState(false);

  // State Dropdown Login
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const closeDropdown = () => setIsLoginDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  const servicesMap = {
    cuci_setrika: { name: "Cuci Kering Setrika", price: 7000, duration: "24 Jam" },
    cuci_kering: { name: "Cuci Kering", price: 5000, duration: "24 Jam" },
    setrika: { name: "Setrika Saja", price: 4000, duration: "24 Jam" },
    bedcover: { name: "Cuci Bed Cover", price: 15000, duration: "48 Jam" },
    sepatu: { name: "Cuci Sepatu", price: 30000, duration: "72 Jam" },
  };

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const getEstimatedPrice = () => {
    const selected = servicesMap[calcService];
    if (!selected) return 0;
    let total = selected.price * calcWeight;
    if (calcExpress) {
      total += 15000; // flat express delivery cost
    }
    return total;
  };

  const getEstimatedDuration = () => {
    const selected = servicesMap[calcService];
    if (!selected) return "";
    if (calcExpress) {
      return "Express 3 - 6 Jam";
    }
    return selected.duration;
  };

  // Alur proses laundry standar
  const stepsList = ["Diterima", "Dicuci", "Disetrika", "Selesai"];

  const getCurrentStepIndex = (status) => {
    if (!status) return 0;
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("terima") || lowerStatus.includes("pending") || lowerStatus.includes("baru"))
      return 0;
    if (lowerStatus.includes("cuci") || lowerStatus.includes("proses") || lowerStatus.includes("progress"))
      return 1;
    if (lowerStatus.includes("setrika") || lowerStatus.includes("gosok") || lowerStatus.includes("siap"))
      return 2;
    if (lowerStatus.includes("selesai") || lowerStatus.includes("ambil") || lowerStatus.includes("done"))
      return 3;
    return 0;
  };

  const handleTracking = async (e) => {
    e.preventDefault();
    if (!searchInvoice.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", searchInvoice.trim())
        .single();

      if (error) {
        console.error("Gagal melacak nota:", error.message);
        setResult(null);
      } else if (data) {
        setResult({
          id: data.id,
          customer: data.customer_name || data.customer || "Pelanggan LaundryGo",
          status: data.status || "Diterima",
          currentStep: getCurrentStepIndex(data.status),
          steps: stepsList,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-800"}`}>
      
      {/* 1. NAVBAR */}
      <nav className={`border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${isDarkMode ? "bg-slate-950/80 border-slate-900" : "bg-white/80 border-slate-100"}`}>
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            <span className="text-xl">L</span>
          </div>
          <h1 className={`text-xl font-black tracking-tight transition duration-200 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Laundry<span className="text-blue-600">Go</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center
              ${isDarkMode 
                ? "border-slate-800 bg-slate-900 text-yellow-400 hover:bg-slate-850 hover:text-yellow-300" 
                : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600"}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <MdOutlineLightMode size={16} /> : <MdOutlineDarkMode size={16} />}
          </button>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoginDropdownOpen(!isLoginDropdownOpen);
              }}
              onMouseEnter={() => setIsLoginDropdownOpen(true)}
              className={`font-bold transition text-xs sm:text-sm flex items-center gap-1 cursor-pointer ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}
            >
              Login <ChevronDown size={14} />
            </button>

            {isLoginDropdownOpen && (
              <div
                onMouseLeave={() => setIsLoginDropdownOpen(false)}
                className={`absolute right-0 mt-2 w-48 rounded-xl border p-1.5 shadow-xl transition-all duration-200 animate-fadeIn text-left z-50
                  ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-150 text-slate-800"}`}
              >
                <Link
                  to="/member/login"
                  onClick={() => setIsLoginDropdownOpen(false)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition text-xs font-bold ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                >
                  <Users size={14} className="text-indigo-500" />
                  <span>Login Member</span>
                </Link>
                
                <Link
                  to="/login"
                  onClick={() => setIsLoginDropdownOpen(false)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg transition text-xs font-bold ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                >
                  <Shield size={14} className="text-blue-600" />
                  <span>Login Admin</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/member/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition text-xs sm:text-sm shadow-md shadow-blue-500/10"
          >
            Daftar Akun
          </Link>
        </div>
      </nav>

      {/* GLOW DECORATIONS */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-2/3 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* HERO & SEARCH BAR */}
        <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/30 uppercase tracking-widest">
            <Sparkles size={12} /> Guest Tracking Portal
          </span>
          <h1 className={`text-4xl sm:text-5xl font-black leading-[1.15] tracking-tight transition duration-200 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Pantau Cucian Anda <br />
            Secara <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Real-Time</span>.
          </h1>
          <p className={`text-sm sm:text-base max-w-lg mx-auto leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
            Kasir kami memberikan ID transaksi di nota Anda. Masukkan ID tersebut di bawah ini untuk melihat proses pengerjaan secara langsung.
          </p>

          {/* FORM PENCARIAN */}
          <form
            onSubmit={handleTracking}
            className={`w-full max-w-md mx-auto p-2 rounded-2xl flex items-center border shadow-md focus-within:ring-2 focus-within:ring-blue-600 transition duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <input
              type="text"
              placeholder="Masukkan ID Transaksi (Contoh: TRX-12345)..."
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              className="bg-transparent flex-1 px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none text-inherit"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition flex items-center justify-center font-extrabold text-sm cursor-pointer disabled:opacity-50"
            >
              <BiSearchAlt className="text-lg me-1" />
              {loading ? "Mencari..." : "Track"}
            </button>
          </form>

          {/* JIKA DATA TIDAK PAS */}
          {hasSearched && !result && !loading && (
            <div className="w-full max-w-md mx-auto p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl text-orange-700 dark:text-orange-400 text-xs font-bold text-left flex items-start gap-2.5 shadow-sm animate-fadeIn">
              <span className="text-sm">⚠️</span>
              <span>ID Transaksi tidak ditemukan. Pastikan data sudah tersimpan di sistem kasir/admin.</span>
            </div>
          )}

          {/* VISUALISASI DATA DARI PANEL ADMIN */}
          {result && (
            <div className={`w-full max-w-xl mx-auto p-6 rounded-3xl border text-left shadow-2xl animate-fadeIn transition duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className={`flex justify-between items-start border-b pb-3 mb-5 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                <div>
                  <h3 className={`text-[10px] uppercase font-black tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    ID Transaksi / Nota
                  </h3>
                  <p className="font-mono text-sm font-bold text-blue-500 break-all mt-0.5">
                    {result.id}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className={`text-[10px] uppercase font-black tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Nama Pelanggan
                  </h3>
                  <p className={`text-sm font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {result.customer}
                  </p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="flex items-center justify-between mb-6 py-3 overflow-x-auto">
                {result.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex-1 text-center relative min-w-[75px]"
                  >
                    {index !== result.steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-1/2 w-full h-1 z-0 transition-colors duration-300
                          ${index < result.currentStep ? "bg-blue-600" : (isDarkMode ? "bg-slate-800" : "bg-slate-200")}`}
                      />
                    )}

                    <div
                      className={`w-8.5 h-8.5 mx-auto rounded-full flex items-center justify-center text-xs font-black z-10 relative shadow-md transition-all duration-300
                        ${index <= result.currentStep 
                          ? "bg-blue-600 text-white shadow-blue-500/20 scale-105" 
                          : (isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400")}`}
                    >
                      {index + 1}
                    </div>
                    <p
                      className={`text-[10px] mt-2.5 font-bold tracking-wide transition ${index <= result.currentStep ? "text-blue-500" : (isDarkMode ? "text-slate-500" : "text-slate-400")}`}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className={`p-3.5 rounded-2xl flex justify-between items-center transition ${isDarkMode ? "bg-slate-800/40 border border-slate-800" : "bg-blue-50/50 border border-blue-100/50"}`}>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Status Update Kasir:
                </span>
                <span className={`text-[11px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider ${isDarkMode ? "bg-blue-950/60 border-blue-900/50 text-blue-400" : "bg-blue-100 border-blue-200 text-blue-800"}`}>
                  {result.status}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 3. INTERACTIVE ESTIMATOR CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <div className={`rounded-3xl border overflow-hidden shadow-xl transition-colors duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className={`p-6 border-b flex items-center gap-3 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Calculator size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Kalkulator Estimasi Biaya</h2>
                <p className={`text-xs transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Hitung perkiraan biaya dan durasi pengerjaan pakaian Anda.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8">
              {/* Inputs */}
              <div className="md:col-span-7 space-y-6 text-left">
                {/* Select Service */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-400">Pilih Layanan</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(servicesMap).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCalcService(key)}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-200 cursor-pointer
                          ${calcService === key 
                            ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" 
                            : (isDarkMode ? "border-slate-800 hover:border-slate-700 bg-slate-850" : "border-slate-200 hover:border-slate-300 bg-white")}`}
                      >
                        {value.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {calcService === "sepatu" ? "Jumlah Sepatu" : "Berat Pakaian"}
                    </label>
                    <span className="text-sm font-black text-blue-600">
                      {calcWeight} {calcService === "sepatu" ? "Pasang" : "Kg"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>1 {calcService === "sepatu" ? "Pasang" : "Kg"}</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15 {calcService === "sepatu" ? "Pasang" : "Kg"}</span>
                  </div>
                </div>

                {/* Express Option */}
                <div className={`p-4 rounded-2xl border transition ${isDarkMode ? "bg-slate-850/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                        <Clock size={16} />
                      </div>
                      <div className="text-left">
                        <span className={`text-sm font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Layanan Kilat (Express)</span>
                        <p className={`text-[11px] transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Pakaian selesai dalam 3-6 jam. Tambahan biaya Rp 15.000.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={calcExpress}
                      onChange={(e) => setCalcExpress(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Display Result */}
              <div className="md:col-span-5 flex flex-col">
                <div className={`flex-1 rounded-2xl p-6 text-center flex flex-col justify-center items-center border transition-colors duration-300 ${isDarkMode ? "bg-slate-850/40 border-slate-800" : "bg-blue-50/30 border-blue-100/30"}`}>
                  <span className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Estimasi Total Biaya</span>
                  <div className="my-4">
                    <p className="text-4xl font-black text-blue-600">
                      Rp {getEstimatedPrice().toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  <div className={`w-full border-t my-4 ${isDarkMode ? "border-slate-800" : "border-blue-100/50"}`}></div>

                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} font-medium`}>Estimasi Durasi</span>
                      <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>{getEstimatedDuration()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`${isDarkMode ? "text-slate-400" : "text-slate-500"} font-medium`}>Harga Satuan</span>
                      <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                        Rp {servicesMap[calcService]?.price.toLocaleString("id-ID")} / {calcService === "sepatu" ? "Pasang" : "Kg"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PROMO MEMBER CALL-TO-ACTION BANNER */}
        <section className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 overflow-hidden shadow-lg">
            {/* Background designs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
              <div className="md:col-span-8 space-y-4">
                <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Tag size={10} /> Diskon Spesial Member
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Ingin Laundry Lebih Hemat? <br />
                  Gabung Sebagai Member LaundryGo!
                </h2>
                <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
                  Dapatkan diskon tetap 10% di setiap pencucian, kumpulkan poin loyalitas untuk hadiah menarik, dan pantau histori cucian secara lengkap.
                </p>
              </div>
              <div className="md:col-span-4 flex justify-start md:justify-end">
                <Link
                  to="/member/register"
                  className="bg-white hover:bg-slate-50 text-blue-700 font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
                >
                  <UserPlus size={16} /> Daftar Member Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. PRICING CARDS WITH REAL IMAGES */}
        <section className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Daftar Layanan Terfavorit
            </h2>
            <p className={`text-xs sm:text-sm transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Harga terjangkau dengan hasil cuci bersih, higienis, wangi dan rapi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {servicesPriceList.map((service, index) => (
              <div
                key={index}
                className={`relative border rounded-[28px] p-5 text-center overflow-hidden hover:-translate-y-2 transition-all duration-300 group ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150"}`}
              >
                {/* Glow effect on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-28 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all"></div>

                {/* Service image from Unsplash */}
                <div className="relative h-28 w-full rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100/10">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent"></div>
                </div>

                {/* Name */}
                <h3 className={`text-sm font-black mb-2 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  {service.name}
                </h3>
                <p className={`text-[10px] leading-relaxed mb-4 min-h-[44px] transition ${isDarkMode ? "text-slate-500" : "text-slate-450"}`}>
                  {service.description}
                </p>

                <div className="w-10 h-0.5 bg-blue-600 mx-auto rounded-full mb-4"></div>

                <p className="text-slate-500 text-[9px] uppercase tracking-wider mb-1.5 font-bold">
                  Harga / Kg
                </p>

                {/* Harga Badge */}
                <div className={`rounded-xl py-2 border shadow-sm transition ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <p className="text-sm font-black text-blue-500">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. LAUNDRY EXPRESS & KASIR STANDARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Feature 1 */}
          <div className={`p-6 rounded-3xl border text-left flex items-start gap-4 transition duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Clock size={20} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Layanan 3 Jam Selesai</h4>
              <p className={`text-xs leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Solusi mendadak untuk baju kotor. Pilih layanan Express untuk pencucian kilat super higienis dalam 3 jam.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={`p-6 rounded-3xl border text-left flex items-start gap-4 transition duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Garansi Kebersihan</h4>
              <p className={`text-xs leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Jika cucian kurang bersih atau setrika kurang rapi, beri tahu admin kami dan kami cuci ulang gratis!
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className={`p-6 rounded-3xl border text-left flex items-start gap-4 transition duration-300 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <TrendingUp size={20} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Poin & Loyalty System</h4>
              <p className={`text-xs leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Tingkatkan terus frekuensi pencucian Anda, kumpulkan poin member, dan nikmati bonus potongan harga menarik.
              </p>
            </div>
          </div>
        </section>

        {/* 7. LAUNDRY TIPS & TRICKS SECTION */}
        <section className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Tips & Trik Perawatan Pakaian
            </h2>
            <p className={`text-xs sm:text-sm transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Edukasi seputar cara merawat serat kain dan merontokkan noda membandel di rumah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {laundryTips.map((tip, index) => (
              <div
                key={index}
                className={`border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150"}`}
              >
                {/* Image */}
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                    Tips LaundryGo
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className={`text-base font-black leading-snug group-hover:text-blue-600 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      {tip.title}
                    </h3>
                    <p className={`text-xs leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {tip.desc}
                    </p>
                  </div>
                  
                  <a
                    href="#faq"
                    className="text-blue-500 hover:text-blue-600 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Pelajari Selengkapnya <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 8. FOOTER */}
      <footer className={`text-center p-6 border-t text-xs transition duration-300 ${isDarkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-white border-slate-100 text-slate-400"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} LaundryGo. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#faq" className="hover:text-blue-500">FAQ</a>
            <a href="#kontak" className="hover:text-blue-500">Hubungi Kami</a>
            <Link to="/" className="hover:text-blue-500">Beranda</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
