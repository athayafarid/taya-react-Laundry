import {
  MdDashboard,
  MdOutlineAssignment,
  MdPeople,
  MdLocationOn,
  MdHistory,
  MdLocalLaundryService,
  MdInventory2,
  MdLogout,
  MdOutlineWaterDrop,
  MdAddCircleOutline,
} from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { to: "/add-order", label: "Pemesanan Baru", icon: MdAddCircleOutline },
  { to: "/orders", label: "Manajemen Order", icon: MdOutlineAssignment },
  { to: "/tracking", label: "Tracking Status", icon: MdLocationOn },
  { to: "/customers", label: "Data Pelanggan", icon: MdPeople },
  { to: "/services", label: "Layanan & Harga", icon: MdLocalLaundryService },
  { to: "/product", label: "Produk", icon: MdInventory2 },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Keluar dari dashboard LaundryGo?");
    if (!confirmLogout) return;

    await supabase.auth.signOut();
    navigate("/");
  };

  const menuClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
      isActive
        ? "bg-white text-blue-700 shadow-lg shadow-blue-950/10"
        : "text-blue-50/80 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <button
        aria-label="Tutup sidebar"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden bg-blue-700 text-white shadow-2xl shadow-blue-950/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-white/14 via-transparent to-orange-400/20" />

      <div className="relative flex h-full flex-col px-5 py-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-lg shadow-blue-950/10">
            <MdOutlineWaterDrop size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">
              Admin Panel
            </p>
            <h1 className="text-2xl font-black tracking-tight">
              Laundry<span className="text-orange-300">Go</span>
            </h1>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
          <p className="text-xs font-bold text-blue-100">Status outlet</p>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-lg font-black">Operasional</p>
              <p className="text-xs text-blue-100/80">08.00 - 21.00 WIB</p>
            </div>
            <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-black uppercase text-emerald-100 ring-1 ring-emerald-300/30">
              Online
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} className={menuClass} onClick={onClose}>
                <Icon className="text-xl transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-3xl bg-slate-950/20 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/img/Farid.jpeg"
              alt="Admin"
              className="h-11 w-11 rounded-2xl border border-white/20 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">M Farid Athaya</p>
              <p className="text-xs font-semibold text-blue-100/70">Super Admin</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-xs font-black text-white transition hover:bg-white hover:text-blue-700"
          >
            <MdLogout size={18} />
            Logout
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100/60">
          <MdHistory size={14} />
          System v1.0
        </div>
      </div>
      </aside>
    </>
  );
}
