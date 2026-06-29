import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiMessageAltError } from "react-icons/bi";
import { MdOutlineDownloading } from "react-icons/md";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
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
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: dataForm.email,
          password: dataForm.password,
        },
      );

      if (authError) {
        setError(authError.message);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        setError("Akun ini bukan Admin.");
        return;
      }

      console.log("Login Admin berhasil");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan koneksi sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md flex flex-col items-center border border-slate-100">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-blue-600 h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <span className="text-xl">L</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-wider">
              Laundry<span className="text-blue-600">Go</span>
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 tracking-widest uppercase font-black">
            Laundry Management System
          </p>
        </div>

        <h2 className="text-xl font-black text-slate-800 mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-100 mb-4 p-3.5 text-xs font-semibold text-red-700 rounded-xl flex items-center w-full">
            <BiMessageAltError className="text-red-500 me-2 text-base flex-shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-100 mb-4 p-3.5 text-xs text-blue-700 rounded-xl flex items-center w-full">
            <MdOutlineDownloading className="me-2 animate-spin text-base text-blue-500" />
            Sedang memverifikasi akun...
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition duration-200 disabled:bg-slate-300 cursor-pointer text-sm shadow-lg shadow-blue-500/10"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          <Link
            to="/guest"
            className="text-center block mt-4 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            Masuk sebagai Guest
          </Link>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Belum punya akses?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-bold"
          >
            Daftar Akun Baru
          </Link>
        </p>

        <Link
          to="/"
          className="text-center block mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition duration-200"
        >
          ← Kembali ke Landing Page
        </Link>
      </div>
    </div>
  );
}
