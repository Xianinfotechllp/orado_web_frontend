import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Search, Plus, Minus, Heart, ShoppingBasket, Truck, Shield, Stethoscope } from 'lucide-react';

const MedicineStoreDetail = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock medicine store data
  const store = {
    id: 1,
    name: "HealthCare Plus Pharmacy",
    image: "https://media.gettyimages.com/id/2204236374/photo/indian-economy.jpg?s=2048x2048&w=gi&k=20&c=OMG1uDcCT5UevAWZTjLfZW1rZHesd3FpUcyEtdKt9ns=",
    description: "Your trusted pharmacy with genuine medicines and healthcare products",
    rating: 4.7,
    deliveryTime: "30-45 min",
    minOrder: 149,
    location: "Medical District",
    offers: [
      {
        type: "percentage",
        title: "First Order",
        discountValue: 15,
        maxDiscount: 150
      },
      {
        type: "flat",
        title: "Free Delivery",
        discountValue: 50,
        minOrderValue: 399
      }
    ]
  };

  // Mock categories and products data
  const categories = [
    { id: 'all', name: 'All Medicines' },
    { id: 'pain-relief', name: 'Pain Relief' },
    { id: 'cold-flu', name: 'Cold & Flu' },
    { id: 'digestive', name: 'Digestive Health' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'first-aid', name: 'First Aid' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'baby-care', name: 'Baby Care' }
  ];

  const products = {
    'pain-relief': [
      { id: 1, name: 'Paracetamol 500mg', price: 12.99, unit: 'per strip (10 tablets)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 2, name: 'Ibuprofen 400mg', price: 18.50, unit: 'per strip (10 tablets)', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 3, name: 'Aspirin 75mg', price: 15.99, unit: 'per strip (14 tablets)', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 4, name: 'Diclofenac Gel', price: 89.99, unit: 'per tube (30g)', image: 'https://images.unsplash.com/photo-1585435557343-3b092031d4c1?w=150&h=150&fit=crop', inStock: false, prescription: true }
    ],
    'cold-flu': [
      { id: 5, name: 'Cough Syrup', price: 45.99, unit: 'per bottle (100ml)', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 6, name: 'Throat Lozenges', price: 25.49, unit: 'per pack (16 pieces)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 7, name: 'Nasal Spray', price: 79.99, unit: 'per bottle (15ml)', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=150&fit=crop', inStock: true, prescription: false }
    ],
    'digestive': [
      { id: 8, name: 'Antacid Tablets', price: 32.99, unit: 'per strip (10 tablets)', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 9, name: 'Probiotic Capsules', price: 299.99, unit: 'per bottle (30 capsules)', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 10, name: 'Digestive Enzyme', price: 189.99, unit: 'per bottle (60 tablets)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop', inStock: true, prescription: false }
    ],
    'vitamins': [
      { id: 11, name: 'Vitamin C 1000mg', price: 249.99, unit: 'per bottle (60 tablets)', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 12, name: 'Vitamin D3 2000IU', price: 199.99, unit: 'per bottle (90 capsules)', image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 13, name: 'Multivitamin', price: 399.99, unit: 'per bottle (30 tablets)', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 14, name: 'Omega-3 Fish Oil', price: 599.99, unit: 'per bottle (60 capsules)', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&h=150&fit=crop', inStock: false, prescription: false }
    ],
    'first-aid': [
      { id: 15, name: 'Bandages', price: 49.99, unit: 'per pack (10 pieces)', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop', inStock: true, prescription: false },
    ],
    'skincare': [
      { id: 17, name: 'Moisturizing Lotion', price: 159.99, unit: 'per bottle (200ml)', image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=150&h=150&fit=crop', inStock: true, prescription: false },
    ],
    'baby-care': [
      { id: 19, name: 'Baby Diaper Rash Cream', price: 189.99, unit: 'per tube (100g)', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=150&h=150&fit=crop', inStock: true, prescription: false },
      { id: 20, name: 'Baby Oral Drops', price: 129.99, unit: 'per bottle (15ml)', image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150&h=150&fit=crop', inStock: true, prescription: false }
    ]
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const formatOffer = (offer) => {
    if (!offer) return null;
    
    switch (offer.type) {
      case "percentage":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              {offer.discountValue}% OFF up to ₹{offer.maxDiscount}
            </div>
          </>
        );
      case "flat":
        return (
          <>
            <div className="font-medium">{offer.title}</div>
            <div className="text-sm text-white">
              Flat ₹{offer.discountValue} OFF
            </div>
          </>
        );
      default:
        return <div className="font-medium">{offer.title}</div>;
    }
  };

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getFilteredProducts = () => {
    let allProducts = [];
    
    if (selectedCategory === 'all') {
      Object.values(products).forEach(categoryProducts => {
        allProducts = [...allProducts, ...categoryProducts];
      });
    } else {
      allProducts = products[selectedCategory] || [];
    }

    if (searchTerm) {
      allProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return allProducts;
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src={store.image} 
          alt={store.name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
          {/* Favorite button */}
          <button
            onClick={handleFavoriteToggle}
            className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
              isFavorite 
                ? 'bg-blue-500 text-white shadow-blue-500/50 hover:bg-blue-600' 
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Store name */}
          <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{store.name}</h1>

          {/* Offers Section */}
          {store.offers?.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {store.offers.map((offer, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-blue-300" />
                  <div className="min-w-0">
                    {formatOffer(offer)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <button className="bg-blue-500/90 border border-blue-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-blue-600 transition flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Delivery in {store.deliveryTime}</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{store.rating} Rating</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>Licensed Pharmacy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="flex overflow-x-auto px-4 py-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {getFilteredProducts().map(product => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Favorite Button */}
              <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-white text-sm font-semibold tracking-wide">Out of Stock</span>
                      <div className="w-16 h-0.5 bg-white/50 mx-auto mt-1"></div>
                    </div>
                  </div>
                )}
                
                {/* Stock indicator */}
                {product.inStock && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Available
                  </div>
                )}

                {/* Prescription indicator */}
                {product.prescription && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Rx
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4">
                <div className="mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                </div>

                {/* Price & Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-xl font-bold text-blue-500">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {product.inStock && (
                    <div className="flex items-center">
                      {cart[product.id] ? (
                        <div className="flex items-center bg-blue-50 rounded-full p-1">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="text-sm sm:text-base font-bold text-blue-600 min-w-[24px] sm:min-w-[28px] text-center px-2">
                            {cart[product.id]}
                          </span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group-hover:scale-110"
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Add Animation */}
                {product.inStock && !cart[product.id] && (
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-xs text-gray-500 text-center">
                      {product.prescription ? 'Prescription Required' : 'Quick Add'}
                    </div>
                  </div>
                )}
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-full group-hover:translate-x-0"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {getFilteredProducts().length === 0 && (
          <div className="text-center py-16">
            <div className="mb-4">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No medicines found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search or browse different categories to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{getTotalCartItems()}</span>
              </div>
              <span className="text-gray-700 font-medium">{getTotalCartItems()} items in cart</span>
            </div>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineStoreDetail;