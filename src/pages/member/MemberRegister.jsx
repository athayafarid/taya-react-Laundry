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
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4">
      <div className="bg-[#1C2541] p-8 rounded-[32px] shadow-2xl w-full max-w-lg border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Daftar Member</h1>

          <p className="text-gray-400 text-sm mt-2">
            Bergabung sebagai member BILAS Laundry
          </p>
        </div>

        {success && (
          <div className="bg-green-200 text-green-800 p-3 rounded-xl text-sm mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-200 text-red-800 p-3 rounded-xl flex items-center mb-4 text-sm">
            <BiMessageAltError className="mr-2 text-lg" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-gray-700 text-gray-200 p-3 rounded-xl flex items-center mb-4 text-sm">
            <MdOutlineDownloading className="mr-2 animate-spin text-lg" />
            Sedang mendaftarkan akun...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm">Nama Lengkap</label>

            <input
              type="text"
              name="name"
              value={dataForm.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Email</label>

            <input
              type="email"
              name="email"
              value={dataForm.email}
              onChange={handleChange}
              placeholder="email@gmail.com"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Nomor Handphone</label>

            <input
              type="text"
              name="phone"
              value={dataForm.phone}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Alamat</label>

            <textarea
              name="address"
              value={dataForm.address}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap"
              required
              rows={3}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Password</label>

            <input
              type="password"
              name="password"
              value={dataForm.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm">Konfirmasi Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={dataForm.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#131A30] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00E676] hover:bg-[#00C853] text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? "Registering..." : "Daftar Menjadi Member"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Sudah memiliki akun?{" "}
          <Link
            to="/member/login"
            className="text-[#00E676] font-semibold hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
