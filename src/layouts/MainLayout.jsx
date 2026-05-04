import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="bg-gray-100 min-h-screen">

            {/* SIDEBAR */}
            <Sidebar />

            {/* KONTEN KANAN */}
            <div className="ml-72 flex flex-col min-h-screen">

                {/* HEADER */}
                <Header />

                {/* CONTENT */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </div>

            </div>
        </div>
    );
}