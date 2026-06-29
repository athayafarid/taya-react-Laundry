import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiLogOut,
  FiPackage,
  FiGift,
} from "react-icons/fi";

const getLoyaltyLabel = (points) => {
  const pts = Number(points) || 0;
  if (pts >= 100) return "Gold";
  if (pts >= 50) return "Silver";
  return "Bronze";
};

export default function MemberDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);

  useEffect(() => {
    getMember();
  }, []);

  const getMember = async () => {
    try {
      // Ambil user login
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/member/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans antialiased">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
        <span className="text-slate-500 font-bold text-sm">Memuat halaman dashboard member...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-[-30%] right-[-10%] w-[350px] h-[350px] bg-white/10 rounded-full blur-[80px]"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div>
              <span className="bg-white/10 text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest border border-white/15">
                Member Area
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">
                Halo, {member?.name} 👋
              </h1>
              <p className="text-blue-100 mt-3 text-sm md:text-base max-w-md leading-relaxed">
                Selamat datang di dashboard LaundryGo. Pantau status cucian dan poin loyalitas Anda di sini.
              </p>
            </div>

            <div className="h-28 w-28 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl text-white shadow-inner shrink-0">
              <FiUser />
            </div>
          </div>
        </div>

        {/* CONTAINER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
          {/* PROFILE INFO CARD */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <FiUser className="text-blue-600 text-lg" />
                <h2 className="text-base font-black text-slate-900 tracking-wide">
                  Informasi Member
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1.5 text-xs font-bold uppercase tracking-wider">
                    <FiUser />
                    <span>Nama Lengkap</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-950">
                    {member?.name}
                  </h3>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1.5 text-xs font-bold uppercase tracking-wider">
                    <FiMail />
                    <span>Alamat Email</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-950 break-all">
                    {member?.email}
                  </h3>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1.5 text-xs font-bold uppercase tracking-wider">
                    <FiPhone />
                    <span>Nomor Handphone</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-950">
                    {member?.phone}
                  </h3>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1.5 text-xs font-bold uppercase tracking-wider">
                    <FiMapPin />
                    <span>Alamat Domisili</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-950 leading-relaxed">
                    {member?.address || "Belum diisi"}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-150 text-[10px] text-slate-400 font-bold leading-normal">
              * Silakan hubungi kasir/admin LaundryGo jika terdapat kesalahan pencatatan data diri Anda.
            </div>
          </div>

          {/* SIDEBAR CARDS */}
          <div className="space-y-6">
            {/* POINTS CARD */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-3xl p-6 md:p-8 border border-orange-200/50 shadow-sm relative overflow-hidden">
              <div className="absolute bottom-[-20%] right-[-10%] w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center gap-2.5 text-orange-600 mb-4">
                <FiAward className="text-xl" />
                <span className="font-black uppercase tracking-wider text-xs">
                  Poin Member
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h1 className="text-6xl font-black text-orange-600 tracking-tight">
                  {member?.points || 0}
                </h1>
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Poin</span>
              </div>

              <p className="text-slate-500 text-xs mt-3 leading-relaxed font-semibold">
                Kumpulkan poin dari setiap transaksi laundry Anda dan tukarkan dengan berbagai promo serta potongan harga khusus.
              </p>
            </div>

            {/* STATISTICS CARD */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                <FiPackage className="text-blue-600 text-lg" />
                <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Status Akun
                </span>
              </div>

              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Level Loyalitas</span>
                  <span className="bg-blue-50 border border-blue-100 text-blue-700 font-black px-3 py-1 rounded-lg uppercase tracking-wide">
                    {getLoyaltyLabel(member?.points)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Benefit Loyalitas</span>
                  <span className="text-slate-800 font-black">
                    Diskon Khusus Member
                  </span>
                </div>
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition duration-200 rounded-2xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <FiLogOut size={16} />
              Logout dari Akun
            </button>
          </div>
        </div>

        {/* REWARDS SECTON */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mt-8">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
            <FiGift className="text-blue-600 text-xl" />
            <h2 className="text-base font-black text-slate-900 tracking-wide">
              Katalog Reward & Hadiah Poin
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 hover:-translate-y-1 transition duration-200">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                100 Poin
              </span>
              <h3 className="font-black text-slate-900 text-base">
                Voucher Diskon 10%
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 font-bold">
                Klaim potongan 10% untuk transaksi apa pun.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 hover:-translate-y-1 transition duration-200">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                250 Poin
              </span>
              <h3 className="font-black text-slate-900 text-base">
                Gratis Cuci 2 Kg
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 font-bold">
                Klaim cuci gratis maksimal 2 Kg layanan standar.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 hover:-translate-y-1 transition duration-200">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider inline-block mb-3">
                500 Poin
              </span>
              <h3 className="font-black text-slate-900 text-base">
                Voucher Diskon 50%
              </h3>
              <p className="text-slate-400 text-xs mt-1.5 font-bold">
                Klaim potongan setengah harga untuk cucian besar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}