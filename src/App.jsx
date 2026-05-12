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

  // LAYOUT
  const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
  const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));

  const Product = React.lazy(() => import("./pages/Product"))
  const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* MAIN APP */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/Product" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          {/* FORM */}
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/add-customer" element={<AddCustomer />} />

          {/* 🔥 FITUR BARU */}
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/order-history" element={<OrderHistory />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
