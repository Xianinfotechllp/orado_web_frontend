import React, { useState } from 'react';

const MedicineSection = () => {
  const [activeCategory, setActiveCategory] = useState(null);

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
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
            Your <span className="text-blue-100">Healthcare</span> Essentials
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Trusted medicines and health products—delivered safely to your doorstep in minutes.
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
                placeholder="Search for medicines, brands, or health products..."
                className="w-full pl-14 pr-6 py-4 rounded-full bg-transparent text-gray-800 placeholder-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Stats */}
          {/* <div className="flex flex-wrap justify-center gap-6 text-blue-100">
            <StatItem value="5K+" label="Medicines" />
            <StatItem value="20min" label="Avg Delivery" />
            <StatItem value="200+" label="Trusted Brands" />
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