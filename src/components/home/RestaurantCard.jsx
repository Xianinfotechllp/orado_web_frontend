import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, IndianRupee, MapPin, ChefHat } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/details/${restaurant._id}`}>
      <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-orange-100 hover:border-orange-200">
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden">
          <img
            src={restaurant.images[0] || "https://via.placeholder.com/260x160"}
            alt={restaurant.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-sm font-semibold text-gray-800">
              {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
            </span>
          </div>

          {/* Food Type Badge */}
          <div className="absolute top-4 left-4 bg-orange-600/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1">
            <ChefHat className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">{restaurant.foodType}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Restaurant Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 truncate group-hover:text-orange-600 transition-colors duration-300">
            {restaurant.name}
          </h3>

          {/* Info Grid */}
          <div className="space-y-3">
            {/* Opening Hours */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-700">
                  {restaurant.openingHours && restaurant.openingHours.length > 0 ? (
                    <div className="space-y-1">
                      {restaurant.openingHours.slice(0, 2).map(({ day, openingTime, closingTime, isClosed }) => {
                        const dayName = day ? day.charAt(0).toUpperCase() + day.slice(1) : "Unknown";
                        return (
                          <div key={day || Math.random()} className="flex justify-between">
                            <span className="font-medium text-gray-600">{dayName}</span>
                            <span className="text-gray-800">
                              {isClosed ? (
                                <span className="text-red-500 font-medium">Closed</span>
                              ) : (
                                `${openingTime} - ${closingTime}`
                              )}
                            </span>
                          </div>
                        );
                      })}
                      {restaurant.openingHours.length > 2 && (
                        <div className="text-xs text-orange-600 font-medium">
                          +{restaurant.openingHours.length - 2} more days
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-600">10 AM - 10 PM</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row - Min Order & Distance */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              {/* Min Order */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                  <IndianRupee className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">₹{restaurant.minOrderAmount}</span>
                  <span className="text-gray-500 ml-1">min</span>
                </span>
              </div>

              {/* Distance */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                  <MapPin className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {restaurant.distance ? `${(restaurant.distance / 1000).toFixed(1)} km` : "Nearby"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-200 transition-colors duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default RestaurantCard;