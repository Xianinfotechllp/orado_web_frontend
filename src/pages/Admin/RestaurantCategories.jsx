import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronRight, Star, Clock, Filter, Search } from 'lucide-react';

const RestaurantCategories = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    console.log(restaurantId)

    useEffect(() => {
        const fetchRestaurantAndCategories = async () => {
            try {
                setLoading(true);
                // Fetch restaurant details
                const restaurantRes = await axios.get(`http://localhost:5000/restaurant/${restaurantId}`);
                console.log(restaurantRes)
                
                setRestaurant(restaurantRes.data.restaurant);
                
                // Fetch categories
                const categoriesRes = await axios.get(`http://localhost:5000/admin/restaurant/${restaurantId}/category`);
                console.log(categoriesRes)
                setCategories(categoriesRes.data.categories || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch restaurant data');
                console.error('Error:', err);
                setLoading(false);
            }
        };

        fetchRestaurantAndCategories();
    }, [restaurantId]);

    const handleCategoryClick = (categoryId) => {
        navigate(`/restaurants/${restaurantId}/categories/${categoryId}/items`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p>Loading categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-orange-500"
                        >
                            &larr; Back
                        </button>
                        <div className="relative w-1/2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
                            />
                        </div>
                    </div>

                    {restaurant && (
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
                                <p className="text-sm text-gray-600">{restaurant.cuisines?.join(', ') || 'Multi-cuisine'}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                    <span>{restaurant.rating}</span>
                                </div>
                                <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                                    <span>{restaurant.deliveryTime}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Category Cards */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {filteredCategories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No categories found</h3>
                        <p className="text-gray-600 mb-4">Try searching with different keywords</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <div 
                                key={category._id} 
                                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleCategoryClick(category._id)}
                            >
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{category.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {category.description || `Browse all ${category.name} items`}
                                    </p>
                                    <div className="flex items-center text-orange-500 font-medium">
                                        <span>View items</span>
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RestaurantCategories;