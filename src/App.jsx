import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route  path="/home" element={<Home/>} />
      </Routes>
    </>
  );
}

export default App;
