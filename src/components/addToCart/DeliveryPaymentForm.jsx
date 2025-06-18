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
import { Loader2, AlertCircle, CheckCircle  ,Plus} from "lucide-react"; // Import icons

export default function DeliveryPaymentForm({ useWallet }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [localSelectedAddress, setLocalSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState("60-70 mins");
  
  // Loading and error states
  const [loading, setLoading] = useState({
    addresses: false,
    placingOrder: false,
    updatingAddress: false,
    addingAddress: false
  });
  const [error, setError] = useState({
    addresses: null,
    order: null,
    addressUpdate: null,
    addressAdd: null
  });

  const user = useSelector((state) => state.auth.user);
  const cartId = useSelector((state) => state.cart.cartId);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(prev => ({...prev, addresses: true}));
        setError(prev => ({...prev, addresses: null}));
        const res = await getAddress(user._id);
        setAddresses(res.data);
        if (res.data?.length > 0) {
          setLocalSelectedAddress(res.data[0]);
          dispatch(setSelectedAddress(res.data[0]));
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        setError(prev => ({...prev, addresses: "Failed to load addresses"}));
      } finally {
        setLoading(prev => ({...prev, addresses: false}));
      }
    };
    
    if (user?._id) fetchAddresses();
  }, [user?._id, dispatch]);

  const handleAddressUpdate = async (updatedAddress) => {
    try {
      setLoading(prev => ({...prev, updatingAddress: true}));
      setError(prev => ({...prev, addressUpdate: null}));
      
    
      await updateAddress(updatedAddress.addressId, updatedAddress);
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.addressId === updatedAddress.addressId ? updatedAddress : addr
        )
      );
    
      if (localSelectedAddress?.addressId === updatedAddress.addressId) {
        setLocalSelectedAddress(updatedAddress);
        dispatch(setSelectedAddress(updatedAddress));
      }
    } catch (error) {
      console.error("Failed to update address:", error);
      setError(prev => ({...prev, addressUpdate: "Failed to update address"}));
    } finally {
      setLoading(prev => ({...prev, updatingAddress: false}));
    }
  };

  const handlePlaceOrder = async () => {
    if (!localSelectedAddress) {
      setError(prev => ({...prev, order: "Please select a delivery address first"}));
      return;
    }

    if (!cartId) {
      setError(prev => ({...prev, order: "No cart items found. Please add items to cart first"}));
      return;
    }

    try {
      setLoading(prev => ({...prev, placingOrder: true}));
      setError(prev => ({...prev, order: null}));
      
      const orderPayload = {
        cartId: cartId,
        userId: user._id,
        paymentMethod,
        useWallet,
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
      
      const res = await placeOrder(orderPayload);

      if (res?.orderId) {
        // Clear Redux and backend cart
        dispatch(clearCart());
        await clearCartApi(user._id);
        
        setOrderSuccess(true);
        setOrderId(res.orderId);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      const errorMsg = error.response?.data?.message || 
                      "Failed to place order. Please try again.";
      setError(prev => ({...prev, order: errorMsg}));
    } finally {
      setLoading(prev => ({...prev, placingOrder: false}));
    }
  };

  const handleOrderModalClose = () => {
    setOrderSuccess(false);
    navigate(`/orders/${orderId}`);
  };

  // Loading skeleton for addresses
  if (loading.addresses) {
    return (
      <div className="w-full space-y-4">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-300 rounded-lg p-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Order success modal */}
      {orderSuccess && (
        <OrderSuccessModal
          orderId={orderId}
          estimatedDelivery={estimatedDelivery}
          onClose={handleOrderModalClose}
        />
      )}

      {/* Error messages */}
      {error.order && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error.order}</p>
          </div>
        </div>
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

        {addresses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-3">No addresses saved yet</p>
            <button
              onClick={() => setShowNewAddressForm(true)}
              className="text-orange-600 font-medium hover:underline"
            >
              + Add New Address
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-black font-medium text-base">
              {localSelectedAddress?.type || "Select an address"}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {localSelectedAddress
                ? `${localSelectedAddress.street}, ${localSelectedAddress.city}, ${localSelectedAddress.state}, ${localSelectedAddress.zip}`
                : "Please select an address from below"}
            </p>
            <p className="text-black font-medium text-sm mt-3">68 mins</p>
          </div>
        )}
      </div>

      {/* Address List */}
      <div>
        {addresses?.map((address) => (
          <div
            key={address.addressId}
            className={`bg-white border rounded-lg p-4 mb-4 cursor-pointer transition-colors ${
              localSelectedAddress?.addressId === address.addressId
                ? "border-orange-600 bg-orange-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              setLocalSelectedAddress(address);
              dispatch(setSelectedAddress(address));
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <h3 className="text-orange-600 font-medium text-base">{address.type}</h3>
                {localSelectedAddress?.addressId === address.addressId && (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                )}
              </div>
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

        {/* Address Forms */}
        {editingAddress && (
          <EditAddressForm
            address={editingAddress}
            userId={user._id}
            loading={loading.updatingAddress}
            error={error.addressUpdate}
            onClose={() => setEditingAddress(null)}
            onUpdate={(form) => {
              setEditingAddress(null);
              handleAddressUpdate(form);
            }}
          />
        )}
              handleAddressUpdate(form);

        {showNewAddressForm && (
          <NewAddressForm
            userId={user._id}
            loading={loading.addingAddress}
            error={error.addressAdd}
            onClose={() => setShowNewAddressForm(false)}
            onAdd={async (newAddress) => {
              console.log(newAddress,"new addres sform")
              try {
            
                setLoading(prev => ({...prev, addingAddress: true}));
                setError(prev => ({...prev, addressAdd: null}));
                const res = await addAddress(user._id, newAddress);
                setAddresses((prev) => [...prev, res.data]);
                setLocalSelectedAddress(res.data);
                dispatch(setSelectedAddress(res.data));
                setShowNewAddressForm(false);
              } catch (error) {
                console.error("Failed to add address:", error);
                setError(prev => ({...prev, addressAdd: "Failed to add address"}));
              } finally {
                setLoading(prev => ({...prev, addingAddress: false}));
              }
            }}
          />
        )}
      </div>

      <button
        className="text-orange-600 text-sm font-medium hover:underline mt-2 flex items-center"
        onClick={() => setShowNewAddressForm(true)}
      >
        <Plus className="w-4 h-4 mr-1" /> Add New Address
      </button>

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
            <span className="text-gray-700">Card Payment</span>
          </label>
        </div>

        <button
          className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded text-base transition-colors mt-4 flex items-center justify-center ${
            loading.placingOrder ? "opacity-75 cursor-not-allowed" : ""
          }`}
          onClick={handlePlaceOrder}
          disabled={loading.placingOrder}
        >
          {loading.placingOrder ? (
            <>
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Placing Order...
            </>
          ) : (
            "Proceed To Pay"
          )}
        </button>
      </div>
    </div>
  );
}