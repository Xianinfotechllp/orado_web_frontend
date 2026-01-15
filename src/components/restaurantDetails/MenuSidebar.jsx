import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { getRestaurantMenu } from '../../apis/restaurantApi';

const RestaurantMenuSidebar = ({ restaurantId }) => {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await getRestaurantMenu(restaurantId);
        setMenuData(data.data || []);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const MenuContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-red-600 text-sm">
          {error}
        </div>
      );
    }

    if (!menuData.length) {
      return (
        <div className="p-4 text-gray-500 text-sm">
          No menu categories available
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {menuData.map((category) => (
          <div key={category.categoryId} className="border-b border-gray-100 last:border-b-0">
            {/* Category Header */}
            <div 
              className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(category.categoryId)}
            >
              <div className="flex items-center">
                <span className="text-gray-800 font-medium text-sm">
                  {category.categoryName}
                </span>
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category.totalProducts}
                </span>
              </div>
              <div className="text-gray-400">
                {expandedCategories[category.categoryId] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </div>
            </div>

            {/* Category Items */}
            {expandedCategories[category.categoryId] && (
              <div className="pb-2">
                {category.items?.map((item) => (
                  <div 
                    key={item._id}
                    className="py-2 px-8 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer transition-colors"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center text-gray-700"
        >
          <Menu className="w-5 h-5 mr-2" />
          <span className="font-medium">Menu</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-80 h-full">
            {/* Mobile Header */}
            <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-orange-200 text-xl"
              >
                ×
              </button>
            </div>
            <MenuContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white shadow-md border-r border-gray-200 h-full">
        {/* Sticky Header */}
        <div className="bg-orange-600 text-white px-4 py-3 flex items-center">
            <Menu className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">Menu</h2>
        </div>
        
        {/* Menu Content */}
        <div className="flex-1 px-2 py-4 overflow-hidden">
          <MenuContent />
        </div>
      </div>
    </>
  );
};

export default RestaurantMenuSidebar;