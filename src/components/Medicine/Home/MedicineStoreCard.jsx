import React, { useState } from "react";
import { Heart, Package, Clock, Star, Truck } from "lucide-react";

function PharmacyStoreCard({ store }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsLoading(true);
    // Simulate API call
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
        src={store.image}
        alt={store.name}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay */}
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

        {/* Store name */}
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
            Min Order ₹{store.minOrder || 199}
          </button>
        </div>
      </div>
    </div>
  );
}

// Dummy data for pharmacy stores
const pharmacyStores = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    deliveryTime: "15-25 min",
    minOrder: 149,
    rating: 4.6,
    offers: [
      {
        type: "percentage",
        title: "First Order",
        discountValue: 25,
        maxDiscount: 150
      },
      {
        type: "flat",
        title: "Free Delivery",
        discountValue: 50,
        minOrderValue: 299
      }
    ]
  },
  {
    id: 2,
    name: "24/7 MediCare",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    deliveryTime: "20-30 min",
    minOrder: 199,
    rating: 4.4,
    offers: [
      {
        type: "percentage",
        title: "Health Discount",
        discountValue: 20,
        maxDiscount: 200
      }
    ]
  },
  {
    id: 3,
    name: "WellCare Pharmacy",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    deliveryTime: "25-35 min",
    minOrder: 249,
    rating: 4.7,
    offers: [
      {
        type: "flat",
        title: "Wellness Offer",
        discountValue: 75,
        minOrderValue: 599
      }
    ]
  },
  {
    id: 4,
    name: "QuickMeds Express",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1479&q=80",
    deliveryTime: "10-20 min",
    minOrder: 99,
    rating: 4.5,
    offers: [
      {
        type: "percentage",
        title: "New Customer",
        discountValue: 30,
        maxDiscount: 180
      },
      {
        type: "flat",
        title: "Express Delivery",
        discountValue: 40,
        minOrderValue: 199
      }
    ]
  }
];

function PharmacyStoresSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Popular Pharmacy Stores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pharmacyStores.map(store => (
          <PharmacyStoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

export default PharmacyStoresSection;