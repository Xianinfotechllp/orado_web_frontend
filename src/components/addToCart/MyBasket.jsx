import React, { useState, useEffect } from "react";
import {
  ShoppingBasket,
  Plus,
  Minus,
  Delete,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBillSummary } from "../../apis/orderApi";
import {
  clearCartApi,
  getCart,
  removeFromCart,
  updateCart,
} from "../../apis/cartApi";
import { setCart, clearCart } from "../../slices/cartSlice";

export default function MyBasket() {
  const [items, setItems] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState({});
  const [buttonLoading, setButtonLoading] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  // Fetch bill summary
  const fetchBill = async (cartId) => {
    if (!cartId || !selectedAddress) return;
    try {
      const billRes = await getBillSummary({
        userId: user._id,
        longitude: selectedAddress.location.longitude,
        latitude: selectedAddress.location.latitude,
        cartId,
      });
      setBill(billRes.data);
    } catch (err) {
      console.error("Error fetching bill summary", err);
    }
  };

  // Fetch cart data
  const fetchCartData = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const cart = await getCart();
      if (cart?._id) {
        dispatch(setCart(cart));
        setCartDetails(cart);
        setItems(cart.products || []);
        await fetchBill(cart._id);  // bill summary here
      } else {
        dispatch(clearCart());
        setItems([]);
        setCartDetails({});
        setBill({});
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      dispatch(clearCart());
      setItems([]);
      setCartDetails({});
      setBill({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user?._id]);

  useEffect(() => {
    if (cartDetails._id && selectedAddress) {
      fetchBill(cartDetails._id);
    }
  }, [selectedAddress]);

  const updateQuantity = async (productId, change) => {
    try {
      setButtonLoading(productId);
      const selectedItem = items.find((item) => item.productId._id === productId);
      if (!selectedItem) return;

      const newQuantity = selectedItem.quantity + change;
      if (newQuantity <= 0) {
        await removeFromCart(productId);
      } else {
        await updateCart({ productId, quantity: newQuantity });
      }

      await fetchCartData();
    } catch (error) {
      console.error("Failed to update quantity", error);
    } finally {
      setButtonLoading(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setButtonLoading(productId);
      await removeFromCart(productId);
      await fetchCartData();
    } catch (error) {
      console.error("Failed to remove item", error);
    } finally {
      setButtonLoading(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const response = await clearCartApi();
      if (response.success) {
        dispatch(clearCart());
        setItems([]);
        setCartDetails({});
        setBill({});
      }
    } catch (error) {
      console.error("Failed to clear cart", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 font-medium text-gray-600">
        Loading your basket...
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden sm:max-w-md md:max-w-lg">
      {/* Header */}
      <div className="text-white p-4 flex items-center gap-3" style={{ backgroundColor: "#ea4525" }}>
        <div className="relative">
          <ShoppingBasket size={24} />
          <div
            className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            style={{ color: "#ea4525" }}
          >
            {items.length > 0 ? items.length : "✓"}
          </div>
        </div>
        <h1 className="text-xl font-semibold">My Basket</h1>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="ml-auto flex items-center gap-1 text-sm hover:bg-red-700 px-2 py-1 rounded"
            disabled={loading}
          >
            <Trash2 size={16} /> Clear
          </button>
        )}
      </div>

      {/* Items */}
      <div className="bg-gray-50 p-3 space-y-3 sm:p-4 sm:space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-600 font-medium py-8 space-y-4">
            <p>Your basket is empty.</p>
            <button
              onClick={fetchCartData}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition"
            >
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.productId._id} className="bg-white rounded-lg p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-green-600 font-semibold text-sm sm:text-base">
                    ₹{item.price?.toFixed(2) || 0}
                  </div>
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                    {item.productId.name || "Unnamed Item"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.productId._id, -1)}
                      disabled={buttonLoading === item.productId._id}
                      className={`p-1 ${buttonLoading === item.productId._id ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, 1)}
                      disabled={buttonLoading === item.productId._id}
                      className={`p-1 ${buttonLoading === item.productId._id ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    disabled={buttonLoading === item.productId._id}
                    className={`text-white w-5 h-5 rounded flex items-center justify-center bg-red-500 ${buttonLoading === item.productId._id ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}`}
                  >
                    <Delete size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                Total: ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Summary */}
      {items.length > 0 && (
        <>
          <div className="p-4 space-y-2 border-t">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-medium">Sub Total:</span>
              <span className="font-medium">₹{(bill?.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-medium">Discounts:</span>
              <span className="font-medium" style={{ color: "#ea4525" }}>₹{(bill?.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-medium">Tax:</span>
              <span className="font-medium">₹{(bill?.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-medium">Delivery Fee:</span>
              <span className="font-medium">₹{(bill?.deliveryFee || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="p-4 pt-0">
            <button
              disabled={items.length === 0}
              className={`w-full text-white font-semibold py-3 px-4 rounded-lg text-base sm:text-lg flex justify-between items-center ${items.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
              style={{ backgroundColor: "#ea4525" }}
            >
              <span>{items.length === 0 ? "No items to pay" : "Total to pay"}</span>
              <span>₹{(bill?.total || 0).toFixed(2)}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
