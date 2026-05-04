import {
  MdDashboard,
  MdOutlineAssignment,
  MdPeople,
  MdLocationOn,
  MdNotifications,
  MdHistory,
  MdLocalLaundryService,
} from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuClass = ({ isActive }) =>
    `flex items-center rounded-xl p-3 space-x-3 transition
        ${
          isActive
            ? "text-white bg-gradient-to-r from-purple-500 to-indigo-600 font-bold shadow-md"
            : "text-gray-300 hover:text-white hover:bg-white/10"
        }`;

  return (
    <div className="fixed top-0 left-0 h-screen w-72 flex flex-col bg-gradient-to-b from-purple-700 to-indigo-800 p-6 text-white z-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cuci Gosok</h1>
        <p className="text-sm text-purple-200">Quality Laundry</p>
      </div>

      {/* Menu */}
      <ul className="space-y-2">
        {/* ✅ Dashboard */}
        <li>
          <NavLink to="/" className={menuClass}>
            <MdDashboard />
            <span>Dashboard</span>
          </NavLink>
        </li>

        {/* Pemesanan */}
        <li>
          <NavLink to="/add-order" className={menuClass}>
            <FaPlus />
            <span>Pemesanan Baru</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" className={menuClass}>
            <MdOutlineAssignment />
            <span>Manajemen Order</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/tracking" className={menuClass}>
            <MdLocationOn />
            <span>Tracking Status</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/customers" className={menuClass}>
            <MdPeople />
            <span>Data Pelanggan</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/services" className={menuClass}>
            <MdLocalLaundryService />
            <span>Layanan & Harga</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/notifications" className={menuClass}>
            <MdNotifications />
            <span>Notifikasi</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/order-history" className={menuClass}>
            <MdHistory />
            <span>Riwayat</span>
          </NavLink>
        </li>
      </ul>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
          <img
            src="/img/Farid.jpeg"
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold">Admin Cuci Gosok</p>
            <p className="text-xs text-purple-200">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
