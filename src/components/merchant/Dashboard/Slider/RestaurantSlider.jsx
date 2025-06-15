import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { getMerchantRestaurants } from "../../../../apis/restaurantApi";

const RestaurantSlider = ({ 
  onRestaurantSelect, 
  onRestaurantsLoad, 
  selectedIndex = null,
  className = "",
  showError = true 
}) => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(selectedIndex);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tabRefs = useRef([]);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlinePosition, setUnderlinePosition] = useState(0);

  // Fetch restaurants on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await getMerchantRestaurants(user.id);
        const restaurantData = response.data.restaurants;
        
        setRestaurants(restaurantData);
        
        // If no selected restaurant and restaurants exist, select first one
        if (selectedRestaurant === null && restaurantData.length > 0) {
          setSelectedRestaurant(0);
          // Notify parent component about restaurants load and initial selection
          onRestaurantsLoad?.(restaurantData);
          onRestaurantSelect?.(restaurantData[0], 0);
        } else if (selectedRestaurant !== null && restaurantData.length > 0) {
          // If there's a selected index, notify parent
          onRestaurantsLoad?.(restaurantData);
          onRestaurantSelect?.(restaurantData[selectedRestaurant], selectedRestaurant);
        }
      } catch (err) {
        setError(err.message);
        console.error("Failed to load restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user?.id]);

  // Update underline position when selected restaurant changes
  useEffect(() => {
    const updateUnderline = () => {
      if (selectedRestaurant !== null && tabRefs.current[selectedRestaurant]) {
        const activeTab = tabRefs.current[selectedRestaurant];
        const rect = activeTab.getBoundingClientRect();
        const parentRect = activeTab.parentElement.getBoundingClientRect();

        setUnderlineWidth(rect.width);
        setUnderlinePosition(rect.left - parentRect.left);
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [selectedRestaurant, restaurants]);

  // Handle external selectedIndex changes
  useEffect(() => {
    if (selectedIndex !== null && selectedIndex !== selectedRestaurant) {
      setSelectedRestaurant(selectedIndex);
    }
  }, [selectedIndex]);

  const handleRestaurantSelect = (index) => {
    setSelectedRestaurant(index);
    const selectedRestaurantData = restaurants[index];
    onRestaurantSelect?.(selectedRestaurantData, index);
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-16 ${className}`}>
        <div className="text-gray-500">Loading restaurants...</div>
      </div>
    );
  }

  if (error && showError) {
    return (
      <div className={`flex justify-center items-center h-16 ${className}`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className={`flex justify-center items-center h-16 ${className}`}>
        <div className="text-gray-500">No restaurants found</div>
      </div>
    );
  }

  return (
    <div className={`flex space-x-4 ${className}`}>
      <div className="flex-1 relative">
        <div className="flex space-x-8 relative pb-4">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant._id}
              ref={(el) => (tabRefs.current[index] = el)}
              className={`cursor-pointer transition-all duration-300 relative restaurant-tab ${
                index === selectedRestaurant
                  ? "transform scale-110"
                  : "opacity-60 hover:opacity-80"
              }`}
              onClick={() => handleRestaurantSelect(index)}
              data-index={index}
            >
              <div className="">
                <h3
                  className={`font-medium ${
                    index === selectedRestaurant
                      ? "text-orange-600 text-lg"
                      : "text-gray-700"
                  }`}
                >
                  {restaurant.name}
                </h3>
              </div>
            </div>
          ))}

          <div
            className="absolute bottom-0 h-1 bg-orange-500 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${underlineWidth}px`,
              left: `${underlinePosition}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RestaurantSlider;