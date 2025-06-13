import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import RestaurantDetailscard from "../../components/restaurantDetails/RestaurantDetailscard";
import CategorySection from "../../components/restaurantDetails/CategorySection";
import { getRestaurantById, getRestaurantMenu } from "../../apis/restaurantApi";

function RestaurantDetails() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        console.log("🍽️ Starting fetch for", restaurantId);
        const restaurantRes = await getRestaurantById(restaurantId);
        console.log("✅ Fetched restaurant:", restaurantRes);
        setRestaurant(restaurantRes.data);

        const menuRes = await getRestaurantMenu(restaurantId);
        console.log("✅ Fetched menu:", menuRes.data);
        setMenu(menuRes.data);
      } catch (error) {
        console.error("❌ Error fetching restaurant details or menu:", error);
      } finally {
        console.log("🍴 Done fetching, setting loading false");
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  // Filter menu based on search query and selected category
  const filteredMenu = menu?.filter((category) => {
    // Filter by search query (category name or items)
    const matchesSearch = 
      category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Filter by selected category (if any)
    const matchesCategory = 
      !selectedCategory || 
      category.categoryName === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Navbar />

      {/* Restaurant Card */}
      {restaurant ? (
        <RestaurantDetailscard
          restaurant={
            restaurant || {
              name: "The Burger Hub",
              minOrderAmount: 150,
              openingHours: "10:00 AM - 11:00 PM",
              images: [],
              rating: 4.2,
              address: "123, MG Road, Delhi",
            }
          }
        />
      ) : (
        <p className="text-center py-10 text-lg font-semibold">Loading restaurant details...</p>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between px-10 py-4 max-md:flex-col">
        <p className="text-xl font-bold max-md:mb-4">
          All Offers from {restaurant?.name || "this restaurant"}
        </p>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedCategory(null); // Reset category filter when searching
          }}
          placeholder="Search from menu..."
          className="pl-4 pr-10 py-2 border-black border outline-none rounded-2xl"
        />
      </div>

      {/* Categories */}
      <div className="bg-[#EA4424] w-full flex flex-row gap-2 justify-center overflow-x-auto whitespace-nowrap px-2 py-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-white font-bold py-2 px-6 rounded-full whitespace-nowrap transition ${
            !selectedCategory ? "bg-black text-[#EA4424]" : "hover:bg-black hover:text-[#EA4424]"
          }`}
        >
          All Categories
        </button>
        
        {menu?.length > 0 ? menu.map((category, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedCategory(category.categoryName);
              setSearchQuery(""); // Reset search when selecting a category
            }}
            className={`text-white font-bold py-2 px-6 rounded-full whitespace-nowrap transition ${
              selectedCategory === category.categoryName 
                ? "bg-black text-[#EA4424]" 
                : "hover:bg-black hover:text-[#EA4424]"
            }`}
          >
            {category.categoryName}
          </button>
        )) : (
          <button className="text-white font-bold py-2 px-6 rounded-full whitespace-nowrap bg-black">
            No Categories
          </button>
        )}
      </div>

      {/* Menu */}
      <div className="px-4 mx-auto">
        {loading ? (
          <p className="text-center py-10 text-lg font-semibold">Loading menu...</p>
        ) : filteredMenu?.length === 0 ? (
          <p className="text-center py-10 text-lg font-semibold">
            No items found {searchQuery ? `for "${searchQuery}"` : ""} 
            {selectedCategory ? ` in ${selectedCategory}` : ""}.
          </p>
        ) : (
          filteredMenu.map((category) => (
            <div key={category.categoryId} className="flex flex-col justify-center items-center">
              <CategorySection 
                category={category} 
                restaurantId={restaurantId} 
                searchQuery={searchQuery} // Pass search query to highlight matches
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RestaurantDetails;