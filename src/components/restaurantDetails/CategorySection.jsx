import React from 'react'
import Menucard from './Menucard'
function CategorySection({ category }) {
  return (
<div className="my-8">
      <h2 className="text-2xl font-bold mb-2">{category.categoryName}</h2>
      <p className="text-gray-600 mb-4">{category.description}</p>

      <div className="flex flex-wrap gap-2">
        {category.items.length > 0 ? (
          category.items.map((item, index) => (
            <Menucard key={index} item={item} />
          ))
        ) : (
          <p className="text-gray-500">No items available in this category yet.</p>
        )}
      </div>
    </div>
  )
}

export default CategorySection