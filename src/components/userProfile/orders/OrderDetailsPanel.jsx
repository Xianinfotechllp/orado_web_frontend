import React from 'react';
import { X, MapPin, Home, CheckCircle, Clock } from 'lucide-react';
import { reorderOrder } from '../../../apis/orderApi'; 
import { useNavigate } from "react-router-dom";
import { HiCheckCircle, HiClock, HiTruck, HiXCircle, HiOutlineClock } from "react-icons/hi";
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsPanel = ({ order, onClose }) => {
  if (!order) return null;

  const navigate = useNavigate();
  const [isReordering, setIsReordering] = React.useState(false);

  const handleReorder = async () => {
    try {
      setIsReordering(true);
      await reorderOrder(order._id);
      navigate("/add-to-cart");
    } catch (error) {
      console.error("Reorder failed:", error);
    } finally {
      setIsReordering(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <HiCheckCircle className="h-4 w-4 text-green-500" />;
      case "cancelled_by_customer":
      case "rejected_by_agent":
      case "rejected_by_restaurant":
        return <HiXCircle className="h-4 w-4 text-red-500" />;
      case "pending":
      case "pending_agent_acceptance":
      case "awaiting_agent_assignment":
        return <HiOutlineClock className="h-4 w-4 text-yellow-500" />;
      case "preparing":
      case "accepted_by_restaurant":
        return <HiClock className="h-4 w-4 text-orange-500" />;
      case "assigned_to_agent":
      case "picked_up":
      case "in_progress":
      case "arrived":
        return <HiTruck className="h-4 w-4 text-blue-500" />;
      default:
        return <HiClock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "pending_agent_acceptance":
        return "Awaiting Agent Acceptance";
      case "awaiting_agent_assignment":
        return "Awaiting Agent Assignment";
      case "accepted_by_restaurant":
        return "Accepted by Restaurant";
      case "rejected_by_restaurant":
        return "Rejected by Restaurant";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "assigned_to_agent":
        return "Assigned to Agent";
      case "picked_up":
        return "Picked Up";
      case "in_progress":
        return "In Progress";
      case "arrived":
        return "Arrived";
      case "completed":
        return "Delivered";
      case "cancelled_by_customer":
        return "Cancelled by Customer";
      case "rejected_by_agent":
        return "Rejected by Agent";
      default:
        return status;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
          onClick={onClose}
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="absolute inset-y-0 right-0 max-w-full flex"
        >
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-medium text-gray-900">Order #{order._id.slice(-12)}</h2>
                  <button 
                    onClick={onClose} 
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Restaurant Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="px-4 py-4 border-b border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{order.restaurantId?.name || 'Restaurant'}</h3>
                      <p className="text-sm text-gray-500">{order.deliveryAddress?.street || 'Unknown street'}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="px-4 py-4 border-b border-gray-100"
                >
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Home</h4>
                      <p className="text-sm text-gray-500">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}, {order.deliveryAddress?.country}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Delivery Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 py-4 border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className="text-sm text-gray-900">
                        {getStatusText(order.orderStatus)} on {formatDateTime(order.orderTime)}
                      </span>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      ON TIME
                    </span>
                  </div>
                  {order.assignedAgent && (
                    <p className="text-sm text-gray-500 mt-1">
                      by {typeof order.assignedAgent === 'string' ? order.assignedAgent : order.assignedAgent.fullName}
                    </p>
                  )}
                </motion.div>

                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="px-4 py-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {order.orderItems?.length || 0} ITEMS
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {order.orderItems?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">
                            {item.name} x {item.quantity}
                          </span>
                        </div>
                        <span className="text-sm font-medium">₹ {item.totalPrice || (item.price * item.quantity)}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bill Details */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="px-4 py-4 bg-gray-50"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Item Total</span>
                      <span className="text-sm font-medium">₹ {order.subtotal}</span>
                    </div>

                    {order.deliveryCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Order Packing Charges</span>
                        <span className="text-sm font-medium">₹ {order.deliveryCharge}</span>
                      </div>
                    )}

                    {order.surgeCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Platform Fee</span>
                        <span className="text-sm font-medium">₹ {order.surgeCharge}</span>
                      </div>
                    )}

                    {order.deliveryCharge > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Delivery partner fee</span>
                        <span className="text-sm font-medium">₹ {order.deliveryCharge}</span>
                      </div>
                    )}

                    {order.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Discount Applied</span>
                        <span className="text-sm text-green-600">-₹ {order.discountAmount}</span>
                      </div>
                    )}

                    {order.tipAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Extra discount for you</span>
                        <span className="text-sm text-green-600">-₹ {order.tipAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taxes</span>
                      <span className="text-sm font-medium">₹ {order.tax}</span>
                    </div>

                    <hr className="my-2" />

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">Paid Via {order.paymentMethod}</span>
                        <div className="text-lg font-semibold text-gray-900">BILL TOTAL</div>
                      </div>
                      <span className="text-lg font-semibold">₹ {order.totalAmount}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 py-4 border-t border-gray-200 bg-white"
              >
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
                  onClick={handleReorder}
                  disabled={isReordering}
                >
                  {isReordering ? "Processing..." : "REORDER"}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderDetailsPanel;