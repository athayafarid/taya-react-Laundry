import "./assets/tailwind.css";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense, useState, useEffect } from "react";
import Loading from "./components/Loading";
import { supabase } from "./lib/supabase";

// Catat pathname pertama kali aplikasi dimuat untuk mendeteksi pengetikan manual atau refresh
const initialPathname = window.location.pathname;

const isProtectedPath = (path) => {
  if (!path) return false;
  const p = path.toLowerCase();
  const protectedPaths = [
    "/dashboard",
    "/product",
    "/products",
    "/orders",
    "/customers",
    "/add-order",
    "/add-customer",
    "/tracking",
    "/services"
  ];
  return protectedPaths.some(prot => p.startsWith(prot));
};

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi supabase saat pertama kali mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Dengarkan perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Jika rute saat pertama kali web dimuat adalah rute terproteksi, berarti diakses lewat ketik manual dari address bar.
  // Gunakan window.location.replace agar memicu reload fisik ke "/" dan me-reset initialPathname.
  if (isProtectedPath(initialPathname)) {
    window.location.replace("/");
    return <Loading />;
  }

  if (!session) {
    // Jika tidak terautentikasi, alihkan paksa ke halaman login agar mereka harus login terlebih dahulu
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    // Inisialisasi tema global dari localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // LAZY LOAD SEMUA HALAMAN
  const Dashboard = React.lazy(() => import("./pages/Dashboard"));
  const Orders = React.lazy(() => import("./pages/Orders"));
  const Customers = React.lazy(() => import("./pages/Customers"));
  const NotFound = React.lazy(() => import("./pages/NotFound"));

  const AddOrder = React.lazy(() => import("./pages/AddOrder"));
  const AddCustomer = React.lazy(() => import("./pages/AddCustomer"));

  // 🔥 TAMBAHAN FITUR BARU
  const Tracking = React.lazy(() => import("./pages/Tracking"));
  const Services = React.lazy(() => import("./pages/Services"));
  const Notifications = React.lazy(() => import("./pages/Notifications"));
  const OrderHistory = React.lazy(() => import("./pages/OrderHistory"));

  // AUTH
  const Login = React.lazy(() => import("./pages/auth/Login"));
  const Register = React.lazy(() => import("./pages/auth/Register"));
  const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

  // MEMBER
  const MemberRegister = React.lazy(
    () => import("./pages/member/MemberRegister")
  );
  const MemberLogin = React.lazy(
    () => import("./pages/member/MemberLogin")
  );
  const MemberDashboard = React.lazy(
    () => import("./pages/member/MemberDashboard")
  );
  const MemberProfile = React.lazy(
    () => import("./pages/member/MemberProfile")
  );

  // LAYOUT
  const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
  const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

  const Product = React.lazy(() => import("./pages/Product"));
  const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));

  // 🌐 GUEST PORTAL
  const GuestPage = React.lazy(() => import("./pages/GuestPage"));
  const LandingPage = React.lazy(() => import("./pages/LandingPage"));

  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />

        {/* MAIN APP (ADMIN) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          
          <Route path="/orders" element={<Orders />} />
          <Route path="/Orders" element={<Orders />} />
          
          <Route path="/customers" element={<Customers />} />
          <Route path="/Customers" element={<Customers />} />
          
          <Route path="/product" element={<Product />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/products" element={<Product />} />
          <Route path="/Products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/Products/:id" element={<ProductDetail />} />

          {/* FORM */}
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/Add-order" element={<AddOrder />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/Add-customer" element={<AddCustomer />} />

          <Route path="/tracking" element={<Tracking />} />
          <Route path="/Tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Services" element={<Services />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* LANDING & GUEST */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/laundrygo" element={<LandingPage />} />
        <Route path="/guest" element={<GuestPage />} />

        {/* MEMBER */}
        <Route path="/member/register" element={<MemberRegister />} />
        <Route path="/member/login" element={<MemberLogin />} />
        <Route path="/member/dashboard" element={<MemberDashboard />} />
        <Route path="/member/profile" element={<MemberProfile />} />

      </Routes>
    </Suspense>
  );
}

export default App;