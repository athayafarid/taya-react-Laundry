import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiMessageAltError } from "react-icons/bi";
import { MdOutlineDownloading } from "react-icons/md";
import { supabase } from "../../lib/supabase";

import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiAward,
  FiTruck,
  FiGift,
  FiArrowLeft,
} from "react-icons/fi";

export default function MemberLogin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: dataForm.email,
        password: dataForm.password,
      });

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!profile || profile.role !== "member") {
        await supabase.auth.signOut();
        setError("Akun ini bukan Member.");
        return;
      }

      navigate("/member/dashboard");

      if (error) throw error;

      console.log("Login berhasil:", data.user);

      navigate("/member/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-wider">BILAS</h1>
            <p className="text-green-400 text-sm tracking-[5px]">LAUNDRY</p>
          </div>

          <Link
            to="/guest"
            className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition"
          >
            <FiArrowLeft />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="rounded-[40px] p-10 bg-gradient-to-br from-[#071a2c] via-[#07111f] to-[#092c25] border border-slate-800 relative overflow-hidden">
            <div className="inline-flex bg-green-500/20 text-green-400 px-5 py-2 rounded-full text-sm font-semibold mb-8">
              #1 Laundry Terpercaya
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Selamat Datang
              <br />
              <span className="text-green-400">Kembali!</span>
            </h1>

            <p className="text-slate-400 mt-6 text-lg leading-8">
              Masuk ke akun member Anda dan nikmati layanan laundry terbaik
              dengan lebih mudah.
            </p>

            <div className="space-y-8 mt-12">
              <div className="flex gap-5">
                <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center text-green-400 text-2xl">
                  <FiAward />
                </div>

                <div>
                  <h3 className="font-bold text-xl">Kumpulkan Poin</h3>

                  <p className="text-slate-400 mt-2">
                    Setiap transaksi mendapatkan reward point yang dapat ditukar
                    dengan promo menarik.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center text-green-400 text-2xl">
                  <FiTruck />
                </div>

                <div>
                  <h3 className="font-bold text-xl">Lacak Pesanan</h3>

                  <p className="text-slate-400 mt-2">
                    Pantau status laundry Anda secara real-time kapan saja.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center text-green-400 text-2xl">
                  <FiGift />
                </div>

                <div>
                  <h3 className="font-bold text-xl">Promo Eksklusif</h3>

                  <p className="text-slate-400 mt-2">
                    Dapatkan berbagai promo khusus bagi member BILAS Laundry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[40px] p-10 bg-[#091423] border border-slate-800 flex flex-col justify-center">
            <div className="text-center">
              <div className="h-28 w-28 rounded-full border border-green-500/40 bg-green-500/10 mx-auto flex items-center justify-center text-green-400 text-5xl shadow-[0_0_60px_rgba(34,197,94,0.25)]">
                🔒
              </div>

              <h1 className="text-5xl font-black mt-8">Login Member</h1>

              <p className="text-slate-400 mt-4 text-lg">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl flex items-center mt-8">
                <BiMessageAltError className="mr-3 text-red-400 text-xl" />
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="bg-slate-800 p-4 rounded-2xl flex items-center mt-8">
                <MdOutlineDownloading className="mr-3 animate-spin text-xl text-green-400" />
                Sedang login...
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 mt-10">
              <div>
                <label className="text-slate-300">Email</label>

                <div className="mt-3 flex items-center bg-[#111D2E] rounded-2xl px-5 border border-slate-700">
                  <FiMail className="text-slate-500 text-xl" />

                  <input
                    type="email"
                    name="email"
                    value={dataForm.email}
                    onChange={handleChange}
                    placeholder="Masukkan email Anda"
                    required
                    className="w-full bg-transparent p-5 outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300">Password</label>

                <div className="mt-3 flex items-center bg-[#111D2E] rounded-2xl px-5 border border-slate-700">
                  <FiLock className="text-slate-500 text-xl" />

                  <input
                    type="password"
                    name="password"
                    value={dataForm.password}
                    onChange={handleChange}
                    placeholder="Masukkan password Anda"
                    required
                    className="w-full bg-transparent p-5 outline-none text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 transition rounded-2xl py-5 font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(34,197,94,0.3)]"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <>
                    Masuk Sekarang
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-slate-400 mt-10">
              Belum punya akun?{" "}
              <Link
                to="/member/register"
                className="text-green-400 font-semibold hover:underline"
              >
                Daftar Member
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
