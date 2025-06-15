// RestaurantListDropdown.jsx (no changes needed)
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMerchantRestaurants } from "../../../../apis/restaurantApi";
import { toast } from "react-toastify";

const RestaurantListDropdown = ({ onRestaurantSelect }) => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await getMerchantRestaurants(user.id);
        setRestaurants(response.data.restaurants);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user]);

  const handleChange = (e) => {
    const selectedId = e.target.value;
    console.log("Selected Restaurant ID:", selectedId);

    if (!restaurants || restaurants.length === 0) {
      console.log("No restaurants available");
      return;
    }

    // Change from _id to id to match your data structure
    const selectedRestaurant = restaurants.find((r) => r.id === selectedId);
    console.log("Available restaurants:", restaurants);
    console.log("Selected Restaurant:", selectedRestaurant);

    if (selectedRestaurant && onRestaurantSelect) {
      onRestaurantSelect(selectedRestaurant);
    } else {
      console.log("No restaurant found with ID:", selectedId);
    }
  };

  if (loading) {
    return <div>Loading restaurants...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mb-4">
      <label
        htmlFor="restaurant-dropdown"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Select a Restaurant
      </label>
      <select
        id="restaurant-dropdown"
        onChange={handleChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        defaultValue=""
        disabled={restaurants.length === 0}
      >
        <option value="" disabled>
          {restaurants.length === 0
            ? "No restaurants available"
            : "Choose a restaurant"}
        </option>
        {restaurants.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RestaurantListDropdown;
