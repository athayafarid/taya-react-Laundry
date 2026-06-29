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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Header */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <span className="text-lg">L</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Laundry<span className="text-blue-600">Go</span>
              </h1>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-bold transition text-sm"
          >
            <FiArrowLeft />
            Kembali ke Landing Page
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* LEFT */}
          <div className="rounded-[32px] p-8 lg:p-10 bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex bg-blue-50 text-blue-700 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold mb-8 uppercase tracking-wider">
                #1 Laundry Terpercaya
              </div>

              <h1 className="text-3.5xl lg:text-4.5xl font-black text-slate-900 leading-tight">
                Selamat Datang
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Kembali!</span>
              </h1>

              <p className="text-slate-600 mt-4 text-sm sm:text-base leading-relaxed">
                Masuk ke akun member Anda dan nikmati layanan laundry terbaik dengan lebih mudah.
              </p>

              <div className="space-y-6 mt-10">
                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 text-xl shrink-0">
                    <FiAward />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Kumpulkan Poin</h3>
                    <p className="text-slate-500 mt-1 text-xs leading-relaxed">
                      Setiap transaksi mendapatkan reward point yang dapat ditukar dengan promo menarik.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 text-xl shrink-0">
                    <FiTruck />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Lacak Pesanan</h3>
                    <p className="text-slate-500 mt-1 text-xs leading-relaxed">
                      Pantau status laundry Anda secara real-time kapan saja.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-600 text-xl shrink-0">
                    <FiGift />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Promo Eksklusif</h3>
                    <p className="text-slate-500 mt-1 text-xs leading-relaxed">
                      Dapatkan berbagai promo khusus bagi member LaundryGo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[32px] p-8 lg:p-10 bg-white border border-slate-100 shadow-xl flex flex-col justify-center">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full border border-blue-100 bg-blue-50 mx-auto flex items-center justify-center text-blue-600 text-3xl shadow-inner">
                🔒
              </div>

              <h1 className="text-3xl font-black text-slate-900 mt-6">Login Member</h1>
              <p className="text-slate-500 mt-2 text-sm">
                Masuk ke akun Anda untuk melanjutkan
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center mt-6 text-xs font-semibold text-red-700">
                <BiMessageAltError className="mr-2 text-red-500 text-lg shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center mt-6 text-xs text-blue-700 font-semibold">
                <MdOutlineDownloading className="mr-2 animate-spin text-lg text-blue-500" />
                Sedang login...
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 mt-6">
              <div>
                <label className="text-slate-500 font-bold text-xs">Email</label>
                <div className="mt-2 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 focus-within:bg-white transition">
                  <FiMail className="text-slate-400 text-lg shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={dataForm.email}
                    onChange={handleChange}
                    placeholder="Masukkan email Anda"
                    required
                    className="w-full bg-transparent py-4 px-2 outline-none text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 font-bold text-xs">Password</label>
                <div className="mt-2 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600 focus-within:bg-white transition">
                  <FiLock className="text-slate-400 text-lg shrink-0" />
                  <input
                    type="password"
                    name="password"
                    value={dataForm.password}
                    onChange={handleChange}
                    placeholder="Masukkan password Anda"
                    required
                    className="w-full bg-transparent py-4 px-2 outline-none text-slate-800 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold transition rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 text-sm cursor-pointer mt-2"
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

            <p className="text-center text-slate-400 text-xs mt-6">
              Belum punya akun?{" "}
              <Link
                to="/member/register"
                className="text-blue-600 font-bold hover:underline"
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
