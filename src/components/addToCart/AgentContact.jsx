import { useState } from 'react';
import { Phone, Copy, X } from 'lucide-react';

const AgentContactButton = ({ orderData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(orderData.assignedAgent?.phoneNumber || '');
    // You can add a toast notification here if you want
    alert('Phone number copied to clipboard!');
  };

  const makePhoneCall = () => {
    window.location.href = `tel:${orderData.assignedAgent?.phoneNumber}`;
  };

  return (
    <>
      <button 
        className="flex items-center justify-center w-12 h-12 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!orderData.assignedAgent}
        onClick={() => setIsModalOpen(true)}
      >
        <Phone size={18} />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bgOp flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-orange-600">Agent Contact</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">{orderData.assignedAgent?.phoneNumber || 'No number available'}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyPhoneNumber}
                  disabled={!orderData.assignedAgent?.phoneNumber}
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Copy size={16} />
                  Copy Number
                </button>

                <button
                  onClick={makePhoneCall}
                  disabled={!orderData.assignedAgent?.phoneNumber}
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

export default AgentContactButton;