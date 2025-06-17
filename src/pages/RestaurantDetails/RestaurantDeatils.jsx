import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import RestaurantDetailscard from "../../components/restaurantDetails/RestaurantDetailscard";
import CategorySection from "../../components/restaurantDetails/CategorySection";
import { getRestaurantById, getRestaurantMenu } from "../../apis/restaurantApi";
import RestaurantReviews from "../../components/home/RestaurantReview";
import { Star, MessageSquare, X } from "lucide-react"; // Import icons

function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        console.log("🍽️ Starting fetch for", restaurantId);

        // Fetch restaurant details first
        const restaurantRes = await getRestaurantById(restaurantId);
        console.log("✅ Fetched restaurant:", restaurantRes);
        setRestaurant(restaurantRes.data);

        // Then fetch menu data
        const menuRes = await getRestaurantMenu(restaurantId);
        console.log("✅ Fetched menu:", menuRes.data);
        setMenu(menuRes.data);

        // Select first category by default if available
        if (menuRes.data?.length > 0) {
          setSelectedCategory(menuRes.data[0].categoryId);
        }

      } catch (error) {
        console.error("❌ Error fetching restaurant details or menu:", error);
      } finally {
        console.log("🍴 Done fetching, setting loading false");
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  // Filter menu items based on search query
  const filteredMenu = menu?.filter(category => {
    const matchesSearch = category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // If a category is selected, only show that category if it matches search
    return selectedCategory 
      ? category.categoryId === selectedCategory && matchesSearch
      : matchesSearch;
  });

  return (
    <div className="pb-20">
      <Navbar />

      {/* Restaurant Card */}
      {restaurant ? (
        <div className="relative">
          <RestaurantDetailscard restaurant={restaurant} />
          {/* Add Reviews Button */}
          <button
            onClick={() => setShowReviews(true)}
            className="absolute right-4 bottom-4 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full shadow-md transition"
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

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 z-50 overflow-y-auto bgOp">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed" 
              aria-hidden="true"
              onClick={() => setShowReviews(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Customer Reviews
                  </h3>
                  <button
                    onClick={() => setShowReviews(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>
                <RestaurantReviews restaurantId={restaurantId} />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowReviews(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Categories Section */}
      <div className="sticky top-0 z-10 bg-white pt-4 pb-2 shadow-sm">
        {/* Search Bar */}
        <div className="flex items-center justify-between px-4 md:px-10 py-2 max-md:flex-col gap-3">
          <h2 className="text-xl font-bold max-md:mb-2">
            {restaurant?.name ? `Menu from ${restaurant.name}` : "Restaurant Menu"}
          </h2>
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 outline-none rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="bg-[#EA4424] w-full flex flex-row gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 scrollbar-hide">
          {menu?.length > 0 ? (
            <>
              <button
                key="all"
                onClick={() => setSelectedCategory(null)}
                className={`text-white font-bold py-2 px-4 rounded-full whitespace-nowrap transition ${
                  !selectedCategory ? 'bg-orange-700 text-[#fff]' : 'hover:bg-orange-700 hover:text-[#EA4424]'
                }`}
              >
                All Items
              </button>
              {menu.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => setSelectedCategory(category.categoryId)}
                  className={`text-white font-bold py-2 px-4 rounded-full whitespace-nowrap transition ${
                    selectedCategory === category.categoryId ? 'bg-orange-700 text-[#fff]' : 'hover:bg-orange-700 hover:text-[#EA4424]'
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </>
          ) : (
            !loading && (
              <button className="text-white font-bold py-2 px-6 rounded-full whitespace-nowrap bg-black">
                No Categories Available
              </button>
            )
          )}
        </div>
      </div>

      {/* Menu Content */}
      <div className="px-4 md:px-10 mx-auto">
        {loading ? (
          <div className="space-y-6 py-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-32 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredMenu?.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">
              {searchQuery 
                ? `No items found for "${searchQuery}"`
                : "No menu available for this restaurant."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          filteredMenu.map((category) => (
            <CategorySection 
              key={category.categoryId} 
              category={category} 
              restaurantId={restaurantId}
              highlight={searchQuery}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default RestaurantDetails;