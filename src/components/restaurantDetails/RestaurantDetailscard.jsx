import React, { useState } from "react";
import { Heart } from "lucide-react";
import burger from "../../assets/burger.png";

function RestaurantDetailscard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    console.log(`${isFavorite ? 'Removed from' : 'Added to'} favorites:`, restaurant.name);
  };

  return (
    <div className="relative w-full h-[22em] overflow-hidden shadow-lg rounded-xl mt-18">
      {/* Background Image */}
      <img
        src={restaurant.images ? restaurant.images[0] : burger}
        alt="Restaurant Banner"
        className="w-full h-full object-cover"
      />

      {/* Swiggy-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
        {/* Favorite button - Made more prominent */}
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
            isFavorite 
              ? 'bg-orange-500 text-white shadow-orange-500/50' 
              : 'bg-white text-gray-700 hover:bg-orange-50'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} 
          />
        </button>

        <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{restaurant.name}</h1>
        
        {/* Swiggy-style buttons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="bg-orange-500/90 border border-orange-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-orange-600 transition flex items-center gap-1">
            <span>Delivery in 20-25 min</span>
          </button>
          <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition">
            Min Order ₹{restaurant.minOrderAmount || 100}
          </button>
        </div>
        
        <p className="text-sm text-orange-100">Open until 3:00 AM</p>

        {/* Rating card */}
        {/* <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-3 text-black text-center hidden md:block">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-orange-500 text-xl font-bold">4.2</span>
            <span className="text-orange-500">★</span>
          </div>
          <h4 className="text-xs text-gray-600 font-medium">1,360 reviews</h4>
        </div> */}
      </div>
    </div>
  );
}

export default RestaurantDetailscard;