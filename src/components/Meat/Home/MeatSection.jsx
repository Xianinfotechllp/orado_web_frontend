import React, { useState } from 'react';
import MeatHero from '../../../assets/meatHero.webp'

const MeatSection = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: "Fresh Chicken",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Premium fresh chicken cuts and whole chicken"
    },
    {
      id: 2,
      name: "Mutton & Lamb",
      image: "https://t3.ftcdn.net/jpg/05/29/62/38/360_F_529623896_VZ1Kg506mZ9pvPuUBiIHOtkSE035cgj6.jpg",
      description: "Fresh mutton and tender lamb cuts"
    },
    {
      id: 3,
      name: "Fresh Fish",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Ocean fresh fish and seafood"
    },
    {
      id: 4,
      name: "Prawns & Shrimp",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Fresh prawns and premium shrimp"
    },
    {
      id: 5,
      name: "Eggs & Poultry",
      image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Farm fresh eggs and poultry products"
    },
    {
      id: 6,
      name: "Marinated & Ready",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Pre-marinated and ready-to-cook items"
    },
    {
      id: 7,
      name: "Frozen Meat",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Premium frozen meat and seafood"
    },
    {
      id: 8,
      name: "Crab & Lobster",
      image: "https://t4.ftcdn.net/jpg/01/65/03/13/360_F_165031397_pQr4KqEcrBBhvFVPKC5QqLt9y5gz0CYf.jpg",
      description: "Fresh crab and premium lobster"
    },
    {
      id: 9,
      name: "Turkey & Duck",
      image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Premium turkey and duck meat"
    },
    {
      id: 10,
      name: "Goat & Specialty",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Fresh goat meat and specialty cuts"
    },
    {
      id: 11,
      name: "Sausages & Processed",
      image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Premium sausages and processed meats"
    },
    {
      id: 12,
      name: "Organic & Free Range",
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      description: "Organic and free-range meat options"
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 mt-18">
      {/* Hero Section */}
      <div className="relative w-full bg-red-100 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={MeatHero}
            alt="Fresh Meat Background"
            className="w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-90/90 via-orange-190/40 to-orange-20/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center text-white">
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
            Fresh <span className="text-orange-600">Premium Meat</span>, Delivered
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            The finest cuts of fresh meat and seafood—sourced daily and delivered to your doorstep with guaranteed freshness.
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
                placeholder="Search for meat, fish, or specific cuts..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats */}
          {/* <div className="flex flex-wrap justify-center gap-6 text-red-100">
            <StatItem value="500+" label="Fresh Cuts" />
            <StatItem value="2hrs" label="Freshness Guarantee" />
            <StatItem value="100%" label="Halal Certified" />
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
              Explore our premium selection of fresh meat, fish, and poultry
            </p>
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full mt-6"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative"
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 transform hover:-translate-y-2 cursor-pointer">
                  <div className="relative overflow-hidden">
                    <div className="aspect-square p-4 bg-gradient-to-br from-red-50 to-white">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover rounded-lg transition-all duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight group-hover:text-red-600 transition-colors duration-300">
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
            <button className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
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

export default MeatSection;