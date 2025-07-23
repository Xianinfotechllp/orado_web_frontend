import React, { useState, useEffect, useRef } from "react";
import {
  Filter,
  RefreshCw,
  ExternalLink,
  FileText,
  ChevronUp,
  ChevronDown,
  Info,
  Clock,
  MapPin,
  Phone,
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
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  getOrdersByMerchant,
  updateOrderStatus,
  sendOrderDelayReason,
} from "../../../../apis/orderApi";
import RestaurantSlider from "../Slider/RestaurantSlider";
import socket from "../../../../socket/socket";

// Updated status styling to use borders instead of background colors
const statusColors = {
  pending: "border-yellow-500 text-yellow-500",
  accepted_by_restaurant: "border-blue-500 text-blue-500",
  rejected_by_restaurant: "border-red-500 text-red-500",
  preparing: "border-orange-500 text-orange-500",
  ready: "border-purple-500 text-purple-500",
};

const statusLabels = {
  pending: "Pending",
  accepted_by_restaurant: "Accepted",
  rejected_by_restaurant: "Rejected",
  preparing: "Preparing",
  ready: "Ready for Pickup",
};

const statuses = ["All", "New", "Pending", "Preparing", "Ready", "Cancelled"];
const columns = [
  "Order ID",
  "Order Status",
  "Order Time",
  "Customer",
  "Amount",
  "Address",
  "Delivery Mode",
  "Payment Status",
  "Payment Method",
  "Preparation Time (min)",
  "Actions",
];

const getStatusOptions = (currentStatus) => {
  if (currentStatus === "pending")
    return ["accepted_by_restaurant", "rejected_by_restaurant"];
  if (currentStatus === "accepted_by_restaurant") return ["preparing"];
  if (currentStatus === "preparing") return ["ready"];
  return [];
};

// Custom hook for beep sound
const useBeep = (volume = 0.3) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    try {
      audioRef.current = new Audio();
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
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((error) => {
        console.log("HTML5 Audio failed, using Web Audio:", error);
      });
    }
  };

  return { play };
};

const OrderTimer = ({ order, onTimeUp, onDelayModalOpen }) => {
  const { play: playBeep } = useBeep(0.2);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isBeeping, setIsBeeping] = useState(false);
  const [isSnoozed, setIsSnoozed] = useState(false);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [showDelayButton, setShowDelayButton] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const beepIntervalRef = useRef(null);
  const snoozeTimeoutRef = useRef(null);

  const cleanupTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (beepIntervalRef.current) clearInterval(beepIntervalRef.current);
    if (snoozeTimeoutRef.current) clearTimeout(snoozeTimeoutRef.current);
    setIsBeeping(false);
    setIsSnoozed(false);
  };

  useEffect(() => {
    cleanupTimers();

    if (order.orderStatus === "preparing") {
      const startTime = new Date(order.updatedAt || order.createdAt);
      const preparationTimeMinutes = order.preparationTime || 20;
      const totalTimeMs = preparationTimeMinutes * 60 * 1000;
      const endTime = new Date(startTime.getTime() + totalTimeMs);

      const updateTimer = () => {
        const now = new Date();
        const remainingMs = endTime - now;
        const secondsLeft = Math.floor(remainingMs / 1000);

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

    playBeep();

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
    if (timeLeft <= 60) return "text-red-600";
    if (timeLeft <= 300) return "text-orange-600";
    return "text-green-600";
  };

  const getProgressColor = () => {
    if (timeLeft === null) return "bg-gray-200";
    if (timeLeft <= 60) return "bg-red-500";
    if (timeLeft <= 300) return "bg-orange-500";
    return "bg-green-500";
  };

  if (order.orderStatus !== "preparing") return null;

  return (
    <div className="mt-1 space-y-2">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${getProgressColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1">
          <Clock className={`w-3 h-3 ${getTimerColor()}`} />
          <span className={`font-mono ${getTimerColor()}`}>
            {timeLeft !== null
              ? timeLeft <= 0
                ? "TIME'S UP!"
                : formatTime(timeLeft)
              : "Calculating..."}
          </span>

          {isBeeping && !isSnoozed && (
            <button
              onClick={handleSnooze}
              className="px-1 py-0.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center"
            >
              <Pause className="w-3 h-3" />
            </button>
          )}
        </div>

        {timeLeft <= 0 && (
          <button
            onClick={() => onDelayModalOpen(order._id)}
            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded flex items-center space-x-1 animate-pulse"
          >
            <MessageSquare className="w-3 h-3" />
            <span className="text-xs">Notify</span>
          </button>
        )}
      </div>
    </div>
  );
};

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
const OrderRow = ({
  order,
  expandedOrderId,
  setExpandedOrderId,
  handleStatusChange,
  handleDelayModalOpen,
  handleTimerExpired,
  onOrderClick,
}) => {
  const isExpanded = expandedOrderId === order._id;
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper functions for new columns
  const getPaymentStatus = () => {
    if (order.paymentMethod === "cash") {
      return "Pending";
    }
    return order.onlinePaymentDetails?.verificationStatus || "N/A";
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const getDeliveryMode = () => {
    return order.deliveryCharge > 0 ? "Delivery" : "Pickup";
  };

  // Check if dropdown should be shown (from accepted_by_restaurant until ready)
  const shouldShowDropdown = () => {
    const statusesWithDropdown = [
      "accepted_by_restaurant",
      "preparing",
      "ready",
    ];
    return statusesWithDropdown.includes(order.orderStatus);
  };

  // Get progressive status options based on current status
  const getProgressiveStatusOptions = (currentStatus) => {
    const statusFlow = {
      accepted_by_restaurant: ["preparing", "ready", "completed"],
      preparing: ["ready", "completed"],
      ready: ["completed"],
    };
    return statusFlow[currentStatus] || [];
  };

  return (
    <>
      <tr className={`border-b ${isExpanded ? "bg-gray-50" : ""}`}>
        <td className="px-4 py-3 text-sm">
          <button
            onClick={() => onOrderClick(order._id)}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {order.orderNumber || order._id.substring(0, 8)}
          </button>
        </td>
        <td className="px-4 py-3" ref={statusDropdownRef}>
          <div className="relative">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full border text-xs font-medium ${
                  statusColors[order.orderStatus]
                }`}
              >
                {statusLabels[order.orderStatus] || order.orderStatus}
              </span>

              {/* Show dropdown icon only if status allows progression */}
              {shouldShowDropdown() && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {showStatusDropdown ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              )}
            </div>

            {/* Dropdown menu with progressive status options */}
            {showStatusDropdown && shouldShowDropdown() && (
              <div className="absolute z-10 mt-1 left-0 bg-white shadow-lg rounded-md border border-gray-200 min-w-[150px]">
                {getProgressiveStatusOptions(order.orderStatus).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusChange(order._id, status);
                        setShowStatusDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 whitespace-nowrap flex items-center justify-between"
                    >
                      <span>{statusLabels[status] || status}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status === "preparing"
                            ? "bg-orange-500"
                            : status === "ready"
                            ? "bg-purple-500"
                            : status === "completed"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      ></div>
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </td>
        <td className="px-4 py-3 text-sm text-gray-900">
          {order.customerId?.name || "N/A"}
        </td>
        <td className="px-4 py-3 text-sm font-medium text-gray-900">
          ₹{Math.round(order.totalAmount)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
          {order.deliveryAddress?.street || "N/A"}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">{getDeliveryMode()}</td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {getPaymentStatus()}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {formatPaymentMethod(order.paymentMethod)}
        </td>
        <td className="px-4 py-3 text-sm text-gray-500">
          {order.preparationTime || "N/A"}
        </td>
        <td className="px-4 py-3 text-sm">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedOrderId(isExpanded ? null : order._id);
            }}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </td>
      </tr>

      {/* Expanded order details section remains the same */}
      {isExpanded && (
        <tr className="bg-gray-50">
          <td colSpan={11} className="px-3 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Customer Details
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="font-medium">
                    {order.customerId?.name || "N/A"}
                  </p>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.customerId?.phone || "N/A"}
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.deliveryAddress
                        ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
                        : "N/A"}
                    </span>
                  </div>
                </div>

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
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                  <div>
                    <OrderTimer
                      order={order}
                      onTimeUp={handleTimerExpired}
                      onDelayModalOpen={handleDelayModalOpen}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {order.orderStatus === "preparing" && (
                  <div className="mt-4">
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
          </td>
        </tr>
      )}
    </>
  );
};

const OrderManagement = ({ onOrderClick }) => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [delayLoading, setDelayLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const currentRestaurantId =
    selectedRestaurant !== null ? restaurants[selectedRestaurant]?.id : null;

  const handleNewOrder = (data) => {
    const audio = new Audio("/sounds/notificaion.mp3");
    audio.play();

    if (Notification.permission === "granted") {
      new Notification("🍽️ New Order Received!", {
        body: `Order #${data.orderNumber || data._id.substring(0, 6)} for ₹${
          data.totalAmount
        } from ${data.customerId?.name || "Customer"}`,
        icon: "/logo.png",
      });
    }

    toast(
      (t) => (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 },
          }}
          exit={{
            opacity: 0,
            x: 300,
            scale: 0.8,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          className="max-w-sm w-full bg-gradient-to-r from-orange-50 to-red-50 shadow-xl rounded-2xl pointer-events-auto ring-1 ring-orange-200 overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{
                  scale: 1,
                  rotate: 0,
                  transition: { delay: 0.2, type: "spring", stiffness: 200 },
                }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-orange-400"
                  />
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.3 },
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      🎉 New Order!
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Live
                    </span>
                  </div>
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-600 font-medium">
                      Order #
                      {data._id || data._id.substring(0, 8).toUpperCase()}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-orange-600">
                          ₹{Math.round(Number(data.totalAmount) || 0)}
                        </span>
                        <span className="text-xs text-gray-500">
                          • {data.itemCount || "3"} items
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{data.estimatedTime || "25-30"} min</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-600 mt-2">
                      <User className="w-3 h-3" />
                      <span className="truncate">
                        {data.customerId.name || "Customer"}
                      </span>
                      <span className="text-gray-400">•</span>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {data.deliveryAddress?.street || "Delivery Area"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.4 },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group"
              >
                <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: 6000,
        position: "top-right",
      }
    );

    setOrders((prevOrders) => {
      const exists = prevOrders.some(
        (order) => String(order._id) === String(data._id)
      );
      if (exists) return prevOrders;

      const formattedOrder = {
        ...data,
        orderTime: data.orderTime
          ? new Date(data.orderTime).toLocaleString("en-IN")
          : "N/A",
      };

      return [formattedOrder, ...prevOrders];
    });
  };

  useEffect(() => {
    if (!currentRestaurantId) return;

    if (!socket.connected) socket.connect();

    socket.emit("join-room", {
      userId: currentRestaurantId,
      userType: "restaurant",
    });

    socket.on("new_order", handleNewOrder);

    return () => {
      socket.off("new_order", handleNewOrder);
      socket.emit("leave-room", {
        userId: currentRestaurantId,
        userType: "restaurant",
      });
    };
  }, [currentRestaurantId]);

  const fetchRestaurantOrders = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await getOrdersByMerchant(restaurantId);
      console.log("response order id--------", response)
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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    const sortableOrders = [...orders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  };

  const filteredOrders =
    selectedStatus === "All"
      ? getSortedOrders()
      : getSortedOrders().filter((order) => {
          if (selectedStatus === "New") return order.orderStatus === "pending";
          if (selectedStatus === "Pending")
            return order.orderStatus === "accepted_by_restaurant";
          if (selectedStatus === "Preparing")
            return order.orderStatus === "preparing";
          if (selectedStatus === "Ready") return order.orderStatus === "ready";
          if (selectedStatus === "Cancelled")
            return order.orderStatus === "cancelled";
          return true;
        });

  return (
    <div className="relative p-4 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Mobile Header */}
      <div className="md:hidden flex justify-end mb-4 bg-white">
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-lg hover:bg-gray-200">
            <Filter className="w-5 h-5 text-gray-800" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200 hidden md:block">
            <RefreshCw className="w-5 h-5 text-gray-800" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-200 hidden md:block mr-1">
            <ExternalLink className="w-5 h-5 text-gray-800" />
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm font-medium">
            Create Order
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="mb-6 bg-white px-5 py-3 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center text-xl font-semibold mb-4 md:mb-0">
            <FileText className="w-5 h-5 text-gray-800 mr-2" />
            Orders
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-200 hidden md:block">
              <RefreshCw className="w-5 h-5 text-gray-800" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200">
              <Filter className="w-5 h-5 text-gray-800" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 hidden md:block">
              <ExternalLink className="w-5 h-5 text-gray-800" />
            </button>
            <button className="bg-[#0f172a] hover:bg-gray-100 text-white px-3 py-1.5 rounded-md text-sm font-medium">
              Create Order
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Slider Component */}
      <div className="mb-4">
        <RestaurantSlider
          onRestaurantSelect={handleRestaurantSelect}
          onRestaurantsLoad={handleRestaurantsLoad}
          selectedIndex={selectedRestaurant}
          showError={true}
        />
      </div>

      {/* Delay Reason Modal */}
      <DelayReasonModal
        isOpen={delayModalOpen}
        onClose={handleDelayModalClose}
        orderId={selectedOrderId}
        onSubmit={handleDelayReasonSubmit}
        loading={delayLoading}
      />

      {/* Table Section */}
      <section className="bg-white rounded-lg shadow overflow-hidden">
        {/* Status Navigation */}
        <div className="p-4 flex overflow-x-auto pb-2 space-x-1 bg-[#f0f3f6] mb-4 rounded-lg">
          {statuses.map((status, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-[#0f172a] text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Fixed height container with scroll */}
        <div
          className="overflow-auto"
          style={{
            maxHeight: "50vh",
            minHeight: "200px",
          }}
        >
          <div className="min-w-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#f8f9fa] z-10 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className={`px-4 py-3 ${
                        col === "Order Status"
                          ? "min-w-[150px]"
                          : col === "Delivery Mode"
                          ? "min-w-[140px]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{col}</span>
                        {col === "Order Time" && (
                          <button
                            onClick={() => requestSort("createdAt")}
                            className="flex flex-col ml-1"
                          >
                            <ChevronUp
                              className={`w-3 h-3 ${
                                sortConfig.key === "createdAt" &&
                                sortConfig.direction === "ascending"
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronDown
                              className={`w-3 h-3 -mt-1 ${
                                sortConfig.key === "createdAt" &&
                                sortConfig.direction === "descending"
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-400 mb-4"></div>
                        <p className="text-gray-500">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center">
                        <svg
                          width="143"
                          height="110"
                          viewBox="0 0 143 110"
                          className="mx-auto mb-4"
                        >
                          {/* SVG paths from example */}
                        </svg>
                        <p className="text-gray-500">No orders found</p>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredOrders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    expandedOrderId={expandedOrderId}
                    setExpandedOrderId={setExpandedOrderId}
                    handleStatusChange={handleStatusChange}
                    handleDelayModalOpen={handleDelayModalOpen}
                    handleTimerExpired={handleTimerExpired}
                    onOrderClick={onOrderClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            Showing {filteredOrders.length} of {filteredOrders.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-1 rounded disabled:opacity-30">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9505C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9505L15.5773 7.49085C15.7186 7.34942 15.7979 7.15771 15.7979 6.95782C15.7979 6.75794 15.7186 6.56622 15.5773 6.42479L12.0574 2.90479C11.9181 2.82159 11.7557 2.78551 11.5943 2.80192C11.4329 2.81833 11.2811 2.88635 11.1614 2.99588C11.0417 3.10541 10.9605 3.25061 10.9299 3.40994C10.8993 3.56927 10.9208 3.73423 10.9914 3.88033L13.9985 6.89748L10.9914 9.91463C10.8501 10.0561 10.7708 10.2478 10.7708 10.4477C10.7708 10.6475 10.8501 10.8393 10.9914 10.9807C11.061 11.0512 11.144 11.1071 11.2356 11.1451Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button className="p-1 rounded disabled:opacity-30">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-gray-500"
              >
                <path
                  d="M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div className="bg-gray-200 rounded w-8 h-8 flex items-center justify-center">
              <span className="text-sm">1</span>
            </div>

            <button className="p-1 rounded">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-gray-500"
              >
                <path
                  d="M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <button className="p-1 rounded">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.221C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div className="flex items-center ml-4">
              <span className="text-sm mr-2 text-gray-500">Rows per page:</span>
              <div className="relative">
                <select className="bg-white border rounded py-1 px-3 text-sm appearance-none">
                  <option>25</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderManagement;
