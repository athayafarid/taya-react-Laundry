import { useCallback, useEffect, useMemo, useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import {
  MdAddCircleOutline,
  MdCheckCircle,
  MdClose,
  MdInventory2,
  MdLocalLaundryService,
  MdLogout,
  MdMenu,
  MdNotificationsNone,
  MdOutlineAssignment,
  MdPayment,
  MdPeople,
  MdRefresh,
  MdSchedule,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import products from "../data/products.json";

const quickLinks = [
  { label: "Buat Order", to: "/add-order", icon: MdAddCircleOutline },
  { label: "Kelola Order", to: "/orders", icon: MdOutlineAssignment },
];

const menuResults = [
  { type: "Menu", title: "Dashboard", description: "Ringkasan bisnis laundry", to: "/dashboard", icon: MdOutlineAssignment },
  { type: "Menu", title: "Pemesanan Baru", description: "Input transaksi laundry baru", to: "/add-order", icon: MdAddCircleOutline },
  { type: "Menu", title: "Manajemen Order", description: "Kelola status dan pembayaran order", to: "/orders", icon: MdOutlineAssignment },
  { type: "Menu", title: "Tracking Status", description: "Lacak cucian berdasarkan ID nota", to: "/tracking", icon: MdSchedule },
  { type: "Menu", title: "Data Pelanggan", description: "Daftar pelanggan dan loyalty", to: "/customers", icon: MdPeople },
  { type: "Menu", title: "Layanan & Harga", description: "Kelola layanan laundry", to: "/services", icon: MdLocalLaundryService },
  { type: "Menu", title: "Produk", description: "Inventori produk dan perlengkapan", to: "/Product", icon: MdInventory2 },
];

const defaultServices = [
  { id: "s1", name: "Cuci Kering Setrika", price: 7000 },
  { id: "s2", name: "Cuci Kering", price: 5000 },
  { id: "s3", name: "Setrika Saja", price: 4000 },
  { id: "s4", name: "Cuci Bed Cover", price: 15000 },
  { id: "s5", name: "Cuci Sepatu", price: 30000 },
];

export default function Header({ onMenuClick = () => {} }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fetchHeaderData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Gagal memuat data header:", error.message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchHeaderData();
  }, [fetchHeaderData]);

  const services = useMemo(() => {
    const localServices = JSON.parse(localStorage.getItem("services")) || [];
    return localServices.length > 0 ? localServices : defaultServices;
  }, [isSearchOpen]);

  const customers = useMemo(() => {
    const customerMap = {};
    orders.forEach((order) => {
      if (!order.customer) return;
      const key = `${order.customer.toLowerCase().trim()}_${(order.phone || "").trim()}`;
      if (!customerMap[key]) {
        customerMap[key] = {
          id: key,
          name: order.customer,
          phone: order.phone || "-",
          transactionCount: 0,
        };
      }
      customerMap[key].transactionCount += 1;
    });

    return Object.values(customerMap);
  }, [orders]);

  const searchableItems = useMemo(() => {
    const orderItems = orders.map((order) => ({
      type: "Order",
      title: order.id,
      description: `${order.customer || "Pelanggan Umum"} - ${order.service || "Layanan"} - ${order.status || "Order Diterima"}`,
      to: `/tracking?trx=${encodeURIComponent(order.id)}`,
      keywords: [order.id, order.customer, order.phone, order.service, order.status, order.payment],
      icon: MdOutlineAssignment,
    }));

    const customerItems = customers.map((customer) => ({
      type: "Pelanggan",
      title: customer.name,
      description: `${customer.phone} - ${customer.transactionCount} transaksi`,
      to: "/customers",
      keywords: [customer.name, customer.phone],
      icon: MdPeople,
    }));

    const serviceItems = services.map((service) => ({
      type: "Layanan",
      title: service.name,
      description: `Rp ${Number(service.price || 0).toLocaleString("id-ID")} / kg`,
      to: "/services",
      keywords: [service.name, service.price],
      icon: MdLocalLaundryService,
    }));

    const productItems = products.map((product) => ({
      type: "Produk",
      title: product.tittle,
      description: `${product.code} - ${product.category} - stok ${product.stock}`,
      to: `/products/${product.id}`,
      keywords: [product.tittle, product.code, product.category, product.brand],
      icon: MdInventory2,
    }));

    return [...menuResults, ...orderItems, ...customerItems, ...serviceItems, ...productItems];
  }, [customers, orders, services]);

  const searchResults = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return searchableItems.slice(0, 8);

    return searchableItems
      .filter((item) =>
        [item.title, item.description, ...(item.keywords || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalized))
      )
      .slice(0, 12);
  }, [searchQuery, searchableItems]);

  const notifications = useMemo(() => {
    const list = [];

    orders.slice(0, 20).forEach((order) => {
      if (order.status === "Selesai") {
        list.push({
          id: `ready-${order.id}`,
          title: "Cucian siap diambil",
          message: `#${order.id} milik ${order.customer || "pelanggan"} sudah selesai.`,
          tone: "green",
          icon: MdCheckCircle,
          to: `/tracking?trx=${encodeURIComponent(order.id)}`,
        });
      }

      if ((order.payment || "Belum Bayar") === "Belum Bayar") {
        list.push({
          id: `payment-${order.id}`,
          title: "Pembayaran belum selesai",
          message: `#${order.id} memiliki tagihan Rp ${Number(order.total || 0).toLocaleString("id-ID")}.`,
          tone: "red",
          icon: MdPayment,
          to: "/orders",
        });
      }

      if (order.status === "Diproses") {
        list.push({
          id: `process-${order.id}`,
          title: "Order sedang diproses",
          message: `#${order.id} sedang berjalan untuk ${order.customer || "pelanggan"}.`,
          tone: "blue",
          icon: MdSchedule,
          to: `/tracking?trx=${encodeURIComponent(order.id)}`,
        });
      }
    });

    return list.slice(0, 10);
  }, [orders]);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Keluar dari dashboard LaundryGo?");
    if (!confirmLogout) return;

    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout gagal:", error);
      alert("Terjadi kesalahan saat logout.");
    }
  };

  const goToResult = (to) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(to);
  };

  const goToNotification = (to) => {
    setIsNotificationOpen(false);
    navigate(to);
  };

  const toneClass = {
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-slate-50/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
          >
            <MdMenu size={22} />
          </button>

          <div className="hidden sm:block">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-600">
              Laundry Operations
            </p>
            <p className="mt-1 text-sm font-bold text-slate-500">{today}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="hidden min-w-[320px] max-w-xl flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-400 shadow-sm transition hover:border-blue-200 hover:shadow-md md:flex"
        >
          <span>Cari menu, nota, pelanggan, layanan, produk...</span>
          <FaSearch className="text-blue-600" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className="hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-700 sm:flex"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200 md:hidden"
          >
            <FaSearch size={16} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationOpen((value) => !value);
                fetchHeaderData();
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-blue-700"
            >
              <FaBell size={17} />
              {notifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {notifications.length}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-14 z-50 w-[min(92vw,380px)] rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-200/80">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Notifikasi</h3>
                    <p className="text-[11px] font-semibold text-slate-500">
                      Update order dan pembayaran terbaru.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchHeaderData}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <MdRefresh size={18} className={isLoadingData ? "animate-spin" : ""} />
                  </button>
                </div>

                <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = notification.icon;

                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => goToNotification(notification.to)}
                          className="flex w-full gap-3 rounded-2xl p-3 text-left transition hover:bg-slate-50"
                        >
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${toneClass[notification.tone]}`}>
                            <Icon size={21} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">
                              {notification.message}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="grid place-items-center rounded-2xl bg-slate-50 px-4 py-8 text-center">
                      <MdNotificationsNone size={34} className="text-slate-300" />
                      <p className="mt-2 text-sm font-black text-slate-700">
                        Tidak ada notifikasi penting
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Semua order terlihat aman saat ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="group relative">
            <button className="flex items-center gap-3 rounded-2xl bg-white p-1.5 pr-3 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
              <img
                src="/img/Farid.jpeg"
                alt="Profile"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div className="hidden text-left lg:block">
                <p className="text-sm font-black text-slate-900">Farid</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Admin
                </p>
              </div>
            </button>

            <div className="invisible absolute right-0 top-14 w-60 translate-y-2 rounded-3xl border border-slate-100 bg-white p-4 opacity-0 shadow-2xl shadow-slate-200/80 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-sm font-black text-slate-900">M Farid Athaya</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Super Admin LaundryGo
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-100"
              >
                <MdLogout size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center bg-slate-950/50 px-4 pt-20 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Pencarian Keseluruhan</h3>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  Cari menu, transaksi, pelanggan, layanan, dan produk.
                </p>
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                <MdClose size={18} />
              </button>
            </div>

            <div className="relative mt-5">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ketik ID nota, nama pelanggan, layanan, produk, atau menu..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 pr-12 text-sm font-semibold outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <FaSearch className="absolute right-5 top-5 text-blue-600" />
            </div>

            <div className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {searchResults.length > 0 ? (
                searchResults.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={`${item.type}-${item.title}-${item.to}`}
                      type="button"
                      onClick={() => goToResult(item.to)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-transparent p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/60"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-100">
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500">
                            {item.type}
                          </span>
                        </div>
                        <p className="truncate text-sm font-black text-slate-900">
                          {item.title}
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="grid place-items-center rounded-3xl bg-slate-50 px-6 py-10 text-center">
                  <FaSearch className="text-3xl text-slate-300" />
                  <p className="mt-3 text-sm font-black text-slate-700">
                    Tidak ada hasil ditemukan
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Coba kata kunci lain seperti ID nota, nama pelanggan, atau layanan.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            aria-label="Tutup pencarian"
            className="fixed inset-0 -z-10"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
