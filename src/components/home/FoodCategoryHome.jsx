import React from 'react';
import FoodCategoryCard from './FoodCategoryCard';
import { foodCategories } from './constants';

const FoodCategoryHome = ({ onCategoryClick }) => {
  return (
    <div className="bg-white py-4 px-2">
      <h2 className="text-lg font-bold text-gray-800 mb-3 px-4">
        What's on your mind?
      </h2>
      
      <div className="flex overflow-x-auto gap-4 pb-4 px-4 scrollbar-hide">
        {foodCategories.map(category => (
          <FoodCategoryCard
            key={category.id}
            category={category}
            onClick={onCategoryClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodCategoryHome;