import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Search, Plus, Minus, Heart, ShoppingBasket, Truck } from 'lucide-react';

const MeatStoreDetail = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock store data
  const store = {
    id: 1,
    name: "Prime Meat & Seafood",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Premium quality fresh meat and seafood delivered to your door",
    rating: 4.7,
    deliveryTime: "20-30 min",
    minOrder: 299,
    location: "Central Market District",
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
        discountValue: 60,
        minOrderValue: 499
      }
    ]
  };

  // Mock categories and products data
  const categories = [
    { id: 'all', name: 'All Items'},
    { id: 'chicken', name: 'Chicken' },
    { id: 'mutton', name: 'Mutton' },
    { id: 'seafood', name: 'Seafood' },
    { id: 'fish', name: 'Fresh Fish'},
    { id: 'eggs', name: 'Eggs' },
    { id: 'processed', name: 'Processed' }
  ];

  const products = {
    chicken: [
      { id: 1, name: 'Chicken Breast (Boneless)', price: 249, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=150&h=150&fit=crop', inStock: true },
      { id: 2, name: 'Chicken Thighs (Bone-in)', price: 189, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=150&h=150&fit=crop', inStock: true },
      { id: 3, name: 'Whole Chicken', price: 299, unit: 'per kg', image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=150&h=150&fit=crop', inStock: true },
      { id: 4, name: 'Chicken Wings', price: 199, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=150&h=150&fit=crop', inStock: true },
      { id: 5, name: 'Chicken Drumsticks', price: 179, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=150&h=150&fit=crop', inStock: true },
      { id: 6, name: 'Minced Chicken', price: 229, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=150&h=150&fit=crop', inStock: false }
    ],
    mutton: [
      { id: 7, name: 'Mutton Chops', price: 699, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=150&h=150&fit=crop', inStock: true },
      { id: 8, name: 'Mutton Curry Cut', price: 649, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=150&h=150&fit=crop', inStock: true },
      { id: 9, name: 'Goat Leg Piece', price: 749, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=150&h=150&fit=crop', inStock: true },
      { id: 10, name: 'Minced Mutton', price: 599, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=150&h=150&fit=crop', inStock: true },
      { id: 11, name: 'Mutton Ribs', price: 799, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=150&h=150&fit=crop', inStock: false }
    ],
    seafood: [
      { id: 12, name: 'Fresh Prawns (Large)', price: 899, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=150&h=150&fit=crop', inStock: true },
      { id: 13, name: 'Crab (Whole)', price: 1299, unit: 'per kg', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop', inStock: true },
      { id: 14, name: 'Squid (Cleaned)', price: 449, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop', inStock: true },
      { id: 15, name: 'Mussels', price: 349, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=150&h=150&fit=crop', inStock: true },
      { id: 16, name: 'Lobster', price: 1899, unit: 'per piece', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=150&h=150&fit=crop', inStock: false }
    ],
    fish: [
      { id: 18, name: 'Pomfret (Whole)', price: 799, unit: 'per kg', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=150&h=150&fit=crop', inStock: true },
      { id: 19, name: 'Kingfish Steaks', price: 649, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop', inStock: true },
      { id: 20, name: 'Mackerel', price: 299, unit: 'per 500g', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop', inStock: true },
      { id: 22, name: 'Sea Bass (Whole)', price: 549, unit: 'per kg', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=150&h=150&fit=crop', inStock: false }
    ],
    eggs: [
      { id: 23, name: 'Farm Fresh Eggs', price: 79, unit: 'per 12 pieces', image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=150&h=150&fit=crop', inStock: true },
      { id: 25, name: 'Duck Eggs', price: 159, unit: 'per 6 pieces', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=150&h=150&fit=crop', inStock: true },
    ],
    processed: [
      { id: 27, name: 'Chicken Sausages', price: 199, unit: 'per 250g', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=150&h=150&fit=crop', inStock: true },
      { id: 28, name: 'Chicken Salami', price: 249, unit: 'per 200g', image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=150&h=150&fit=crop', inStock: true },
      { id: 29, name: 'Fish Fingers', price: 279, unit: 'per 300g', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&h=150&fit=crop', inStock: true },
      { id: 30, name: 'Chicken Nuggets', price: 229, unit: 'per 400g', image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=150&h=150&fit=crop', inStock: true },
      { id: 31, name: 'Smoked Salmon', price: 1499, unit: 'per 200g', image: 'https://images.unsplash.com/photo-1574781330855-d0db8cc2a4c1?w=150&h=150&fit=crop', inStock: false }
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
                ? 'bg-red-500 text-white shadow-red-500/50 hover:bg-red-600' 
                : 'bg-white text-gray-700 hover:bg-red-50'
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
                  <ShoppingBasket className="w-4 h-4 text-red-300" />
                  <div className="min-w-0">
                    {formatOffer(offer)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <button className="bg-red-500/90 border border-red-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-red-600 transition flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Delivery in {store.deliveryTime}</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{store.rating} Rating</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition">
              Min Order ₹{store.minOrder}
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
            placeholder="Search meat & seafood..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
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
                    Fresh
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
                    <span className="text-lg sm:text-xl font-bold text-red-500">
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
                        <div className="flex items-center bg-red-50 rounded-full p-1">
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="text-sm sm:text-base font-bold text-red-600 min-w-[24px] sm:min-w-[28px] text-center px-2">
                            {cart[product.id]}
                          </span>
                          <button
                            onClick={() => addToCart(product.id)}
                            className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-8 h-8 sm:w-9 sm:h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group-hover:scale-110"
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
                    <div className="text-xs text-gray-500 text-center">Quick Add</div>
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
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
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{getTotalCartItems()}</span>
              </div>
              <span className="text-gray-700 font-medium">{getTotalCartItems()} items in cart</span>
            </div>
            <button className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors shadow-lg">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeatStoreDetail;