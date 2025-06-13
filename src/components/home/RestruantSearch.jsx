import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, Clock, Star, MapPin, TrendingUp, Coffee, Pizza, Utensils } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import { useSelector } from 'react-redux';
import { getRestaurantsBySearchQuery } from '../../apis/restaurantApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const locationState = useLocation().state;
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  
  // Get current location from Redux store
  const location = useSelector((state) => state.location.location);
  console.log('Current location:', location);
  

  const popularSearches = [
    { icon: Pizza, text: 'Pizza', color: 'bg-red-100 text-red-600' },
    { icon: Coffee, text: 'Coffee', color: 'bg-amber-100 text-amber-600' },
    { icon: Utensils, text: 'Biryani', color: 'bg-orange-100 text-orange-600' },
    { icon: Pizza, text: 'Burger', color: 'bg-yellow-100 text-yellow-600' },
  ];

  useEffect(() => {
    // If coming from search submission with state data
    if (locationState?.searchResults) {
        setRestaurants(locationState.searchResults.data || []);
        setSearchQuery(locationState.searchQuery || '');
    } else if (searchQuery) {
        // If page refreshed or directly accessed with search query
        handleSearch();
    }
    }, [locationState, searchQuery]);

    const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
        setIsLoading(true);
        try {
        const results = await getRestaurantsBySearchQuery({
            query: searchQuery.trim(),
            latitude: location?.lat || 0,
            longitude: location?.lon || 0,
            radius: 5000,
            page: 1,
            limit: 10
        });
        console.log("Search results:", results);
        
        setRestaurants(results.data || []);
        } catch (error) {
        console.error("Error searching restaurants:", error);
        setRestaurants([]);
        } finally {
        setIsLoading(false);
        }
    }
    };

    const clearSearch = () => {
    setSearchQuery('');
    setRestaurants([]);
    navigate('/search');
    };
    console.log('restaurants:', restaurants);
    
    // Filter options with dynamic counts
    const filterOptions = [
    { id: 'all', label: 'All', count: restaurants.length },
    { id: 'indian', label: 'Indian', count: restaurants.filter(r => r.foodType?.toLowerCase() === 'indian').length },
    { id: 'italian', label: 'Italian', count: restaurants.filter(r => r.foodType?.toLowerCase() === 'italian').length },
    { id: 'chinese', label: 'Chinese', count: restaurants.filter(r => r.foodType?.toLowerCase() === 'chinese').length },
    { id: 'fast-food', label: 'Fast Food', count: restaurants.filter(r => r.foodType?.toLowerCase() === 'fast food').length },
    ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b border-orange-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-6">
            <div className="flex items-center bg-white border-2 border-orange-200 rounded-2xl px-6 py-4 shadow-lg focus-within:border-orange-500 transition-colors duration-300">
              <Search className="w-6 h-6 text-orange-600 mr-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, cuisines, or dishes..."
                className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>

          {/* Popular Searches - Show when no search query */}
          {!searchQuery && restaurants.length === 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">Popular Searches</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {popularSearches.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(item.text)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${item.color} hover:scale-105 transition-all duration-200 font-medium`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {item.text}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filters and Sort - Show when there's a search query */}
          {searchQuery && restaurants.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              {/* Sort and Advanced Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="delivery-time">Delivery Time</option>
                  <option value="cost-low">Cost: Low to High</option>
                  <option value="cost-high">Cost: High to Low</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors duration-200"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {searchQuery ? (
          <>
            {/* Results Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Search results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                Found {restaurants.length} restaurants near you
              </p>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Restaurant Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && restaurants.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No restaurants found</h3>
                <p className="text-gray-600 mb-6">
                  Try searching with different keywords or check the spelling
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        ) : (
          /* Default State - Popular Categories */
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Explore by Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {[
                { name: 'Pizza', icon: '🍕', color: 'bg-red-50 border-red-200' },
                { name: 'Burgers', icon: '🍔', color: 'bg-yellow-50 border-yellow-200' },
                { name: 'Chinese', icon: '🥡', color: 'bg-green-50 border-green-200' },
                { name: 'Indian', icon: '🍛', color: 'bg-orange-50 border-orange-200' },
                { name: 'Coffee', icon: '☕', color: 'bg-amber-50 border-amber-200' },
                { name: 'Desserts', icon: '🍰', color: 'bg-pink-50 border-pink-200' },
              ].map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(category.name)}
                  className={`p-6 rounded-2xl border-2 ${category.color} hover:scale-105 transition-all duration-200 text-center group`}
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-gray-800 group-hover:text-orange-600">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;