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
    console.log(
      "Tombol login diklik! Mencoba menyambung ke Supabase...",
      dataForm,
    );

    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: dataForm.email,
          password: dataForm.password,
        },
      );

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
      if (authError) {
        console.error("Autentikasi Supabase gagal:", authError.message);
        setError(authError.message || "Invalid credentials");
        return;
      }

      console.log("Login sukses! Data user:", data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Crash Jaringan/Sistem:", err);
      setError("Terjadi kesalahan koneksi sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4">
      <div className="bg-[#1C2541] p-8 rounded-[32px] shadow-2xl w-full max-w-md flex flex-col items-center border border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-amber-500 h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
              <span className="text-xl">O</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-wider">
              BILAS<span className="text-blue-400">.</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
            Laundry Management System
          </p>
        </div>

        <h2 className="text-xl font-bold text-gray-300 mb-4">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-200/90 mb-4 p-3 text-xs font-medium text-red-800 rounded-xl flex items-center w-full">
            <BiMessageAltError className="text-red-600 me-2 text-base flex-shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-gray-700/50 mb-4 p-3 text-xs text-gray-300 rounded-xl flex items-center w-full">
            <MdOutlineDownloading className="me-2 animate-spin text-base text-blue-400" />
            Sedang memverifikasi akun...
          </div>
        )}

        {/* PASTIKAN ON SUBMIT BERADA DI TAG FORM */}
        <form onSubmit={handleLogin} className="w-full">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-[#131A30] text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-[#131A30] text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="********"
              required
            />
          </div>

          {/* TYPE BUTTON HARUS SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00E676] hover:bg-[#00C853] text-white font-bold py-3 rounded-xl transition duration-200 disabled:bg-gray-600 cursor-pointer text-sm shadow-lg shadow-green-500/20"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link
            to="/guest"
            className="text-center block mt-4 text-gray-400 hover:text-[#00E676]"
          >
            Masuk sebagai Guest
          </Link>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Belum punya akses?{" "}
          <Link
            to="/register"
            className="text-[#00E676] hover:underline font-semibold"
          >
            Daftar Akun Baru
          </Link>
        </p>
      </div>
    </div>
  );
}
