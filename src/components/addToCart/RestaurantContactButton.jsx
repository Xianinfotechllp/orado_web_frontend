import { useState } from 'react';
import { Phone, Copy, X, Utensils } from 'lucide-react';

const RestaurantContactButton = ({ orderData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(orderData.restaurantId?.phone || '');
    // You can add a toast notification here if you want
    alert('Restaurant phone number copied to clipboard!');
  };

  const makePhoneCall = () => {
    window.location.href = `tel:${orderData.restaurantId?.phone}`;
  };

  return (
    <>
      <button 
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!orderData.restaurantId?.phone}
        onClick={() => setIsModalOpen(true)}
      >
        Contact Restaurant
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bgOp flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="text-orange-600" size={20} />
                <h3 className="text-lg font-semibold text-orange-600">Restaurant Contact</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-1">
                  {orderData.restaurantId?.name || 'Restaurant'}
                </h4>
                <div className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-gray-700">
                    {orderData.restaurantId?.phone || 'No number available'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyPhoneNumber}
                  disabled={!orderData.restaurantId?.phone}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy size={16} />
                  Copy Number
                </button>

                <button
                  onClick={makePhoneCall}
                  disabled={!orderData.restaurantId?.phone}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone size={16} />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantContactButton;