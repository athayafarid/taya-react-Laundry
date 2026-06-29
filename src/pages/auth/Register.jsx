import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiMessageAltError } from "react-icons/bi";
import { MdOutlineDownloading } from "react-icons/md";
import { supabase } from "../../lib/supabase"; 
import AuthSplitLayout from "../../components/AuthSplitLayout";

export default function Register() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Tombol register diklik! Mengirim data ke Supabase Auth...", dataForm);

        setLoading(true);
        setError("");
        setSuccess("");

        if (dataForm.password !== dataForm.confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok!");
            setLoading(false);
            return;
        }

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email: dataForm.email,
                password: dataForm.password,
            });

            if (authError) {
                console.error("Registrasi Supabase gagal:", authError.message);
                setError(authError.message);
                return;
            }

            console.log("Registrasi sukses!", data);
            setSuccess("Pendaftaran berhasil! Mengalihkan...");
            setDataForm({ email: "", password: "", confirmPassword: "" });
            
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            console.error("Crash Jaringan/Sistem:", err);
            setError("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            eyebrow="Admin Register"
            title="Siapkan akses admin untuk mengelola outlet."
            description="Buat akun admin LaundryGo untuk mulai mengatur layanan, transaksi, dan pelanggan dengan proses kerja yang lebih modern."
            image="/img/spray.png"
            imageAlt="Peralatan laundry"
        >
            <div className="w-full rounded-[32px] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/80 sm:p-8">
                
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

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-black text-slate-900">
                        Register Admin
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                        Daftarkan akun untuk akses dashboard pengelolaan laundry.
                    </p>
                </div>

                {success && (
                    <div className="bg-green-50 border border-green-100 mb-4 p-3.5 text-xs font-semibold text-green-700 rounded-xl w-full">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-100 mb-4 p-3.5 text-xs font-semibold text-red-700 rounded-xl flex items-center w-full">
                        <BiMessageAltError className="text-red-500 me-2 text-base flex-shrink-0" />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="bg-blue-50 border border-blue-100 mb-4 p-3.5 text-xs text-blue-700 rounded-xl flex items-center w-full">
                        <MdOutlineDownloading className="me-2 animate-spin text-base text-blue-500" />
                        Mendaftarkan akun...
                    </div>
                )}

                <form onSubmit={handleRegister} className="w-full">
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={dataForm.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
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

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={dataForm.confirmPassword}
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
                        {loading ? "Mendaftarkan..." : "Buat Akun Admin"}
                    </button>
                </form>

                <p className="text-xs text-slate-400 text-center mt-6">
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-bold">
                        Login Di Sini
                    </Link>
                </p>

                <Link
                    to="/"
                    className="text-center block mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition duration-200"
                >
                    ← Kembali ke Landing Page
                </Link>
                
            </div>
        </AuthSplitLayout>
    );
}
