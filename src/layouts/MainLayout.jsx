import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    // 🔥 DESIGN SYSTEM: NATURAL COLORS
    const colors = {
        bg: "#F4F7FE",      // Natural Background
        navy: "#1B254B",    // Primary Text
        blueGray: "#A3AED0" // Secondary / Caption Text
    };

    return (
        <div className={`min-h-screen bg-[${colors.bg}] font-sans flex overflow-hidden relative`}>
            
            {/* 🔥 SIDEBAR SECTION */}
            {/* Sidebar tetap fixed di kiri (w-72) */}
            <Sidebar />

            {/* 🔥 MAIN CONTENT AREA */}
            {/* ml-72 agar konten sinkron dengan lebar sidebar */}
            <div className="flex flex-col flex-1 ml-72 h-screen overflow-hidden relative">
                
                {/* HEADER SECTION */}
                {/* Header biasanya berisi breadcrumb, profile, dan search */}
                <Header />

                {/* CONTENT SECTION */}
                {/* - h-full & overflow-y-auto: Hanya area ini yang scrollable.
                  - font-sans: Mengaktifkan Plus Jakarta Sans / Inter.
                */}
                <main className="p-8 flex-1 overflow-y-auto scroll-smooth">
                    {/* Max-width container untuk menjaga layout tidak terlalu melar di layar ultra-wide */}
                    <div className="max-w-[1600px] mx-auto">
                        
                        {/* Wrapper untuk memastikan hierarchy typography konsisten di setiap page */}
                        <div className={`text-[${colors.navy}] antialiased`}>
                            <Outlet />
                        </div>

                    </div>

                    {/* FOOTER SUBTLE (Optional) */}
                    <footer className="mt-12 pb-6 flex justify-between items-center border-t border-gray-100 pt-6">
                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-[${colors.blueGray}]`}>
                            Bilas Laundry System v1.0
                        </p>
                        <div className="flex gap-4">
                            <span className={`text-[10px] font-bold text-[${colors.blueGray}] cursor-pointer hover:text-[#5D5FEF]`}>Support</span>
                            <span className={`text-[10px] font-bold text-[${colors.blueGray}] cursor-pointer hover:text-[#5D5FEF]`}>Privacy Policy</span>
                        </div>
                    </footer>
                </main>

                {/* Subtle Grain Overlay (Bikin tampilan lebih bertekstur/premium) */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>
        </div>
    );
}