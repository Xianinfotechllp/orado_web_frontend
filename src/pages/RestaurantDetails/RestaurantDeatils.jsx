import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import RestaurantDetailscard from "../../components/restaurantDetails/RestaurantDetailscard";
import CategorySection from "../../components/restaurantDetails/CategorySection";
import { getRestaurantById, getRestaurantMenu } from "../../apis/restaurantApi";
import RestaurantReviews from "../../components/home/RestaurantReview";
import { Star, MessageSquare, X } from "lucide-react";
import RestaurantMenuSidebar from "../../components/restaurantDetails/MenuSidebar";
import MyBasket from "../../components/addToCart/MyBasket";

function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantRes = await getRestaurantById(restaurantId);
        setRestaurant(restaurantRes.data);
        const menuRes = await getRestaurantMenu(restaurantId);
        setMenu(menuRes.data);
      } catch (error) {
        console.error("Error fetching restaurant details or menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, [restaurantId]);

  const filteredMenu = menu?.filter(category => {
    const matchesSearch = category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return selectedCategory 
      ? category.categoryId === selectedCategory && matchesSearch
      : matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Restaurant Card */}
      {restaurant ? (
        <div className="relative">
          <RestaurantDetailscard restaurant={restaurant} />
          <button
            onClick={() => setShowReviews(true)}
            className="absolute right-4 bottom-4 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <MessageSquare size={18} />
            <span>View Reviews</span>
          </button>
        </div>
      ) : (
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <p className="text-center py-10 text-lg font-semibold">Loading restaurant details...</p>
        </div>
      )}

      {/* Reviews Modal - Fixed */}
      {showReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bgOp backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-semibold">Customer Reviews</h3>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
              <RestaurantReviews restaurantId={restaurantId} />
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowReviews(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Floating Menu Sidebar */}
        <div className="hidden lg:flex flex-col w-80 bg-white border-r border-gray-200 shadow-md sticky top-16 h-[calc(100vh-64px)] pt-5">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-orange-600">Menu</h2>
            <p className="text-sm text-gray-500">Browse delicious items</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <RestaurantMenuSidebar restaurantId={restaurantId} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-0">
          {/* Sticky Search and Categories Section */}
          <div className=" z-10 bg-white shadow-sm pt-5">
            <div className="px-4 md:px-8 py-4">
              <div className="flex items-center justify-between max-md:flex-col gap-3">
                <h2 className="text-2xl font-bold text-gray-800 max-md:mb-2">
                  {restaurant?.name ? `Menu from ${restaurant.name}` : "Restaurant Menu"}
                </h2>
                <div className="relative w-full md:w-1/3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menu items..."
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 outline-none rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Categories Tabs */}
            <div className="bg-gradient-to-r bg-orange-600  w-full flex flex-row gap-3 overflow-x-auto whitespace-nowrap px-4 py-4 scrollbar-hide">
              {menu?.length > 0 ? (
                <>
                  <button
                    key="all"
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full font-semibold text-sm px-6 py-3 transition-all duration-200 border-2 border-white ${
                      !selectedCategory
                        ? "bg-white text-orange-600 shadow-lg transform scale-105"
                        : "bg-transparent text-white hover:bg-white hover:text-orange-600"
                    }`}
                  >
                    All Items
                  </button>
                  {menu.map((category) => (
                    <button
                      key={category.categoryId}
                      onClick={() => setSelectedCategory(category.categoryId)}
                      className={`rounded-full font-semibold text-sm px-6 py-3 transition-all duration-200 border-2 border-white ${
                        selectedCategory === category.categoryId
                          ? "bg-white text-orange-600 shadow-lg transform scale-105"
                          : "bg-transparent text-white hover:bg-white hover:text-orange-600"
                      }`}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </>
              ) : (
                !loading && (
                  <button className="text-white font-bold py-3 px-6 rounded-full whitespace-nowrap bgOp">
                    No Categories Available
                  </button>
                )
              )}
            </div>
          </div>   

          {/* Menu Content */}
          <div className="px-4 md:px-8 py-6 bg-gray-50">
            {loading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-lg p-6 shadow-sm">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-32 bg-gray-100 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMenu?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery 
                      ? `No items found for "${searchQuery}"`
                      : "No menu available for this restaurant."}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? "Try searching for something else or browse all categories."
                      : "Please check back later for menu updates."}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredMenu.map((category) => (
                  <div key={category.categoryId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <CategorySection 
                      category={category} 
                      restaurantId={restaurantId}
                      highlight={searchQuery}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

       {/* Floating Cart Sidebar */}
        <div className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200 shadow-md sticky top-16 h-[calc(100vh-64px)] pt-5">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-orange-600">My Basket</h2>
            <p className="text-sm text-gray-500">Review your selections</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <MyBasket useWallet={useWallet} setUseWallet={setUseWallet} />
          </div>
        </div>

        {/* Mobile Cart - Bottom Sheet */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
          {/* Collapsed View */}
          {!isMobileCartOpen && (
            <div className="bg-orange-600 text-white px-6 py-4 rounded-t-xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
                <h3 className="font-semibold">View Basket</h3>
              </div>
              <button 
                onClick={() => setIsMobileCartOpen(true)} 
                className="text-sm bg-white text-orange-600 font-bold px-4 py-1 rounded-full shadow hover:bg-orange-100"
              >
                Open
              </button>
            </div>
          )}

          {/* Expanded Cart */}
          <div className={`
            transition-transform duration-300 ease-in-out 
            bg-white shadow-2xl rounded-t-2xl overflow-hidden
            max-h-[80vh] 
            ${isMobileCartOpen ? 'translate-y-0' : 'translate-y-full'}
            fixed bottom-0 left-0 right-0 z-50
          `}>
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
                <h3 className="font-semibold">My Basket</h3>
              </div>
              <button 
                onClick={() => setIsMobileCartOpen(false)} 
                className="text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Cart Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <MyBasket useWallet={useWallet} setUseWallet={setUseWallet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
