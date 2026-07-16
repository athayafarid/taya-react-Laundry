import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  LogOut, 
  Package, 
  Gift, 
  PlusCircle, 
  List, 
  Clock, 
  Activity, 
  Sun, 
  Moon, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Sliders
} from "lucide-react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const getLoyaltyLabel = (points) => {
  const pts = Number(points) || 0;
  if (pts >= 100) return "Gold";
  if (pts >= 50) return "Silver";
  return "Bronze";
};

const servicesMap = {
  cuci_setrika: { name: "Cuci Kering Setrika", price: 7000, duration: "24 Jam" },
  cuci_kering: { name: "Cuci Kering", price: 5000, duration: "24 Jam" },
  setrika: { name: "Setrika Saja", price: 4000, duration: "24 Jam" },
  bedcover: { name: "Cuci Bed Cover", price: 15000, duration: "48 Jam" },
  sepatu: { name: "Cuci Sepatu", price: 30000, duration: "72 Jam" },
};

export default function MemberDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [orders, setOrders] = useState([]);
  const [claimedVouchers, setClaimedVouchers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // State untuk form Request Laundry Baru
  const [requestService, setRequestService] = useState("cuci_setrika");
  const [requestWeight, setRequestWeight] = useState(3);
  const [requestExpress, setRequestExpress] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  // State Tema Gelap/Terang
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

  const getMember = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/member/login");
        return;
      }

      // Ambil data profil member
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setMember(data);

      // Load claimed vouchers dari localStorage
      const savedVouchers = localStorage.getItem(`laundrygo_vouchers_${user.id}`);
      if (savedVouchers) {
        setClaimedVouchers(JSON.parse(savedVouchers));
      }

      // Ambil transaksi milik member berdasarkan Nomor Telepon
      if (data?.phone) {
        await fetchMemberOrders(data.phone);
      }
    } catch (err) {
      console.error("Gagal memuat profil member:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchMemberOrders = async (phone) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("phone", phone)
        .order("date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Gagal memuat transaksi member:", err.message);
    }
  };

  useEffect(() => {
    getMember();
  }, [getMember]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/member/login");
  };

  // Kirim Pengajuan Laundry Baru ke Database
  const handleRequestLaundry = async (e) => {
    e.preventDefault();
    if (!member) return;

    setSubmittingOrder(true);
    try {
      const selected = servicesMap[requestService];
      const weight = Number(requestWeight);
      let price = selected.price;
      let total = price * weight;
      if (requestExpress) {
        total += 15005; // flat express fee
      }

      const orderId = `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const newOrder = {
        id: orderId,
        date: new Date().toISOString().split("T")[0],
        customer: member.name,
        phone: member.phone,
        service: selected.name + (requestExpress ? " (Express)" : ""),
        price: Math.round(price),
        weight: Math.round(weight),
        total: Math.round(total),
        status: "Order Diterima",
        payment: "Belum Bayar",
      };

      const { error } = await supabase
        .from("orders")
        .insert([newOrder]);

      if (error) throw error;

      alert(`Pengajuan laundry #${orderId} berhasil dikirim! Kurir kami akan segera menjemput ke alamat Anda.`);
      
      // Reset form
      setRequestWeight(3);
      setRequestExpress(false);

      // Refresh list order
      await fetchMemberOrders(member.phone);
      
      // Pindahkan ke tab My Orders
      setActiveTab("orders");
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pengajuan laundry.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Tukarkan Poin Member
  const handleRedeemPoints = async (voucherName, pointsCost) => {
    if (!member) return;
    if ((member.points || 0) < pointsCost) {
      alert("Poin loyalitas Anda belum mencukupi untuk klaim reward ini.");
      return;
    }

    setRedeeming(true);
    try {
      const updatedPoints = member.points - pointsCost;

      // Update di Supabase
      const { error } = await supabase
        .from("members")
        .update({ points: updatedPoints })
        .eq("id", member.id);

      if (error) throw error;

      // Update state local
      setMember(prev => ({ ...prev, points: updatedPoints }));

      // Simpan voucher berkode acak ke state & localStorage
      const claimCode = `VCHR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newClaim = {
        code: claimCode,
        name: voucherName,
        cost: pointsCost,
        date: new Date().toLocaleDateString("id-ID"),
      };

      const newVouchersList = [newClaim, ...claimedVouchers];
      setClaimedVouchers(newVouchersList);
      localStorage.setItem(`laundrygo_vouchers_${member.id}`, JSON.stringify(newVouchersList));

      alert(`Klaim Sukses! Tukarkan kode "${claimCode}" ke Kasir untuk menikmati benefit ${voucherName}.`);
    } catch (err) {
      console.error(err);
      alert("Klaim reward gagal.");
    } finally {
      setRedeeming(false);
    }
  };

  const getEstimatedPrice = () => {
    const selected = servicesMap[requestService];
    if (!selected) return 0;
    let total = selected.price * requestWeight;
    if (requestExpress) {
      total += 15000;
    }
    return total;
  };

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

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-sans antialiased transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <span className="text-slate-500 font-bold text-sm">Memuat dashboard member...</span>
      </div>
    );
  }

  const activeOrders = orders.filter(o => o.status !== "Diambil");
  const pastOrders = orders.filter(o => o.status === "Diambil");

  return (
    <div className={`min-h-screen font-sans flex flex-col antialiased transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-800"}`}>
      
      {/* GLOW DECORATIONS */}
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-2/3 left-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full flex-1 flex flex-col space-y-6">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-[80px]"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 text-left">
            <div>
              <div className="flex items-center gap-3">
                <span className="bg-white/10 text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-white/15">
                  Member Portal
                </span>
                <span className="bg-orange-500 text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                  Level {getLoyaltyLabel(member?.points)}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mt-4 tracking-tight">
                Halo, {member?.name} 👋
              </h1>
              <p className="text-blue-100 mt-3 text-xs md:text-sm max-w-md leading-relaxed">
                Kumpulkan poin loyalitas dan ajukan pencucian baru langsung dari rumah Anda dengan mudah.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle in Header Card */}
              <button
                onClick={toggleTheme}
                className="p-3.5 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition cursor-pointer flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <MdOutlineLightMode size={20} /> : <MdOutlineDarkMode size={20} />}
              </button>

              <button
                onClick={handleLogout}
                className="bg-white hover:bg-slate-50 text-blue-700 font-extrabold px-5 py-3.5 rounded-2xl shadow-md transition flex items-center gap-2 text-xs cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* TAB CONTROLLERS */}
        <div className={`p-1.5 rounded-2xl flex border overflow-x-auto gap-1 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/60"}`}>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0
              ${activeTab === "overview" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}`}
          >
            <Activity size={14} /> Beranda
          </button>
          
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0
              ${activeTab === "orders" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}`}
          >
            <List size={14} /> Cucian Saya ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("request")}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0
              ${activeTab === "request" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}`}
          >
            <PlusCircle size={14} /> Ajukan Cuci Baru
          </button>

          <button
            onClick={() => setActiveTab("redeem")}
            className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0
              ${activeTab === "redeem" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : (isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900")}`}
          >
            <Gift size={14} /> Tukar Poin
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Points Stat */}
                <div className={`border p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Award size={18} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Loyalty Points</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="text-5xl font-black text-orange-500">{member?.points || 0}</h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Poin</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("redeem")}
                    className="mt-6 text-blue-500 hover:text-blue-600 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer text-left w-fit"
                  >
                    Klaim Hadiah <ChevronRight size={14} />
                  </button>
                </div>

                {/* Active Laundry Stat */}
                <div className={`border p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Clock size={18} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Cucian Aktif</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="text-5xl font-black text-blue-600">{activeOrders.length}</h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Transaksi</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="mt-6 text-blue-500 hover:text-blue-600 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer text-left w-fit"
                  >
                    Lacak Detail <ChevronRight size={14} />
                  </button>
                </div>

                {/* Total Orders Stat */}
                <div className={`border p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-indigo-500">
                      <Package size={18} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Total Laundry</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <h2 className="text-5xl font-black text-indigo-600">{orders.length}</h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Penyelesaian</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="mt-6 text-blue-500 hover:text-blue-600 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer text-left w-fit"
                  >
                    Lihat Riwayat <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Active Tracking Progress on Overview */}
                <div className={`lg:col-span-2 border p-6 rounded-3xl text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-6 border-b pb-3.5 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                    <Activity className="text-blue-600" size={18} />
                    <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Status Cucian Berjalan</h2>
                  </div>

                  {activeOrders.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                      <Package size={40} className="mx-auto text-slate-300 dark:text-slate-800" />
                      <p className="text-xs font-bold">Tidak ada cucian yang sedang diproses.</p>
                      <button
                        onClick={() => setActiveTab("request")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow transition cursor-pointer"
                      >
                        Ajukan Cucian Baru
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {activeOrders.slice(0, 2).map((order) => {
                        const currentStep = getCurrentStepIndex(order.status);
                        return (
                          <div key={order.id} className={`p-5 rounded-2xl border transition ${isDarkMode ? "bg-slate-850/60 border-slate-800" : "bg-slate-50 border-slate-200/60"}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="font-mono text-xs font-black text-blue-500">{order.id}</span>
                                <h3 className={`text-xs font-bold mt-1 transition ${isDarkMode ? "text-white" : "text-slate-800"}`}>{order.service}</h3>
                              </div>
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-md border uppercase tracking-wider ${isDarkMode ? "bg-blue-950/60 border-blue-900/60 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-700"}`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Tracking nodes */}
                            <div className="flex items-center justify-between py-2">
                              {stepsList.map((step, idx) => (
                                <div key={idx} className="flex-1 text-center relative min-w-[50px]">
                                  {idx !== stepsList.length - 1 && (
                                    <div className={`absolute top-3 left-1/2 w-full h-0.5 z-0 transition ${idx < currentStep ? "bg-blue-600" : (isDarkMode ? "bg-slate-800" : "bg-slate-200")}`} />
                                  )}
                                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-black z-10 relative transition-all duration-300
                                    ${idx <= currentStep ? "bg-blue-600 text-white" : (isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400")}`}
                                  >
                                    {idx + 1}
                                  </div>
                                  <p className={`text-[8px] mt-1.5 font-black uppercase tracking-wider ${idx <= currentStep ? "text-blue-500" : "text-slate-400"}`}>
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Profile info cards */}
                <div className={`border p-6 rounded-3xl text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <div className="flex items-center gap-2 mb-4 border-b pb-3 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                    <User className="text-blue-600" size={18} />
                    <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Profil Member</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Email</span>
                      <p className={`text-xs font-bold break-all transition ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{member?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">No. HP</span>
                      <p className={`text-xs font-bold transition ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>{member?.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Alamat Penjemputan</span>
                      <p className={`text-xs font-bold leading-relaxed transition ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>{member?.address || "Belum ditentukan"}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS LIST */}
          {activeTab === "orders" && (
            <div className={`border rounded-3xl p-6 text-left shadow-sm animate-fadeIn ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="flex items-center gap-2 mb-6 border-b pb-3.5 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                <List className="text-blue-600" size={18} />
                <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Riwayat Transaksi Laundry</h2>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-3">
                  <Package size={44} className="mx-auto text-slate-300 dark:text-slate-800" />
                  <p className="text-xs font-black">Belum ada riwayat transaksi laundry.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className={`border-b transition ${isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                        <th className="pb-3.5 font-black uppercase tracking-wider">ID Nota</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider">Tanggal</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider">Layanan</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider text-center">Berat (Kg)</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider text-right">Total Biaya</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider text-center">Status Cucian</th>
                        <th className="pb-3.5 font-black uppercase tracking-wider text-center">Pembayaran</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y transition ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}>
                      {orders.map((o) => (
                        <tr key={o.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition`}>
                          <td className="py-3.5 font-mono font-bold text-blue-500">{o.id}</td>
                          <td className={`py-3.5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>{o.date}</td>
                          <td className={`py-3.5 font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>{o.service}</td>
                          <td className="py-3.5 text-center font-bold">{o.weight} Kg</td>
                          <td className="py-3.5 text-right font-black text-blue-600">Rp {o.total.toLocaleString("id-ID")}</td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border
                              ${o.status === "Diambil" || o.status === "Selesai" 
                                ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                : "bg-blue-500/10 border-blue-500/20 text-blue-500"}`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border
                              ${o.payment === "Sudah Bayar" 
                                ? "bg-green-500/10 border-green-500/20 text-green-500" 
                                : "bg-red-500/10 border-red-500/20 text-red-500"}`}
                            >
                              {o.payment}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REQUEST PICKUP FORM */}
          {activeTab === "request" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              
              {/* Form Input */}
              <div className={`lg:col-span-7 border rounded-3xl p-6 text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 mb-6 border-b pb-3.5 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                  <PlusCircle className="text-blue-600" size={18} />
                  <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Formulir Pengajuan Cuci</h2>
                </div>

                <form onSubmit={handleRequestLaundry} className="space-y-6">
                  {/* Select Service */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400">Pilih Kategori Layanan</label>
                    <select
                      value={requestService}
                      onChange={(e) => setRequestService(e.target.value)}
                      className={`w-full p-3 rounded-xl border text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-600
                        ${isDarkMode ? "bg-slate-850 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"}`}
                    >
                      {Object.entries(servicesMap).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name} (Rp {value.price.toLocaleString("id-ID")}/Kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-400">Perkiraan Berat / Jumlah</label>
                      <span className="text-xs font-black text-blue-600">{requestWeight} {requestService === "sepatu" ? "Pasang" : "Kg"}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={requestWeight}
                      onChange={(e) => setRequestWeight(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Address default */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-455 dark:text-slate-400">Alamat Penjemputan & Pengantaran</label>
                    <textarea
                      value={member?.address || ""}
                      disabled
                      placeholder="Hubungi kasir untuk melengkapi alamat penjemputan Anda."
                      className={`w-full p-3.5 rounded-xl border text-xs font-bold resize-none h-20 opacity-80 cursor-not-allowed
                        ${isDarkMode ? "bg-slate-850 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-500"}`}
                    />
                    <span className="text-[9px] text-slate-400 font-medium block">
                      * Alamat default terikat pada database profil. Kurir menjemput sesuai titik alamat profil Anda.
                    </span>
                  </div>

                  {/* Express Checkbox */}
                  <div className={`p-4 rounded-xl border flex items-center justify-between transition ${isDarkMode ? "bg-slate-850/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                        <Clock size={16} />
                      </div>
                      <div className="text-left">
                        <span className={`text-xs font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Opsi Express (Kilat 3-6 Jam)</span>
                        <p className={`text-[10px] transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Selesai ekstra cepat dengan tambahan biaya flat Rp 15.000.</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={requestExpress}
                      onChange={(e) => setRequestExpress(e.target.checked)}
                      className="w-5 h-5 rounded text-blue-600 border-slate-350 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingOrder}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest transition shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {submittingOrder ? "Mengirim..." : "Kirim Pengajuan Penjemputan"}
                  </button>
                </form>
              </div>

              {/* Ringkasan Biaya */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className={`rounded-3xl p-6 text-center flex flex-col justify-center items-center border shadow-sm flex-1 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Estimasi Tagihan</span>
                  <h2 className="text-4xl font-black text-blue-600 my-4">
                    Rp {getEstimatedPrice().toLocaleString("id-ID")}
                  </h2>
                  <div className={`w-full border-t my-4 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}></div>
                  
                  <div className="space-y-3 w-full text-left text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Layanan</span>
                      <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-850"}`}>{servicesMap[requestService]?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Tarif Kiloan</span>
                      <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-850"}`}>Rp {servicesMap[requestService]?.price.toLocaleString("id-ID")} / Kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Layanan Express</span>
                      <span className={`font-black ${isDarkMode ? "text-white" : "text-slate-850"}`}>{requestExpress ? "Ya (+ Rp 15.000)" : "Tidak"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Waktu Estimasi</span>
                      <span className="text-blue-500 font-black">{requestExpress ? "Express 3 - 6 Jam" : servicesMap[requestService]?.duration}</span>
                    </div>
                  </div>
                </div>

                <div className={`rounded-3xl p-5 border text-left flex items-start gap-3.5 shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-blue-50/20 border-blue-100/30"}`}>
                  <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                    <Sliders size={16} />
                  </div>
                  <p className={`text-[11px] leading-relaxed transition ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    <strong>Catatan:</strong> Estimasi berat yang diisi bersifat sementara. Berat final akan ditimbang secara presisi oleh kurir/kasir kami saat penyerahan laundry.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: REDEEM POINTS */}
          {activeTab === "redeem" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Catalogue grid */}
              <div className={`border rounded-3xl p-6 text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-center mb-6 border-b pb-3.5 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Gift className="text-blue-600" size={18} />
                    <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Katalog Tukar Poin</h2>
                  </div>
                  <span className="text-xs font-black text-orange-500">Poin Anda: {member?.points || 0} Pts</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Reward 1 */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between hover:-translate-y-1 transition duration-200 ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200/50"}`}>
                    <div>
                      <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                        100 Poin
                      </span>
                      <h3 className={`font-black text-sm mb-1.5 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Voucher Diskon 10%</h3>
                      <p className={`text-[10px] leading-relaxed transition ${isDarkMode ? "text-slate-500" : "text-slate-450"}`}>
                        Klaim potongan biaya 10% untuk pengerjaan reguler.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints("Voucher Diskon 10%", 100)}
                      disabled={redeeming || (member?.points || 0) < 100}
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-blue-600 transition"
                    >
                      Tukarkan Poin
                    </button>
                  </div>

                  {/* Reward 2 */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between hover:-translate-y-1 transition duration-200 ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200/50"}`}>
                    <div>
                      <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                        150 Poin
                      </span>
                      <h3 className={`font-black text-sm mb-1.5 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Gratis Setrika 1 Kg</h3>
                      <p className={`text-[10px] leading-relaxed transition ${isDarkMode ? "text-slate-500" : "text-slate-455"}`}>
                        Klaim gratis setrika wangi untuk cucian pakaian Anda.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints("Gratis Setrika 1 Kg", 150)}
                      disabled={redeeming || (member?.points || 0) < 150}
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-blue-600 transition"
                    >
                      Tukarkan Poin
                    </button>
                  </div>

                  {/* Reward 3 */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between hover:-translate-y-1 transition duration-200 ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200/50"}`}>
                    <div>
                      <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                        250 Poin
                      </span>
                      <h3 className={`font-black text-sm mb-1.5 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Gratis Cuci 2 Kg</h3>
                      <p className={`text-[10px] leading-relaxed transition ${isDarkMode ? "text-slate-500" : "text-slate-455"}`}>
                        Potongan berat cucian gratis maksimal 2 Kg layanan cuci reguler.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints("Gratis Cuci 2 Kg", 250)}
                      disabled={redeeming || (member?.points || 0) < 250}
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-blue-600 transition"
                    >
                      Tukarkan Poin
                    </button>
                  </div>

                  {/* Reward 4 */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between hover:-translate-y-1 transition duration-200 ${isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200/50"}`}>
                    <div>
                      <span className="bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                        500 Poin
                      </span>
                      <h3 className={`font-black text-sm mb-1.5 transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Voucher Diskon 50%</h3>
                      <p className={`text-[10px] leading-relaxed transition ${isDarkMode ? "text-slate-500" : "text-slate-455"}`}>
                        Potongan harga setengah tarif untuk pencucian berat/besar.
                      </p>
                    </div>
                    <button
                      onClick={() => handleRedeemPoints("Voucher Diskon 50%", 500)}
                      disabled={redeeming || (member?.points || 0) < 500}
                      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-blue-600 transition"
                    >
                      Tukarkan Poin
                    </button>
                  </div>
                </div>
              </div>

              {/* Claimed Vouchers List */}
              <div className={`border rounded-3xl p-6 text-left shadow-sm ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
                <div className="flex items-center gap-2 mb-6 border-b pb-3.5 transition-colors duration-200 border-slate-100 dark:border-slate-800">
                  <CheckCircle className="text-green-500" size={18} />
                  <h2 className={`text-sm font-black uppercase tracking-wider transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>Voucher Saya Yang Aktif</h2>
                </div>

                {claimedVouchers.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Gift size={36} className="mx-auto text-slate-300 dark:text-slate-800" />
                    <p className="text-xs font-black">Belum ada voucher yang ditukarkan.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {claimedVouchers.map((v, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border border-dashed flex justify-between items-center transition
                          ${isDarkMode ? "bg-slate-850/40 border-slate-800" : "bg-green-50/20 border-green-200/50"}`}
                      >
                        <div className="text-left space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Klaim: {v.date}</span>
                          <h4 className={`text-xs font-black transition ${isDarkMode ? "text-white" : "text-slate-900"}`}>{v.name}</h4>
                          <p className="font-mono text-xs font-black text-blue-500 tracking-wider select-all">{v.code}</p>
                        </div>
                        <span className="text-[10px] font-black bg-green-500/10 border border-green-500/25 text-green-500 px-2 py-0.5 rounded uppercase">
                          Aktif
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
        
      </div>

      {/* FOOTER */}
      <footer className={`text-center p-6 border-t text-xs transition duration-300 ${isDarkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-white border-slate-100 text-slate-400"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} LaundryGo. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-blue-500">Beranda</Link>
            <Link to="/guest" className="hover:text-blue-500">Pelacakan Tamu</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
