import React from 'react';

const FoodCategoryCard = ({ category, onClick }) => {
  return (
    <div 
      className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform duration-200"
      onClick={() => onClick(category)}
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg mb-3 bg-white group-hover:shadow-xl transition-all duration-200 border-2 border-transparent group-hover:border-orange-200">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
        />
      </div>
      <span className="text-xs md:text-sm font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors max-w-[80px] leading-tight">
        {category.name}
      </span>
    </div>
  );
};

export default FoodCategoryCard;