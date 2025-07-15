import React, { useState } from 'react';
import GroceryHero from '../../../assets/groceryHero.jpg'

const GrocerySection = () => {
  const [activeCategory, setActiveCategory] = useState(null);

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
    {/* Heading */}
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
      Your Daily <span className="text-orange-100">Groceries</span>, Delivered
    </h1>
    <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8">
      Everything you need—from fresh produce to pantry must-haves—delivered in just minutes.
    </p>

    {/* Search Bar */}
    <div className="max-w-xl mx-auto mb-10">
      <div className="relative rounded-full shadow-xl bg-white/80 backdrop-blur-md border border-white/30">
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
          placeholder="Search for groceries, brands, or categories..."
          className="w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none"
        />
      </div>
    </div>

    {/* Stats */}
    {/* <div className="flex flex-wrap justify-center gap-6 text-orange-100">
      <StatItem value="10K+" label="Products" />
      <StatItem value="15min" label="Avg Delivery" />
      <StatItem value="500+" label="Top Brands" />
    </div> */}
  </div>
</div>

{/* StatItem Component */}
{/* const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
); */}

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

          {/* View All Button */}
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