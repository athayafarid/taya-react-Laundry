import {
  MdDashboard,
  MdOutlineAssignment,
  MdPeople,
  MdLocationOn,
  MdNotifications,
  MdHistory,
  MdLocalLaundryService,
  MdStar,
  MdFavorite,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  // Logic class tetap sama, hanya styling warna disesuaikan dengan gambar
  const menuClass = ({ isActive }) =>
    `flex items-center rounded-xl p-3 space-x-4 transition-all duration-200
        ${isActive
      ? "text-[#5D5FEF] bg-white font-bold shadow-lg"
      : "text-white/70 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="fixed top-0 left-0 h-screen w-72 flex flex-col bg-[#5D5FEF] p-6 text-white z-50 rounded-r-[2.5rem]">
      {/* Logo Section - Disesuaikan dengan gaya VENTES */}
      <div className="mb-10 flex items-center space-x-2 px-2">
        <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shadow-inner">
          <div className="w-6 h-6 bg-white/20 rounded-full"></div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">CUCI GOSOK</h1>
        </div>
      </div>

      {/* Menu - Semua fitur tetap ada */}
      <ul className="space-y-1">
        <li>
          <NavLink to="/dashboard" className={menuClass}>
            <MdDashboard size={22} />
            <span className="text-sm">Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/add-order" className={menuClass}>
            <FaPlus size={20} />
            <span className="text-sm">Pemesanan Baru</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" className={menuClass}>
            <MdOutlineAssignment size={22} />
            <span className="text-sm">Manajemen Order</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/tracking" className={menuClass}>
            <MdLocationOn size={22} />
            <span className="text-sm">Tracking Status</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/customers" className={menuClass}>
            <MdPeople size={22} />
            <span className="text-sm">Data Pelanggan</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/services" className={menuClass}>
            <MdLocalLaundryService size={22} />
            <span className="text-sm">Layanan & Harga</span>
          </NavLink>
        </li>

        <li>
          <NavLink id="menu-2" to="/Product" className={menuClass}>
            <MdOutlineAssignment className="mr-4 text-xl" />
            <span>Produk</span>
          </NavLink>
        </li>
      </ul>

      {/* Upgrade Card - Mirip di gambar (Hiasan) */}
      <div className="mt-10 bg-white rounded-3xl p-5 text-center relative overflow-hidden">
        <div className="relative z-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1033/1033013.png"
            alt="rocket"
            className="w-12 h-12 mx-auto mb-2"
          />
          <p className="text-[#5D5FEF] text-xs font-medium">Want to upgrade?</p>
          <button className="mt-2 bg-orange-400 text-white text-xs py-2 px-4 rounded-xl font-bold hover:bg-orange-500 transition">
            Upgrade now
          </button>
        </div>
        {/* Hiasan background kartu */}
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#5D5FEF]/5 rounded-full"></div>
      </div>

      {/* Footer / Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 p-2">
          <img
            src="/img/Farid.jpeg"
            alt="avatar"
            className="w-10 h-10 rounded-xl object-cover border-2 border-white/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Admin Cuci Gosok</p>
            <p className="text-[10px] text-white/60">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}