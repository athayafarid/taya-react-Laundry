import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-80px)] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <Outlet />
          </div>

          <footer className="mx-auto mt-10 flex max-w-[1500px] flex-col gap-3 border-t border-slate-200 py-6 text-xs font-bold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>LaundryGo Admin System v1.0</span>
            <div className="flex gap-4">
              <span>Support</span>
              <span>Privacy Policy</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
