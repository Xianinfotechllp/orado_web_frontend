import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2, RefreshCw, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../apis/cartApi";
import { setCart } from "../../slices/cartSlice";

export default function CartSummary() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const fetchCartData = async () => {
    if (!user?._id) return;
    try {
      setError(null);
      setLoading(true);
      const cart = await getCart();
      if (cart?._id) {
        dispatch(setCart(cart));
        setItems(cart.products || []);
        calculateTotal(cart.products || []);
      } else {
        setItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load your cart. Please try again.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (cartItems) => {
    const calculatedTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotal(calculatedTotal);
  };

  useEffect(() => {
    fetchCartData();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="text-center py-4 font-medium text-gray-600">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-orange-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} />
          <h3 className="font-semibold">Your Order</h3>
        </div>
        <button
          onClick={fetchCartData}
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
        {items.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.productId._id} className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">
                      {item.productId.name}
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
      {items.length > 0 && (
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
          disabled={items.length === 0}
          className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
            items.length === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          <ShoppingCart size={18} />
          {items.length > 0 ? "View & Checkout" : "Cart is Empty"}
        </button>
      </div>
    </div>
  );
}