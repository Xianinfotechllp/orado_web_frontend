import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, Clock, Star, MapPin, TrendingUp, Coffee, Pizza, Utensils, Loader } from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import { useSelector } from 'react-redux';
import { getRestaurantsBySearchQuery, getNearbyCategories } from '../../apis/restaurantApi';
import useDebounce from '../../hooks/useDebounce';

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
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const location = useSelector((state) => state.location.location);

  const popularSearches = [
    { icon: Pizza, text: 'Pizza', color: 'bg-red-100 text-red-600' },
    { icon: Coffee, text: 'Coffee', color: 'bg-amber-100 text-amber-600' },
    { icon: Utensils, text: 'Biryani', color: 'bg-orange-100 text-orange-600' },
    { icon: Pizza, text: 'Burger', color: 'bg-yellow-100 text-yellow-600' },
  ];

  // Fetch nearby categories when location changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!location?.lat || !location?.lon) return;
      
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const response = await getNearbyCategories({
          latitude: location.lat,
          longitude: location.lon,
          distance: 5000 // 5km radius
        });
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching nearby categories:", error);
        setCategoriesError("Failed to load categories. Please try again.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [location]);

  // Memoized filtered restaurants
  const filteredRestaurants = useMemo(() => {
    if (activeFilter === 'all') return restaurants;
    
    return restaurants.filter(restaurant => {
      switch (activeFilter) {
        case 'indian':
          return restaurant.foodType?.toLowerCase().includes('indian');
        case 'italian':
          return restaurant.foodType?.toLowerCase().includes('italian');
        case 'chinese':
          return restaurant.foodType?.toLowerCase().includes('chinese');
        case 'fast-food':
          return ['burger', 'pizza', 'sandwich', 'fries'].some(item => 
            restaurant.foodType?.toLowerCase().includes(item)
          );
        default:
          return true;
      }
    });
  }, [restaurants, activeFilter]);

  // Memoized sorted restaurants
  const sortedRestaurants = useMemo(() => {
    return [...filteredRestaurants].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance - b.distance;
        case 'delivery-time':
          return a.deliveryTime - b.deliveryTime;
        case 'cost-low':
          return a.priceRange - b.priceRange;
        case 'cost-high':
          return b.priceRange - a.priceRange;
        default:
          return 0; // relevance - keep original order
      }
    });
  }, [filteredRestaurants, sortBy]);

  useEffect(() => {
    if (locationState?.searchResults) {
      setRestaurants(locationState.searchResults.data || []);
      setSearchQuery(locationState.searchQuery || '');
    } else if (searchQuery) {
      handleSearch();
    }
  }, [locationState, searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery === searchQuery) {
      handleSearch();
    }
  }, [debouncedSearchQuery]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!location?.lat || !location?.lon) {
      setShowLocationWarning(true);
      return;
    }

    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        const results = await getRestaurantsBySearchQuery({
          query: searchQuery.trim(),
          latitude: location?.lat || 0,
          longitude: location?.lon || 0,
          radius: 5000,
          page: 1,
          limit: 20
        });
        
        setRestaurants(results.data || []);
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
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

  const filterOptions = useMemo(() => [
    { id: 'all', label: 'All', count: restaurants.length },
    { id: 'indian', label: 'Indian', count: restaurants.filter(r => 
      r.foodType?.toLowerCase().includes('indian')).length 
    },
    { id: 'italian', label: 'Italian', count: restaurants.filter(r => 
      r.foodType?.toLowerCase().includes('italian')).length 
    },
    { id: 'chinese', label: 'Chinese', count: restaurants.filter(r => 
      r.foodType?.toLowerCase().includes('chinese')).length 
    },
    { id: 'fast-food', label: 'Fast Food', count: restaurants.filter(r => 
      ['burger', 'pizza', 'sandwich', 'fries'].some(item => 
        r.foodType?.toLowerCase().includes(item)
      )
    ).length },
  ], [restaurants]);

  // Render category buttons
  const renderCategories = () => {
    if (isLoadingCategories) {
      return [...Array(6)].map((_, index) => (
        <div key={index} className="p-6 rounded-2xl border-2 bg-gray-100 border-gray-200 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      ));
    }

    if (categoriesError) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-red-500 mb-2">{categoriesError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
          >
            Retry
          </button>
        </div>
      );
    }

    if (categories.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">No categories found in your area</p>
        </div>
      );
    }

    return categories.map((category) => (
      <button
        key={category._id}
        onClick={() => setSearchQuery(category.name)}
        className={`p-6 rounded-2xl border-2 bg-orange-50 border-orange-200 hover:scale-105 transition-all duration-200 text-center group`}
      >
        <div className="text-4xl mb-2">{category.icon || '🍽️'}</div>
        <div className="font-semibold text-gray-800 group-hover:text-orange-600">
          {category.name}
        </div>
        {category.restaurantCount && (
          <div className="text-xs text-gray-500 mt-1">
            {category.restaurantCount} restaurants
          </div>
        )}
      </button>
    ));
  };

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
                aria-label="Search for restaurants"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>
          </form>

          {showLocationWarning && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>Please select a location to see relevant results</span>
              </div>
              <button 
                onClick={() => setShowLocationWarning(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Popular Searches */}
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

          {/* Filters and Sort */}
          {searchQuery && restaurants.length > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                    } ${filter.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={filter.count === 0}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-medium text-gray-700 focus:border-orange-500 focus:outline-none"
                  aria-label="Sort by"
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
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-colors duration-200 ${
                    showFilters 
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-gray-200 text-gray-700 hover:border-orange-300 hover:text-orange-600'
                  }`}
                  aria-label="Toggle filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Search results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                Found {filteredRestaurants.length} restaurants {location?.name ? `near ${location.name.split(',')[0]}` : 'near you'}
              </p>
            </div>

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
              <>
                {sortedRestaurants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedRestaurants.map((restaurant) => (
                      <RestaurantCard 
                        key={restaurant._id} 
                        restaurant={restaurant} 
                        currentLocation={location}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-12 h-12 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No restaurants found
                    </h3>
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
            )}
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Explore by Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
              {renderCategories()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;