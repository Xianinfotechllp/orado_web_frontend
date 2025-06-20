import React, { useState } from "react";
import {
  BarChart3,
  ShoppingBag,
  ClipboardList,
  Home,
  Grid3X3,
  Star,
  Tag,
  MapPin,
  LogOut,
  MessageCircle,
  MessageCircleCode,
  Menu,
  X
} from "lucide-react";
import logo from "../../../../assets/oradoLogo.png";
import { useNavigate } from "react-router-dom";
import { logoutMerchant } from "../../../../apis/restaurantApi";

const MerchantSidebar = ({ activeTab, setActiveTab, mobileSidebarOpen, setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const menuItems = [
    { id: "restaurant", label: "My Restaurant", icon: Home },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "menu", label: "Menu Management", icon: ShoppingBag },
    { id: "categories", label: "Category", icon: Grid3X3 },
    { id: "orders", label: "Orders", icon: ClipboardList },
    { id: "service-areas", label: "Service Areas", icon: MapPin },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "offers", label: "Offers & Coupons", icon: Tag },
    { id: "customerChat", label: "Customer Chats", icon: MessageCircle },
    { id: "adminChat", label: "Admin Chats", icon: MessageCircleCode },
  ];

  const handleLogout = async () => {
    try {
      await logoutMerchant();
      localStorage.removeItem("merchantToken");
      localStorage.removeItem("merchantData");
      navigate("/partner-with-orado");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("merchantToken");
      localStorage.removeItem("merchantData");
      navigate("/partner-with-orado");
    }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bgOp z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 h-full transition-all duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
        w-64 border-r border-gray-200 bg-white flex flex-col
      `}>
        {/* Mobile Close Button */}
        <button 
          className="lg:hidden absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:text-gray-700"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 justify-center">
            <img src={logo} alt="Orado Logo" className="h-11 w-auto" />
            <span className="text-4xl font-bold">Orado</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-start p-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MerchantSidebar;