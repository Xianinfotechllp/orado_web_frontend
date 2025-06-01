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

      </Routes>
    </>
  );
}

export default App;
