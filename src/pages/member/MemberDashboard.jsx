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
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-[#07111F] text-white">

    <div className="max-w-7xl mx-auto p-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#091423] via-[#0B132B] to-[#071A2C] rounded-[40px] p-10 border border-slate-800 shadow-2xl">

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          <div>
            <p className="text-green-400 font-semibold">
              Member Area
            </p>

            <h1 className="text-5xl font-black mt-3">
              Halo, {member?.name} 👋
            </h1>

            <p className="text-slate-400 mt-4 text-lg">
              Selamat datang kembali di
              BILAS Laundry.
            </p>
          </div>

          <div className="h-32 w-32 rounded-full bg-green-500/10 border border-green-500/40 flex items-center justify-center text-5xl text-green-400 shadow-[0_0_50px_rgba(34,197,94,0.25)]">
            <FiUser />
          </div>

        </div>
      </div>

      {/* CARD */}
      <div className="grid lg:grid-cols-3 gap-8 mt-10">

        {/* PROFIL */}
        <div className="lg:col-span-2 bg-[#091423] rounded-[35px] p-8 border border-slate-800">

          <h2 className="text-2xl font-bold mb-8">
            Informasi Member
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-[#111D2E] rounded-3xl p-5">
              <div className="flex items-center gap-3 text-green-400 mb-3">
                <FiUser />
                <span>Nama Lengkap</span>
              </div>

              <h3 className="text-xl font-bold">
                {member?.name}
              </h3>
            </div>

            <div className="bg-[#111D2E] rounded-3xl p-5">
              <div className="flex items-center gap-3 text-green-400 mb-3">
                <FiMail />
                <span>Email</span>
              </div>

              <h3 className="text-xl font-bold break-all">
                {member?.email}
              </h3>
            </div>

            <div className="bg-[#111D2E] rounded-3xl p-5">
              <div className="flex items-center gap-3 text-green-400 mb-3">
                <FiPhone />
                <span>No Handphone</span>
              </div>

              <h3 className="text-xl font-bold">
                {member?.phone}
              </h3>
            </div>

            <div className="bg-[#111D2E] rounded-3xl p-5">
              <div className="flex items-center gap-3 text-green-400 mb-3">
                <FiMapPin />
                <span>Alamat</span>
              </div>

              <h3 className="text-lg font-bold">
                {member?.address}
              </h3>
            </div>

          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">

          {/* POIN */}
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-[35px] p-8 border border-green-500/30">

            <div className="flex items-center gap-3 text-green-400 mb-6">
              <FiAward className="text-2xl" />
              <span className="font-semibold">
                Poin Member
              </span>
            </div>

            <h1 className="text-6xl font-black text-green-400">
              {member?.points}
            </h1>

            <p className="text-slate-400 mt-4">
              Kumpulkan poin dan tukarkan
              dengan promo menarik.
            </p>
          </div>

          {/* STATISTIK */}
          <div className="bg-[#091423] rounded-[35px] p-8 border border-slate-800">

            <div className="flex items-center gap-3 mb-6">
              <FiPackage className="text-green-400" />
              <span className="font-semibold">
                Statistik
              </span>
            </div>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Status Member
                </span>

                <span className="font-bold text-green-400">
                  Silver
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Reward
                </span>

                <span className="font-bold">
                  Aktif
                </span>
              </div>

            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 transition rounded-3xl py-5 font-bold flex items-center justify-center gap-3"
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </div>

      {/* REWARD */}
      <div className="bg-[#091423] rounded-[35px] p-8 border border-slate-800 mt-10">

        <div className="flex items-center gap-3 mb-6">
          <FiGift className="text-green-400 text-2xl" />
          <h2 className="text-2xl font-bold">
            Reward Member
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-[#111D2E] rounded-3xl p-6">
            <h3 className="font-bold text-xl">
              100 Poin
            </h3>

            <p className="text-slate-400 mt-2">
              Voucher Diskon 10%
            </p>
          </div>

          <div className="bg-[#111D2E] rounded-3xl p-6">
            <h3 className="font-bold text-xl">
              250 Poin
            </h3>

            <p className="text-slate-400 mt-2">
              Gratis Cuci 2 Kg
            </p>
          </div>

          <div className="bg-[#111D2E] rounded-3xl p-6">
            <h3 className="font-bold text-xl">
              500 Poin
            </h3>

            <p className="text-slate-400 mt-2">
              Voucher Diskon 50%
            </p>
          </div>

        </div>

      </div>

    </div>
  </div>
);
}   