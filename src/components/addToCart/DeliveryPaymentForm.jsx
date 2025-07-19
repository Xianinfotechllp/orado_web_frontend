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
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  MapPin, 
  Edit3, 
  Clock,
  CreditCard,
  Banknote,
  ChevronRight,
  Home,
  Building2,
  Briefcase
} from "lucide-react";

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

  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
      case 'office':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  // Loading skeleton for addresses
  if (loading.addresses) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          </div>
        </div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded-lg w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Order success modal */}
      {orderSuccess && (
        <OrderSuccessModal
          orderId={orderId}
          estimatedDelivery={estimatedDelivery}
          onClose={handleOrderModalClose}
        />
      )}

      {/* Error Alert */}
      {error.order && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mx-4 sm:mx-0">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium text-sm">Order Error</h3>
              <p className="text-red-700 text-sm mt-1">{error.order}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Delivery Details</h1>
        <p className="text-gray-600">Choose your delivery address and payment method</p>
      </div>

      {/* Current Selected Address Card */}
      {localSelectedAddress && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-200 rounded-xl text-orange-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delivering to</h3>
                <p className="text-sm text-gray-600">Your selected address</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewAddressForm(true)}
              className="text-orange-600 text-sm font-medium hover:text-orange-700 transition-colors"
            >
              Change
            </button>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-orange-600 mt-1">
              {getAddressIcon(localSelectedAddress.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium text-gray-900 capitalize">{localSelectedAddress.type}</h4>
                <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                  Selected
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {localSelectedAddress.street}, {localSelectedAddress.area && `${localSelectedAddress.area}, `}
                {localSelectedAddress.city}, {localSelectedAddress.state} {localSelectedAddress.zip}
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">68 mins</span>
                <span className="text-gray-500 text-sm">• Estimated delivery</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Addresses Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Delivery Addresses</h2>
            <button
              onClick={() => setShowNewAddressForm(true)}
              className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm font-medium">Add New</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">Add your first delivery address to continue</p>
              <button
                onClick={() => setShowNewAddressForm(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.addressId}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    localSelectedAddress?.addressId === address.addressId
                      ? "border-orange-300 bg-orange-50 ring-2 ring-orange-100"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => {
                    setLocalSelectedAddress(address);
                    dispatch(setSelectedAddress(address));
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      localSelectedAddress?.addressId === address.addressId
                        ? "bg-orange-200 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {getAddressIcon(address.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-medium capitalize ${
                            localSelectedAddress?.addressId === address.addressId
                              ? "text-orange-900"
                              : "text-gray-900"
                          }`}>
                            {address.type}
                          </h3>
                          {localSelectedAddress?.addressId === address.addressId && (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600 font-medium">Selected</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                          }}
                          className="flex items-center space-x-1 text-gray-500 hover:text-orange-600 transition-colors p-1"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {address.street}
                        {address.area && `, ${address.area}`}
                        <br />
                        {address.city}, {address.state} {address.zip}
                      </p>
                      
                      {address.landmark && (
                        <p className="text-gray-500 text-xs mt-2">
                          Near {address.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {localSelectedAddress?.addressId === address.addressId && (
                    <div className="absolute inset-0 ring-2 ring-orange-300 rounded-xl pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Method Section */}
      {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          <p className="text-gray-600 text-sm mt-1">Choose how you'd like to pay</p>
        </div>

        <div className="p-6 space-y-4">
          <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
            paymentMethod === "cash" 
              ? "border-orange-300 bg-orange-50 ring-2 ring-orange-100" 
              : "border-gray-200 hover:border-gray-300"
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                paymentMethod === "cash" ? "bg-orange-200 text-orange-600" : "bg-gray-100 text-gray-600"
              }`}>
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                <p className="text-gray-600 text-sm">Pay with cash when order arrives</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5 text-orange-600 focus:ring-orange-500"
            />
          </label>

          <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
            paymentMethod === "card" 
              ? "border-orange-300 bg-orange-50 ring-2 ring-orange-100" 
              : "border-gray-200 hover:border-gray-300"
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                paymentMethod === "card" ? "bg-orange-200 text-orange-600" : "bg-gray-100 text-gray-600"
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Card Payment</h3>
                <p className="text-gray-600 text-sm">Pay securely with your card</p>
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5 text-orange-600 focus:ring-orange-500"
            />
          </label>
        </div>
      </div> */}

      {/* Place Order Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4">
        {/* <button
          className={`w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 ${
            loading.placingOrder || !localSelectedAddress ? "opacity-75 cursor-not-allowed transform-none" : ""
          }`}
          onClick={handlePlaceOrder}
          disabled={loading.placingOrder || !localSelectedAddress}
        >
          {loading.placingOrder ? (
            <>
              <Loader2 className="animate-spin h-6 w-6" />
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>Place Order</span>
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </button> */}
        
        {!localSelectedAddress && (
          <p className="text-center text-red-600 text-sm mt-2">
            Please select a delivery address to continue
          </p>
        )}
      </div>

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
       
      {showNewAddressForm && (
        <NewAddressForm
          userId={user._id}
          loading={loading.addingAddress}
          error={error.addressAdd}
          onClose={() => setShowNewAddressForm(false)}
          onAdd={async (newAddress) => {
            console.log(newAddress,"new address form")
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
  );
}