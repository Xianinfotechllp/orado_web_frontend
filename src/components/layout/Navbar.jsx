import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiMapPin,
} from "react-icons/fi";
import axios from "axios";
import logo from "../../assets/oradoLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../slices/locationSlice";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";

function Navbar() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileLocationOpen, setMobileLocationOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const locationRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const fetchSuggestions = async (searchText) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&addressdetails=1`
      );
      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place) => {
    const locationData = {
      name: place.display_name,
      lat: place.lat,
      lon: place.lon,
    };
    
    setSelectedLocation(locationData);
    dispatch(setLocation(locationData));
    setQuery(place.display_name);
    setSuggestions([]);
    setIsSearchOpen(false);
    setMobileLocationOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setSuggestions([]);
        if (!query) {
          setIsSearchOpen(false);
          setMobileLocationOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [query]);

  return (
    <div className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 max-w-7xl mx-auto">
        {/* Logo & Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Orado Logo" className="h-8 md:h-10 w-auto" />
          <span className="text-xl md:text-2xl font-semibold text-gray-800">Orado</span>
        </div>

        {/* Desktop Location Search */}
        <div className="hidden md:flex items-center gap-2 relative" ref={locationRef}>
          {!isSearchOpen ? (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-12 h-12 border-2 border-orange-600 rounded-xl bg-white shadow hover:shadow-md hover:bg-orange-50 transition-all duration-200 cursor-pointer"
              aria-label="Open location search"
            >
              <FiMapPin size={20} className="text-orange-600" />
            </button>
          ) : (
            <div className="flex items-center gap-3 border-2 border-orange-600 px-4 py-2 rounded-xl w-80 bg-white shadow hover:shadow-md transition-shadow duration-200">
              <FiMapPin size={20} className="text-orange-600" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Location"
                className="outline-none bg-transparent w-full text-gray-800 placeholder-gray-500 font-medium"
                autoFocus
              />
            </div>
          )}

          {isSearchOpen && suggestions.length > 0 && (
            <ul className="absolute z-10 top-14 left-0 bg-white border-2 border-orange-600 w-80 mt-1 max-h-60 overflow-auto shadow-xl rounded-xl">
              {suggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => handleSelect(place)}
                  className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors duration-150 text-gray-800 font-medium"
                >
                  <div className="flex items-center gap-3">
                    <FiMapPin size={16} className="text-orange-600" />
                    <span className="truncate">{place.display_name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
   
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          <Link to="/">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Home</li>
          </Link>
          <Link to="/restaurants">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Restaurants</li>
          </Link>
          <Link to="/menu">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Menu</li>
          </Link>
          <Link to="/blog">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Blog</li>
          </Link>
          <Link to="/notifications">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Notifications</li>
          </Link>
          <Link to="/contact">
            <li className="hover:text-orange-600 cursor-pointer transition-colors duration-200">Contact</li>
          </Link>
          <Link to="/search">
            <li className="cursor-pointer hover:text-orange-600 transition-colors duration-200">
              <FiSearch size={20} />
            </li>
          </Link>
          {/* Desktop Cart Icon */}
          <Link to="/add-to-cart">
            <li className="cursor-pointer hover:text-orange-600 transition-colors duration-200 relative">
              <FiShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </li>
          </Link>
          <Link to={user ? "/my-account" : "/login"}>
            <button className="flex items-center gap-2 text-black px-4 py-2 rounded-full font-bold hover:bg-orange-100 transition">
              <VscAccount size={22} />
              <span className="hidden lg:inline">{user ? user.name.split(' ')[0] : "Login"}</span>
            </button>
          </Link>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Cart Icon */}
          <Link to="/add-to-cart" className="relative">
            <FiShoppingBag size={20} className="text-gray-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMenu} className="text-gray-700">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow-inner">
          {/* Mobile Location Search */}
          <div className="mb-4 relative" ref={locationRef}>
            <div 
              onClick={() => setMobileLocationOpen(!mobileLocationOpen)}
              className="flex items-center gap-3 border-2 border-orange-600 px-4 py-3 rounded-xl bg-white shadow"
            >
              <FiMapPin size={18} className="text-orange-600" />
              <span className="font-medium truncate">
                {selectedLocation ? selectedLocation.name : "Select your location"}
              </span>
            </div>
            
            {mobileLocationOpen && (
              <div className="mt-2">
                <div className="flex items-center gap-3 border-2 border-orange-600 px-4 py-2 rounded-xl bg-white">
                  <FiSearch size={18} className="text-orange-600" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Location"
                    className="outline-none bg-transparent w-full text-gray-800 placeholder-gray-500 font-medium"
                    autoFocus
                  />
                </div>
                
                {suggestions.length > 0 && (
                  <ul className="mt-1 bg-white border-2 border-orange-600 max-h-48 overflow-auto shadow rounded-xl">
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        onClick={() => handleSelect(place)}
                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors duration-150 text-gray-800 font-medium"
                      >
                        <div className="flex items-center gap-3">
                          <FiMapPin size={16} className="text-orange-600" />
                          <span className="truncate">{place.display_name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <ul className="flex flex-col gap-3 text-gray-700 font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Home</li>
            </Link>
            <Link to="/restaurants" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Restaurants</li>
            </Link>
            <Link to="/menu" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Menu</li>
            </Link>
            <Link to="/blog" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Blog</li>
            </Link>
            <Link to="/notifications" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Notifications</li>
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200">Contact</li>
            </Link>
            <Link to="/search" onClick={() => setMenuOpen(false)}>
              <li className="hover:text-orange-600 cursor-pointer px-2 py-2 rounded transition-colors duration-200 flex items-center gap-2">
                <FiSearch size={18} /> Search
              </li>
            </Link>
            <div className="mt-2">
              <Link to={user ? "/my-account" : "/login"} onClick={() => setMenuOpen(false)}>
                <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2">
                  <VscAccount size={20} />
                  {user ? "My Account" : "Login / Register"}
                </button>
              </Link>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Navbar;