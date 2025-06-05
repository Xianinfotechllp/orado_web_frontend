import React from 'react';
import { BarChart3, ShoppingBag, ClipboardList } from 'lucide-react';

const MerchantSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'menu', label: 'Menu Management', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
  ];

  return (
    <div className="w-64 h-full border-r border-gray-200 bg-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">FD</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">FoodDash</h2>
            <p className="text-sm text-gray-500">Merchant Portal</p>
          </div>
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
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MerchantSidebar;