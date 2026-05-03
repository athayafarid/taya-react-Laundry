import { MdDashboard, MdOutlineAssignment, MdPeople } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

export default function Sidebar() {
    // Mengganti warna hijau ke biru untuk menu yang aktif dan saat di-hover
    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4  space-x-2
        ${isActive ?
            "text-blue-600 bg-blue-100 font-extrabold" :
            "text-gray-600 hover:text-blue-600 hover:bg-blue-100 hover:font-extrabold"
        }`

    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            {/* Logo */}
            <div id="sidebar-logo" className="flex flex-col">
                {/* Mengganti teks Sedap menjadi Bilas (atau bisa kamu ganti "Laundry") */}
                <span id="logo-title" className="font-poppins text-[48px] text-gray-900">
                    Cuci Bersih <b id="logo-dot" className="text-blue-600">.</b>
                </span>
                <span id="logo-subtitle" className="font-semibold text-gray-400">Laundry Admin Dashboard</span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">
                    <li>
                        <NavLink id="menu-1" to="/" className={menuClass}>
                            <MdDashboard className="mr-4 text-xl" />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-2" to="/orders" className={menuClass}>
                            <MdOutlineAssignment className="mr-4 text-xl" />
                            <span>Orders</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="/customers" className={menuClass}>
                            <MdPeople className="mr-4 text-xl" />
                            <span>Customers</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="*" className={menuClass}>
                            <MdPeople className="mr-4 text-xl" />
                            <span>NotFound</span>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Footer */}
            <div id="sidebar-footer" className="mt-auto">
                {/* Mengganti bg-hijau menjadi bg-blue-500 */}
                <div id="footer-card" className="mb-10 flex items-center rounded-md bg-blue-500 px-4 py-2 shadow-lg">
                    <div id="footer-text" className="text-sm text-white">
                        <span>Please organize your menus through button below!</span>
                        <div id="add-menu-button" className="mt-3 flex items-center justify-center space-x-2 rounded-md bg-white p-2">
                            <FaPlus className="text-gray-600" />
                            <span className="flex items-center text-gray-600">Add Menus</span>
                        </div>
                    </div>
                    <img id="footer-avatar" className="w-20 rounded-full" src="img/Farid.jpeg" alt="avatar" />
                </div>
                {/* Mengganti teks brand footer */}
                <span id="footer-brand" className="font-bold text-gray-400">Bilas Laundry Admin Dashboard</span>
                <p id="footer-copyright" className="font-light text-gray-400">&copy; 2026 All Right Reserved</p>
            </div>
        </div>
    );
}