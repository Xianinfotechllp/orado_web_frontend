import React from 'react';
import { useSelector } from 'react-redux';

export default function DeliveryPaymentForm() {
   const location = useSelector((state) => state.location.location);
  return (
    <div className="w-full space-y-4">
      {/* Delivery Address Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-orange-600 font-medium text-base">Delivery address</h2>
          <button className="text-orange-600 text-sm font-medium hover:underline">
            Change
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-black font-medium text-base">Home</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {location.name}
          </p>
          <p className="text-black font-medium text-sm mt-3">68 mins</p>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h2 className="text-black font-medium text-base mb-4">Choose Payment Method</h2>

        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded text-base transition-colors">
          Proceed To Pay
        </button>
      </div>
    </div>
  );
}
