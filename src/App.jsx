import "./assets/tailwind.css";
import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./components/Loading";

function App() {
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
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* MAIN APP (ADMIN) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* FORM */}
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/add-customer" element={<AddCustomer />} />

          {/* FITUR */}
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/order-history" element={<OrderHistory />} />

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