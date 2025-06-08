import React, { useState, useEffect } from 'react';
import FoodCategoryHome from './FoodCategoryHome';
import RestaurantsList from './RestaurantsList';
import { getRestaurantsByLocationAndCategory } from '../../apis/restaurantApi';

const FoodCategoryApp = () => {
  const [currentView, setCurrentView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          // Handle error or use default location
        }
      );
    }
  }, []);

  const handleCategoryClick = async (category) => {
    if (!location) {
      alert("Please enable location services to find nearby restaurants");
      return;
    }

    try {
      setLoading(true);
      setSelectedCategory(category);
      
      const restaurants = await getRestaurantsByLocationAndCategory(
        location.latitude,
        location.longitude,
        category.id
      );
      
      setSelectedRestaurants(restaurants);
      setCurrentView('restaurants');
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (currentView === 'restaurants') {
    return (
      <RestaurantsList
        restaurants={selectedRestaurants}
        categoryName={selectedCategory?.name}
        onBackClick={handleBackToCategories}
      />
    );
  }

  return <FoodCategoryHome onCategoryClick={handleCategoryClick} />;
};

export default FoodCategoryApp;