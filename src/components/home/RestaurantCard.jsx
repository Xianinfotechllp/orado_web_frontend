import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, IndianRupee, MapPin, ChefHat, Tag } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  console.log("Restaurant Card Data:", restaurant);
  
  const isActive = restaurant.active !== false; // Default to true if active is undefined
  
  // Content of the card that will be reused
  const cardContent = (
    <div className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer border border-orange-100 hover:border-orange-200 ${!isActive ? 'grayscale opacity-70' : ''}`}>
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden">
        <img
          src={restaurant.images[0] || "https://via.placeholder.com/260x160"}
          alt={restaurant.name}
          className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ${!isActive ? 'filter grayscale' : ''}`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Inactive Overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <span className="text-sm font-semibold text-gray-800">Currently Closed</span>
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className={`absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg ${!isActive ? 'grayscale' : ''}`}>
          <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-semibold text-gray-800">
            {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
          </span>
        </div>

        {/* Food Type Badge */}
        <div className={`absolute top-4 left-4 bg-orange-600/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 ${!isActive ? 'grayscale' : ''}`}>
          <ChefHat className="w-3 h-3 text-white" />
          <span className="text-xs font-medium text-white">{restaurant.foodType}</span>
        </div>

        {restaurant.offers && restaurant.offers.length > 0 && (
          <div className={`absolute bottom-4 left-4 bg-green-600/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center space-x-1 shadow-lg ${!isActive ? 'grayscale' : ''}`}>
            <Tag className="w-3 h-3 text-white" />
            <span className="text-xs font-medium text-white">
              {restaurant.offers[0].title} {/* Display first offer */}
              {restaurant.offers.length > 1 && (
                <p>More offers</p>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Rest of your component remains the same */}
      <div className={`p-6 ${!isActive ? 'grayscale' : ''}`}>
        <h3 className={`text-xl font-bold text-gray-900 mb-3 truncate group-hover:text-orange-600 transition-colors duration-300 ${!isActive ? 'text-gray-500' : ''}`}>
          {restaurant.name}
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center ${!isActive ? 'bg-gray-100' : ''}`}>
              <Clock className={`w-4 h-4 ${!isActive ? 'text-gray-400' : 'text-orange-600'}`} />
            </div>
            <div className="flex-1 min-w-0">
              {/* Opening hours content */}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 bg-green-50 rounded-full flex items-center justify-center ${!isActive ? 'bg-gray-100' : ''}`}>
                <IndianRupee className={`w-3 h-3 ${!isActive ? 'text-gray-400' : 'text-green-600'}`} />
              </div>
              <span className={`text-sm ${!isActive ? 'text-gray-500' : 'text-gray-700'}`}>
                <span className="font-semibold">₹{restaurant.minOrderAmount}</span>
                <span className={`ml-1 ${!isActive ? 'text-gray-400' : 'text-gray-500'}`}>min</span>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center ${!isActive ? 'bg-gray-100' : ''}`}>
                <MapPin className={`w-3 h-3 ${!isActive ? 'text-gray-400' : 'text-blue-600'}`} />
              </div>
              <span className={`text-sm font-medium ${!isActive ? 'text-gray-500' : 'text-gray-700'}`}>
                {restaurant.distance ? `${(restaurant.distance / 1000).toFixed(1)} km` : "Nearby"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-200 transition-colors duration-300 pointer-events-none ${!isActive ? 'group-hover:border-gray-300' : ''}`}></div>
    </div>
  );

  return isActive ? (
    <Link to={`/restaurant/details/${restaurant._id}`}>
      {cardContent}
    </Link>
  ) : (
    <div className="cursor-not-allowed">
      {cardContent}
    </div>
  );
};

export default RestaurantCard;