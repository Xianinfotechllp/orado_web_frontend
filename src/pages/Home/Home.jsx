import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import HomeOrange from "../../assets/HomeOrange.png";
import homeGirlimage from "../../assets/homeGirl.png";
import RestaurantCard from "../../components/home/RestaurantCard";
import { getRecommendedRestaurants, getRestaurantsByLocationAndCategory } from "../../apis/restaurantApi";
import { useSelector } from "react-redux";
import FoodCategoryCard from "../../components/home/FoodCategoryCard";
import { foodCategories } from "../../components/home/constants"; 
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, Star } from "lucide-react";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [categoryRestaurants, setCategoryRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const selectedLocation = useSelector((state) => state.location.location);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!selectedLocation) return;

      try {
        const { lat, lon } = selectedLocation;
        const data = await getRecommendedRestaurants(lat, lon);
        setRestaurants(data.data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [selectedLocation]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/category/${category.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden mt-2">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-30 -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-20 translate-y-20 -translate-x-10"></div>
        
        <div className="container mx-auto px-6 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Lightning Fast Delivery
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  Deliver Your <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                    Delicious Food
                  </span> at <br />
                  <span className="text-orange-600">Lightning Speed</span>
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-600 max-w-2xl leading-relaxed">
                  Our job is to satisfy your hunger with delicious food and fast, free delivery. 
                  Experience culinary excellence delivered right to your doorstep.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {/* <button className="border-2 border-orange-200 text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all duration-300">
                  Learn More
                </button> */}
              </div>
              
              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Restaurant Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">25 min</div>
                  <div className="text-sm text-gray-600">Avg Delivery</div>
                </div>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="flex-1 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="relative">
                  <img
                    src={HomeOrange}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-contain z-0 opacity-80"
                  />
                  <img
                    src={homeGirlimage}
                    alt="Delicious Food Delivery"
                    className="relative z-10 w-full h-auto object-contain filter drop-shadow-2xl"
                  />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-0 right-0 bg-white rounded-2xl p-4 shadow-lg animate-bounce">
                  <div className="hidden lg:flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-sm font-semibold">15 min delivery</span>
                  </div>
                </div>
                
                <div className="absolute bottom-12 left-8 bg-white rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">4.8 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What's on your mind?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-7 gap-6 justify-items-center">
            {foodCategories.map(category => (
              <div key={category.id} className="transform hover:scale-110 transition-all duration-300">
                <FoodCategoryCard
                  category={category}
                  onClick={handleCategoryClick}
                />
              </div>
            ))}
          </div>
          
          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto gap-6 pb-4 px-2 scrollbar-hide snap-x snap-mandatory">
              {foodCategories.map(category => (
                <div key={category.id} className="flex-shrink-0 snap-center">
                  <FoodCategoryCard
                    category={category}
                    onClick={handleCategoryClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category-specific Restaurants */}
      {selectedCategory && categoryRestaurants.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-white py-12 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedCategory.name} Restaurants
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoryRestaurants.map(restaurant => (
                <div key={restaurant._id} className="transform hover:scale-105 transition-all duration-300">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popular Restaurants Section */}
      <div className="bg-white py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Restaurants
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the most loved restaurants in your area, carefully selected for quality and taste
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mt-4"></div>
          </div>

          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="transform hover:scale-105 transition-all duration-300">
                  <RestaurantCard restaurant={restaurant} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-orange-100 rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Star className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No restaurants available
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We're working hard to bring amazing restaurants to your location. 
                Check back soon for delicious options!
              </p>
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300">
                Notify Me
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-red-500"></div>
    </div>
  );
}

export default Home;