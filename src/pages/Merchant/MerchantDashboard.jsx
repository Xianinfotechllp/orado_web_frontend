import React, { useState } from "react";
import MerchantSidebar from "../../components/merchant/Dashboard/sidebar/MerchantSidebar";
import DashboardHeader from "../../components/merchant/Dashboard/DashboardHeader";
import DashboardOverview from "../../components/merchant/Dashboard/EarningsSection/DashboardOverView";
import CreateMenu from "../../components/merchant/Dashboard/MenuSection/MenuManagement";
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
import RestaurantEditSection from "../../components/merchant/Dashboard/RestaurantEdit/RestaurantEditSection"

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState("restaurant");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "earnigs":
        return <RestaurantEarnings  />
      case "restaurantManagement":
         return <RestaurantEditSection/>;
      case "menu":
        return <CreateMenu />;
      case "orders":
        return <OrderManagement />;
      case "service-areas":
        return <ServiceAreaManagement />;
      case "restaurant":
        return <RestaurantManagement />;
      // case "categories":
      //   return <CategoryManagement />;
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
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar - Completely fixed and independent */}
      <div className="flex-shrink-0">
        <MerchantSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>

      {/* Main Content Area - Independent scrolling */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-0">
        {/* Fixed Header */}
        <div className="flex-shrink-0 z-20 bg-white border-b border-gray-200">
          <DashboardHeader onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 lg:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MerchantDashboard;