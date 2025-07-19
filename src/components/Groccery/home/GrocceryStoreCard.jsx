import React, { useEffect, useState } from "react";
import { Heart, ShoppingBasket, Clock, Star, Truck } from "lucide-react";
import groceryPlaceholder from "../../../assets/grocery-placeholder.jpg"; 
import { getNearbyGroceryStores } from "../../../apis/storeApi";

function GroceryStoreCard({ store }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    setTimeout(() => {
      setIsFavorite(!isFavorite);
      setIsLoading(false);
    }, 300);
  };

  const formatOffer = (offer) => {
    if (!offer) return null;
    
    switch (offer.type) {
      case "percentage":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              {offer.discountValue}% OFF up to ₹{offer.maxDiscount}
            </div>
          </>
        );
      case "flat":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              Flat ₹{offer.discountValue} OFF
            </div>
          </>
        );
      default:
        return <div className="font-medium">{offer.title}</div>;
    }
  };

  return (
    <div className="relative w-full h-[22rem] overflow-hidden shadow-lg rounded-xl">
      {/* Background Image */}
      <img
        src={store.images?.[0] || groceryPlaceholder}
        alt={store.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = groceryPlaceholder;
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

        {/* Store name */}
        <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{store.name}</h1>

        {/* Address */}
        {store.address && (
          <div className="text-sm mb-2">
            {store.address.street && <div>{store.address.street}</div>}
            {store.address.city && store.address.state && (
              <div>{store.address.city}, {store.address.state}</div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button className="bg-orange-500/90 border border-orange-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-orange-600 transition flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Delivery in 20-30 min</span>
          </button>
          {store.minOrderAmount && (
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition">
              Min Order ₹{store.minOrderAmount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GroceryStoresSection() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const latitude = 9.92;
        const longitude = 76.25;

        const res = await getNearbyGroceryStores({
          latitude,
          longitude,
        });

        console.log("Fetched grocery stores:", res.data);
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching nearby stores:", err);
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Loading Grocery Stores...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[22rem] bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Grocery Stores</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Grocery Stores</h2>
        <div className="text-gray-500">No grocery stores available in your area.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Grocery Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map(store => (
          <GroceryStoreCard key={store._id} store={store} />
        ))}
      </div>
    </div>
  );
}

export default GroceryStoresSection;