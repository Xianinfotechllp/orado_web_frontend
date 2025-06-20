import React, { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiMapPin,
  FiChevronDown,
} from "react-icons/fi";
import axios from "axios";
import logo from "../../assets/oradoLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../slices/locationSlice";
import { selectCartItemCount } from "../../slices/cartSlice";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { getRestaurantsBySearchQuery } from "../../apis/restaurantApi";

function Navbar() {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileLocationOpen, setMobileLocationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFoodSearchOpen, setIsFoodSearchOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const location = useSelector((state) => state.location.location);
  const user = useSelector((state) => state.auth.user);
  const cartItemsCount = useSelector(selectCartItemCount);
  const locationRef = useRef(null);
  const foodSearchRef = useRef(null);
  const navigate = useNavigate();

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Fetch location suggestions
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
  if (location) { // This comes from your Redux state
    setSelectedLocation(location);
    setQuery(location.name);
  }
}, [location]);
  // Debounce location search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle location selection
const handleSelect = (place) => {
  const locationData = {
    name: place.display_name,
    lat: place.lat,
    lon: place.lon,
  };
  setSelectedLocation(locationData);
  dispatch(setLocation(locationData)); // This will persist automatically
  setQuery(place.display_name);
  setSuggestions([]);
  setIsSearchOpen(false);
  setMobileLocationOpen(false);
};

  // Handle food search toggle
  const handleFoodSearch = () => {
    setIsFoodSearchOpen(!isFoodSearchOpen);
    if (!isFoodSearchOpen) {
      setFoodSearchQuery("");
    }
  };

  // Submit food search
  const handleFoodSearchSubmit = async (e) => {
    e.preventDefault();
    if (foodSearchQuery.trim()) {
      try {
        const restaurants = await getRestaurantsBySearchQuery({
          query: foodSearchQuery.trim(),
          latitude: location?.lat || 0,
          longitude: location?.lon || 0,
          radius: 5000,
          page: 1,
          limit: 10
        });
        navigate(`/search`, { 
          state: { 
            searchResults: restaurants,
            searchQuery: foodSearchQuery.trim()
          }
        });
        setIsFoodSearchOpen(false);
        setFoodSearchQuery("");
      } catch (error) {
        console.error("Error searching restaurants:", error);
      }
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setSuggestions([]);
        if (!query) {
          setIsSearchOpen(false);
          setMobileLocationOpen(false);
        }
      }
      if (foodSearchRef.current && !foodSearchRef.current.contains(event.target)) {
        setIsFoodSearchOpen(false);
        setFoodSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [query]);

  return (
    <div className={`w-full fixed top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-orange-100' 
        : 'bg-white shadow-lg'
    }`}>
      {/* Gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
      
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Left Section: Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - Hidden on md and up */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-gray-700 p-2 hover:bg-orange-50 rounded-lg transition-all duration-300 hover:text-orange-600"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo & Name */}
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Orado Logo"
              className="h-7 sm:h-8 md:h-10 w-auto filter drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 hover:text-orange-600 transition-colors duration-300">
              Orado
            </span>
          </div>
        </div>

        {/* Center Section: Food Search - Hidden on mobile when menu is open */}
        {!menuOpen && (
          <div className={`${isFoodSearchOpen ? 'flex' : 'hidden'} md:flex items-center flex-1 max-w-lg mx-4 sm:mx-6 md:mx-8`} ref={foodSearchRef}>
            {!isFoodSearchOpen ? (
              <button
                onClick={handleFoodSearch}
                className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <FiSearch size={16} sm:size={18} className="text-gray-500 group-hover:text-orange-600" />
                <span className="text-sm sm:text-base text-gray-500 group-hover:text-gray-700 font-medium">
                  Search for food, restaurants...
                </span>
              </button>
            ) : (
              <form onSubmit={handleFoodSearchSubmit} className="w-full">
                <div className="flex items-center gap-2 sm:gap-3 bg-white border-2 border-orange-500 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg">
                  <FiSearch size={16} sm:size={18} className="text-orange-600" />
                  <input
                    type="text"
                    value={foodSearchQuery}
                    onChange={(e) => setFoodSearchQuery(e.target.value)}
                    placeholder="Search for food, restaurants..."
                    className="outline-none bg-transparent w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium"
                    autoFocus
                  />
                  {foodSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setFoodSearchQuery("");
                        setIsFoodSearchOpen(false);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* Right Section: Navigation Icons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Mobile Food Search Button - Hidden when search is open or on desktop */}
          {!isFoodSearchOpen && !menuOpen && (
            <button
              onClick={handleFoodSearch}
              className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-all duration-300 hover:text-orange-600"
            >
              <FiSearch size={20} className="text-gray-700" />
            </button>
          )}

          {/* Desktop Location - Hidden on mobile */}
          <div className="hidden md:flex items-center relative" ref={locationRef}>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-medium">Deliver to:</span>
            </div>
            
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 ml-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border border-orange-200 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Open location search"
              >
                <FiMapPin size={16} sm:size={18} className="text-orange-600" />
                <span className="text-sm sm:text-base font-medium text-gray-700 max-w-24 sm:max-w-32 truncate">
                  {selectedLocation ? selectedLocation.name.split(',')[0] : "Select Location"}
                </span>
                <FiChevronDown size={14} sm:size={16} className="text-orange-600 group-hover:rotate-180 transition-transform duration-300" />
              </button>
            ) : (
              <div className="ml-2 flex items-center gap-2 sm:gap-3 bg-white border-2 border-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl w-64 sm:w-80 shadow-lg">
                <FiMapPin size={16} sm:size={18} className="text-orange-600" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Location"
                  className="outline-none bg-transparent w-full text-sm sm:text-base text-gray-800 placeholder-gray-400 font-medium"
                  autoFocus
                />
              </div>
            )}

            {isSearchOpen && suggestions.length > 0 && (
              <ul className="absolute z-20 top-12 sm:top-14 left-20 bg-white border-2 border-orange-200 w-64 sm:w-80 mt-1 max-h-64 overflow-auto shadow-2xl rounded-2xl">
                {suggestions.map((place) => (
                  <li
                    key={place.place_id}
                    onClick={() => handleSelect(place)}
                    className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 cursor-pointer border-b border-orange-100 last:border-b-0 transition-all duration-200 text-sm sm:text-base text-gray-800 font-medium"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FiMapPin size={14} sm:size={16} className="text-orange-600" />
                      <span className="truncate">{place.display_name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart Icon - Always visible */}
          <Link to="/add-to-cart" className="relative p-1 sm:p-2 hover:bg-orange-50 rounded-lg transition-all duration-300">
            <FiShoppingBag size={18} sm:size={20} className="text-gray-700 hover:text-orange-600 transition-colors duration-300" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Account Button - Hidden on mobile when menu is open */}
          {!menuOpen && (
            <Link to={user ? "/my-account" : "/login"}>
              <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                <VscAccount size={18} sm:size={20} />
                <span className="text-sm sm:text-base">
                  {user?.name?.split(" ")[0] || "Login"}
                </span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 shadow-inner">
          {/* Mobile Location Search */}
          <div className="px-4 py-3 border-b border-orange-100" ref={locationRef}>
            <div 
              onClick={() => setMobileLocationOpen(!mobileLocationOpen)}
              className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 px-4 py-3 rounded-xl cursor-pointer hover:from-orange-100 hover:to-orange-200 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <FiMapPin size={18} className="text-orange-600" />
                <span className="font-medium text-gray-700 truncate">
                  {selectedLocation ? selectedLocation.name : "Select your location"}
                </span>
              </div>
              <FiChevronDown size={16} className={`text-orange-600 transition-transform duration-300 ${mobileLocationOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {mobileLocationOpen && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 border-2 border-orange-500 px-4 py-2 rounded-xl bg-white">
                  <FiSearch size={18} className="text-orange-600" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Location"
                    className="outline-none bg-transparent w-full text-gray-800 placeholder-gray-400 font-medium"
                    autoFocus
                  />
                </div>
                
                {suggestions.length > 0 && (
                  <ul className="bg-white border-2 border-orange-200 max-h-48 overflow-auto shadow-xl rounded-xl">
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        onClick={() => handleSelect(place)}
                        className="px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 cursor-pointer border-b border-orange-100 last:border-b-0 transition-all duration-200 text-gray-800 font-medium"
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

          {/* Mobile Navigation Links */}
          <div className="px-4 pb-4">
            <ul className="flex flex-col gap-1 text-gray-700 font-medium">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <li className="hover:text-orange-600 cursor-pointer p-3 rounded-xl hover:bg-orange-50 transition-all duration-200">Home</li>
              </Link>
              <Link to="/notifications" onClick={() => setMenuOpen(false)}>
                <li className="hover:text-orange-600 cursor-pointer p-3 rounded-xl hover:bg-orange-50 transition-all duration-200">Notifications</li>
              </Link>
            </ul>
            
            <div className="mt-4">
              <Link to={user ? "/my-account" : "/login"} onClick={() => setMenuOpen(false)}>
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <VscAccount size={20} />
                  {user ? "My Account" : "Login / Register"}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;