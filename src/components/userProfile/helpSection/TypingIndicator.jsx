import React from 'react';

const TypingIndicator = ({ color = 'orange' }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 rounded-r-2xl rounded-tl-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex space-x-1 items-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {color === 'orange' ? 'Customer Support' : 'Restaurant'} is typing...
          </span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;