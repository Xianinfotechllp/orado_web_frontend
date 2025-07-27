import React, { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import LocationPicker from "../../../map/LocationPicker";

const LocationInput = ({ onLocationSelect }) => {
  const [showMapModal, setShowMapModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside ONLY for suggestions dropdown (not map modal)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    if (!showMapModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMapModal]);

  // Fetch Nominatim suggestions when user types
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=in&addressdetails=1&limit=5`
        );
        const data = await response.json();
        setSuggestions(
          data.map((item) => ({
            displayName: item.display_name,
            latitude: item.lat,
            longitude: item.lon,
            street: item.address?.road || "",
            city:
              item.address?.city ||
              item.address?.town ||
              item.address?.village ||
              "",
            state: item.address?.state || "",
            zip: item.address?.postcode || "",
          }))
        );
      } catch (err) {
        console.error("Error fetching suggestions", err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSuggestionSelect = (suggestion) => {
    setSelectedLocation(suggestion);
    setSearchQuery(suggestion.displayName);
    setSuggestions([]);
    onLocationSelect(suggestion);
  };

  const clearLocation = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    setSuggestions([]);
    onLocationSelect(null);
  };

  const handleMapLocationSelect = (locationDetails) => {
    setSelectedLocation(locationDetails);
    setSearchQuery(locationDetails.street);
    setShowMapModal(false);
    onLocationSelect(locationDetails);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      e.preventDefault();
      handleSuggestionSelect(suggestions[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="Search a location or pick from map"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="absolute right-2 p-1 text-gray-500 hover:text-gray-700"
            title="Select location from map"
          >
            <MapPin className="w-5 h-5" />
          </button>
          {selectedLocation && (
            <button
              type="button"
              onClick={clearLocation}
              className="absolute right-10 p-1 text-gray-500 hover:text-gray-700"
              title="Clear location"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((sug, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionSelect(sug)}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                {sug.displayName}
              </li>
            ))}
          </ul>
        )}

        {/* Loading spinner */}
        {isSearching && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Pick a location from the map</h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-[400px]">
              <LocationPicker onSelectLocation={handleMapLocationSelect} />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
