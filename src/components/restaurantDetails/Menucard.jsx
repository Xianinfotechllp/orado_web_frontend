import React, { useState } from "react";
import { PiPlusCircleBold, PiMinusCircleBold } from "react-icons/pi";
import { Heart, Star, Clock, Flame, Leaf } from "lucide-react";

function Menucard({ item, onQuantityChange, quantity }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleIncrease = () => {
    onQuantityChange(item, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      onQuantityChange(item, quantity - 1);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'bestseller':
        return 'bg-orange-500 text-white';
      case 'spicy':
        return 'bg-red-500 text-white';
      case 'veg':
        return 'bg-green-500 text-white';
      case 'new':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const renderBadges = () => {
    const badges = [];
    
    if (item.isBestseller || item.isPopular) {
      badges.push({ type: 'bestseller', text: 'Bestseller', icon: Star });
    }
    
    if (item.isSpicy || item.spiceLevel > 2) {
      badges.push({ type: 'spicy', text: 'Spicy', icon: Flame });
    }
    
    if (item.isVeg || item.category?.includes('veg')) {
      badges.push({ type: 'veg', text: 'Veg', icon: Leaf });
    }
    
    if (item.isNew) {
      badges.push({ type: 'new', text: 'New', icon: null });
    }

    return badges.slice(0, 2); // Show max 2 badges
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='225' viewBox='0 0 300 225'%3E%3Crect width='300' height='225' fill='%23f8fafc'/%3E%3Cpath d='M150 80c-8 0-15 7-15 15v30c0 8 7 15 15 15s15-7 15-15v-30c0-8-7-15-15-15zm-25 65c-5 0-9 4-9 9s4 9 9 9h50c5 0 9-4 9-9s-4-9-9-9h-50z' fill='%23e2e8f0'/%3E%3Ctext x='150' y='175' text-anchor='middle' fill='%23cbd5e1' font-family='Arial' font-size='12'%3ENo Image Available%3C/text%3E%3C/svg%3E";

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1 flex flex-col h-full w-full">
      {/* Image Container - Fixed Height */}
      <div className="relative overflow-hidden flex-shrink-0 h-48">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        
        <img
          src={item.images && item.images.length > 0 && !imageError ? item.images[0] : placeholderImage}
          alt={item.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {renderBadges().map((badge, index) => (
            <div
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getBadgeColor(badge.type)} backdrop-blur-sm shadow-sm`}
            >
              {badge.icon && <badge.icon className="w-3 h-3" />}
              {badge.text}
            </div>
          ))}
        </div>
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-sm"
          aria-label={`${isLiked ? 'Remove from' : 'Add to'} favorites`}
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-500 hover:text-red-500'
            }`}
          />
        </button>
        
        {/* Quantity Controls Overlay */}
        <div className="absolute bottom-3 right-3">
          {quantity === 0 ? (
            <button
              onClick={handleIncrease}
              className="bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-500 rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label={`Add ${item.name} to cart`}
            >
              <PiPlusCircleBold size={22} />
            </button>
          ) : (
            <div className="bg-white rounded-full px-3 py-2 shadow-lg flex items-center gap-2 border-2 border-orange-500">
              <button
                onClick={handleDecrease}
                className="text-orange-600 hover:bg-orange-50 rounded-full p-1 transition-colors duration-150"
                aria-label={`Decrease ${item.name} quantity`}
              >
                <PiMinusCircleBold size={18} />
              </button>
              <span className="font-bold text-gray-800 min-w-[20px] text-center text-sm">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="text-orange-600 hover:bg-orange-50 rounded-full p-1 transition-colors duration-150"
                aria-label={`Increase ${item.name} quantity`}
              >
                <PiPlusCircleBold size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Content Container - Flexible Height */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title and Rating Row */}
        <div className="flex items-start justify-between mb-2 min-h-[3rem]">
          <h3 className="font-bold text-base text-gray-900 leading-tight flex-1 mr-2 line-clamp-2">
            {item.name}
          </h3>
          {(item.rating || item.averageRating) && (
            <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ml-2">
              <Star className="w-3 h-3 fill-white" />
              <span>{(item.rating || item.averageRating || 4.2).toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem] flex-1">
          {item.description || "Delicious food item prepared with the finest ingredients"}
        </p>
        
        {/* Metadata Row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 flex-wrap">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{item.prepTime || '15-20'} min</span>
          </div>
          {item.calories && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">C</span>
              </div>
              <span>{item.calories} cal</span>
            </div>
          )}
          {item.servingSize && (
            <div className="flex items-center gap-1">
              <span>Serves {item.servingSize}</span>
            </div>
          )}
        </div>
        
        {/* Price Section - Always at Bottom */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.originalPrice)}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>
            
            {/* Customization Indicator */}
            {item.hasCustomization && (
              <span className="text-xs text-orange-600 font-medium flex-shrink-0">
                Customizable
              </span>
            )}
          </div>
          
          {/* Cart Summary */}
          {quantity > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mt-3 flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">
                Added to cart
              </span>
              {/* <span className="text-sm font-bold text-orange-800">
                {formatPrice(item.price * quantity)}
              </span> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Menucard;