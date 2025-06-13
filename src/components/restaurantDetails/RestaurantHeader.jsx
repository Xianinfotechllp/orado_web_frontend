import React, { useState } from 'react'

function RestaurantHeader({restaurant}) {
  return (
    <div className="relative bg-white shadow-xl rounded-3xl overflow-hidden mb-8">
       <div className="relative h-80 md:h-96">
         <img
           src={restaurant.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop"}
           alt={restaurant.name}
           className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
         
         {/* Top badges */}
         <div className="absolute top-6 left-6 flex gap-3">
           {restaurant.isPromoted && (
             <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
               ⭐ PROMOTED
             </span>
           )}
           <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
             <Truck size={14} />
             Free Delivery
           </span>
         </div>
 
         {/* Action buttons */}
         <div className="absolute top-6 right-6 flex gap-3">
           <button
             onClick={() => setIsFavorite(!isFavorite)}
             className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
               isFavorite 
                 ? 'bg-red-500 text-white shadow-lg' 
                 : 'bg-white/90 text-gray-700 hover:bg-white'
             }`}
           >
             <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
           </button>
           <button className="p-3 bg-white/90 text-gray-700 rounded-full hover:bg-white backdrop-blur-sm transition-all duration-200">
             <Share2 size={20} />
           </button>
         </div>
         
         {/* Restaurant info */}
         <div className="absolute bottom-6 left-6 right-6 text-white">
           <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">{restaurant.name}</h1>
           <div className="flex items-center gap-6 text-sm mb-4">
             <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-full">
               <Star size={16} fill="currentColor" className="text-white" />
               <span className="font-bold">{restaurant.rating}</span>
               <span>({restaurant.totalReviews?.toLocaleString()})</span>
             </div>
             <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
               <Clock size={16} />
               <span>{restaurant.deliveryTime}</span>
             </div>
             <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
               <MapPin size={16} />
               <span>{restaurant.cuisine}</span>
             </div>
           </div>
           
           {/* Offers */}
           {restaurant.offers && restaurant.offers.length > 0 && (
             <div className="flex gap-2 overflow-x-auto">
               {restaurant.offers.map((offer, index) => (
                 <span key={index} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                   🎯 {offer}
                 </span>
               ))}
             </div>
           )}
         </div>
       </div>
       
       {/* Info cards */}
       <div className="p-6">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
             <MapPin size={20} className="text-orange-600" />
             <div>
               <div className="font-medium text-gray-800">Address</div>
               <div className="text-sm text-gray-600">{restaurant.address}</div>
             </div>
           </div>
           <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
             <Clock size={20} className="text-green-600" />
             <div>
               <div className="font-medium text-gray-800">Hours</div>
               <div className="text-sm text-gray-600">{restaurant.openingHours}</div>
             </div>
           </div>
           <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
             <ShoppingCart size={20} className="text-blue-600" />
             <div>
               <div className="font-medium text-gray-800">Min Order</div>
               <div className="text-sm text-gray-600">₹{restaurant.minOrderAmount}</div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
  
}

export default RestaurantHeader