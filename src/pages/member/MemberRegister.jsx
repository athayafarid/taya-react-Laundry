import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiMessageAltError } from "react-icons/bi";
import { MdOutlineDownloading } from "react-icons/md";
import { supabase } from "../../lib/supabase";

export default function MemberRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validasi Password
      if (dataForm.password !== dataForm.confirmPassword) {
        setError("Password dan Konfirmasi Password tidak cocok!");
        return;
      }

      // Register ke Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: dataForm.email,
        password: dataForm.password,
      });

      if (authError) {
        throw authError;
      }

      const user = data.user;

      await supabase.from("profiles").insert({
        id: user.id,
        email: dataForm.email,
        nama_lengkap: dataForm.name,
        no_hp: dataForm.phone,
        role: "member",
      });
      if (!user) {
        throw new Error("Gagal membuat akun.");
      }

      // Simpan profil member
      const { error: memberError } = await supabase.from("members").insert({
        id: user.id,
        name: dataForm.name,
        email: dataForm.email,
        phone: dataForm.phone,
        address: dataForm.address,
        points: 0,
      });

      if (memberError) {
        throw memberError;
      }

      setSuccess("Registrasi berhasil! Silakan login menggunakan akun Anda.");

      setDataForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/member/login");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-lg border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Daftar Member</h1>
          <p className="text-slate-500 text-sm mt-2">
            Bergabung sebagai member LaundryGo
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-100 p-3.5 rounded-xl text-xs font-semibold text-green-700 mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl flex items-center mb-4 text-xs font-semibold text-red-700">
            <BiMessageAltError className="mr-2 text-lg shrink-0 text-red-500" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl flex items-center mb-4 text-xs text-blue-700 font-semibold">
            <MdOutlineDownloading className="mr-2 animate-spin text-lg text-blue-500" />
            Sedang mendaftarkan akun...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-slate-500 font-bold text-xs">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={dataForm.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="text-slate-500 font-bold text-xs">Email</label>
            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              placeholder="email@gmail.com"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="text-slate-500 font-bold text-xs">Nomor Handphone</label>
            <input
              type="text"
              name="phone"
              value={dataForm.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="text-slate-500 font-bold text-xs">Alamat</label>
            <textarea
              name="address"
              value={dataForm.address}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap"
              required
              rows={3}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="text-slate-500 font-bold text-xs">Password</label>
            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <div>
            <label className="text-slate-500 font-bold text-xs">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={dataForm.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full mt-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition duration-200 disabled:bg-slate-300 cursor-pointer text-sm shadow-lg shadow-blue-500/10 mt-2"
          >
            {loading ? "Registering..." : "Daftar Menjadi Member"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          Sudah memiliki akun?{" "}
          <Link
            to="/member/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Login di sini
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
