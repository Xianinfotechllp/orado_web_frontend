import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.",
  onRetry = null,
  dismissible = true,
  onDismiss = null,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className={`bg-orange-600 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-orange-100 mb-4">{message}</p>
            
            {onRetry && (
              <div className="flex space-x-3">
                <button
                  onClick={onRetry}
                  className="bg-white text-orange-600 px-4 py-2 rounded font-medium hover:bg-orange-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-orange-200 hover:text-white transition-colors ml-4"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;