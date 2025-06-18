import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";

import AddToCart from "./pages/AddToCart/AddToCart";
import OrderManagement from "./pages/OrderManagement/OrderManagement";

import RestaurantDeatils from "./pages/RestaurantDetails/RestaurantDeatils";
import Signup from "./pages/Auth/SignUp";
import Faq from "./pages/Faq/Faq";

import OrdersPage from "./pages/UserProfile/OrdersPage";
import SettingsPage from "./pages/UserProfile/SettingsPage";
import NotificationPage from "./pages/Notification/NotificationPage";

import AddressPage from "./pages/UserProfile/AddressPage";
import PremiumPage from "./pages/UserProfile/PremiumPage";
import FavouriteRestaurantsPage from "./pages/UserProfile/FavouriteRestaurantsPage";
import LogoutPage from "./pages/UserProfile/LogoutPage";
import OrderStatusPage from "./components/addToCart/OrderStatus";
import CategoryRestaurants from "./components/home/CategoryRestruants";
import RestaurantSearchPage from "./pages/Search/RestaurantSearchPage";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoutes";
import WalletTopUpPage from "./pages/UserProfile/WalletTopUpPage";


import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { Toaster, toast } from "react-hot-toast";

import RestaurantApprovalsPage from "./pages/Admin/RestaurantApprovalsPage";
import RestaurantApplicationDetails from "./pages/Admin/RestaurantApplicationDetails";

import About from "./pages/Merchant/AboutMerchant";
import Partner from "./pages/Merchant/Partner";
import MerchantDashboard from "./pages/Merchant/MerchantDashboard";

import 'react-toastify/dist/ReactToastify.css';

import TicketSystemPage from "./pages/UserProfile/TicketSytemPage";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/details/:restaurantId" element={<RestaurantDeatils />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/category/:categoryName" element={<CategoryRestaurants />} />
        <Route path="/search" element={<RestaurantSearchPage />} />

        {/* Protected Routes */}
        <Route path="/add-to-cart" element={
          <ProtectedRoute><AddToCart /></ProtectedRoute>
        } />
        <Route path="/order-management" element={
          <ProtectedRoute><OrderManagement /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationPage /></ProtectedRoute>
        } />
        <Route path="/order/status/:orderId" element={
          <ProtectedRoute><OrderStatusPage /></ProtectedRoute>
        } />

        {/* User Profile Protected Routes */}
        <Route path="/my-account" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/my-account/orders" element={
          <ProtectedRoute><OrdersPage /></ProtectedRoute>
        } />
        <Route path="/my-account/settings" element={
          <ProtectedRoute><SettingsPage /></ProtectedRoute>
        } />
        <Route path="/my-account/address" element={
          <ProtectedRoute><AddressPage /></ProtectedRoute>
        } />
        <Route path="/my-account/favourites" element={
          <ProtectedRoute><FavouriteRestaurantsPage /></ProtectedRoute>
        } />
        <Route path="/my-account/premium" element={
          <ProtectedRoute><PremiumPage /></ProtectedRoute>
        } />
        <Route path="/my-account/logout" element={
          <ProtectedRoute><LogoutPage /></ProtectedRoute>
        } />
        <Route path="/my-account/wallet" element={
          <ProtectedRoute><WalletTopUpPage /></ProtectedRoute>
        } />

        <Route
          path="/restaurant/details/:restaurantId"
          element={<RestaurantDeatils />}
        />
        <Route path="/faq" element={<Faq />} />
        <Route path="/notifications" element={<NotificationPage />} />

        {/* Merchant side */}
        <Route path="/merchant-detail" element={<About />} />
        <Route path="/partner-with-orado" element={<Partner />} />
        <Route path="/merchant" element={<MerchantDashboard />} />

        {/* Admin-Side */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>
          <Route
            path="restaurant-approvals"
            element={<RestaurantApprovalsPage />}
          />
          <Route
            path="restaurant-approvals/:id"
            element={<RestaurantApplicationDetails />}
          />
          {/* Add more nested routes as needed */}
        </Route>
        <Route path="/my-account/tickets" element={
          <ProtectedRoute><TicketSystemPage /></ProtectedRoute>
        } />
      </Routes>




     <Toaster 
  position="top-center"
  toastOptions={{
    duration: 2000,
    style: {
      background: '#363636',
      color: '#fff',
      fontSize: '18px',        // Extra large font size
      padding: '20px 32px',    // Even more padding
      minWidth: '450px',       // Extra wide
      borderRadius: '16px',    // More rounded
      lineHeight: '1.6',       // Better text spacing
    },
    success: {
      duration: 3000,
      style: {
        background: '#4BB543',
        fontSize: '18px',
        padding: '20px 32px',
        minWidth: '450px',
        borderRadius: '16px',
        lineHeight: '1.6',
      },
    },
    error: {
      duration: 4000,
      style: {
        background: '#FF3333',
        fontSize: '18px',
        padding: '20px 32px',
        minWidth: '450px',
        borderRadius: '16px',
        lineHeight: '1.6',
      },
    },
  }}
/>

    </>
  );
}

export default App;
