import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Utensils,
  User,
  ShoppingBag,
  Bell,
  BellOff,
  Pause,
  Play,
  AlertTriangle,
  X,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  getOrdersByMerchant,
  updateOrderStatus,
  sendOrderDelayReason,
} from "../../../../apis/orderApi";
import { toast } from "react-toastify";
import RestaurantSlider from "../Slider/RestaurantSlider";
import socket from "../../../../socket/socket";

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

// Custom hook for beep sound
const useBeep = (volume = 0.3) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize HTML5 Audio
    try {
      audioRef.current = new Audio();
      // Simple beep sound (800Hz sine wave, 100ms)
      const beepSound = "/sounds/beep.mp3";
      audioRef.current.src = beepSound;
      audioRef.current.load();
    } catch (e) {
      console.error("HTML5 Audio init error:", e);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const play = () => {
    // Try HTML5 Audio first
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((error) => {
        console.log("HTML5 Audio failed, using Web Audio:", error);
        playWebAudio();
      });
      return;
    }

    // Fallback to Web Audio API
    playWebAudio();
  };

  const playWebAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = 800;
      gainNode.gain.value = volume;

      oscillator.start();
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.error("Web Audio failed:", error);
    }
  };

  return { play };
};

const OrderTimer = ({ order, onTimeUp, onDelayModalOpen }) => {
  const { play: playBeep } = useBeep(0.2); // 20% volume
  const [timeLeft, setTimeLeft] = useState(null);
  const [isBeeping, setIsBeeping] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [showDelayButton, setShowDelayButton] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const beepIntervalRef = useRef(null);
  const snoozeTimeoutRef = useRef(null);

  // Cleanup all intervals and timeouts
  const cleanupTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
    if (snoozeTimeoutRef.current) clearTimeout(snoozeTimeoutRef.current);
    setIsBeeping(false);
    setIsSnoozed(false);
  };

  // Initialize timer
  useEffect(() => {
    cleanupTimers();

    if (order.orderStatus === "preparing") {
      const startTime = new Date(order.updatedAt || order.createdAt);
      const preparationTimeMinutes = order.preparationTime || 20; // Default 20 mins
      const totalTimeMs = preparationTimeMinutes * 60 * 1000;
      const endTime = new Date(startTime.getTime() + totalTimeMs);

      const updateTimer = () => {
        const now = new Date();
        const remainingMs = endTime - now;
        const secondsLeft = Math.floor(remainingMs / 1000);

        // Calculate progress percentage (100% to 0%)
        const newProgress = Math.max(
          0,
          Math.min(100, (remainingMs / totalTimeMs) * 100)
        );
        setProgress(newProgress);

        if (remainingMs <= 0) {
          setTimeLeft(0);
          setProgress(0);
          setShowDelayButton(true);
          onTimeUp?.(order._id);
          cleanupTimers();
          return;
        }

        setTimeLeft(secondsLeft);

        // Start beeping in last 5 minutes if not snoozed
        if (secondsLeft <= 300 && !isSnoozed) {
          if (!isBeeping) {
            setIsBeeping(true);
            startBeeping();
          }
        }
      };

      updateTimer();
      intervalRef.current = setInterval(updateTimer, 1000);
    }

    // Cleanup when order is ready/completed
    if (["ready", "completed"].includes(order.orderStatus)) {
      setTimeLeft(null);
      setShowDelayButton(false);
      cleanupTimers();
    }

    return cleanupTimers;
  }, [
    order.orderStatus,
    order.updatedAt,
    order._id,
    order.preparationTime,
    isSnoozed,
  ]);

  const startBeeping = () => {
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);

    // Play immediately
    playBeep();

    // Then every 10 seconds
    beepIntervalRef.current = setInterval(() => {
      if (
        order.orderStatus === "preparing" &&
        !isSnoozed &&
        (timeLeft ?? Infinity) > 0
      ) {
        playBeep();
      } else {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
        setIsBeeping(false);
      }
    }, 10000);
  };

  const handleSnooze = () => {
    setIsSnoozed(true);
    setSnoozeCount((prev) => prev + 1);
    setIsBeeping(false);

    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }

    // Auto-unsnooze after 2 minutes
    snoozeTimeoutRef.current = setTimeout(() => {
      if (
        order.orderStatus === "preparing" &&
        (timeLeft ?? Infinity) > 0 &&
        timeLeft <= 300
      ) {
        setIsSnoozed(false);
      }
    }, 120000);
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeLeft === null) return "text-gray-500";
    if (timeLeft <= 0) return "text-red-600 animate-pulse";
    if (timeLeft <= 60) return "text-red-600"; // Last minute
    if (timeLeft <= 300) return "text-orange-600"; // Last 5 minutes
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (timeLeft === null) return "bg-gray-200";
    if (timeLeft <= 60) return "bg-red-500"; // Last minute
    if (timeLeft <= 300) return "bg-orange-500"; // Last 5 minutes
    return "bg-green-500";
  };

  if (order.orderStatus !== "preparing") return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${getTimerColor()}`} />
          <span
            className={`font-mono text-sm font-semibold ${getTimerColor()}`}
          >
            {timeLeft !== null
              ? timeLeft <= 0
                ? "TIME'S UP!"
                : formatTime(timeLeft)
              : "Calculating..."}
          </span>

          {isBeeping && !isSnoozed && (
            <button
              onClick={handleSnooze}
              className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center space-x-1"
              title="Silence alerts for 2 minutes"
            >
              <Pause className="w-3 h-3" />
              <span>Snooze</span>
            </button>
          )}

          {isSnoozed && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <BellOff className="w-4 h-4" />
              <span>Silenced ({snoozeCount})</span>
            </div>
          )}
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-2">
          {timeLeft > 0 && timeLeft <= 300 && (
            <span
              className={`text-xs font-medium ${
                timeLeft <= 60
                  ? "text-red-600 animate-pulse"
                  : "text-orange-600"
              }`}
            >
              {timeLeft <= 60
                ? `URGENT: ${timeLeft}s LEFT!`
                : `Last ${Math.ceil(timeLeft / 60)} mins`}
            </span>
          )}

          {timeLeft <= 0 && (
            <button
              onClick={() => onDelayModalOpen(order._id)}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center space-x-1 animate-pulse"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Notify Customer</span>
            </button>
          )}
        </div>
      </div>

      {/* Delay notice if already sent */}
      {order.preparationDelayReason && (
        <div className="mt-1 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
          <div className="flex items-start space-x-2">
            <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800">Delay Notice Sent</p>
              <p className="text-yellow-700">{order.preparationDelayReason}</p>
              {order.updatedPreparationTime && (
                <p className="mt-1 text-yellow-700">
                  New estimate: {order.updatedPreparationTime} minutes
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
    "Quality check taking extra time",
  ];

  return (
 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-2 max-h-[90vh] flex flex-col">
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

    <div className="flex-1 overflow-y-auto">
      <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-orange-800">
          This order has exceeded the preparation time. Please provide a
          reason for the delay to keep the customer informed.
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
      </form>
    </div>

    <div className="flex space-x-3 pt-4">
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
        onClick={handleSubmit}
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>
    </div>
  </div>
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

  console.log("selectedRestaurant:", selectedRestaurant);
  console.log("restaurants:", restaurants);
  console.log("currentRestaurantId:", currentRestaurantId);
  const handleNewOrder = (data) => {
    console.log("📦 New Order Received:", data);
    // You can update state here if needed
  };
  useEffect(() => {
    if (!currentRestaurantId) return;

    if (!socket.connected) socket.connect();

    console.log("Joining room for restaurant:", currentRestaurantId);
    socket.emit("join-room", {
      userId: currentRestaurantId,
      userType: "restaurant",
    });

    // Attach listener
    socket.on("new_order", handleNewOrder);

    // Clean up listener + leave room on unmount or restaurant change
    return () => {
      socket.off("new_order", handleNewOrder);
      socket.emit("leave-room", {
        userId: currentRestaurantId,
        userType: "restaurant",
      });
      console.log("Leaving room for restaurant:", currentRestaurantId);
    };
  }, [currentRestaurantId]);

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

  const handleDelayReasonSubmit = async (
    orderId,
    delayReason,
    preparationTime
  ) => {
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
  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
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
      </div>
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
            
            <OrderTimer 
              order={order} 
              onTimeUp={handleTimerExpired}
              onDelayModalOpen={handleDelayModalOpen}
            />

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
            ₹{Math.round(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Details */}
        <div className="md:col-span-1">
          <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
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
              <h4 className="font-medium text-gray-900 mb-2">Delivery Agent</h4>
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
                  <span>Delivery Charge: ₹{Math.round(order.deliveryCharge || 0)}</span>
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
                        ₹{Math.round(item.price)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        ₹{Math.round(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-200 pt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{Math.round(order.subtotal || 0)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{Math.round(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>₹{Math.round(order.deliveryCharge || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{Math.round(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                <span>Total Amount:</span>
                <span>₹{Math.round(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Update */}
        <div className="md:col-span-1">
          <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
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
  );
};

export default OrderManagement;
