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
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import RestaurantApprovalsPage from "./pages/Admin/RestaurantApprovalsPage";
import AddRestaurantPage from "./pages/Admin/AddRestaurant";
import RestaurantList from "./pages/Admin/RestaurantList";
import CreateMenu from "./pages/Admin/CreateMenu";
import RestaurantCategories from "./pages/Admin/RestaurantCategories";
import CategoryItems from "./pages/Admin/CategoryItems";
import RestaurantPermissions from "./pages/Admin/RestaurantPermissions";
import Dashboard from "./pages/Admin/Dashboard";
import AddAdmin from "./pages/Admin/AddAdmin";
import AdminManage from "./pages/Admin/AdminManage";
import Ticket from "./pages/Admin/ticketSystem/Ticket";
import RestaurantCommission from "./pages/Admin/RestaurantCommission";
import AdminCustomerChatDashboard from "./pages/Admin/CustomerChats/AdminCustomerChatDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import AdminCustomerOrderPage from "./pages/Admin/customer/AdminCustomerOrderPage";
import RefundComponent from "./pages/Admin/customer/RefundComponent";
import RefundTransactionsPage from "./pages/Admin/RefundTransactionsPage";
import AccessLogs from "./pages/Admin/AdminAccessLogs";
import RestaurantOrderList from "./pages/Admin/RestaurantOrderList";
import RestaurantReviewsPage from "./pages/Admin/reviews/RestaurantReviewPage";
import RestaurantListforReviews from "./pages/Admin/reviews/RestaurantListforReviews";
import OfferManagement from "./pages/Admin/Offer/OfferManagement";
import CreateOffer from "./pages/Admin/Offer/CreateOffer";
import AssignOffer from "./pages/Admin/Offer/AssignOffer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        <Route path="/add-to-cart" element={<AddToCart />} />
        <Route path="/order-management" element={<OrderManagement />} />

        <Route path="/restaurant/details/:restaurantId" element={<RestaurantDeatils />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/notifications" element={<NotificationPage />} />

        {/* User Profile */}
        <Route path="/my-account" element={<OrdersPage />} />
        <Route path="/my-account/orders" element={<OrdersPage />} />
        <Route path="/my-account/settings" element={<SettingsPage />} />


        {/* Admin-Side */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />}>

          <Route index element={<Dashboard />} />
          {/* restaurant-section */}
          <Route path="restaurant-approvals" element={<RestaurantApprovalsPage />} />
          <Route path="restaurant-add" element={<AddRestaurantPage />} />
          <Route path="restaurant-edit" element={<RestaurantList />} />
          <Route path="restaurant-createmenu" element={<CreateMenu />} />
          <Route path="restaurant-permission" element={<RestaurantPermissions />} />
          <Route path="restaurant-commission" element={<RestaurantCommission />} />
          <Route path="restaurant-feedback" element={<RestaurantListforReviews />} />

          {/* offer section */}
          <Route path="create-offer" element={<CreateOffer />} />
          <Route path="assign-offer" element={<AssignOffer />} />
          <Route path="manage-offer" element={<OfferManagement />} />

          
          {/* admin-section */}
          <Route path="admin-add" element={<AddAdmin />} />
          <Route path="admin-manage" element={<AdminManage />} />
          <Route path="admin-ticket" element={<Ticket />} />
          <Route path="access-logs" element={<AccessLogs />} />

          {/* admin-customer section */}
          <Route path="admin-customer-chat" element={<AdminCustomerChatDashboard />} />
          <Route path="user-managemnet" element={<UserManagement />} />
          <Route path="customer/:userId/orders" element={<AdminCustomerOrderPage />} />
          <Route path="order/refund" element={<RefundComponent />} />
          <Route path="refund/transactions" element={<RefundTransactionsPage />} />


          {/* Add more nested routes as needed */}
        </Route>
        <Route path="/restaurants/:restaurantId/categories" element={<RestaurantCategories />} />
        <Route path="/restaurants/:restaurantId/orders" element={<RestaurantOrderList />} />
        <Route path="/feedback/restaurants/:restaurantId" element={<RestaurantReviewsPage />} />
        <Route
          path="/restaurants/:restaurantId/categories/:categoryId/items"
          element={<CategoryItems />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
