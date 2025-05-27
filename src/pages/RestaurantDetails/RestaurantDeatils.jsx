import React from "react";
import Navbar from "../../components/layout/Navbar";
import RestaurantDetailscard from "../../components/restaurantDetails/RestaurantDetailscard";

function RestaurantDeatils() {

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
    "Orbit®"
  ];
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
      <div className="flex items-center justify-between px-10 py-4">
        <p className="text-xl font-bold">
          {" "}
          All Offers from McDonald’s East America{" "}
        </p>
        <input
          type="text"
          placeholder="Search from menu..."
          className=" pl-4 pr-10 py-2 border-black border outline-none rounded-2xl "
        />
      </div>

    <div className="bg-[#EA4424] w-full flex flex-row gap-2 justify-center  overflow-x-auto whitespace-nowrap px-2 py-4  ">
 {categories.map((category, index) => (
          <button
            key={index}
            className="text-white  font-bold py-2 px-6 rounded-full whitespace-nowrap hover:bg-black hover:text-[#EA4424] transition"
          >
            {category}
          </button> 
        ))}
          
        
    </div>


    </div>
  );
}

export default RestaurantDeatils;
