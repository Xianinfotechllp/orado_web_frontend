import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRestaurantsByLocationAndCategory } from "../../apis/restaurantApi";
import { useSelector } from "react-redux";
import RestaurantCard from "./RestaurantCard";
import { ChefHat, MapPin, Star, Clock } from "lucide-react";
import Navbar from "../layout/Navbar";

function CategoryRestaurants() {
  const { categoryName } = useParams();
  const [restaurants, setRestaurants] = useState([]);
  const selectedLocation = useSelector(state => state.location.location);

  useEffect(() => {
    const fetch = async () => {
      if (!selectedLocation) return;
      const { lat, lon } = selectedLocation;
      const data = await getRestaurantsByLocationAndCategory(lat, lon, categoryName);
      setRestaurants(data.data);
    };
    fetch();
  }, [categoryName, selectedLocation]);

  return (
    <>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-br mt-18 from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-orange-500 bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {categoryName} Restaurants
              </h1>
              <p className="text-orange-100 text-lg">
                Discover the best {categoryName.toLowerCase()} restaurants in your area
              </p>
            </div>
          </div>
          
          {selectedLocation && (
            <div className="flex items-center space-x-2 text-orange-100">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">
                Showing results for your location
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-2xl font-bold text-orange-600">{restaurants.length}</span>
                <span className="text-sm">Restaurants Found</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Star className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Top Rated Options</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {restaurants.length > 0 ? (
          <>
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Available Restaurants
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"></div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map(r => (
                <div key={r._id} className="transform hover:scale-100 transition-all duration-300 hover:shadow-xl">
                  <RestaurantCard restaurant={r} />
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-orange-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Restaurants Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We couldn't find any {categoryName.toLowerCase()} restaurants in your area. 
              Try selecting a different location or browse other categories.
            </p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 shadow-lg hover:shadow-xl">
              Browse All Categories
            </button>
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400"></div>
    </div>
    </>
  );
}

export default CategoryRestaurants;