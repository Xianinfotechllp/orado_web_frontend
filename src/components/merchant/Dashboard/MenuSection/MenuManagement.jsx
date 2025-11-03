import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Settings,
  Grid,
  Eye,
  Edit3
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { getMerchantRestaurants } from '../../../../apis/restaurantApi';
import { useNavigate } from 'react-router-dom';
const MerchantRestaurantSelector = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const user = useSelector((state) => state.auth.user);


  const navigate = useNavigate()
  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    // setTimeout(() => {
    //   setRestaurants([
    //     {
    //       id: 1,
    //       name: "Spice Garden Restaurant",
    //       status: "approved",
    //       cuisines: ["Indian", "Chinese"],
    //       address: "MG Road, Bangalore",
    //       totalMenuItems: 45,
    //       totalCategories: 8,
    //       lastUpdated: "2 days ago",
    //       isActive: true
    //     },
    //     {
    //       id: 2,
    //       name: "Pizza Corner",
    //       status: "approved",
    //       cuisines: ["Italian", "Fast Food"],
    //       address: "Brigade Road, Bangalore",
    //       totalMenuItems: 32,
    //       totalCategories: 5,
    //       lastUpdated: "1 week ago",
    //       isActive: true
    //     },
    //     {
    //       id: 3,
    //       name: "Cafe Delight",
    //       status: "pending",
    //       cuisines: ["Continental", "Beverages"],
    //       address: "Koramangala, Bangalore",
    //       totalMenuItems: 28,
    //       totalCategories: 6,
    //       lastUpdated: "3 days ago",
    //       isActive: false
    //     }
    //   ]);
    //   setLoading(false);
    // }, 1000);




    const fetchRestaurants = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await getMerchantRestaurants(user.id);
        console.log("API Response:", response.data.restaurants);
        setRestaurants(response.data.restaurants);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load restaurants');
      } finally {
        setLoading(false); 
      }
    };

    fetchRestaurants();


  }, [user]);

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisines?.some(cuisine =>
        cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active') return matchesSearch && restaurant.status === 'approved';
    if (selectedFilter === 'inactive') return matchesSearch && restaurant.status !== 'approved';
    
    return matchesSearch;
  });

  const handleRestaurantClick = restaurantId => {
    console.log(`Navigate to restaurant ${restaurantId} menu management`);
    navigate(`/merchant/dashboard/menu/${restaurantId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to load restaurants</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Management</h1>
              <p className="text-gray-600">
                Manage menu categories and items for your restaurants
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setSelectedFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === 'inactive'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Grid className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{restaurants.length}</h3>
                <p className="text-gray-600">Total Restaurants</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {restaurants.filter(r => r.status === 'approved').length}
                </h3>
                <p className="text-gray-600">Active Restaurants</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {restaurants.filter(r => r.status === 'pending').length}
                </h3>
                <p className="text-gray-600">Pending Approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try searching with different keywords' : 'Add your first restaurant to get started'}
            </p>
            {!searchTerm && (
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
                <Plus className="h-5 w-5 mr-2" />
                Add Restaurant
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                       <span className="text-sm text-gray-600 truncate">
  {[
    restaurant?.address?.street,
    restaurant?.address?.city,
    restaurant?.address?.state,
    restaurant?.address?.zip,
  ]
    .filter(Boolean) 
    .join(", ")}
</span>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      {restaurant.status === "approved" ? (
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </div>
                      ) : (
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Cuisines */}
                  {/* <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {restaurant.cuisines?.slice(0, 3).map(cuisine => (
                        <span
                          key={cuisine}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {cuisine}
                        </span>
                      ))}
                      {restaurant.cuisines?.length > 3 && (
                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                          +{restaurant.cuisines.length - 3}
                        </span>
                      )}
                    </div>
                  </div> */}
                  
                  {/* Menu Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{restaurant.totalCategories}</div>
                      <div className="text-xs text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{restaurant.totalMenuItems}</div>
                      <div className="text-xs text-gray-600">Menu Items</div>
                    </div>
                  </div>
                  
                  {/* Last Updated */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Updated {restaurant.lastUpdated}</span>
                    <ChevronRight className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestaurantClick(restaurant.id);
                      }}
                      className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center text-sm"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit Menu
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('View restaurant details');
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantRestaurantSelector;