import React, { useEffect, useState } from "react";
import Menucard from "./Menucard";
import { addToCart, getCart } from "../../apis/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { setCart, addItem } from "../../slices/cartSlice";
import { ChefHat, Clock, Star, TrendingUp, Filter, X } from "lucide-react";

function CategorySection({ category, restaurantId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartFromRedux = useSelector((state) => state.cart.products);

  const [cartItems, setCartItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [categoryStats, setCategoryStats] = useState({
    totalItems: 0,
    avgRating: 0,
    popularItems: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "default",
    dietary: "all",
    priceRange: "all",
    rating: "all"
  });

 const getProductQuantity = (productId) => {
  if (cartItems[productId] !== undefined) {
    return cartItems[productId];
  }

  if (!Array.isArray(cartFromRedux)) return 0;

  const item = cartFromRedux.find(item => {
    const id = item.product?._id || item.productId?._id;
    return id === productId;
  });
  
  return item ? item.quantity : 0;
};
  // Calculate category statistics
  useEffect(() => {
    if (category?.items) {
      const totalItems = category.items.length;
      const avgRating = category.items.reduce((acc, item) => acc + (item.rating || 4.2), 0) / totalItems;
      const popularItems = category.items.filter(item => item.isPopular || item.orderCount > 50).length;

      setCategoryStats({
        totalItems,
        avgRating: avgRating.toFixed(1),
        popularItems
      });
    }
  }, [category]);

  // Sync local cartItems state with Redux cart items
  useEffect(() => {
    const cartMap = {};
    if (cartFromRedux && cartFromRedux.length > 0) {
      cartFromRedux.forEach(item => {
        const productId = item.product?._id || item.productId?._id;
        if (productId) {
          cartMap[productId] = item.quantity;
        }
      });
    }
    setCartItems(cartMap);
  }, [cartFromRedux]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const res = await getCart();
        console.log("getCart response:", res);

        if (res?._id) {
          dispatch(setCart(res));
        }
      } catch (error) {
        console.error("Failed to fetch cart", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, dispatch]);

  const handleAddCart = async (item, quantity) => {
    try {
      const userId = user._id;
      console.log(item)

      // Local optimistic UI update
      setCartItems((prev) => ({
        ...prev,
        [item._id]: quantity,
      }));
      // dispatch(addItem({ product: item, quantity }));

      // Update backend
      const res = await addToCart(restaurantId, item._id, quantity);
      console.log(res.cart)

      if (res?._id) {
        dispatch(setCart(res.cart));
      }
    } catch (error) {
      console.error("Failed to update cart", error);
      // Revert UI state on error
    }
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase();
    if (name?.includes('dessert') || name?.includes('sweet')) return '🍰';
    if (name?.includes('drink') || name?.includes('beverage')) return '🥤';
    if (name?.includes('main') || name?.includes('curry')) return '🍛';
    if (name?.includes('starter') || name?.includes('appetizer')) return '🥗';
    if (name?.includes('bread') || name?.includes('naan')) return '🥖';
    return '🍽️';
  };

  const applyFilters = () => {
    let filteredItems = [...category.items];

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filteredItems.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredItems.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        filteredItems.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      default:
        // Default sorting (as per original order)
        break;
    }

    // Apply dietary filters
    if (filters.dietary !== "all") {
      filteredItems = filteredItems.filter(item => {
        if (filters.dietary === "veg") return item.isVeg;
        if (filters.dietary === "nonveg") return !item.isVeg;
        return true;
      });
    }

    // Apply price range filters
    if (filters.priceRange !== "all") {
      filteredItems = filteredItems.filter(item => {
        const price = item.price;
        if (filters.priceRange === "under500") return price < 500;
        if (filters.priceRange === "500-1000") return price >= 500 && price <= 1000;
        if (filters.priceRange === "over1000") return price > 1000;
        return true;
      });
    }

    // Apply rating filters
    if (filters.rating !== "all") {
      filteredItems = filteredItems.filter(item => {
        const rating = item.rating || 0;
        if (filters.rating === "4+") return rating >= 4;
        if (filters.rating === "3+") return rating >= 3;
        return true;
      });
    }

    return filteredItems;
  };

  const filteredItems = category?.items ? applyFilters() : [];

  if (isLoading) {
    return (
      <div className="my-8 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="my-12 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(category.categoryName)}</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {category.categoryName}
              </h2>
              {/* <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {category.description}
              </p> */}
            </div>
          </div>
        </div>

        {/* Category Stats and Filter Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-700">
              <ChefHat className="w-5 h-5 text-orange-500" />
              <span className="font-medium">{categoryStats.totalItems} Items</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{categoryStats.avgRating} Rating</span>
            </div>

            {categoryStats.popularItems > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-medium">{categoryStats.popularItems} Popular</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">15-25 min</span>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200 shadow-sm"
          >
            {showFilters ? (
              <>
                <X className="w-5 h-5" />
                <span>Hide Filters</span>
              </>
            ) : (
              <>
                <Filter className="w-5 h-5" />
                <span>Filter & Sort</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="popular">Popularity</option>
                </select>
              </div>

              {/* Dietary Preference */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary</label>
                <select
                  value={filters.dietary}
                  onChange={(e) => setFilters({ ...filters, dietary: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Items</option>
                  <option value="veg">Vegetarian</option>
                  <option value="nonveg">Non-Vegetarian</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="over1000">Over ₹1000</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Ratings</option>
                  <option value="4+">4+ Stars</option>
                  <option value="3+">3+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="relative">
        {filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item._id}
                  className="h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <Menucard
                    item={item}
                    onQuantityChange={handleAddCart}
                    quantity={getProductQuantity(item._id)}
                  />
                </div>
              ))}
            </div>

            {/* Show More Button for large categories */}
            {filteredItems.length > 8 && (
              <div className="flex justify-center mt-10">
                <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  <span>View All {category.categoryName}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ChefHat className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No items match your filters
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your filters to see more items
            </p>
            <button
              onClick={() => setFilters({
                sortBy: "default",
                dietary: "all",
                priceRange: "all",
                rating: "all"
              })}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default CategorySection;