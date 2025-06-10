import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAddress, updateAddress, addAddress } from "../../apis/userApi";
import { placeOrder } from "../../apis/orderApi";
import EditAddressForm from "../address/EditAddressForm";
import NewAddressForm from "../address/NewAddressForm";
import OrderSuccessModal from "./OrderSuccessfullModal";
import { useNavigate } from "react-router-dom";
import { setSelectedAddress } from "../../slices/addressSlice";
import { clearCart, setCartId } from "../../slices/cartSlice";
import { clearCartApi, getCart } from "../../apis/cartApi";
import { persistor } from "../../store/store"; // Import persistor to clear persisted state
import store from "../../store/store"; // Import store to check state after clearing cart

export default function DeliveryPaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [localSelectedAddress, setLocalSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("60-70 mins"); // You can fetch actual ETA if available

  const user = useSelector((state) => state.auth.user);
  const cartId = useSelector((state) => state.cart.cartId);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await getAddress(user._id);
        setAddresses(res.data);
        if (res.data?.length > 0) {
          setLocalSelectedAddress(res.data[0]);
          dispatch(setSelectedAddress(res.data[0]));
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    if (user?._id) fetchAddresses();
  }, [user?._id, dispatch]);

  const handleAddressUpdate = (updatedAddress) => {
    updateAddress(updatedAddress.addressId, updatedAddress)
      .then(() => {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.addressId === updatedAddress.addressId ? updatedAddress : addr
          )
        );
        if (localSelectedAddress?.addressId === updatedAddress.addressId) {
          setLocalSelectedAddress(updatedAddress);
          dispatch(setSelectedAddress(updatedAddress));
        }
      })
      .catch((error) => console.error("Failed to update address:", error));
  };

  const handlePlaceOrder = async () => {
    if (!localSelectedAddress) {
      alert("Please select a delivery address first.");
      return;
    }

    if (!cartId) {
      alert("No cart items found. Please add items to cart first.");
      return;
    }

    try {
      const orderPayload = {
        cartId: cartId,
        userId: user._id,
        paymentMethod,
        longitude: localSelectedAddress.location.longitude,
        latitude: localSelectedAddress.location.latitude,
        street: localSelectedAddress.street,
        area: localSelectedAddress.area,
        landmark: localSelectedAddress.landmark,
        city: localSelectedAddress.city,
        state: localSelectedAddress.state,
        pincode: localSelectedAddress.zip,
        country: localSelectedAddress.country,
      };
      
      console.log("Placing order with payload:", orderPayload);
      
      const res = await placeOrder(orderPayload);
      console.log("Place order response:", res);

      if (res?.orderId) {
        // Clear Redux first
        dispatch(clearCart());
         console.log("Redux cart state after clearing:", store.getState().cart);
        
        // Then clear backend
        const response = await clearCartApi(user._id);
        console.log("Clear cart API response:", response);
        
        // Force refresh
        const freshCart = await getCart();
        if (freshCart?.products?.length) {
          // Should be empty, but handle just in case
          dispatch(clearCart());
          console.log("Cart after clearing:", freshCart);
        }
        
        setOrderSuccess(true);
        setOrderId(res.orderId);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      
      // More specific error messages
      if (error.response?.status === 400) {
        alert("Invalid order data. Please check your cart and try again.");
      } else {
        alert("Failed to place order. Please try again.");
      }
    }
  };

  const handleOrderModalClose = () => {
    setOrderSuccess(false);
    navigate(`/orders/${orderId}`); // Adjust the route if necessary
  };

  return (
    <div className="w-full space-y-4">
      {/* Show order success modal */}
      {orderSuccess && (
        <OrderSuccessModal
          orderId={orderId}
          estimatedDelivery={estimatedDelivery}
          onClose={handleOrderModalClose}
        />
      )}

      {/* Delivery Address Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-orange-600 font-medium text-base">Delivery Address</h2>
          <button
            className="text-orange-600 text-sm font-medium hover:underline"
            onClick={() => setShowNewAddressForm(true)}
          >
            Change
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-black font-medium text-base">
            {localSelectedAddress ? localSelectedAddress.type : "No address selected"}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {localSelectedAddress
              ? `${localSelectedAddress.street}, ${localSelectedAddress.city}, ${localSelectedAddress.state}, ${localSelectedAddress.zip}`
              : "Please add or select an address"}
          </p>
          <p className="text-black font-medium text-sm mt-3">68 mins</p>
        </div>
      </div>

      {/* Address List */}
      <div>
        {addresses?.map((address) => (
          <div
            key={address.addressId}
            className={`bg-white border rounded-lg p-4 mb-4 cursor-pointer ${
              localSelectedAddress?.addressId === address.addressId
                ? "border-orange-600"
                : "border-gray-300"
            }`}
            onClick={() => {
              setLocalSelectedAddress(address);
              dispatch(setSelectedAddress(address));
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-orange-600 font-medium text-base">{address.type}</h3>
              <button
                className="text-orange-600 text-sm font-medium hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingAddress(address);
                }}
              >
                Edit
              </button>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {address.street}, {address.city}, {address.state}, {address.zip}
            </p>
          </div>
        ))}

        {editingAddress && (
          <EditAddressForm
            address={editingAddress}
            userId={user._id}
            onClose={() => setEditingAddress(null)}
            onUpdate={(form) => {
              setEditingAddress(null);
              handleAddressUpdate(form);
            }}
          />
        )}

        {showNewAddressForm && (
          <NewAddressForm
            userId={user._id}
            onClose={() => setShowNewAddressForm(false)}
            onAdd={async (newAddress) => {
              try {
                const res = await addAddress(user._id, newAddress);
                setAddresses((prev) => [...prev, res.data]);
                setLocalSelectedAddress(res.data);
                dispatch(setSelectedAddress(res.data));
                setShowNewAddressForm(false);
              } catch (error) {
                console.error("Failed to add address:", error);
              }
            }}
          />
        )}
      </div>

      <button
        className="text-orange-600 text-sm font-medium hover:underline mt-2"
        onClick={() => setShowNewAddressForm(true)}
      >
        + Add New Address
      </button>

      {/* Payment Method Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-black font-medium text-base mb-4">Choose Payment Method</h2>

        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-gray-700">Cash on Delivery</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className="text-gray-700">Card Payment</span>
          </label>
        </div>

        <button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded text-base transition-colors mt-4"
          onClick={handlePlaceOrder}
        >
          Proceed To Pay
        </button>
      </div>
    </div>
  );
}
