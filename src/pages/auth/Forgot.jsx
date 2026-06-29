import { useState } from "react";
import { Link } from "react-router-dom";
import { BiMessageAltError } from "react-icons/bi";
import { MdOutlineDownloading } from "react-icons/md";

export default function Forgot() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    // Simulasi pengiriman email reset link
    setTimeout(() => {
      setSuccess("Link reset password telah dikirim ke email Anda!");
      setLoading(false);
      setEmail("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-orange-50/30 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md flex flex-col items-center border border-slate-100 text-left animate-fadeIn">
        <div className="flex flex-col items-center mb-6 text-center w-full">
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

        <h2 className="text-xl font-black text-slate-800 mb-2 w-full text-center">
          Forgot Your Password?
        </h2>
        
        <p className="text-xs text-slate-500 mb-6 text-center w-full leading-relaxed">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-100 mb-4 p-3.5 text-xs font-semibold text-green-700 rounded-xl w-full animate-fadeIn">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 mb-4 p-3.5 text-xs font-semibold text-red-700 rounded-xl flex items-center w-full animate-fadeIn">
            <BiMessageAltError className="text-red-500 me-2 text-base flex-shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-blue-50 border border-blue-100 mb-4 p-3.5 text-xs text-blue-700 rounded-xl flex items-center w-full animate-fadeIn">
            <MdOutlineDownloading className="me-2 animate-spin text-base text-blue-500" />
            Mengirim email...
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition text-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl transition duration-200 disabled:bg-slate-300 cursor-pointer text-sm shadow-lg shadow-blue-500/10"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6 w-full">
          Kembali ke{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Login Di Sini
          </Link>
        </p>

        <Link
          to="/"
          className="text-center block mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition duration-200 w-full"
        >
          ← Kembali ke Landing Page
        </Link>
      </div>
    </div>
  );
}
