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

import RestaurantChatDashboard from "../../components/merchant/CustomerChats/RestruantChatDashboard";
import RestaurantAdminChat from "../../components/merchant/AdminRestaurantChat/RestaurantAdminChat";
import { Menu } from "lucide-react";

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("restaurant");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      case "customerChat":
        return <RestaurantChatDashboard />;
      case "adminChat":
        return <RestaurantAdminChat />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left z-30 p-2 rounded-md bg-white shadow-md"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <MerchantSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <div className="fixed w-full lg:left-64 lg:w-[calc(100%-16rem)] z-20">
          <DashboardHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 p-4 lg:p-6 mt-16 lg:mt-20 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;