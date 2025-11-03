import React from "react";
import {
  BarChart3,
  ShoppingBag,
  ClipboardList,
  Home,
  Star,
  Tag,
  MapPin,
  LogOut,
  MessageCircle,
  MessageCircleCode,
  X,
} from "lucide-react";
import logo from "../../../../assets/oradoLogo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutMerchant } from "../../../../apis/restaurantApi";

const Sidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
  { path: "/merchant/dashboard/merchant", label: "My Restaurant", icon: Home },
  { path: "/merchant/dashboard/earnings-dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/merchant/dashboard/earnings", label: "Earnings", icon: BarChart3 },
  { path: "/merchant/dashboard/edit", label: "Restaurant Edit", icon: BarChart3 },
  { path: "/merchant/dashboard/menu", label: "Menu Management", icon: ShoppingBag },
  { path: "/merchant/dashboard/orders", label: "Orders", icon: ClipboardList },
  { path: "/merchant/dashboard/serive-area", label: "Service Areas", icon: MapPin }, // match typo in route
  { path: "/merchant/dashboard/reviews", label: "Reviews", icon: Star },
  { path: "/merchant/dashboard/offers", label: "Offers & Coupons", icon: Tag },
  { path: "/merchant/dashboard/customer-chat", label: "Customer Chats", icon: MessageCircle },
  { path: "/merchant/dashboard/admin-chat", label: "Admin Chats", icon: MessageCircleCode },
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
      <div
        className={`
          fixed lg:static top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0
          w-64 border-r border-gray-200 bg-white flex flex-col overflow-hidden
        `}
      >
        {/* Mobile Close Button */}
        <button
          className="lg:hidden absolute top-4 right-4 p-1 rounded-md text-gray-700 hover:text-gray-900 z-10"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sidebar Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 h-20">
          <div className="flex items-center gap-3 justify-center h-full">
            <img src={logo} alt="Orado Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-gray-700">Orado</span>
          </div>
        </div>

        {/* Scrollable Menu */}
        <div
          className="flex-1 overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 160px)" }}
        >
          <nav className="space-y-1 p-3">
            {menuItems.map((item) => (
              <div key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-start p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-gray-600 to-gray-900 text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white h-16">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
