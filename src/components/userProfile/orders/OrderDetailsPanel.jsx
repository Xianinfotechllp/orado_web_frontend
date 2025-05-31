import React from 'react';
import { X } from 'lucide-react';

const OrderDetailsPanel = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bgOp transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500">Order #{order.orderId}</p>
              </div>
            </div>
            
            {/* Restaurant Info */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{order.restaurant}</h3>
              <p className="text-sm text-gray-500">{order.location}</p>
              <p className="text-sm text-gray-500 mt-1">{order.address}</p>
            </div>
            
            {/* Delivery Info */}
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-500">
                Delivered on {order.deliveryDate} by {order.deliveryPartner}
              </p>
            </div>
            
            {/* Order Items */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Order</h3>
              
              {order.items.map((item, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex justify-between">
                    <p className="font-medium">{item.name} × {item.quantity}</p>
                    <p className="text-gray-900">₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Item Total</span>
                  <span className="text-sm text-gray-900">₹ {order.subtotal}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm text-gray-900">₹ {order.deliveryFee}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Platform Fee</span>
                  <span className="text-sm text-gray-900">₹ {order.platformFee}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount Applied</span>
                    <span className="text-sm text-green-600">- ₹ {order.discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxes</span>
                  <span className="text-sm text-gray-900">₹ {order.taxes}</span>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-gray-200 mt-3">
                  <span className="font-semibold">BILL TOTAL</span>
                  <span className="font-semibold">₹ {order.total}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid via {order.paymentMethod}</span>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium">
                REORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;