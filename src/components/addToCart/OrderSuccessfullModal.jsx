import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccessModal({ orderId, onClose, estimatedDelivery }) {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose(); // optional if you want to close the modal first
    navigate(`/order/status/${orderId}`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bgOp flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative animate-bounce">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <CheckCircle className="mx-auto mb-4 text-green-500 animate-bounce" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully! 🎉
          </h2>
          <p className="text-gray-600">Your order #{orderId} is being processed</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-orange-800 font-medium">
            Estimated Delivery: {estimatedDelivery || "45–60 mins"}
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Redirecting to order status in {countdown} seconds...
        </p>

        <button
          onClick={handleRedirect}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          View Order Status
        </button>
      </div>
    </div>
  );
}
