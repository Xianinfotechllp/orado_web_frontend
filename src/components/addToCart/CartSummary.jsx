import React, { useState, useEffect } from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../apis/cartApi";
import { setCart } from "../../slices/cartSlice";

export default function CartSummary({ useWallet, setUseWallet }) {
  // 1. Get products directly from Redux, not local state!
  const products = useSelector(state => state.cart.products || []);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. One-time fetch if not yet in Redux (on first mount)
  useEffect(() => {
    if (!user?._id || products.length) return;
    async function fetchCart() {
      setLoading(true);
      setError(null);
      try {
        const cart = await getCart();
        if (cart?._id) dispatch(setCart(cart));
      } catch (err) {
        setError("Failed to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [user?._id, products.length, dispatch]);

  // 3. Manual refresh
  const handleRefresh = async () => {
    setLoading(true); setError(null);
    try {
      const cart = await getCart();
      if (cart?._id) dispatch(setCart(cart));
    } catch (err) {
      setError("Failed to refresh your cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-orange-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} />
          <h3 className="font-semibold">Your Order</h3>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1 rounded-full hover:bg-orange-600 transition-colors"
          title="Refresh cart"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-2 text-center">
          {error}
        </div>
      )}

      {/* Cart Items */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 font-medium text-gray-600">
            Loading your cart...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Your cart is empty</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {products.map((item) => (
              <div key={item.productId._id || item.productId} className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.productId?.name || item.productId}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Total */}
      {products.length > 0 && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">₹{total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* View Cart Button */}
      <div className="p-3">
        <button
          onClick={() => navigate("/add-to-cart")}
          disabled={products.length === 0 || loading}
          className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
            products.length === 0 || loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          <ShoppingCart size={18} />
          {products.length > 0 ? "View & Checkout" : "Cart is Empty"}
        </button>
      </div>
    </div>
  );
}
