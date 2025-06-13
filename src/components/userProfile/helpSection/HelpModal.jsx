import React from 'react';

const HelpModal = ({ isOpen, onClose, orderId, onChatStart, restaurantName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bgOp flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Need Help?</h2>
          <p className="text-sm text-gray-600 mb-6">Order #{orderId}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => onChatStart('admin')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              Talk to Customer Support
            </button>
            <button
              onClick={() => onChatStart('restaurant')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              Talk to {restaurantName || 'Restaurant'}
            </button>
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;