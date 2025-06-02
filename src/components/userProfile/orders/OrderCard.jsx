import React from 'react';
import {reorderOrder} from '../../../apis/orderApi'; 
import { useNavigate } from "react-router-dom";


const OrderCard = ({ order, onViewDetails }) => {
  const itemSummary = order.orderItems.map(item => `${item.name} × ${item.quantity}`).join(', ');

  const navigate = useNavigate();

  const handleReorder = async () => {
    try {
      await reorderOrder(order._id); // Make the API call
      navigate("/add-to-cart"); // Redirect after success
    } catch (error) {
      console.error("Reorder failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img 
            src={order.image}
            alt="Order"
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-6)}</h3>
              <p className="text-sm text-gray-500">Status: {order.orderStatus}</p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>{new Date(order.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-3">{order._id} | {new Date(order.createdAt).toLocaleString()}</p>

          <button 
            className="text-orange-500 text-sm font-medium mb-4 hover:text-orange-600"
            onClick={onViewDetails}
          >
            VIEW DETAILS
          </button>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-700 flex-1 mr-4">{itemSummary}</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">Total Paid: ₹ {order.totalAmount}</p>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-medium"
                onClick={handleReorder}
                >
                REORDER
              </button>
              <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded text-sm font-medium">
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
