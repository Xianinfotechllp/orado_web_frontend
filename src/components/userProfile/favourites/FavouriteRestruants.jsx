import React from 'react';
import { Heart, X } from 'lucide-react';
import RestaurantCard from '../../home/RestaurantCard';

const FavoriteRestaurants = ({ restaurants, onRemoveFavorite }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-orange-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 md:py-6 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Favorites</h1>
              <p className="text-orange-100 text-sm md:text-base mt-1">Your favorite restaurants in one place</p>
            </div>
            <div className="flex items-center bg-orange-500 rounded-full px-3 py-1.5 md:px-4 md:py-2">
              <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" />
              <span className="text-sm md:text-base font-medium">{restaurants.length} Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {restaurants.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <Heart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2">No favorites yet</h2>
            <p className="text-gray-500 text-sm md:text-base">Start adding restaurants to your favorites to see them here!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                Showing {restaurants.length} favorite restaurant{restaurants.length !== 1 ? 's' : ''}
              </p>
              <div className="text-xs md:text-sm text-gray-500">Tap ✕ to remove from favorites</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="relative">
                  <button
                    onClick={() => onRemoveFavorite(restaurant._id)}
                    className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

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
