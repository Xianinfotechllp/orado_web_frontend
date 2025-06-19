import React, { useState } from "react";
import MerchantSidebar from "../../components/merchant/Dashboard/sidebar/MerchantSidebar";
import DashboardHeader from "../../components/merchant/Dashboard/DashboardHeader";
import DashboardOverview from "../../components/merchant/Dashboard/EarningsSection/DashboardOverView";
import MenuManagement from "../../components/merchant/Dashboard/MenuSection/MenuManagement";
import OrderManagement from "../../components/merchant/Dashboard/OrderSection/OrderManagement";
import RestaurantManagement from "../../components/merchant/Dashboard/RestaurantSection/RestaurantManagement";
import CategoryManagement from "../../components/merchant/Dashboard/CategorySection/CategoryManagement";
import ReviewsManagement from "../../components/merchant/Dashboard/ReviewSection/ReviewsManagement";
import OffersManagement from "../../components/merchant/Dashboard/OffersAndCoupon/OffersManagement";
import ServiceAreaManagement from "../../components/merchant/Dashboard/ServiceSection/ServiceAreaManagement";
import RestaurantEarnings from "../../components/merchant/Dashboard/EarningsSection/RestaurantEarnings";
const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("restaurant");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "earnigs":
        return <RestaurantEarnings  />;
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <OrderManagement />;
      case "service-areas":
        return <ServiceAreaManagement />;
      case "restaurant":
        return <RestaurantManagement />;
      case "categories":
        return <CategoryManagement />;
      case "reviews":
        return <ReviewsManagement />;
      case "offers":
        return <OffersManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 overflow-hidden">
      
      {/* Fixed Sidebar */}
      <div className="fixed h-full">
        <MerchantSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Fixed Header */}
        <div className="fixed w-[calc(100%-16rem)] z-10">
          <DashboardHeader />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-6 mt-20 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;
