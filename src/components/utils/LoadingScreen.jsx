import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingScreen = ({ 
  message = "Loading...", 
  size = "medium",
  fullScreen = true 
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen bg-white flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`${sizeClasses[size]} animate-spin text-orange-600`}>
            <RefreshCw className="w-full h-full" />
          </div>
        </div>
        <p className="text-orange-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;