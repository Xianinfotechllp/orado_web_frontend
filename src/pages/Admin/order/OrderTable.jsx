import React, { useEffect, useState } from "react";
import { getAdminOrders } from "../../../apis/adminApis/adminFuntionsApi"; // adjust import path as needed
import socket from "../../../services/socket"
import { toast } from "react-toastify";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getAdminOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
useEffect(() => {
  const adminId = "682c3a4a2e9fb5869cb96044";
  socket.emit("join-room", { userId: adminId, userType: "admin" });

  socket.on("new_order", (payload) => {
    console.log("Received new order:", payload.data);

    // Show toast notification
    toast.success(`🛵 New order received from ${payload.data.restaurantName}`);

    // Add new order to top of table
    setOrders((prevOrders) => [payload.data, ...prevOrders]);
  });

  return () => {
    socket.off("new_order");
  };
}, []);

  const renderStatusBadge = (status) => {
    const statusStyles = {
      delivered: "bg-green-100 text-green-800",
      preparing: "bg-yellow-100 text-yellow-800",
      ready: "bg-blue-100 text-blue-800",
      accepted_by_restaurant: "bg-indigo-100 text-indigo-800",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>
          <div className="overflow-x-auto overflow-y-auto max-h-[500px] max-w-[100%]">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {[
                    "Order ID",
                    "Order Status",
                    "Restaurants Name",
                    "Customer",
                    "Amount",
                    "Address",
                    "Payment Method",
                    "Order Preparation Time",
                    "Order Time",
                    "Scheduled Delivery Time",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[150px]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className={`transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="py-4 px-4 text-sm text-gray-900 whitespace-nowrap w-[150px]">{order.orderId}</td>
                    <td className="py-4 px-4 text-sm w-[150px]">{renderStatusBadge(order.orderStatus)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.restaurantName}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.customerName}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium w-[150px]">{order.amount}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px] relative group">
                      <span className="block truncate">{order.address}</span>
                      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 z-20 w-[300px] break-words">
                        {order.address}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.paymentMethod}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.preparationTime}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.orderTime}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 w-[150px]">{order.scheduledDeliveryTime}</td>
                    <td className="py-4 px-4 text-sm w-[150px]">
                      <button
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => alert(`View details for Order ID: ${order.orderId}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="11" className="py-4 px-4 text-center text-gray-500 text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;