import React, { useState } from 'react';
import MerchantSidebar from '../../components/merchant/Dashboard/sidebar/MerchantSidebar';
import DashboardHeader from '../../components/merchant/Dashboard/DashboardHeader';
import DashboardOverview from '../../components/merchant/Dashboard/DashboardOverView';
import MenuManagement from '../../components/merchant/Dashboard/MenuManagement';
import OrderManagement from '../../components/merchant/Dashboard/OrderManagement';

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'menu':
        return <MenuManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <MerchantSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;