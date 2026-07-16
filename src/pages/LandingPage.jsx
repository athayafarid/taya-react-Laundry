import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Smartphone, 
  Bell, 
  Clock, 
  History, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Play, 
  X, 
  AlertTriangle,
  ArrowRight,
  Menu,
  Shield,
  Star,
  Users,
  Sun,
  Moon
} from "lucide-react";

export default function LandingPage() {
  // State untuk Tema Gelap/Terang (dibaca langsung dari localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || document.documentElement.classList.contains("dark");
  });

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

  // State untuk FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);
  
  // State untuk Simulator Notifikasi
  const [simStep, setSimStep] = useState(1);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    const closeDropdown = () => setIsLoginDropdownOpen(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Fungsi Toggle FAQ
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Handler Alur Simulator
  const handleSimNext = () => {
    if (simStep === 1) {
      // Step 1 -> Step 2: Kirim Notifikasi
      setBannerText("🔔 Laundry Anda sudah selesai dan siap diambil.");
      setShowBanner(true);
      setSimStep(2);
    } else if (simStep === 2) {
      // Step 2 -> Step 3: Klik Notifikasi -> Buka Detail Pesanan
      setShowBanner(false);
      setSimStep(3);
    } else if (simStep === 3) {
      // Step 3 -> Step 4: Klik Ambil Sekarang / Set Reminder
      setSimStep(4);
    } else if (simStep === 5) {
      // Step 5 -> Step 6: Klik Reminder Notifikasi -> Buka Riwayat Detail
      setShowBanner(false);
      setSimStep(6);
    }
  };

  const handleSetReminder = (time) => {
    setSelectedReminder(time);
    setSimStep(4.5); // State transisi menunggu reminder
    
    // Simulasikan delay pengiriman pengingat
    setTimeout(() => {
      setBannerText("⏰ Jangan lupa mengambil laundry Anda hari ini.");
      setShowBanner(true);
      setSimStep(5);
    }, 1500);
  };

  const resetSimulator = () => {
    setSimStep(1);
    setShowBanner(false);
    setSelectedReminder(null);
  };

  // Auto-scroll banner preview jika muncul
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        // Biarkan banner tetap muncul agar diklik pengguna
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

  return (
    <div className={`min-h-screen font-sans scroll-smooth antialiased transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-800"}`}>
      
      {/* =========================================================================
          1. AREA TOP (ATTENTION)
          ========================================================================= */}
      
      {/* NAVBAR */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4 transition-all duration-300 ${isDarkMode ? "bg-slate-950/80 border-slate-800/80" : "bg-white/80 border-slate-100"}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <span className="text-xl">L</span>
            </div>
            <span className={`text-2xl font-black tracking-tight transition duration-200 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Laundry<span className="text-blue-600">Go</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#beranda" className={`font-semibold transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}>Beranda</a>
            <a href="#fitur" className={`font-semibold transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}>Fitur</a>
            <a href="#cara-kerja" className={`font-semibold transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}>Cara Kerja</a>
            <a href="#faq" className={`font-semibold transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}>FAQ</a>
            <a href="#kontak" className={`font-semibold transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-600 hover:text-blue-600"}`}>Kontak</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center
                ${isDarkMode 
                  ? "border-slate-800 bg-slate-900 text-yellow-400 hover:bg-slate-850 hover:text-yellow-300 shadow-md shadow-yellow-500/5" 
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600 shadow-sm"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoginDropdownOpen(!isLoginDropdownOpen);
                }}
                onMouseEnter={() => setIsLoginDropdownOpen(true)}
                className={`font-bold px-4 py-2 transition text-sm flex items-center gap-1 cursor-pointer ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-700 hover:text-blue-600"}`}
              >
                Masuk <ChevronDown size={14} />
              </button>

              {isLoginDropdownOpen && (
                <div
                  onMouseLeave={() => setIsLoginDropdownOpen(false)}
                  className={`absolute right-0 mt-2 w-72 rounded-2xl border p-2.5 shadow-2xl transition-all duration-200 animate-fadeIn text-left z-50
                    ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-150 text-slate-800"}`}
                >
                  {/* Option 1: Guest */}
                  <Link
                    to="/guest"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl transition ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                  >
                    <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">Pelacakan Tamu (Guest)</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Cek status laundry tanpa login</p>
                    </div>
                  </Link>

                  {/* Option 2: Member */}
                  <Link
                    to="/member/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl transition ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">Portal Member</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Ajukan cuci & tukar poin loyalitas</p>
                    </div>
                  </Link>

                  {/* Option 3: Admin */}
                  <Link
                    to="/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl transition ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"}`}
                  >
                    <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      <Shield size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black">Portal Admin</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">Kelola order, pelanggan & produk</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition text-sm shadow-md shadow-blue-500/10">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition duration-200 ${isDarkMode ? "text-slate-300 hover:text-blue-400" : "text-slate-700 hover:text-blue-600"}`}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 w-full border-b shadow-xl px-6 py-6 flex flex-col gap-4 animate-fadeIn transition duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"}`}>
            <a 
              href="#beranda" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b transition ${isDarkMode ? "text-slate-300 border-slate-800/80 hover:text-blue-400" : "text-slate-600 border-slate-50 hover:text-blue-600"}`}
            >
              Beranda
            </a>
            <a 
              href="#fitur" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b transition ${isDarkMode ? "text-slate-300 border-slate-800/80 hover:text-blue-400" : "text-slate-600 border-slate-50 hover:text-blue-600"}`}
            >
              Fitur
            </a>
            <a 
              href="#cara-kerja" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b transition ${isDarkMode ? "text-slate-300 border-slate-800/80 hover:text-blue-400" : "text-slate-600 border-slate-50 hover:text-blue-600"}`}
            >
              Cara Kerja
            </a>
            <a 
              href="#faq" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b transition ${isDarkMode ? "text-slate-300 border-slate-800/80 hover:text-blue-400" : "text-slate-600 border-slate-50 hover:text-blue-600"}`}
            >
              FAQ
            </a>
            <a 
              href="#kontak" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-semibold py-2 border-b transition ${isDarkMode ? "text-slate-300 border-slate-800/80 hover:text-blue-400" : "text-slate-600 border-slate-50 hover:text-blue-600"}`}
            >
              Kontak
            </a>
            <div className="flex flex-col gap-3.5 pt-2 text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Masuk Portal</span>
              
              <div className="grid grid-cols-1 gap-2">
                <Link 
                  to="/guest" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition text-xs font-bold ${isDarkMode ? "border-slate-800 bg-slate-900/40 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                >
                  <Users size={14} className="text-blue-500" />
                  <span>Pelacakan Tamu (Guest)</span>
                </Link>
                
                <Link 
                  to="/member/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition text-xs font-bold ${isDarkMode ? "border-slate-800 bg-slate-900/40 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700"}`}
                >
                  <Users size={14} className="text-indigo-500" />
                  <span>Portal Member</span>
                </Link>
                
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition text-xs font-bold ${isDarkMode ? "border-slate-800 bg-blue-950/20 text-blue-400" : "border-blue-150 bg-blue-50/50 text-blue-700"}`}
                >
                  <Shield size={14} className="text-blue-600" />
                  <span>Portal Admin</span>
                </Link>
              </div>

              <div className="flex gap-4 pt-2 items-center">
                {/* Mobile Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center
                    ${isDarkMode 
                      ? "border-slate-800 bg-slate-900 text-yellow-400" 
                      : "border-slate-200 bg-slate-50 text-slate-700"}`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <Link 
                  to="/register" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition text-xs uppercase tracking-widest shadow-md shadow-blue-500/10"
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="beranda" className="relative pt-12 pb-24 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-orange-50/40">
        {/* Hiasan Dekoratif */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Teks Hero */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-wider">
              <Star size={12} className="fill-blue-700" /> Aplikasi Laundry Terkini
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Laundry Lebih Mudah dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pengingat Otomatis</span> dan Notifikasi Real-Time.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
              Pelanggan dapat memesan laundry, memantau proses pencucian, dan mendapatkan pengingat pengambilan cucian secara otomatis langsung di perangkat Anda.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#download"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition flex items-center justify-center gap-2 group text-base"
              >
                <Download size={20} />
                Download Aplikasi
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#simulator"
                className="bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-extrabold px-8 py-4 rounded-2xl transition flex items-center justify-center gap-2 text-base"
              >
                <Play size={18} className="fill-slate-700 text-slate-700" />
                Coba Demo Simulasi
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-8 grid grid-cols-3 gap-6 max-w-md border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-900">4.9</p>
                <p className="text-xs text-slate-500 font-semibold mt-1">Rating App Store</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">50K+</p>
                <p className="text-xs text-slate-500 font-semibold mt-1">Pengguna Aktif</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">99.8%</p>
                <p className="text-xs text-slate-500 font-semibold mt-1">Cucian Tepat Waktu</p>
              </div>
            </div>
          </div>

          {/* Visual Hero (Static Mockup / Showcase) */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-80 h-[600px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800">
              {/* Speaker & Camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full"></div>
              </div>
              
              {/* Screen Content */}
              <div className="w-full h-full bg-blue-600 rounded-[38px] overflow-hidden flex flex-col relative pt-8 px-4 text-white text-left select-none">
                {/* Status Bar */}
                <div className="flex justify-between text-[10px] font-semibold px-2 mb-4 opacity-80">
                  <span>09:41</span>
                  <div className="flex gap-1.5">
                    <span>📶</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* App Content */}
                <div className="flex-1 bg-slate-50 rounded-t-3xl p-4 text-slate-800 flex flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Selamat pagi,</p>
                      <h4 className="text-xs font-bold text-slate-800">Farid Athaya</h4>
                    </div>
                    <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px]">
                      👤
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-3 text-white mb-4 shadow-md shadow-blue-500/10">
                    <p className="text-[10px] font-bold opacity-95">PROMO SPESIAL</p>
                    <h5 className="text-xs font-black mt-0.5">Diskon 20% Cuci Karpet</h5>
                    <p className="text-[9px] opacity-80 mt-1">Gunakan kode: BERSIHNYAMAN</p>
                  </div>

                  {/* Active Orders List */}
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Pesanan Berjalan</p>
                  <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Sedang Dicuci</span>
                        <h6 className="text-[10px] font-bold text-slate-800 mt-1">#INV-98231</h6>
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-600">Rp 25.000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 w-1/2 h-full rounded-full"></div>
                    </div>
                    <div className="flex justify-between text-[8px] text-slate-400 mt-1.5 font-medium">
                      <span>Diterima</span>
                      <span>Dicuci</span>
                      <span>Setrika</span>
                      <span>Selesai</span>
                    </div>
                  </div>

                  {/* Notification card preview */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2 animate-bounce mt-auto">
                    <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs shrink-0">
                      🔔
                    </div>
                    <div>
                      <h6 className="text-[9px] font-bold text-blue-900">Status Update</h6>
                      <p className="text-[8px] text-blue-700 mt-0.5">Cucian Anda #INV-98231 selesai & siap diambil!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-800 rounded-full"></div>
            </div>

            {/* Float Element: Notification mockup */}
            <div className="absolute top-20 -left-6 md:-left-12 bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-56 animate-float">
              <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Pengingat Cerdas</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Ambil cucian dalam 15 menit!</p>
              </div>
            </div>
            
            {/* Float Element: Progress tracking */}
            <div className="absolute bottom-20 -right-6 md:-right-12 bg-white/90 backdrop-blur-md border border-slate-100 p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-48 animate-float-delay">
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900">Tracking Selesai</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Waktu proses 1 jam 45 m</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AREA MIDDLE (INTEREST & DESIRE)
          ========================================================================= */}
      
      {/* SECTION PROBLEM & SOLUTION */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              Analisis Masalah & Solusi
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Mengapa Aplikasi Manajemen Laundry Sangat Dibutuhkan?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Kami merancang LaundryGo untuk memecahkan hambatan komunikasi dan kedisiplinan antara penyedia jasa laundry dengan para pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* PROBLEM CARD PANEL */}
            <div className="bg-gradient-to-br from-red-50 to-red-100/30 border border-red-100 rounded-3xl p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-red-950 mb-4">Masalah Klasik Pelanggan</h3>
                <p className="text-red-900/70 text-sm sm:text-base mb-8">
                  Proses laundry konvensional seringkali menimbulkan ketidaknyamanan karena kurangnya transparansi informasi.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-red-200 text-red-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                    <span className="text-red-950 text-sm sm:text-base font-semibold">Lupa mengambil laundry hingga berhari-hari.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-red-200 text-red-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                    <span className="text-red-950 text-sm sm:text-base font-semibold">Tidak mengetahui status cucian sudah diproses atau belum.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-red-200 text-red-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✕</span>
                    <span className="text-red-950 text-sm sm:text-base font-semibold">Tidak mendapat notifikasi apa pun ketika pesanan selesai.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 border-t border-red-200/50 pt-6">
                <p className="text-xs text-red-900/50 italic">*Berdasarkan survei terhadap 500+ pelanggan laundry aktif di perkotaan.</p>
              </div>
            </div>

            {/* SOLUTION CARD PANEL */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100 rounded-3xl p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield size={24} className="fill-blue-100" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-blue-950 mb-4">Solusi Cerdas LaundryGo</h3>
                <p className="text-blue-900/70 text-sm sm:text-base mb-8">
                  Dengan alur digital terintegrasi, pelanggan memiliki kontrol penuh atas cucian mereka dari awal hingga akhir.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-blue-950 text-sm sm:text-base font-semibold">Tracking status laundry secara real-time kapan pun.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-blue-950 text-sm sm:text-base font-semibold">Local Notification otomatis langsung ke HP Anda.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-blue-950 text-sm sm:text-base font-semibold">Reminder pengambilan yang fleksibel & bisa diatur sendiri.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="h-5 w-5 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
                    <span className="text-blue-950 text-sm sm:text-base font-semibold">Riwayat transaksi tersimpan rapi untuk bukti pembayaran.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 border-t border-blue-200/50 pt-6">
                <a href="#simulator" className="text-blue-600 hover:text-blue-700 font-extrabold text-sm flex items-center gap-1.5">
                  Coba simulator interaktif <ArrowRight size={16} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section id="fitur" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Fitur Unggulan
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Dirancang untuk Kemudahan Hidup Anda
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Aplikasi ini dikemas dengan teknologi modern untuk menghadirkan pengalaman mencuci yang efisien dan andal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start text-left group">
              <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Smartphone size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">📦 Tracking Laundry</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Pantau setiap tahap cucian Anda secara real-time mulai dari status Diterima, Dicuci, Disetrika, hingga Siap Diambil.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start text-left group">
              <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                <Bell size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">🔔 Local Notification</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Dapatkan notifikasi dorong (*push notification*) secara instan ketika ada pembaruan status cucian tanpa perlu kuota internet konstan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start text-left group">
              <div className="h-12 w-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">⏰ Reminder Pengambilan</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Atur alarm pengingat fleksibel sesuai kenyamanan waktu Anda sendiri: 5 menit, 15 menit, 30 menit, 1 jam, atau kustomisasi waktu tersendiri.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-start text-left group">
              <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <History size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">📋 Riwayat Laundry</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Simpan semua riwayat invoice transaksi lengkap dengan detail berat pakaian, layanan ekstra, dan riwayat tagihan pembayaran secara digital.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE SIMULATOR (CORE FLOW) */}
      <section id="cara-kerja" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Demo Interaktif
            </span>
            <h2 id="simulator" className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Coba Simulasi Alur Local Notification
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Klik panel admin di sebelah kiri dan ikuti langkah demi langkah untuk melihat bagaimana notifikasi dan pengingat bekerja langsung di layar HP simulasi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT CONTROL PANEL (6 STEPS SIMULATOR) */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">Langkah Simulasi</h3>
                <button 
                  onClick={resetSimulator}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition cursor-pointer"
                >
                  Reset Simulasi
                </button>
              </div>

              <div className="space-y-4">
                {/* Step 1 & 2 */}
                <div 
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    simStep <= 2 
                      ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                      : "bg-white border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      simStep > 2 ? "bg-green-100 text-green-700" : "bg-blue-600 text-white"
                    }`}>
                      {simStep > 2 ? "✓" : "1"}
                    </span>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-bold text-slate-800">Admin Mengubah Status</h4>
                      <p className="text-xs text-slate-500">
                        Admin kasir mengubah status cucian di dashboard web menjadi **"Laundry Siap Diambil"**.
                      </p>
                      
                      {simStep === 1 && (
                        <button 
                          onClick={handleSimNext}
                          className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition cursor-pointer"
                        >
                          Ubah Status Menjadi "Siap Diambil"
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2 Notification Banner Prompt */}
                {simStep === 2 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-pulse">
                    <div className="flex gap-2">
                      <span className="text-amber-500 font-bold text-xs">💡 Petunjuk:</span>
                      <p className="text-xs text-amber-800 font-medium">
                        Sistem telah mengirim notifikasi lokal! **Klik banner notifikasi yang muncul di bagian atas layar HP simulasi** untuk membukanya.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3 & 4 */}
                <div 
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    simStep === 3 || simStep === 4 || simStep === 4.5
                      ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                      : "bg-white border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      simStep > 4.5 ? "bg-green-100 text-green-700" : (simStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400")
                    }`}>
                      {simStep > 4.5 ? "✓" : "2"}
                    </span>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-bold text-slate-800">Pelanggan Mengaktifkan Pengingat (Reminder)</h4>
                      <p className="text-xs text-slate-500">
                        Ketika notifikasi diklik, aplikasi membuka halaman **Detail Pesanan → Status Laundry**. Pelanggan menekan tombol **"Ambil Sekarang"** atau menyetel pengingat waktu pengambilan.
                      </p>
                      
                      {simStep === 3 && (
                        <button 
                          onClick={handleSimNext}
                          className="mt-2 text-xs bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                        >
                          Klik Tombol "Ambil Sekarang"
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 4.5 Waiting indicator */}
                {simStep === 4.5 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500 font-bold text-xs">⏳ Menunggu:</span>
                      <p className="text-xs text-amber-800 font-medium">
                        Menunggu {selectedReminder} menit (disimulasikan 1.5 detik)... Pengingat akan segera berbunyi.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5 & 6 */}
                <div 
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    simStep === 5 || simStep === 6
                      ? "bg-blue-50/50 border-blue-200 shadow-sm" 
                      : "bg-white border-slate-100 opacity-60"
                  }`}
                >
                  <div className="flex gap-3">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      simStep === 6 ? "bg-green-100 text-green-700" : (simStep === 5 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400")
                    }`}>
                      {simStep === 6 ? "✓" : "3"}
                    </span>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-sm font-bold text-slate-800">Notifikasi Pengingat Muncul</h4>
                      <p className="text-xs text-slate-500">
                        Setelah waktu habis, muncul Local Notification kedua: **"Jangan lupa mengambil laundry Anda hari ini."** Klik notifikasi tersebut untuk langsung diarahkan ke halaman **Riwayat Pesanan**.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIMULATOR MOBILE SCREEN */}
            <div className="lg:col-span-6 flex justify-center relative pt-8">
              
              {/* VIRTUAL LOCAL NOTIFICATION BANNER (Slides down on Step 2 or Step 5) */}
              {showBanner && (
                <div 
                  onClick={handleSimNext}
                  className="absolute top-0 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 w-72 sm:w-80 cursor-pointer hover:bg-slate-800 transition duration-300 animate-slideDown"
                >
                  <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-sm shrink-0">
                    🔔
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">LaundryGo App</p>
                    <p className="text-[11px] font-bold truncate mt-0.5">{bannerText}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Sent via Local Notification • Klik untuk buka</p>
                  </div>
                  <div className="text-[9px] text-slate-500 shrink-0 self-start mt-0.5">now</div>
                </div>
              )}

              {/* MOBILE DEVICE MOCKUP */}
              <div className="relative w-72 sm:w-80 h-[580px] bg-slate-955 rounded-[45px] p-3 shadow-2xl border-4 border-slate-850">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center gap-1.5">
                  <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                </div>

                {/* Mobile screen background */}
                <div className="w-full h-full bg-slate-900 rounded-[38px] overflow-hidden flex flex-col relative pt-7 text-left select-none text-slate-800">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between text-[9px] font-bold px-5 py-1 text-white opacity-85">
                    <span>09:41</span>
                    <div className="flex gap-1">
                      <span>LTE</span>
                      <span>🔋</span>
                    </div>
                  </div>

                  {/* App Container */}
                  <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto relative">
                    
                    {/* APP NAVBAR */}
                    <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-sm shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">🧺</span>
                        <span className="text-[11px] font-black text-slate-950 uppercase tracking-wider">LaundryGo</span>
                      </div>
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black">MEMBER</span>
                    </div>

                    {/* DYNAMIC SCREEN VIEWS */}
                    <div className="flex-1 p-3 flex flex-col">
                      
                      {/* VIEW 1: DASHBOARD (Default / Step 1 & 2) */}
                      {(simStep === 1 || simStep === 2) && (
                        <div className="flex-1 flex flex-col">
                          <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm mb-3">
                            <p className="text-[9px] text-slate-400 font-bold">Halo, Farid Athaya</p>
                            <h4 className="text-xs font-black text-slate-955 mt-0.5">Saldo: Rp 120.000</h4>
                          </div>

                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Pesanan Aktif</p>
                          <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span className="text-[9px] font-bold text-slate-800">Order #INV-2026</span>
                              <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Dicuci</span>
                            </div>
                            <p className="text-[8px] text-slate-400">Paket Cuci Gosok 3 Kg</p>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-blue-600 w-1/2 h-full rounded-full"></div>
                            </div>
                            <p className="text-[7px] text-slate-400 text-right">Progress: 50%</p>
                          </div>
                        </div>
                      )}

                      {/* VIEW 2: DETAIL PESANAN - SIAP DIAMBIL (Step 3) */}
                      {simStep === 3 && (
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm space-y-2.5">
                            <div className="flex justify-between items-center">
                              <h5 className="text-[10px] font-black text-slate-950">Detail Pesanan</h5>
                              <span className="text-[8px] bg-green-100 text-green-800 font-black px-2 py-0.5 rounded-full">Siap Diambil</span>
                            </div>

                            <div className="border-y border-slate-100 py-2 space-y-1">
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>No. Invoice:</span>
                                <span className="font-bold text-slate-700">#INV-2026</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Layanan:</span>
                                <span className="font-bold text-slate-700">Cuci Gosok Premium</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Berat:</span>
                                <span className="font-bold text-slate-700">3.0 Kg</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-black text-slate-800">
                              <span>Total Tagihan:</span>
                              <span className="text-blue-600">Rp 21.000</span>
                            </div>
                          </div>

                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-left">
                            <p className="text-[8px] text-amber-900 font-medium leading-relaxed">
                              📢 **Laundry Anda sudah selesai!** Silakan ambil cucian Anda di outlet terdekat sekarang juga.
                            </p>
                          </div>

                          <button 
                            onClick={handleSimNext}
                            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10px] rounded-xl shadow-md transition cursor-pointer mt-auto"
                          >
                            Ambil Sekarang
                          </button>
                        </div>
                      )}

                      {/* VIEW 3: SET REMINDER MODAL (Step 4 & 4.5) */}
                      {(simStep === 4 || simStep === 4.5) && (
                        <div className="flex-1 flex flex-col gap-3 relative">
                          <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm opacity-50 space-y-2">
                            <p className="text-[8px] font-bold">Detail Pesanan #INV-2026</p>
                            <p className="text-[8px] text-slate-400">Status: Siap Diambil</p>
                          </div>

                          {/* Modal Overlay simulasi */}
                          <div className="absolute inset-0 bg-slate-900/30 -mx-3 -my-3 rounded-xl p-4 flex flex-col justify-end">
                            <div className="bg-white rounded-2xl p-4 shadow-xl space-y-3 animate-slideUp">
                              <div className="flex justify-between items-center">
                                <h6 className="text-[10px] font-black text-slate-900">Atur Pengingat</h6>
                                <span className="text-[8px] text-slate-400">Reminder</span>
                              </div>
                              <p className="text-[8px] text-slate-500 leading-normal">
                                Beritahu saya kembali melalui notifikasi jika saya belum mengambil cucian dalam waktu:
                              </p>
                              
                              <div className="grid grid-cols-2 gap-2">
                                {[5, 15, 30, 60].map((t) => (
                                  <button 
                                    key={t}
                                    onClick={() => handleSetReminder(t)}
                                    disabled={simStep === 4.5}
                                    className={`py-1.5 text-[8px] font-bold rounded-lg border transition ${
                                      selectedReminder === t 
                                        ? "bg-blue-600 border-blue-600 text-white" 
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    {t} Menit
                                  </button>
                                ))}
                              </div>
                              
                              <p className="text-[7px] text-slate-400 text-center">*Atau Anda juga dapat melakukan custom waktu pengingat.</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* VIEW 4: NOTIFIKASI PENGINGAT LAYAR UTAMA (Step 5) */}
                      {simStep === 5 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                          <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            ⏳
                          </div>
                          <h6 className="text-[10px] font-black text-slate-900">Reminder Aktif</h6>
                          <p className="text-[8px] text-slate-500 max-w-xs mt-1">
                            Pengingat {selectedReminder} menit telah diaktifkan.
                          </p>
                          <div className="mt-4 p-3 bg-white border border-slate-100 rounded-xl w-full text-left">
                            <p className="text-[7px] text-slate-400 uppercase font-black">Informasi:</p>
                            <p className="text-[8px] text-slate-700 mt-0.5 leading-normal">
                              Jangan lupa mengklik banner notifikasi yang muncul di bagian atas untuk diarahkan ke halaman Riwayat Laundry.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* VIEW 5: RIWAYAT DETAIL LAUNDRY (Step 6) */}
                      {simStep === 6 && (
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm space-y-2.5">
                            <div className="flex justify-between items-center">
                              <h5 className="text-[10px] font-black text-slate-950">Riwayat Transaksi</h5>
                              <span className="text-[8px] bg-green-500 text-white font-black px-2.5 py-0.5 rounded-full">Selesai / Diambil</span>
                            </div>

                            <div className="border-y border-slate-100 py-2 space-y-1">
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>No. Invoice:</span>
                                <span className="font-mono text-slate-700">#INV-2026</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Paket:</span>
                                <span className="font-bold text-slate-700">Cuci Gosok Premium (3.0 Kg)</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Tanggal Masuk:</span>
                                <span className="font-bold text-slate-700">25 Juni 2026</span>
                              </div>
                              <div className="flex justify-between text-[8px] text-slate-400">
                                <span>Tanggal Ambil:</span>
                                <span className="font-bold text-slate-700">Hari ini (Reminder)</span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-black text-slate-800">
                              <span>Total Bayar:</span>
                              <span className="text-slate-900">Rp 21.000 (Lunas)</span>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-left">
                            <p className="text-[8px] text-blue-900 font-medium leading-relaxed">
                              🎉 **Cucian Berhasil Diambil!** Terima kasih telah menggunakan aplikasi LaundryGo. Riwayat Anda tersimpan aman.
                            </p>
                          </div>

                          <button 
                            onClick={resetSimulator}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-xl shadow-md transition cursor-pointer mt-auto"
                          >
                            Ulangi Simulasi Demo
                          </button>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-800 rounded-full"></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              Tanya Jawab
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Menemukan kesulitan? Temukan jawaban cepat mengenai aplikasi LaundryGo di bawah ini.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Apakah aplikasi gratis?",
                a: "Ya! Pelanggan dapat mengunduh dan menggunakan semua fitur utama seperti memantau status cucian, menerima notifikasi lokal, serta mengatur alarm pengingat pengambilan secara gratis."
              },
              {
                q: "Apakah saya akan mendapatkan notifikasi?",
                a: "Ya, tentu saja. Setiap ada perubahan status laundry dari pihak admin (seperti cucian mulai dicuci, disetrika, atau siap diambil), sistem akan secara otomatis mengirimkan Local Notification langsung ke smartphone Anda."
              },
              {
                q: "Apakah reminder bisa diatur sendiri?",
                a: "Ya, fitur pengingat sangat fleksibel. Pengguna dapat memilih interval waktu pengingat mulai dari 5 menit, 15 menit, 30 menit, hingga 1 jam sebelum pengambilan, atau mengatur waktu kustom sesuai kesibukan Anda."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-900 hover:text-blue-600 transition"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50 pt-4 animate-slideDown">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. AREA BOTTOM (ACTION)
          ========================================================================= */}
      
      {/* CTA SECTION */}
      <section id="download" className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Jangan Sampai Lupa Mengambil Laundry Lagi.
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Gunakan LaundryGo sekarang dan nikmati pengalaman laundry yang lebih praktis dengan sistem pelacakan notifikasi dan reminder otomatis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="bg-white hover:bg-slate-50 text-blue-700 font-extrabold px-8 py-4 rounded-2xl shadow-xl transition flex items-center justify-center gap-2.5 text-base cursor-pointer">
              <Download size={20} />
              Download Sekarang
            </button>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition flex items-center justify-center gap-2.5 text-base">
              Daftar Gratis
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-8 opacity-80 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-2">✓ Bebas Iklan</span>
            <span className="flex items-center gap-2">✓ Tanpa Batasan Pesanan</span>
            <span className="flex items-center gap-2">✓ Sinkronisasi Instan</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Logo & Deskripsi */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                <span className="text-lg">L</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Laundry<span className="text-blue-500">Go</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm max-w-sm leading-relaxed text-slate-400">
              Aplikasi mobile manajemen cucian laundry cerdas dengan local notification dan pengingat kustom untuk mengeliminasi lupa pengambilan cucian.
            </p>
            <p className="text-xs text-slate-500">
              Copyright &copy; {new Date().getFullYear()} LaundryGo. All rights reserved.
            </p>
          </div>

          {/* Links 1 */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Perusahaan</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#beranda" className="hover:text-white transition">Tentang Kami</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Karir</a></li>
              <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#kontak" className="hover:text-white transition">Hubungi Kami</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Fitur</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#fitur" className="hover:text-white transition">Tracking Cucian</a></li>
              <li><a href="#cara-kerja" className="hover:text-white transition">Pengingat Waktu</a></li>
              <li><a href="#fitur" className="hover:text-white transition">Notifikasi Otomatis</a></li>
              <li><a href="#beranda" className="hover:text-white transition">Katalog Produk</a></li>
            </ul>
          </div>

          {/* Kontak / Medsos */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Hubungi Kami</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              📍 Jl. Danau Toba No. 12, Jakarta Pusat, Indonesia<br />
              📞 +62 (21) 829-1092<br />
              ✉️ support@laundrygo.id
            </p>
            <div className="flex gap-4 pt-2">
              {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((media) => (
                <span 
                  key={media}
                  className="text-xs font-bold text-slate-500 hover:text-white cursor-pointer transition"
                >
                  {media}
                </span>
              ))}
            </div>
          </div>

        </div>
      </footer>

      {/* Tambahan animasi CSS untuk slider & hover */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: floatDelay 4.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
