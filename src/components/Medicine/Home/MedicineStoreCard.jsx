import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Heart, Truck, Package } from "lucide-react";
import { getNearbyStores } from "../../../apis/storeApi";
import { Link } from "react-router-dom";

// Use your fallback
const pharmacyPlaceholder = "https://placehold.co/400x320/png?text=Pharmacy+Store";

function PharmacyStoreCard({ store }) {
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
    <Link to={`/pharmacy-store/${store._id}`} style={{ textDecoration: "none" }}>
      <div className="relative w-full h-[22rem] overflow-hidden shadow-lg rounded-xl">
        <img
          src={store.images?.[0] || store.image || pharmacyPlaceholder}
          alt={store.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = pharmacyPlaceholder;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={isLoading}
            className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
              isFavorite
                ? 'bg-blue-500 text-white shadow-blue-500/50 hover:bg-blue-600'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isLoading ? (
              <span className="animate-spin inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            )}
          </button>
          <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{store.name}</h1>
          {/* Offers Section */}
          {store.offers?.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {store.offers.map((offer, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-blue-300" />
                  <div className="min-w-0">
                    {formatOffer(offer)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Action buttons */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <button className="bg-blue-500/90 border border-blue-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-blue-600 transition flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Delivery in {store.deliveryTime || "20-30 min"}</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition">
              Min Order ₹{store.minOrderAmount || store.minOrder || 199}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PharmacyStoresSection() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { location } = useSelector((state) => state.location);

  useEffect(() => {
    const fetchStores = async () => {
      if (!location?.lat || !location?.lon) {
        setError("Location not available. Please select your location.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await getNearbyStores({
          latitude: location.lat,
          longitude: location.lon,
          storeType: "medicine", // or 'pharmacy' depending on your backend!
        });
        setStores(res.data || []);
      } catch (err) {
        setError("Failed to load stores. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [location]);

  // Loading
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Loading Pharmacy Stores...</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[22rem] bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  // Error State
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Pharmacy Stores</h2>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  // Empty
  if (stores.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Pharmacy Stores</h2>
        <div className="text-gray-500">No pharmacy stores available in your area.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Pharmacy Stores</h2>
      {/* Show location */}
      {location && (
        <div className="mb-4 text-sm text-gray-600">
          📍 Showing stores near: <span className="font-medium">{location.address || location.name}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stores.map(store => (
          <PharmacyStoreCard key={store._id} store={store} />
        ))}
      </div>
    </div>
  );
}

export default PharmacyStoresSection;
