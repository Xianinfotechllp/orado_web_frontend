import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getRestaurantMenu,
  getRestaurantById,
} from '../../../apis/restaurantApi';
import {
  addToCart as addToRemoteCart,
  getCart as getRemoteCart,
  clearCartApi as clearRemoteCart,
} from '../../../apis/cartApi';
import {
  Star,
  Search,
  Plus,
  Minus,
  Heart,
  ShoppingBasket,
  Truck,
  Shield,
  Stethoscope,
} from 'lucide-react';

const pharmacyPlaceholder = 'https://placehold.co/600x400/png?text=Medicine+Store';

const MedicineStoreDetail = () => {
  const { id: pharmacyId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [store, setStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [cartPharmacyId, setCartPharmacyId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [storeError, setStoreError] = useState('');
  const [menuError, setMenuError] = useState('');
  const [menuLoading, setMenuLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartActionLoading, setCartActionLoading] = useState(false);

  // --- Fetch store details ---
  useEffect(() => {
    setStoreError('');
    setStore(null);
    setLoading(true);
    getRestaurantById(pharmacyId)
      .then((res) => setStore(res.data || null))
      .catch(() => {
        setStore(null);
        setStoreError('Store not found or cannot be loaded.');
      })
      .finally(() => setLoading(false));
  }, [pharmacyId]);

  // --- Fetch Categories & Products ---
  useEffect(() => {
    setMenuLoading(true);
    setMenuError('');
    setCategories([]);
    getRestaurantMenu(pharmacyId)
      .then((res) => {
        setCategories(res.data || []);
        setSelectedCategory(res.data?.length ? res.data[0].categoryId : 'all');
      })
      .catch(() => {
        setCategories([]);
        setMenuError('Failed to load catalogue.');
      })
      .finally(() => setMenuLoading(false));
  }, [pharmacyId]);

  // --- Hydrate cart from remote on mount ---
  useEffect(() => {
    setCartLoading(true);
    getRemoteCart()
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          const remoteCartObj = {};
          let remoteRestId = data.products[0]?.restaurantId || data.restaurantId || null;
          data.products.forEach((item) => {
            remoteCartObj[item.productId] = {
              _id: item.productId,
              quantity: item.quantity,
              restaurantId: item.restaurantId || remoteRestId,
            };
          });
          setCart(remoteCartObj);
          setCartPharmacyId(remoteRestId);
        } else {
          setCart({});
          setCartPharmacyId(null);
        }
      })
      .catch(() => {
        setCart({});
        setCartPharmacyId(null);
      })
      .finally(() => setCartLoading(false));
  }, []);

  // --- Filtered Product List: ONLY show items with active: true ---
  const getFilteredProducts = () => {
    let items = [];
    if (selectedCategory === 'all') {
      categories.forEach(c => c.items?.length && items.push(...c.items.filter(item => item.active)));
    } else {
      const cat = categories.find((c) => c.categoryId === selectedCategory);
      if (cat && cat.items) items = cat.items.filter(item => item.active);
    }
    if (searchTerm)
      items = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return items;
  };

  // --- Mini cart totals ---
  const getTotalCartItems = () =>
    Object.values(cart).reduce((sum, prod) => sum + prod.quantity, 0);

  const getTotalCartPrice = () =>
    Object.values(cart).reduce(
      (sum, prod) => sum + prod.quantity * (prod.price || 0),
      0
    );

  // --- Remote Cart Action: only allow one store per cart ---
  async function clearRemoteCartIfPresent() {
    if (typeof clearRemoteCart === 'function') {
      await clearRemoteCart();
    } else {
      setCart({});
      setCartPharmacyId(null);
    }
  }

  const handleAddToCart = async (product) => {
    if (
      cartPharmacyId &&
      cartPharmacyId !== pharmacyId &&
      getTotalCartItems() > 0
    ) {
      if (
        !window.confirm(
          'Your cart contains products from another store. Adding this product will clear your previous cart. Continue?'
        )
      ) {
        return;
      }
      setCartActionLoading(true);
      try {
        await clearRemoteCartIfPresent();
        setCart({});
        setCartPharmacyId(null);
      } catch (err) {
        alert('Failed to clear previous cart, try again');
        setCartActionLoading(false);
        return;
      }
      setCartActionLoading(false);
    }
    setCartActionLoading(true);
    try {
      const res = await addToRemoteCart(pharmacyId, product._id, (cart[product._id]?.quantity || 0) + 1);
      if (res && res.cart && Array.isArray(res.cart.products)) {
        const remoteCartObj = {};
        let remoteRestId = res.cart.products[0]?.restaurantId || res.cart.restaurantId || null;
        res.cart.products.forEach(item => {
          remoteCartObj[item.productId] = {
            _id: item.productId,
            quantity: item.quantity,
            restaurantId: item.restaurantId || remoteRestId,
          }
        });
        setCart(remoteCartObj);
        setCartPharmacyId(remoteRestId);
      }
    } catch (err) {
      alert((err && err.message) || 'Failed to add product to cart. Please check your network.');
    }
    setCartActionLoading(false);
  };

  const handleRemoveFromCart = async (product) => {
    const newQty = (cart[product._id]?.quantity || 1) - 1;
    if (newQty < 0) return;
    setCartActionLoading(true);
    try {
      const res = await addToRemoteCart(pharmacyId, product._id, newQty);
      if (res && res.cart && Array.isArray(res.cart.products)) {
        const remoteCartObj = {};
        let remoteRestId = res.cart.products[0]?.restaurantId || res.cart.restaurantId || null;
        res.cart.products.forEach(item => {
          remoteCartObj[item.productId] = {
            _id: item.productId,
            quantity: item.quantity,
            restaurantId: item.restaurantId || remoteRestId,
          }
        });
        setCart(remoteCartObj);
        setCartPharmacyId(remoteRestId);
      } else {
        setCart({});
        setCartPharmacyId(null);
      }
    } catch (err) {
      alert((err && err.message) || 'Failed to update cart.');
    }
    setCartActionLoading(false);
  };

  // --- UI Offer formatting ---
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

  // ===== LOADING/EMPTY STATES =====
  if (loading)
    return <div className="text-center py-16">Loading pharmacy details...</div>;
  if (storeError || !store) {
    return (
      <div className="text-center py-16 text-blue-500">
        {storeError || 'Pharmacy not found.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Hero Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={store.images?.[0] || store.image || pharmacyPlaceholder}
          alt={store.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
          {/* Favorite button */}
          <button
            onClick={() => setIsFavorite((fav) => !fav)}
            className={`absolute top-6 right-6 p-3 rounded-full shadow-lg transition-all z-10 ${
              isFavorite
                ? 'bg-blue-500 text-white shadow-blue-500/50 hover:bg-blue-600'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <h1 className="text-3xl font-bold mb-4 drop-shadow-md">{store.name}</h1>
          {/* Offers Section */}
          {store.offers?.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
              {store.offers.map((offer, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-blue-300" />
                  <div className="min-w-0">{formatOffer(offer)}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 mb-4 flex-wrap">
            <button className="bg-blue-500/90 border border-blue-400 py-2 px-4 rounded-full font-semibold text-sm hover:bg-blue-600 transition flex items-center gap-1">
              <Truck className="w-4 h-4" />
              <span>Delivery in {store.deliveryTime || "20-40 min"}</span>
            </button>
            <button className="bg-white/10 border border-white/30 py-2 px-4 rounded-full font-semibold text-sm hover:bg-white/20 transition flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{store.rating || 0} Rating</span>
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
          <button
            key="all"
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => setSelectedCategory(cat.categoryId)}
              className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.categoryId
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4 sm:p-6 md:p-8">
        {menuLoading ? (
          <div className="text-center py-16">Loading products...</div>
        ) : menuError ? (
          <div className="text-center py-16 text-blue-600">{menuError}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 text-blue-400">
            <ShoppingBasket className="w-16 h-16 mx-auto mb-4 text-blue-200" />
            <h3 className="text-xl font-semibold mb-2">No medicines in this store</h3>
            <p>Check back later or visit other pharmacies in your area.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {getFilteredProducts().map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* Favorite */}
                  <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-blue-500" />
                  </button>
                  <div className="relative w-full h-36 sm:h-40 md:h-44 overflow-hidden bg-gray-50">
                    <img
                      src={product.images?.[0] || pharmacyPlaceholder}
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
                    {product.prescription && (
                      <div className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Rx
                      </div>
                    )}
                  </div>
                  {/* Product Info/Cart */}
                  <div className="p-3 sm:p-4">
                    <div className="mb-3">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">{product.unit}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-bold text-blue-500">
                        ₹{product.price}
                      </span>
                      {cart[product._id] ? (
                          <div className="flex items-center bg-blue-50 rounded-full p-1">
                            <button
                              onClick={() =>
                                !cartActionLoading && handleRemoveFromCart(product)
                              }
                              disabled={cartActionLoading}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                            >
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <span className="text-sm sm:text-base font-bold text-blue-600 min-w-[24px] sm:min-w-[28px] text-center px-2">
                              {cart[product._id]?.quantity}
                            </span>
                            <button
                              onClick={() =>
                                !cartActionLoading && handleAddToCart(product)
                              }
                              disabled={cartActionLoading}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                            >
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              !cartActionLoading && handleAddToCart(product)
                            }
                            disabled={cartActionLoading}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group-hover:scale-110"
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {getFilteredProducts().length === 0 && categories.length > 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-600 mb-2">No medicines found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or browse different categories.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mini Cart */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {getTotalCartItems()}
                </span>
              </div>
              <span className="text-gray-700 font-medium">
                {getTotalCartItems()} items in cart
              </span>
              <span className="ml-2 text-gray-600 font-semibold">
                ₹{getTotalCartPrice()}
              </span>
            </div>
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors shadow-lg"
              onClick={() => navigate('/add-to-cart')}
              disabled={cartActionLoading}
            >
              {cartActionLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineStoreDetail;
