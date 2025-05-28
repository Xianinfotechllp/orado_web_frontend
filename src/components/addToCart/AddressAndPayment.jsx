import React from 'react';

export default function DeliveryPaymentForm() {
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
          <h3 className="text-black font-medium text-base">Lorem pesum</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Dummy Ipsum is simply dummy text of the printing and typesetting industry. Lorem 
            Ipsum has been the industry's standard dummy text ever since the 1500s.
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
