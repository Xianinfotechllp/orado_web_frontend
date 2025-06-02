import React from 'react';
import { reorderOrder } from '../../../apis/orderApi';
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, onViewDetails }) => {
  const navigate = useNavigate();

  const itemSummary = order.orderItems?.map(item => `${item.name} × ${item.quantity}`).join(', ') || "No items";

  const handleReorder = async () => {
    try {
      await reorderOrder(order._id);
      navigate("/add-to-cart");
    } catch (error) {
      console.error("Reorder failed:", error);
      alert("Failed to reorder. Please try again.");
    }
  };

  const formatDateTime = (isoDate) =>
    new Date(isoDate).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
              <p className="text-sm text-gray-500">Status: {order.orderStatus}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <span>{formatDateTime(order.updatedAt)}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-2">Order ID: {order._id}</p>
          <p className="text-sm text-gray-500 mb-2">Placed on: {formatDateTime(order.createdAt)}</p>

          <p className="text-sm text-gray-600 mb-2">
            Delivery Address: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
          </p>

          <button
            type="button"
            className="text-orange-500 text-sm font-medium mb-4 hover:text-orange-600"
            onClick={onViewDetails}
          >
            VIEW DETAILS
          </button>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-700 flex-1 mr-4">{itemSummary}</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">Total: ₹{order.totalAmount.toFixed(2)}</p>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Subtotal: ₹{order.subtotal.toFixed(2)} | Tax: ₹{order.tax.toFixed(2)} | Delivery: ₹{order.deliveryCharge.toFixed(2)}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-medium"
                onClick={handleReorder}
              >
                REORDER
              </button>
              <button
                type="button"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded text-sm font-medium"
                onClick={() => alert("Help support coming soon.")}
              >
                HELP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
