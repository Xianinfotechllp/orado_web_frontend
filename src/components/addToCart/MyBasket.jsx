import React, { useState, useEffect } from "react";
import {
  ShoppingBasket,
  Plus,
  Minus,
  Delete,
  RefreshCw,
  Trash2,
  Zap,
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getBillSummary, placeOrder } from "../../apis/orderApi";
import { getWalletBalance } from "../../apis/walletApi";
import {
  clearCartApi,
  getCart,
  removeFromCart,
  updateCart,
} from "../../apis/cartApi";
import { loadRazorpayScript } from "../../utility/razorpay";
import { setCart, clearCart, setCartId } from "../../slices/cartSlice";
import { setSelectedAddress } from "../../slices/addressSlice";
import OrderSuccessModal from "./OrderSuccessfullModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyBasket({ useWallet, setUseWallet }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [cartDetails, setCartDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState({});
  const [buttonLoading, setButtonLoading] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("60-70 mins");

  const user = useSelector((state) => state.auth.user);
  const cartId = useSelector((state) => state.cart.cartId);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  // Fetch bill summary
  const fetchBill = async (cartId) => {
  if (!cartId) {
    setError("Cart ID is required");
    return;
  }

  if (!selectedAddress?.location) {
    setError("Please select a valid delivery address");
    return;
  }

  // Handle both location formats
  const { longitude, latitude } = (() => {
    const loc = selectedAddress.location;
    return loc.coordinates 
      ? { longitude: loc.coordinates[0], latitude: loc.coordinates[1] }
      : { longitude: loc.longitude, latitude: loc.latitude };
  })();

  try {
    setError(null);
    setBillLoading(true);
    setDeliveryAvailable(true);
    
    const billRes = await getBillSummary({
      userId: user._id,
      longitude,
      latitude,
      cartId,
      useWallet: Boolean(useWallet),
    });

    console.log(billRes,"why........")
    
    if (billRes.error) {
      if (billRes.error.includes("do not deliver to your location")) {
        setBill({});
        setDeliveryAvailable(false);
        setError({
          code: "DELIVERY_UNAVAILABLE",
          message: "Delivery unavailable to selected location"
        });
      } else {
        throw new Error(billRes.error);
      }
    } else if (!billRes.data) {
      throw new Error("Invalid response from server");
    } else {
      // ✅ Add the fix here - this replaces your existing success handling
      setBill({ ...billRes.data, deliveryAvailable: true });
      setDeliveryAvailable(true);
      setError(null); // Explicitly clear errors
    }
  } catch (err) {
    console.error("Error fetching bill summary", err);
    setError({
      message: err.message || "Failed to fetch bill summary. Please try again."
    });
  } finally {
    setBillLoading(false);
  }
};

  // Fetch cart data
  const fetchCartData = async () => {
    if (!user?._id) return;
    try {
      setError(null);
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
      setError("Failed to load your cart. Please try again.");
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
      setError(null);
      setWalletLoading(true);
      const res = await getWalletBalance();
      setWalletBalance(res.walletBalance);
      if (res.walletBalance <= 0) {
        setUseWallet(false);
      }
    } catch (err) {
      console.error("Failed to load wallet balance:", err);
      setError("Failed to load wallet balance.");
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  useEffect(() => {
    fetchCartData();
  }, [user?._id]);

useEffect(() => {
  const timer = setTimeout(() => {
    if (cartDetails._id && selectedAddress?.location) {
      fetchBill(cartDetails._id);
    }
  }, 500);
  return () => clearTimeout(timer);
}, [selectedAddress, cartDetails._id, useWallet]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cartDetails._id && selectedAddress?.location) {
        fetchBill(cartDetails._id);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [selectedAddress]);



const handlePlaceOrder = async () => {
  if (!selectedAddress) {
    setError("Please select a delivery address first");
    return;
  }

  if (!cartId) {
    setError("No cart items found. Please add items to cart first");
    return;
  }

  try {
    setLoading(true);
    setError(null);

    if (paymentMethod === "cash") {
      // 👉 Cash order flow
      const orderPayload = {
        cartId,
        userId: user._id,
        paymentMethod,
        useWallet,
        cookingInstructions,
        longitude: selectedAddress.location.longitude,
        latitude: selectedAddress.location.latitude,
        street: selectedAddress.street,
        area: selectedAddress.area,
        landmark: selectedAddress.landmark,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.zip,
        country: selectedAddress.country,
        instructions: cookingInstructions
      };

      const res = await placeOrder(orderPayload);

      if (res?.orderId) {
        dispatch(clearCart());
        await clearCartApi(user._id);
        setOrderSuccess(true);
        setOrderId(res.orderId);
      }

    } else if (paymentMethod === "card") {  

        const resScript = await loadRazorpayScript();



  if (!resScript) {
    alert("Failed to load Razorpay SDK. Please check your connection.");
    setLoading(false);
    return;
  }
      // 👉 Online payment flow
const amountInPaise = Math.round((bill?.payable ?? bill?.total ?? 0));
      // 1️⃣ Create Razorpay order from backend
      const { data } = await axios.post("http://localhost:5000/payments/create-order", {
       amount: amountInPaise // your calculated cart total
      });

      // 2️⃣ Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:amountInPaise,
        currency: "INR",
        name: "Orado Food Delivery",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          // 3️⃣ Verify payment at backend
          await axios.post("http://localhost:5000/payments/verify", {
            order_id: data.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          // 4️⃣ Place the order now (after payment success)
          const orderPayload = {
            cartId,
            userId: user._id,
            paymentMethod,
            paymentStatus: "success",
            razorpayPaymentId: response.razorpay_payment_id,
            useWallet,
            cookingInstructions,
            longitude: selectedAddress.location.longitude,
            latitude: selectedAddress.location.latitude,
            street: selectedAddress.street,
            area: selectedAddress.area,
            landmark: selectedAddress.landmark,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.zip,
            country: selectedAddress.country,
            instructions: cookingInstructions
          };

          const res = await placeOrder(orderPayload);

          if (res?.orderId) {
            dispatch(clearCart());
            await clearCartApi(user._id);
            setOrderSuccess(true);
            setOrderId(res.orderId);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: "#ff5500",
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }

  } catch (error) {
    console.error("Failed to place order:", error);
    const errorMsg = error.response?.data?.message || 
                    "Failed to place order. Please try again.";
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};


  const handleOrderModalClose = () => {
    setOrderSuccess(false);
    navigate(`/orders/${orderId}`);
  };

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
      setError("Failed to update item quantity. Please try again.");
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
      setError("Failed to remove item from cart. Please try again.");
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
      setError("Failed to clear your cart. Please try again.");
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
      {/* Order success modal */}
      {orderSuccess && (
        <OrderSuccessModal
          orderId={orderId}
          estimatedDelivery={estimatedDelivery}
          onClose={handleOrderModalClose}
        />
      )}

      {/* Error Message Display */}
      {error && (
        <div className={`p-3 flex items-start gap-2 ${
          error.code === "DELIVERY_UNAVAILABLE" 
            ? "bg-yellow-50 border-l-4 border-yellow-400" 
            : "bg-red-50 border-b border-red-100"
        }`}>
          <AlertCircle 
            size={18} 
            className={`mt-0.5 flex-shrink-0 ${
              error.code === "DELIVERY_UNAVAILABLE" 
                ? "text-yellow-500" 
                : "text-red-500"
            }`} 
          />
          <div className="flex-1 text-sm">
            <p className={
              error.code === "DELIVERY_UNAVAILABLE" 
                ? "text-yellow-700" 
                : "text-red-600"
            }>
              {console.log(error)}
             Sorry, we don’t deliver to this location yet
            </p>
            {error.code === "DELIVERY_UNAVAILABLE" && (
              <p className="text-yellow-600 text-xs mt-1">
                Please try a different delivery address
              </p>
            )}
          </div>
          <button 
            onClick={() => setError(null)} 
            className={`text-lg ${
              error.code === "DELIVERY_UNAVAILABLE" 
                ? "text-yellow-400 hover:text-yellow-600" 
                : "text-red-400 hover:text-red-600"
            }`}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

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

      {/* Address Display Section */}
      {selectedAddress && (
        <div className="bg-white border border-gray-300 rounded-lg p-4 m-4">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-orange-600 font-medium text-base">Delivery Address</h2>
          </div>
          <div className="space-y-2">
            <h3 className="text-black font-medium text-base">
              {selectedAddress?.type || "Selected Address"}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-3 space-y-3 sm:p-4 sm:space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-600 font-medium py-8 space-y-4">
            <p>Your basket is empty.</p>
            <button
              onClick={fetchCartData}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition mx-auto"
            >
              <RefreshCw size={16} /> Refresh Basket
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId._id}
              className="bg-white rounded-lg p-3 sm:p-4 shadow-sm"
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
      {billLoading ? (
        <div className="p-4 space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ) : items.length > 0 && deliveryAvailable ? (
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
            </div>
          </div>

          {bill?.offersApplied?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Tag size={14} /> Applied Offers:
              </div>
              {bill.offersApplied.map((offer, index) => (
                <div
                  key={index}
                  className="flex justify-between text-xs sm:text-sm pl-6"
                >
                  <span className="text-green-600">
                    {typeof offer === 'string' ? offer : offer?.name || "Offer"}
                  </span>
                  {bill?.discount > 0 && index === 0 && (
                    <span className="text-green-600">
                      - ₹{(bill?.discount || 0).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="font-medium">Tax Total:</span>
              <span className="font-medium">₹{(bill?.tax || 0).toFixed(2)}</span>
            </div>
            
            {bill?.taxes?.map((taxItem, index) => (
              <div key={index} className="flex justify-between text-xs pl-4 text-gray-600">
                <span>
                  {taxItem.name} ({taxItem.percentage}%):
                </span>
                <span>₹{taxItem.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm sm:text-base">
            <span className="font-medium">Delivery Fee:</span>
            <span className="font-medium">
              ₹{(bill?.deliveryFee || 0).toFixed(2)}
            </span>
          </div>

          {bill?.isSurge && (
            <div className="flex justify-between text-sm sm:text-base animate-pulseOnce">
              <span className="font-medium flex items-center gap-1">
                <Zap size={14} className="text-yellow-500 animate-bounce" />
                Surge Fee
                {bill?.surgeReason && (
                  <span className="text-xs text-gray-500">
                    ({bill.surgeReason})
                  </span>
                )}
              </span>
              <span className="font-medium text-yellow-600">
                ₹{(bill?.surgeFee || 0).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm sm:text-base pt-2">
            <label className="font-medium flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                disabled={walletBalance <= 0 || walletLoading}
                checked={walletBalance > 0 && useWallet}
                onChange={handleWalletToggle}
                className="cursor-pointer"
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
      ) : null}

      <div className="p-4 space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Cooking Instructions (optional)
        </label>
        <textarea
          value={cookingInstructions}
          onChange={(e) => setCookingInstructions(e.target.value)}
          placeholder="E.g. Less spicy, no onion, extra sauce..."
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm resize-none"
        />
      </div>

      {/* Payment Method Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-black font-medium text-base mb-4">Choose Payment Method</h2>

        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-gray-700">Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-gray-700">Pay online</span>
          </label>
        </div>

        

        {/* Checkout Button */}
        {items.length > 0 && (
          <button
            onClick={handlePlaceOrder}
            disabled={!deliveryAvailable || error || loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white mt-4 flex items-center justify-center ${
              !deliveryAvailable || error
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Placing Order...
              </>
            ) : !deliveryAvailable ? (
              "Delivery Unavailable"
            ) : (
              "Proceed to Pay"
            )}
          </button>
        )}
      </div>
    </div>
  );
}