import React from 'react';

const OrderCard = ({ order, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
      <div className="flex gap-4">
        {/* Order Image */}
        <div className="flex-shrink-0">
          <img 
            src={order.image} 
            alt={order.restaurant}
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
        
        {/* Order Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{order.restaurant}</h3>
              <p className="text-sm text-gray-500">{order.location}</p>
            </div>
            
            {/* Delivery Status */}
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <span>Delivered on {order.deliveryDate}</span>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">{order.orderId} | {order.date}</p>
          
          <button 
            className="text-orange-500 text-sm font-medium mb-4 hover:text-orange-600"
            onClick={onViewDetails}
          >
            VIEW DETAILS
          </button>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-700 flex-1 mr-4">{order.items}</p>
              <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">Total Paid: ₹ {order.total}</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded text-sm font-medium">
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