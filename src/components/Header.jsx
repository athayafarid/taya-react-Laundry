import { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // LOGOUT
  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Apakah kamu yakin ingin keluar dari dashboard BILAS Laundry?"
    );

    if (!confirmLogout) return;

    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout gagal:", error);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  return (
    <div
      id="header-container"
      className="flex items-center justify-between bg-white px-10 py-4 shadow-sm relative"
    >
      {/* Search Bar */}
      <div id="search-bar" className="relative flex w-1/2 items-center">
        <input
          id="search-input"
          type="text"
          placeholder="Search Here..."
          className="w-full rounded-xl bg-gray-50 py-3 pl-4 pr-12 outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer"
          onClick={() => setIsSearchOpen(true)}
          readOnly
        />

        <FaSearch
          id="search-icon"
          className="absolute right-4 text-gray-400"
        />
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center bg-black/40 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Cepat Cari Menu...
              </h3>

              <button
                onClick={() => setIsSearchOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Ketik nama pelanggan atau nomor transaksi..."
                className="w-full p-5 bg-gray-50 rounded-2xl outline-none border-2 border-green-500 shadow-inner"
              />

              <FaSearch className="absolute right-5 top-6 text-green-500 text-xl" />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Sering dicari:
              </span>

              {[
                "Pelanggan Baru",
                "Order #001",
                "Laundry Selesai",
                "Member",
              ].map((item) => (
                <span
                  key={item}
                  className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 cursor-pointer hover:bg-green-100 hover:text-green-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsSearchOpen(false)}
          ></div>
        </div>
      )}

      {/* Right Section */}
      <div id="icons-container" className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <FaBell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white border-2 border-white">
              50
            </span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xl">
            <FcAreaChart />
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 text-xl">
            <SlSettings />
          </div>
        </div>

        <div className="h-10 w-[1px] bg-gray-200"></div>

        {/* Profile */}
        <div className="flex items-center gap-4 relative group">
          <div className="text-right">
            <p className="text-xs text-gray-400">Welcome,</p>
            <p className="text-sm font-bold text-gray-900">
              M Farid Athaya
            </p>
          </div>

          <div className="relative">
            <img
              src="/img/Farid.jpeg"
              alt="Profile"
              className="h-12 w-12 rounded-full border-2 border-green-500 object-cover p-0.5 cursor-pointer hover:scale-105 transition-transform"
            />

            {/* Tooltip */}
            <div className="absolute top-14 right-0 hidden group-hover:block w-56 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 z-50">
              <div className="text-center">
                <p className="font-bold text-gray-800">
                  M Farid Athaya
                </p>

                <p className="text-[10px] text-gray-400 mb-4">
                  Super Admin - BILAS Laundry
                </p>

                <div className="space-y-2">
                  <button className="w-full py-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 hover:bg-green-50 hover:text-green-600">
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-50 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}