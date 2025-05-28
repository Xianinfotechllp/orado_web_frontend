import React, { useState } from "react";
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiMapPin } from "react-icons/fi";
import logo from "../../assets/oradoLogo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState("Select Location");

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    // optionally: trigger fetchNearbyRestaurants here
  };

  return (
    <div className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Orado Logo" className="h-10 w-auto" />
          <span className="text-2xl font-semibold text-gray-800">Orado</span>
        </div>

        {/* Location Picker */}
        <div className="hidden md:flex items-center gap-2 border px-3 py-1 rounded-lg">
          <FiMapPin size={18} className="text-[#EA4424]" />
          <select
            value={location}
            onChange={handleLocationChange}
            className="outline-none bg-transparent text-gray-700"
          >
            <option disabled>Select Location</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
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

            {/* Location dropdown in mobile */}
            <li className="flex items-center gap-2">
              <FiMapPin size={18} className="text-[#EA4424]" />
              <select
                value={location}
                onChange={handleLocationChange}
                className="outline-none border rounded px-2 py-1"
              >
                <option disabled>Select Location</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
              </select>
            </li>

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
