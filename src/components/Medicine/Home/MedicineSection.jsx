import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { searchStore } from '../../../apis/storeApi'; // <- your API
import { Heart, Truck } from "lucide-react";

// --- CARD COMPONENT (small but real example) ---
function MedicineStoreCard({ store }) {
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
    <div className="relative w-full h-[20rem] overflow-hidden shadow-lg rounded-xl group">
      <img
        src={store.images?.[0] || store.image || "https://placehold.co/400x320/png?text=Medicine+Store"}
        alt={store.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
        {/* Favorite */}
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
        <h1 className="text-2xl font-bold drop-shadow-md">{store.name}</h1>
        {/* Address */}
        {store.address && (
          <div className="text-xs mb-1">
            {store.address.street && <div>{store.address.street}</div>}
            {store.address.city && store.address.state && (
              <div>{store.address.city}, {store.address.state}</div>
            )}
          </div>
        )}
        {/* Delivery/Min Order */}
        <div className="flex gap-2 mt-2">
          <button className="bg-blue-500/80 border border-blue-400 py-1 px-3 rounded-full font-semibold text-xs hover:bg-blue-600 flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Delivery in 20-30 min</span>
          </button>
          <button className="bg-white/10 border border-white/30 py-1 px-3 rounded-full font-semibold text-xs hover:bg-white/20">
            Min Order ₹{store.minOrderAmount || store.minOrder || 199}
          </button>
        </div>
      </div>
    </div>
  );
}

const MedicineSection = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const { location } = useSelector(state => state.location);

  const categories = [
    {
      id: 1,
      name: "Pain Relief",
      image: "https://www.sbherbostore.com/wp-content/uploads/2023/12/dvfdfsdf.jpg",
      description: "Headache, muscle pain, and fever relief"
    },
    {
      id: 2,
      name: "Cold & Flu",
      image: "https://images.gopuff.com/blob/gopuffcatalogstorageprod/catalog-images-container/resize/cf/version=1_2,format=auto,fit=scale-down,width=800,height=800/002dd3d7-f46b-4003-80c1-96269db46a75.png",
      description: "Cough, cold, and flu medications"
    },
    {
      id: 3,
      name: "Digestive Health",
      image: "https://5.imimg.com/data5/SELLER/Default/2022/11/BO/OF/BE/26771149/keva-digestive-health-care-tablet-500x500.jpg",
      description: "Stomach care and digestive aids"
    },
    {
      id: 4,
      name: "Vitamins & Supplements",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
      description: "Essential vitamins and health supplements"
    },
    {
      id: 5,
      name: "First Aid",
      image: "https://m.media-amazon.com/images/I/61v0JPUnwGS.jpg",
      description: "Bandages, antiseptics, and wound care"
    },
    {
      id: 6,
      name: "Allergy & Sinus",
      image: "https://i5.peapod.com/c/ON/ON3FM.jpg",
      description: "Allergy relief and sinus medications"
    },
    {
      id: 7,
      name: "Heart & BP",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
      description: "Cardiovascular and blood pressure care"
    },
    {
      id: 8,
      name: "Diabetes Care",
      image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&h=400&fit=crop",
      description: "Blood sugar monitoring and diabetes management"
    },
    {
      id: 9,
      name: "Skin Care",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
      description: "Topical treatments and skin medications"
    },
    {
      id: 10,
      name: "Eye Care",
      image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400&h=400&fit=crop",
      description: "Eye drops and vision care products"
    },
    {
      id: 11,
      name: "Women's Health",
      image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=400&fit=crop",
      description: "Feminine hygiene and women's wellness"
    },
    {
      id: 12,
      name: "Baby Care",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      description: "Pediatric medicines and baby health products"
    },
  ];

  // --------- SEARCH HANDLER (API) ----------
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
        storeType: 'medicine'
      });
      setSearchResults(res.data || []);
    } catch (err) {
      setSearchError(err.message || "Failed to search");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // --------- RENDER -----------
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-18">
      {/* Hero Section */}
      <div className="relative w-full bg-blue-100 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&h=600&fit=crop"
            alt="Medicine Background"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-390/90 via-blue-190/40 to-blue-400/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
            Your <span className="text-blue-100">Healthcare</span> Essentials
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Trusted medicines and health products—delivered safely to your doorstep in minutes.
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
                placeholder="Search for medicines, brands, or health products..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      {/* ----- SEARCH RESULTS USING MEDICINE STORE CARD ----- */}
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
                      <MedicineStoreCard key={store._id} store={store} />
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
              Explore our comprehensive range of medicines and healthcare products
            </p>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-6"></div>
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
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <div className="aspect-square p-4 bg-gradient-to-br from-blue-50 to-white">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight group-hover:text-blue-600 transition-colors duration-300">
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
            <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
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

export default MedicineSection;
