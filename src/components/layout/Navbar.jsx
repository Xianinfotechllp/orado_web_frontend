import React, { useState } from "react";
import { FiSearch, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/oradoLogo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Orado Logo" className="h-10 w-auto" />
          <span className="text-2xl font-semibold text-gray-800">Orado</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <li className="hover:text-[#EA4424] cursor-pointer">Home</li>
          <li className="hover:text-[#EA4424] cursor-pointer">Restaurant</li>
          <li className="hover:text-[#EA4424] cursor-pointer">Menu</li>
          <li className="hover:text-[#EA4424] cursor-pointer">Blog</li>
          <li className="hover:text-[#EA4424] cursor-pointer">Contact</li>
          <li className="cursor-pointer"><FiSearch size={20} /></li>
          <li className="cursor-pointer"><FiShoppingBag size={20} /></li>
          <button className="bg-[#EA4424] text-white px-6 py-2 rounded-full font-bold hover:bg-[#d1381b] transition">
            Get Started
          </button>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li className="hover:text-[#EA4424] cursor-pointer">Home</li>
            <li className="hover:text-[#EA4424] cursor-pointer">Restaurant</li>
            <li className="hover:text-[#EA4424] cursor-pointer">Menu</li>
            <li className="hover:text-[#EA4424] cursor-pointer">Blog</li>
            <li className="hover:text-[#EA4424] cursor-pointer">Contact</li>
            <li className="cursor-pointer flex items-center gap-2"><FiSearch /> Search</li>
            <li className="cursor-pointer flex items-center gap-2"><FiShoppingBag /> Cart</li>
            <button className="bg-[#EA4424] text-white px-6 py-2 rounded-full font-bold hover:bg-[#d1381b] transition">
              Get Started
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;
