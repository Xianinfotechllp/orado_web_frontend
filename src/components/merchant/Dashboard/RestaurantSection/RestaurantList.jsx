import React from "react";
import { Home, Utensils } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

const RestaurantList = ({
  restaurants = [],
  onRegisterClick,
  onAddNewClick,
  onRestaurantClick,
  onEditRestaurant,
}) => {
  console.log("child component:------------>>>", restaurants);
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-6">
          <Home className="w-12 h-12 text-orange-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No Restaurants Found
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          You haven't registered any restaurants yet. Get started by registering
          your first restaurant to begin managing your business.
        </p>

        <button
          onClick={onRegisterClick}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <Utensils className="w-5 h-5 mr-2" />
          Register Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          <p className="text-gray-600 mt-1"></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={{
              ...restaurant,
              cuisine: restaurant.foodType,
              image: "/placeholder-restaurant.jpg",
              rating: 0,
              orders: 0,
            }}
            onClick={() => onRestaurantClick?.(restaurant)}
            onEdit={onEditRestaurant}
          />
        ))}
      </div>

      {/* Floating Add Restaurant button with Utensils icon */}
      <button
        onClick={onAddNewClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center z-50"
        aria-label="Add Restaurant"
      >
        <Home className="w-6 h-6 mr-2" />
        <span>Add Restaurant</span>
      </button>
    </div>
  );
};

export default RestaurantList;
