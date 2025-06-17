import React, { useState, useEffect } from "react";
import { Heart, Truck, Tag, Clock, Star } from "lucide-react";
import burger from "../../assets/burger.png";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import apiClient from "../../apis/apiClient/apiClient";

function RestaurantDetailscard({ restaurant }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  // Check initial favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user?._id) {
        setIsFavorite(false);
        return;
      }
      
      try {
        const response = await apiClient.get('/user/fav/restaurants');
        const isFav = response.data.data.some(
          fav => fav._id.toString() === restaurant._id.toString()
        );
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorites:", error);
        toast.error("Failed to load favorites");
      }
    };

    checkFavoriteStatus();
  }, [user, restaurant._id]);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user?._id) {
      toast.info("Please login to add favorites");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
    await apiClient.put('/user/fav/restaurants/remove', { restaurantId: restaurant._id })
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        await apiClient.post('/user/fav/restaurants', {
          restaurantId: restaurant._id
        });
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      const errorMsg = error.response?.data?.message || "Failed to update favorites";
      toast.error(errorMsg);
      // Revert UI state if error occurs
      setIsFavorite(prev => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  const formatOffer = (offer) => {
    if (!offer) return null;
    
    switch (offer.type) {
      case "percentage":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              {offer.discountValue}% OFF up to ₹{offer.maxDiscount} on orders above ₹{offer.minOrderValue}
            </div>
          </>
        );
      case "flat":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              Flat ₹{offer.discountValue} OFF on orders above ₹{offer.minOrderValue}
            </div>
          </>
        );
      default:
        return <div className="font-medium">{offer.title}</div>;
    }
  };

  const getDeliveryTime = () => {
    if (restaurant.deliveryTime) {
      return restaurant.deliveryTime;
    }
    // Default delivery time range based on distance or other factors
    return "20-25 min";
  };

  const getOpeningHours = () => {
    if (restaurant.openingHours) {
      return restaurant.openingHours;
    }
    // Default opening hours
    return "Open until 11:00 PM";
  };

  return (
    <div className="relative w-full h-[22rem] overflow-hidden shadow-lg rounded-xl mt-[5.5em]">
      {/* Background Image */}
      <img
        src={restaurant.images?.[0] || burger}
        alt={restaurant.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = burger;
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
        {/* Favorite button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isLoading}
          className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
            isFavorite 
              ? 'bg-orange-500 text-white shadow-orange-500/50 hover:bg-orange-600' 
              : 'bg-white text-gray-700 hover:bg-orange-50'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoading ? (
            <span className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          )}
        </button>

        {/* Restaurant name */}
        <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{restaurant.name}</h1>

        {/* Offers Section */}
        {restaurant.offers?.length > 0 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {restaurant.offers.map((offer) => (
              <div 
                key={offer._id || offer.title}
                className="flex-shrink-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-orange-300" />
                <div className="min-w-0">
                  {formatOffer(offer)}
                  {offer.description && (
                    <p className="text-xs text-white/80 truncate">
                      {offer.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="bg-orange-500/90 border border-orange-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-orange-600 transition flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Delivery in {getDeliveryTime()}</span>
          </button>
          <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition">
            Min Order ₹{restaurant.minOrderAmount || 100}
          </button>
        </div>
        
        {/* Opening hours */}
        {/* <p className="text-sm text-orange-100">
          {getOpeningHours()}
        </p> */}

        {/* Rating card */}
        {/* <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-3 text-black text-center hidden md:block">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-orange-500 text-xl font-bold">
              {restaurant.rating?.toFixed(1) || "New"}
            </span>
            <Star className="w-4 h-4 text-orange-500 fill-current" />
          </div>
          <h4 className="text-xs text-gray-600 font-medium">1,360 reviews</h4>
        </div> */}
      </div>
    </div>
  );
}

export default RestaurantDetailscard;