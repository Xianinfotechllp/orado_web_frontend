import React, { useState, useEffect } from "react";
import { Clock, MapPin, Phone, Utensils } from "lucide-react";
import { useSelector } from "react-redux";
import { getOrdersByMerchant, updateOrderStatus } from "../../../../apis/orderApi";
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

const OrderManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
                </div>

                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-1">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="flex items-center">
                          {item.quantity}x {item.name}
                          {item.variation && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({item.variation})
                            </span>
                          )}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

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