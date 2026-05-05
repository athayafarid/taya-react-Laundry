import { Outlet } from "react-router-dom";

export default function AuthLayout() {
    // 🔥 DESIGN SYSTEM: SEMANTIC & NATURAL
    const colors = {
        primary: "#5D5FEF",       // Brand / Semantic Accent
        accent: "#FFB547",        // Semantic Warning/Gold (Logo)
        navy: "#1B254B",          // Natural Navy (Background Card)
        darkBg: "#0B1437",        // Natural Darker Navy (Main Background)
        blueGray: "#A3AED0",      // Natural Blue Gray (Sub-text)
        white: "#FFFFFF"
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center font-sans p-6 relative overflow-hidden"
            style={{ backgroundColor: colors.darkBg }}
        >
            
            {/* Background Ornamen (Semantic Ambient Light) */}
            <div 
                className="absolute top-[-15%] left-[-15%] w-[500px] h-[500px] opacity-20 rounded-full blur-[120px]"
                style={{ backgroundColor: colors.primary }}
            ></div>
            <div 
                className="absolute bottom-[-15%] right-[-15%] w-[500px] h-[500px] opacity-10 rounded-full blur-[120px]"
                style={{ backgroundColor: colors.accent }}
            ></div>

            {/* Main Auth Card (Natural Surface) */}
            <div 
                className="w-full max-w-md p-12 rounded-[3.5rem] shadow-[0px_50px_100px_rgba(0,0,0,0.5)] border border-white/5 relative z-10"
                style={{ backgroundColor: colors.navy }}
            >

                {/* LOGO SECTION (H1 Scale) */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center space-x-4 mb-4">
                        <div 
                            className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center shadow-2xl transform rotate-12"
                            style={{ backgroundColor: colors.accent }}
                        >
                            <div className="w-6 h-6 bg-white/30 rounded-lg"></div>
                        </div>
                        {/* H1 - Font Weight 900 / Black */}
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                            BILAS<span style={{ color: colors.primary }}>.</span>
                        </h1>
                    </div>
                    
                    {/* CAPTION / OVERLINE - Weight 900 & Widest Tracking */}
                    <p 
                        className="text-[10px] uppercase tracking-[0.4em] font-black"
                        style={{ color: colors.blueGray }}
                    >
                        Laundry Management System
                    </p>
                </div>

                {/* FORM AREA (H2 & Body Scale di dalam Outlet) */}
                <div className="min-h-[200px]">
                    {/* Mengirimkan context warna ke Login/Register page */}
                    <Outlet context={{ colors }} />
                </div>

                {/* FOOTER (Caption Scale) */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <p 
                        className="text-center text-[10px] uppercase tracking-widest font-black opacity-30"
                        style={{ color: colors.blueGray }}
                    >
                        © 2026 Bilas Laundry Dashboard
                    </p>
                </div>

            </div>

            {/* Glassmorphism Subtle Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        </div>
    );
}