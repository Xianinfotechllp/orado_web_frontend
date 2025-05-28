import React from 'react'
import Menucard from './Menucard'
function CategorySection({ category }) {
  return (
<div className="my-8 w-full flex flex-col  px-auto md:px-10 lg:px-20 ">
  <h2 className="text-2xl font-bold mb-2 text-left">{category.categoryName}</h2>
  <p className="text-gray-600 mb-4 text-left">{category.description}</p>

  <div className="flex flex-wrap  gap-4 w-full">
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