import React from 'react';
import { CheckCheck, Check } from 'lucide-react';

const Message = ({ message, isOwn, color = 'orange' }) => {
      console.log('Rendering Message:', { message, isOwn });

  const formatTime = (timestamp) => {
    // Convert to Date if timestamp is a string
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Fix for Tailwind dynamic classes - define explicit bg classes
  const ownBgClass = color === 'orange' ? 'bg-orange-600' : 'bg-blue-600';
  const ownTextClass = 'text-white';
  const otherBgClass = 'bg-gray-100';
  const otherTextClass = 'text-gray-800';
  const ownReadIconClass = color === 'orange' ? 'text-orange-200' : 'text-blue-200';

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 shadow-sm ${
          isOwn
            ? `${ownBgClass} ${ownTextClass} rounded-l-2xl rounded-tr-2xl rounded-br-md`
            : `${otherBgClass} ${otherTextClass} rounded-r-2xl rounded-tl-2xl rounded-bl-md`
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div
          className={`flex items-center justify-end mt-2 space-x-1 ${
            isOwn ? 'text-orange-100' : 'text-gray-500'
          }`}
        >
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {isOwn && (
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck size={12} className="text-blue-200" />
              ) : (
                <Check size={12} className={ownReadIconClass} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
