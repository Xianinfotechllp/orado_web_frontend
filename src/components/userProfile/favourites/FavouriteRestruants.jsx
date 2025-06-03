import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';
import RestaurantCard from '../../home/RestaurantCard';

const FavoriteRestaurants = () => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([
    {
      _id: "1",
      name: "Pizza Paradise",
      images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=180&fit=crop"],
      rating: 4.5,
      foodType: "Italian, Pizza",
      openingHours: "11 AM - 11 PM",
      minOrderAmount: 200,
      distance: 1200
    },
    {
      _id: "2", 
      name: "Burger Junction",
      images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=180&fit=crop"],
      rating: 4.2,
      foodType: "American, Burgers",
      openingHours: "12 PM - 12 AM",
      minOrderAmount: 150,
      distance: 800
    },
    {
      _id: "3",
      name: "Spice Route",
      images: ["https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=180&fit=crop"],
      rating: 4.7,
      foodType: "Indian, North Indian",
      openingHours: "12 PM - 10 PM",
      minOrderAmount: 180,
      distance: 1500
    },
    {
      _id: "4",
      name: "Sushi Zen",
      images: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=300&h=180&fit=crop"],
      rating: 4.6,
      foodType: "Japanese, Sushi",
      openingHours: "1 PM - 11 PM",
      minOrderAmount: 300,
      distance: 2000
    },
    {
      _id: "5",
      name: "Taco Fiesta",
      images: ["https://images.unsplash.com/photo-1565299585323-38174c179142?w=300&h=180&fit=crop"],
      rating: 4.3,
      foodType: "Mexican, Tacos",
      openingHours: "11 AM - 10 PM",
      minOrderAmount: 120,
      distance: 900
    },
    {
      _id: "6",
      name: "Dragon Wok",
      images: ["https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=180&fit=crop"],
      rating: 4.4,
      foodType: "Chinese, Asian",
      openingHours: "12 PM - 11 PM",
      minOrderAmount: 160,
      distance: 1800
    }
  ]);

  const handleRemoveFromFavorites = (restaurantId) => {
    setFavoriteRestaurants(prev => prev.filter(restaurant => restaurant._id !== restaurantId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 md:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
                <p className="text-orange-100 text-sm md:text-base mt-1">Your favorite restaurants in one place</p>
              </div>
              <div className="flex items-center bg-orange-500 rounded-full px-3 py-1.5 md:px-4 md:py-2 self-end sm:self-auto">
                <Heart className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" fill="currentColor" />
                <span className="text-sm md:text-base font-medium">{favoriteRestaurants.length} Favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {favoriteRestaurants.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
            <p className="text-gray-500 text-sm md:text-base">Start adding restaurants to your favorites to see them here!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-2 md:space-y-0">
              <p className="text-gray-600 text-sm md:text-base">
                Showing {favoriteRestaurants.length} favorite restaurant{favoriteRestaurants.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center text-xs md:text-sm text-gray-500">
                <span>Tap ✕ to remove from favorites</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {favoriteRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="relative">
                  {/* Remove button overlay - larger on mobile for better touch targets */}
                  <button
                    onClick={() => handleRemoveFromFavorites(restaurant._id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 md:p-1.5 shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <X className="w-4 h-4 md:w-4 md:h-4 text-gray-600" />
                  </button>
                  
                  {/* Your existing RestaurantCard component */}
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteRestaurants; 