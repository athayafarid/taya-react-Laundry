import { Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdLocalLaundryService,
  MdNotificationsActive,
  MdOutlineWaterDrop,
} from "react-icons/md";

const highlights = [
  "Tracking cucian real-time",
  "Notifikasi status otomatis",
  "Manajemen order lebih rapi",
];

export default function AuthSplitLayout({
  eyebrow = "LaundryGo Access",
  title = "Kelola laundry dengan lebih tenang.",
  description = "Satu dashboard untuk mengatur pesanan, pelanggan, layanan, dan status cucian dengan tampilan yang rapi.",
  image = "/img/cuci.png",
  imageAlt = "LaundryGo service",
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-blue-700 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_45%,rgba(251,146,60,0.24)_100%)]" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-lg shadow-blue-950/10">
                <MdOutlineWaterDrop size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">
                  Laundry Management
                </p>
                <h1 className="text-2xl font-black tracking-tight">
                  Laundry<span className="text-orange-300">Go</span>
                </h1>
              </div>
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-[1fr_280px] items-center gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-blue-50 ring-1 ring-white/15">
                <MdLocalLaundryService size={16} />
                {eyebrow}
              </span>
              <h2 className="mt-6 max-w-xl text-5xl font-black leading-tight tracking-tight">
                {title}
              </h2>
              <p className="mt-5 max-w-lg text-sm font-semibold leading-relaxed text-blue-100">
                {description}
              </p>

              <div className="mt-8 space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-orange-200">
                      <MdCheckCircle size={20} />
                    </div>
                    <span className="text-sm font-bold text-blue-50">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-blue-950/20 backdrop-blur">
                <img
                  src={image}
                  alt={imageAlt}
                  className="h-72 w-full rounded-[24px] bg-white object-contain p-6"
                />
                <div className="mt-4 rounded-3xl bg-white p-4 text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <MdNotificationsActive size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black">Operasional siap</p>
                      <p className="text-xs font-semibold text-slate-500">
                        Pesanan, status, dan pelanggan dalam satu alur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs font-bold text-blue-100">
            <span>Admin dashboard and member portal</span>
            <span>2026</span>
          </div>
        </section>

        <main className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:justify-end lg:px-12">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
