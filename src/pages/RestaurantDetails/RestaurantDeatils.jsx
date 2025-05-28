import React, { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import RestaurantDetailscard from "../../components/restaurantDetails/RestaurantDetailscard";
import CategorySection from "../../components/restaurantDetails/CategorySection";
import { getRestaurantMenu } from "../../apis/restaurantApi";

function RestaurantDeatils() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Offers",
    "Burgers",
    "Fries",
    "Snacks",
    "Salads",
    "Cold drinks",
    "Happy Meal®",
    "Desserts",
    "Hot drinks",
    "Sauces",
    "Orbit®",
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getRestaurantMenu("682c28a8e269347b428cd539");
        setMenu(response.data.menu); // assuming your API response structure is { menu: [...] }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <Navbar />

      <RestaurantDetailscard
        restaurant={{
          name: "Lorem Pesum’s East America",
          minOrderAmount: 250,
          openingHours: "10:00 AM - 11:00 PM",
        }}
      />

      <div className="flex items-center justify-between px-10 py-4 max-md:flex-col">
        <p className="text-xl font-bold max-md:mb-4">
          All Offers from McDonald’s East America
        </p>
        <input
          type="text"
          placeholder="Search from menu..."
          className="pl-4 pr-10 py-2 border-black border outline-none rounded-2xl"
        />
      </div>

      <div className="bg-[#EA4424] w-full flex flex-row gap-2 justify-center overflow-x-auto whitespace-nowrap px-2 py-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="text-white font-bold py-2 px-6 rounded-full whitespace-nowrap hover:bg-black hover:text-[#EA4424] transition"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <p className="text-center py-10 text-lg font-semibold">Loading menu...</p>
        ) : menu.length === 0 ? (
          <p className="text-center py-10 text-lg font-semibold">No menu available.</p>
        ) : (
          menu.map((category) => (
            <CategorySection key={category.categoryId} category={category} />
          ))
        )}
      </div>
    </div>
  );
}

export default RestaurantDeatils;
