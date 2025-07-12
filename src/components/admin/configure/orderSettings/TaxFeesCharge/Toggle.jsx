import React from 'react';

const Toggle = ({ 
  enabled, 
  onChange, 
  label, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      container: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      container: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={onChange}
        className={`${classes.container} relative inline-flex items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled 
            ? 'bg-blue-600' 
            : 'bg-gray-200'
        }`}
      >
        <span
          className={`${classes.circle} inline-block transform rounded-full bg-white shadow transition-transform ${
            enabled ? classes.translate : 'translate-x-0'
          }`}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
};

export default Toggle;