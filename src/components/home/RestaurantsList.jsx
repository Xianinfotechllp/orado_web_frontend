import React from 'react';
import RestaurantCard from './RestaurantCard';

const RestaurantsList = ({ restaurants, categoryName, onBackClick }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6 sticky top-0 bg-white py-4 z-10">
        <button 
          onClick={onBackClick}
          className="text-gray-600 hover:text-gray-800 text-2xl p-1"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {categoryName || 'Restaurants'}
        </h1>
      </div>

      {/* Restaurant Grid */}
      {restaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {restaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant._id || restaurant.id} 
              restaurant={restaurant} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No restaurants found for this category
          </p>
          <button
            onClick={onBackClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Categories
          </button>
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;