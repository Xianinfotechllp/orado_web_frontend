import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GroceryHero from '../../../assets/groceryHero.jpg'
import { Heart, Truck } from "lucide-react";
import { searchStore } from '../../../apis/storeApi';
import groceryPlaceholder from "../../../assets/grocery-placeholder.jpg"; 


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


const GrocerySection = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { location } = useSelector(state => state.location);
  console.log(location)

  const categories = [
    {
      id: 1,
      name: "Paan Corner",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-12/paan-corner_web.png",
      description: "Traditional paan and mouth fresheners"
    },
    {
      id: 2,
      name: "Dairy, Bread & Eggs",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-2_10.png",
      description: "Fresh dairy products and bakery items"
    },
    {
      id: 3,
      name: "Fruits & Vegetables",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-3_9.png",
      description: "Farm fresh fruits and vegetables"
    },
    {
      id: 4,
      name: "Snacks & Munchies",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-5_4.png",
      description: "Tasty snacks and quick bites"
    },
    {
      id: 5,
      name: "Breakfast & Instant Food",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-6_5.png",
      description: "Quick breakfast and instant meals"
    },
    {
      id: 6,
      name: "Sweet Tooth",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-7_3.png",
      description: "Desserts and sweet treats"
    },
    {
      id: 7,
      name: "Bakery & Biscuits",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-8_4.png",
      description: "Fresh bakery items and biscuits"
    },
    {
      id: 8,
      name: "Tea, Coffee & Health Drink",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-9_3.png",
      description: "Premium teas, coffee and health drinks"
    },
    {
      id: 9,
      name: "Atta, Rice & Dal",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-10.png",
      description: "Staple grains and pulses"
    },
    {
      id: 10,
      name: "Masala, Oil & More",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-11.png",
      description: "Spices, oils and cooking essentials"
    },
    {
      id: 11,
      name: "Sauces & Spreads",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-12.png",
      description: "Condiments and flavor enhancers"
    },
    {
      id: 12,
      name: "Organic & Healthy Living",
      image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-14.png",
      description: "Organic and health-conscious products"
    },
  ];

  // Search handler
  const handleSearch = async (customQuery) => {
    const query = typeof customQuery === 'string' ? customQuery : searchText;
    if (!query.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchPerformed(true);

    try {
      const res = await searchStore({
        query,
        latitude: location?.lat,
        longitude: location?.lon,
        storeType: 'grocery'
      });
      setSearchResults(res.data || []);
    } catch (err) {
      setSearchError(err.message || "Failed to search");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 mt-18">
      {/* Hero Section */}
      <div className="relative w-full bg-orange-100 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={GroceryHero}
            alt="Groceries Background"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-70/90 via-orange-100/40 to-orange-20/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
            Your Daily <span className="text-orange-100">Groceries</span>, Delivered
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Everything you need—from fresh produce to pantry must-haves—delivered in just minutes.
          </p>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-10">
            <form
              className="relative rounded-full shadow-xl bg-white/80 backdrop-blur-md border border-white/30"
              onSubmit={e => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <svg
                className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search for groceries, brands, or categories..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      {/* ----- SEARCH RESULTS USING GROCERY STORE CARD ----- */}
      {searchPerformed && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          {searchLoading && <div className="py-8 text-center">Loading...</div>}
          {searchError && <div className="py-8 text-center text-red-600">{searchError}</div>}
          {!searchLoading && !searchError && (
            <>
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-gray-600">No stores found.</div>
              ) : (
                <div>
                  <div className="mb-8 text-lg text-gray-700 font-semibold">
                    {searchResults.length} result{searchResults.length > 1 ? "s" : ""} found
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {searchResults.map(store => (
                      <GroceryStoreCard key={store._id} store={store} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Categories Section */}
      <div className="w-full py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of fresh groceries and everyday essentials
            </p>
            <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button
                  type="button"
                  onClick={() => handleSearch(category.name)}
                  className="w-full"
                  style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                >
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <div className="aspect-square p-4 bg-gradient-to-br from-orange-50 to-white">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight group-hover:text-orange-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </button>
                {/* Tooltip */}
                {activeCategory === category.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-20 animate-fade-in">
                    {category.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-semibold rounded-full hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <span>View All Categories</span>
              <svg className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GrocerySection;
