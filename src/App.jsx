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
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route  path="/home" element={<Home/>} />

        <Route path="/add-to-cart" element={<AddToCart />} />
        <Route path="/order-management" element={<OrderManagement />} />

        <Route path="/restaurant/details/:restaurantId" element={<RestaurantDeatils/>}  />
        <Route path="/faq" element={<Faq/>}  />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/order/status/:orderId" element={<OrderStatusPage />} />
        <Route path="/category/:categoryName" element={<CategoryRestaurants />} />

        {/* User Profile */}
        <Route path="/my-account" element={<OrdersPage />} />
        <Route path="/my-account/orders" element={<OrdersPage />} />
        <Route path="/my-account/settings" element={<SettingsPage />} />
        <Route path="/my-account/address" element={<AddressPage />} />
        <Route path="/my-account/favourites" element={<FavouriteRestaurantsPage />} />
        <Route path="/my-account/premium" element={<PremiumPage />} />
        <Route path="/my-account/logout" element={<LogoutPage />} />
      </Routes>
    </>
  );
}

export default App;
