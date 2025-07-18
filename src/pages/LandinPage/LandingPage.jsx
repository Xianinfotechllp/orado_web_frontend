import React from 'react';
import Navbar from '../../components/layout/Navbar';

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Hero Section with Modern Gradient */}
        <div className="w-full min-h-[calc(100vh-20rem)] flex flex-col md:flex-row items-center justify-between py-8 md:py-12 bg-gradient-to-r from-orange-50 via-white to-orange-50 relative overflow-hidden mt-13">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(251,146,60,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,146,60,0.08),transparent_50%)]"></div>

          {/* Left Image with Hover Effect */}
          <div className="w-full md:w-1/4 hidden md:block group relative z-10">
            <div className="transform transition-all duration-500 hover:scale-105 hover:rotate-1">
              <img 
                className="w-full h-auto drop-shadow-lg filter hover:drop-shadow-2xl transition-all duration-500" 
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png" 
                alt="Fresh vegetables" 
              />
            </div>
          </div>

          {/* Center Text with Modern Typography */}
          <div className="w-full md:w-2/4 text-center px-4 md:px-8 relative z-10">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Order food & groceries.
                <span className="block text-orange-600 text-3xl md:text-5xl mt-2">
                  Discover best restaurants.
                </span>
                <span className="block text-2xl md:text-4xl font-semibold text-gray-700 mt-2">
                  Orado it!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                Fast delivery to your doorstep with premium quality guaranteed
              </p>
              <div className="flex items-center justify-center space-x-2 mt-6 md:mt-8">
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse delay-300"></div>
              </div>
            </div>
          </div>

          {/* Right Image with Hover Effect */}
          <div className="w-full md:w-1/4 hidden md:block group relative z-10">
            <div className="transform transition-all duration-500 hover:scale-105 hover:-rotate-1">
              <img 
                className="w-full h-auto drop-shadow-lg filter hover:drop-shadow-2xl transition-all duration-500" 
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png" 
                alt="Delicious sushi" 
              />
            </div>
          </div>
        </div>

        {/* Tiles Section with Modern Cards */}
        <div className="w-full bg-gradient-to-b from-orange-50 to-white px-4 md:px-20 pb-10 md:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What would you like to order?
              </h2>
              <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <Tile
                href="/restaurants"
                img="https://assets.cntraveller.in/photos/60f6d111a77bf98b83f5364c/16:9/w_960,c_limit/Ahmedabad%20Food%20Guide.jpg"
                title="Food Delivery"
                description="Delicious meals from top restaurants"
              />
              <Tile
                href="/grocery"
                img="https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-07/grocery-list-1024x536.jpg"
                title="Grocery Delivery"
                description="Fresh groceries at your doorstep"
              />
              <Tile
                href="/meat-delivery"
                img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4prdadgPk6j2vAPd0Kvg3K-lYSIvjP-k9eQ&s"
                title="Meat Delivery"
                description="Premium quality meat & seafood"
              />
              <Tile
                href="/medicine-delivery"
                img="https://media.istockphoto.com/id/1778918997/photo/background-of-a-large-group-of-assorted-capsules-pills-and-blisters.jpg?s=612x612&w=0&k=20&c=G6aeWKN1kHyaTxiNdToVW8_xGY0hcenWYIjjG_xwF_Q="
                title="Medicine Delivery"
                description="Healthcare essentials delivered fast"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Tile = ({ href, img, title, description }) => (
  <div className="group relative">
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2 hover:rotate-1">
      <div className="relative overflow-hidden">
        <a href={href} className="block">
          <div className="relative">
            <img 
              src={img} 
              alt={title} 
              className="w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              {description}
            </p>
            <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <span>Order Now</span>
              <svg className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
);

export default LandingPage;
