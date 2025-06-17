import React, { useState, useEffect } from "react";
import {
  ShoppingBasket,
  Plus,
  Minus,
  Delete,
  RefreshCw,
  Trash2,
  Zap, Tag
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBillSummary } from "../../apis/orderApi";
import { getWalletBalance } from "../../apis/walletApi";
import {
  clearCartApi,
  getCart,
  removeFromCart,
  updateCart,
} from "../../apis/cartApi";
import { setCart, clearCart } from "../../slices/cartSlice";

export default function MyBasket({ useWallet, setUseWallet }) {
  const [items, setItems] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState({});
  const [buttonLoading, setButtonLoading] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);

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
        cartId: cartId,
        useWallet: useWallet,
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
        await fetchBill(cart._id);
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

  const fetchWalletBalance = async () => {
    try {
      const res = await getWalletBalance();
      setWalletBalance(res.walletBalance);
      if (res.walletBalance <= 0) {
        setUseWallet(false);
      }
    } catch (err) {
      console.error("Failed to load wallet balance:", err);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [user?._id]);

  useEffect(() => {
    if (cartDetails._id && selectedAddress) {
      fetchBill(cartDetails._id);
    }
  }, [cartDetails._id, selectedAddress, useWallet]);

  const updateQuantity = async (productId, change) => {
    try {
      setButtonLoading(productId);
      const selectedItem = items.find(
        (item) => item.productId._id === productId
      );
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
        setUseWallet(false);
      }
    } catch (error) {
      console.error("Failed to clear cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletToggle = (e) => {
    if (walletBalance <= 0) return;
    const newUseWallet = e.target.checked;
    setUseWallet(newUseWallet);
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
      <div className="text-white p-4 flex items-center gap-3 bg-[#ea4525]">
        <div className="relative">
          <ShoppingBasket size={24} />
          <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-[#ea4525]">
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
            <div
              key={item.productId._id}
              className="bg-white rounded-lg p-3 sm:p-4"
            >
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
                      className={`p-1 ${
                        buttonLoading === item.productId._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, 1)}
                      disabled={buttonLoading === item.productId._id}
                      className={`p-1 ${
                        buttonLoading === item.productId._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    disabled={buttonLoading === item.productId._id}
                    className={`text-white w-5 h-5 rounded flex items-center justify-center bg-red-500 ${
                      buttonLoading === item.productId._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-80"
                    }`}
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

      {items.length > 0 && (
        <div className="p-4 space-y-2 border-t">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Sub Total:</span>
            <span className="font-medium">
              ₹{(bill?.subtotal || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Discount:</span>
            <div className="text-right">
              <div className="font-medium text-[#ea4525]">
                - ₹{(bill?.discount || 0).toFixed(2)}
              </div>
              {bill?.offersApplied?.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  {bill.offersApplied.map((offer, index) => (
                    <div key={index}>• {offer}</div>
                  ))}
                </div>
              )}
            </div>



               {bill?.offersApplied?.length > 0 && (
      <div className="space-y-2 animate-fadeIn">
        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
          Applied Offers:
        </div>
       {bill?.offersApplied?.length > 0 && (
  <div className="space-y-2 animate-fadeIn">
    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
      <Tag size={14} /> Applied Offers:
    </div>
    {bill.offersApplied.map((offer, index) => (
      <div 
        key={index} 
        className="flex justify-between text-xs sm:text-sm pl-6 animate-slideIn"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <span className="text-green-600">{offer?.name || 'Offer'}</span>
        <span className="text-green-600">
          - ₹{(offer?.discountValue || 0).toFixed(2)}
        </span>
      </div>
    ))}
  </div>
)}
      </div>
    )}
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Tax:</span>
            <span className="font-medium">₹{(bill?.tax || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Delivery Fee:</span>
            <span className="font-medium">
              ₹{(bill?.deliveryFee || 0).toFixed(2)}
            </span>
          </div>
          {/* Show Surge Fee if applicable */}
        {bill?.isSurge && (
  <div className="flex justify-between text-sm sm:text-base animate-pulseOnce">
    <span className="font-medium flex items-center gap-1">
      <svg 
        className="w-4 h-4 text-yellow-500 animate-bounce" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Surge Fee
      {bill?.surgeReason && (
        <span className="text-xs text-gray-500">({bill.surgeReason})</span>
      )}
    </span>
    <span className="font-medium text-yellow-600">₹{(bill?.surgeFee || 0).toFixed(2)}</span>
  </div>
)}

          <div className="flex items-center justify-between text-sm sm:text-base pt-2">
            <label className="font-medium flex items-center gap-2">
              <input
                type="checkbox"
                disabled={walletBalance <= 0 || walletLoading}
                checked={walletBalance > 0 && useWallet}
                onChange={handleWalletToggle}
              />
              Use Wallet (₹{walletBalance.toFixed(2)} available)
            </label>
          </div>
          {bill?.walletUsed > 0 && (
            <div className="flex justify-between text-sm sm:text-base mb-2">
              <span className="font-medium text-green-600">Wallet Used:</span>
              <span className="font-medium text-green-600">
                - ₹{bill.walletUsed.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm sm:text-base font-semibold border-t pt-2">
            <span>Payable Now:</span>
            <span>₹{(bill?.payable ?? bill?.total ?? 0).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
