import React, { useState } from 'react';
import OrderManagement from './OrderManagement';
import OrderDetails from './OrderDetails';

const OrderManager = () => {
  const [currentView, setCurrentView] = useState('list');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedOrderId(null);
  };

  return (
    <div className="relative p-4 bg-gray-50 min-h-screen">
      {currentView === 'list' && (
        <OrderManagement onOrderClick={handleOrderClick} />
      )}
      
      {currentView === 'detail' && selectedOrderId && (
        <OrderDetails 
          orderId={selectedOrderId} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};

export default OrderManager;