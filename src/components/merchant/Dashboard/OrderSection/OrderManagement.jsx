import React, { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Phone, Utensils, User, ShoppingBag, Bell, BellOff, Pause, Play, AlertTriangle, X, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { getOrdersByMerchant, updateOrderStatus, sendOrderDelayReason } from "../../../../apis/orderApi";
import { toast } from "react-toastify";
import RestaurantSlider from "../Slider/RestaurantSlider";

const statusColors = {
  pending: "bg-yellow-500",
  accepted_by_restaurant: "bg-blue-500",
  rejected_by_restaurant: "bg-red-500",
  preparing: "bg-orange-500",
  ready: "bg-purple-500",
  completed: "bg-green-500",
};

const statusLabels = {
  pending: "Pending",
  accepted_by_restaurant: "Accepted",
  rejected_by_restaurant: "Rejected",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  completed: "Completed",
};

const getStatusOptions = (currentStatus) => {
  const statusFlow = [
    "pending",
    "accepted_by_restaurant",
    "rejected_by_restaurant",
    "preparing",
    "ready",
    "completed",
  ];

  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex === -1) return [];

  if (currentStatus === "pending") {
    return ["accepted_by_restaurant", "rejected_by_restaurant"];
  }

  if (currentStatus === "accepted_by_restaurant") {
    return ["preparing", "rejected_by_restaurant"];
  }

  if (currentStatus === "preparing") {
    return ["ready", "rejected_by_restaurant"];
  }

  if (currentStatus === "ready") {
    return ["completed"];
  }

  return [];
};

// Delay Reason Modal Component
const DelayReasonModal = ({ isOpen, onClose, orderId, onSubmit, loading }) => {
  const [delayReason, setDelayReason] = useState("");
  const [additionalTime, setAdditionalTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!delayReason.trim()) {
      toast.error("Please provide a reason for the delay");
      return;
    }
    
    const preparationTime = additionalTime ? parseInt(additionalTime) : null;
    onSubmit(orderId, delayReason.trim(), preparationTime);
    setDelayReason("");
    setAdditionalTime("");
  };

  const handleClose = () => {
    setDelayReason("");
    setAdditionalTime("");
    onClose();
  };

  if (!isOpen) return null;

  const predefinedReasons = [
    "High order volume - kitchen busy",
    "Ingredient preparation taking longer",
    "Special dietary requirements",
    "Equipment maintenance issue",
    "Staff shortage",
    "Complex order preparation",
    "Quality check taking extra time"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            Order Delay Notification
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            This order has exceeded the preparation time. Please provide a reason for the delay to keep the customer informed.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Delay *
            </label>
            
            {/* Predefined reasons */}
            <div className="space-y-2 mb-3">
              {predefinedReasons.map((reason, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setDelayReason(reason)}
                  className={`w-full text-left px-3 py-2 text-sm border rounded-md transition-colors ${
                    delayReason === reason
                      ? "border-orange-500 bg-orange-50 text-orange-800"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {/* Custom reason input */}
            <textarea
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              placeholder="Or type a custom reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows="3"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Preparation Time (minutes)
            </label>
            <input
              type="number"
              value={additionalTime}
              onChange={(e) => setAdditionalTime(e.target.value)}
              placeholder="e.g., 15"
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional: Estimated additional time needed to complete the order
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !delayReason.trim()}
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Timer Component for individual orders
const OrderTimer = ({ order, onTimeUp, onDelayModalOpen }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isBeeping, setIsBeeping] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [showDelayButton, setShowDelayButton] = useState(false);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const beepIntervalRef = useRef(null);
  const snoozeTimeoutRef = useRef(null);

  // Cleanup function to stop all timers and audio
  const cleanupTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
    if (snoozeTimeoutRef.current) {
      clearTimeout(snoozeTimeoutRef.current);
      snoozeTimeoutRef.current = null;
    }
    setIsBeeping(false);
    setIsSnoozed(false);
  };

  // Initialize timer when order is preparing
  useEffect(() => {
    // Clean up first
    cleanupTimers();
    
    if (order.orderStatus === 'preparing' && !order.timerStarted) {
      const startTime = new Date(order.updatedAt || order.createdAt);
      const preparationTimeMinutes = order.preparationTime || 20; // Use dynamic preparation time from backend
      const endTime = new Date(startTime.getTime() + preparationTimeMinutes * 60 * 1000);
      
      const updateTimer = () => {
        const now = new Date();
        const remaining = endTime - now;
        
        if (remaining <= 0) {
          setTimeLeft(0);
          setShowDelayButton(true);
          onTimeUp && onTimeUp(order._id);
          cleanupTimers();
          return;
        }
        
        setTimeLeft(Math.floor(remaining / 1000));
        
        // Start beeping in last 5 minutes (300 seconds)
        if (remaining <= 300000 && !isSnoozed) {
          if (!isBeeping) {
            setIsBeeping(true);
            startBeeping();
          }
        }
      };
      
      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);
    }
    
    // Stop timer and beeping when order is ready for pickup or completed
    if (order.orderStatus === 'ready' || order.orderStatus === 'completed') {
      setTimeLeft(null);
      setShowDelayButton(false);
      cleanupTimers();
    }
    
    return () => {
      cleanupTimers();
    };
  }, [order.orderStatus, order.updatedAt, order.createdAt, order._id, order.preparationTime]);

  // Separate effect for snooze state changes
  useEffect(() => {
    if (!isSnoozed && timeLeft > 0 && timeLeft <= 300 && order.orderStatus === 'preparing') {
      if (!isBeeping) {
        setIsBeeping(true);
        startBeeping();
      }
    }
  }, [isSnoozed, timeLeft, order.orderStatus]);

  const startBeeping = () => {
    // Stop any existing beeping first
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
    }
    
    // Create audio context for beep sound
    if (!audioRef.current) {
      try {
        audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.error('Audio context creation failed:', error);
        return;
      }
    }
    
    const playBeep = () => {
      try {
        // Check if we should still be beeping
        if (order.orderStatus !== 'preparing' || isSnoozed) {
          return;
        }
        
        const oscillator = audioRef.current.createOscillator();
        const gainNode = audioRef.current.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioRef.current.destination);
        
        oscillator.frequency.setValueAtTime(800, audioRef.current.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioRef.current.currentTime + 0.5);
        
        oscillator.start(audioRef.current.currentTime);
        oscillator.stop(audioRef.current.currentTime + 0.5);
      } catch (error) {
        console.error('Beep playback failed:', error);
      }
    };
    
    // Play initial beep
    playBeep();
    
    // Beep every 10 seconds
    beepIntervalRef.current = setInterval(() => {
      // Double check conditions before each beep
      if (order.orderStatus === 'preparing' && !isSnoozed && timeLeft > 0) {
        playBeep();
      } else {
        // Stop beeping if conditions are no longer met
        if (beepIntervalRef.current) {
          clearInterval(beepIntervalRef.current);
          beepIntervalRef.current = null;
        }
        setIsBeeping(false);
      }
    }, 10000);
  };

  const handleSnooze = () => {
    setIsSnoozed(true);
    setSnoozeCount(prev => prev + 1);
    setIsBeeping(false);
    
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
    
    // Resume beeping after 2 minutes
    snoozeTimeoutRef.current = setTimeout(() => {
      // Only resume if order is still preparing
      if (order.orderStatus === 'preparing' && timeLeft > 0 && timeLeft <= 300) {
        setIsSnoozed(false);
      }
    }, 120000); // 2 minutes
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft === null) return "text-gray-500";
    if (timeLeft <= 0) return "text-red-600";
    if (timeLeft <= 300) return "text-red-600"; // Last 5 minutes
    if (timeLeft <= 600) return "text-orange-600"; // Last 10 minutes
    return "text-green-600";
  };

  // Only show timer for preparing orders
  if (order.orderStatus !== 'preparing') {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <Clock className={`w-4 h-4 ${getTimerColor()}`} />
      <span className={`font-mono text-sm font-semibold ${getTimerColor()}`}>
        {timeLeft !== null ? (timeLeft <= 0 ? "OVERDUE!" : formatTime(timeLeft)) : "Starting..."}
      </span>
      
      {isBeeping && !isSnoozed && (
        <div className="flex items-center space-x-1">
          <Bell className="w-4 h-4 text-red-600 animate-pulse" />
          <button
            onClick={handleSnooze}
            className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded"
            title="Snooze for 2 minutes"
          >
            <Pause className="w-3 h-3" />
          </button>
        </div>
      )}
      
      {isSnoozed && (
        <div className="flex items-center space-x-1">
          <BellOff className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">Snoozed ({snoozeCount})</span>
        </div>
      )}
      
      {timeLeft <= 300 && timeLeft > 0 && (
        <span className="text-xs text-red-600 font-semibold animate-pulse">
          ⚠️ Alert Zone!
        </span>
      )}

      {/* Show delay notification button when time is up */}
      {showDelayButton && timeLeft <= 0 && (
        <button
          onClick={() => onDelayModalOpen(order._id)}
          className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center space-x-1 animate-pulse"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Send Delay Notice</span>
        </button>
      )}
      
      {/* Show delay reason if already sent */}
      {order.preparationDelayReason && (
        <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 border border-yellow-300 rounded-md">
          <MessageSquare className="w-3 h-3 text-yellow-600" />
          <span className="text-xs text-yellow-800">Delay reason sent</span>
        </div>
      )}
    </div>
  );
};

const OrderManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [delayLoading, setDelayLoading] = useState(false);
  
  const currentRestaurantId =
    selectedRestaurant !== null ? restaurants[selectedRestaurant]?.id : null;

  const fetchRestaurantOrders = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await getOrdersByMerchant(restaurantId);
      console.log("Fetched orders:", response);
      setOrders(response.orders || []);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = async (restaurant, index) => {
    setSelectedRestaurant(index);
    if (restaurant?.id) {
      await fetchRestaurantOrders(restaurant.id);
    }
  };

  const handleRestaurantsLoad = (restaurantData) => {
    setRestaurants(restaurantData);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      await fetchRestaurantOrders(currentRestaurantId);
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(
        error.response?.data?.error || "Failed to update order status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTimerExpired = (orderId) => {
    toast.error("⏰ Order preparation time exceeded!", {
      position: "top-center",
      autoClose: false,
    });
  };

  const handleDelayModalOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setDelayModalOpen(true);
  };

  const handleDelayModalClose = () => {
    setDelayModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleDelayReasonSubmit = async (orderId, delayReason, preparationTime) => {
    try {
      setDelayLoading(true);
      await sendOrderDelayReason(orderId, delayReason, preparationTime);
      toast.success("Delay notification sent to customer successfully!");
      setDelayModalOpen(false);
      setSelectedOrderId(null);
      // Refresh orders to show updated delay reason
      await fetchRestaurantOrders(currentRestaurantId);
    } catch (error) {
      console.error("Failed to send delay reason:", error);
      toast.error(
        error.response?.data?.message || "Failed to send delay notification"
      );
    } finally {
      setDelayLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Slider Component */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
        selectedIndex={selectedRestaurant}
        className=""
        showError={true}
      />

      {/* Delay Reason Modal */}
      <DelayReasonModal
        isOpen={delayModalOpen}
        onClose={handleDelayModalClose}
        orderId={selectedOrderId}
        onSubmit={handleDelayReasonSubmit}
        loading={delayLoading}
      />

      {/* Orders List */}
      <div className="grid gap-4">
        {loading && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Loading orders...</div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No orders found</div>
            <p className="text-gray-500">
              Orders for the selected restaurant will appear here
            </p>
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order._id}
            className="overflow-hidden bg-white rounded-lg border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Order #{order.orderNumber || order._id.substring(0, 6)}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • Est. delivery: {order.estimatedDeliveryTime || "N/A"}
                    </div>
                    
                    {/* Timer Component */}
                    <OrderTimer 
                      order={order} 
                      onTimeUp={handleTimerExpired}
                      onDelayModalOpen={handleDelayModalOpen}
                    />

                    {/* Display delay reason if exists */}
                    {order.preparationDelayReason && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-yellow-800">Delay Reason Sent:</p>
                            <p className="text-xs text-yellow-700">{order.preparationDelayReason}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.orderStatus]
                    } text-white`}
                  >
                    {statusLabels[order.orderStatus] || order.orderStatus}
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Customer Details */}
                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Customer Details
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">
                      {order.customerId?.name || "N/A"}
                    </p>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.customerPhone || "N/A"}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {typeof order.deliveryAddress === "string"
                          ? order.deliveryAddress
                          : order.deliveryAddress
                          ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}`
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Agent Details */}
                  {order.assignedAgent && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Delivery Agent
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          <span>{order.assignedAgent.fullName}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{order.assignedAgent.phoneNumber}</span>
                        </div>
                        <div className="flex items-center">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          <span>Delivery Charge: ₹{order.deliveryCharge || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-2">
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.orderItems?.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                ₹{item.price}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                ₹{item.price * item.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-gray-200 pt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{order.subtotal || 0}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{order.discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>₹{order.deliveryCharge || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>₹{order.tax || 0}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                        <span>Total Amount:</span>
                        <span>₹{order.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Update */}
                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Update Status
                  </h4>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    disabled={
                      !getStatusOptions(order.orderStatus).length ||
                      ["rejected_by_restaurant", "completed"].includes(order.orderStatus)
                    }
                  >
                    <option value={order.orderStatus}>
                      {statusLabels[order.orderStatus] || order.orderStatus}
                    </option>
                    {getStatusOptions(order.orderStatus).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status] || status}
                      </option>
                    ))}
                  </select>

                  {order.orderStatus === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "accepted_by_restaurant")
                        }
                        className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "rejected_by_restaurant")
                        }
                        className="flex-1 px-3 py-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Manual delay reason button for preparing orders */}
                  {order.orderStatus === "preparing" && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleDelayModalOpen(order._id)}
                        className="w-full px-3 py-2 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md text-sm flex items-center justify-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Delay Notice</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;