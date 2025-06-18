import React from "react";
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
  MessageCircleCode
} from "lucide-react";
import logo from "../../../../assets/oradoLogo.png";
import { useNavigate } from "react-router-dom";
import { logoutMerchant } from "../../../../apis/restaurantApi";
import { logout } from "../../../../slices/authSlice";

const MerchantSidebar = ({ activeTab, setActiveTab }) => {
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
      // Call the logout API
      await logoutMerchant();
      
      // Clear local storage or any merchant session data
      localStorage.removeItem("merchantToken");
      localStorage.removeItem("merchantData");
      
      // Redirect to login page
      navigate("/partner-with-orado");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem("merchantToken");
      localStorage.removeItem("merchantData");
      navigate("/partner-with-orado");
    }
  };

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 justify-centerZ">
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
                onClick={() => setActiveTab(item.id)}
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
  );
};

export default MerchantSidebar;