import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Bell, Key, Mail, Phone, Menu } from 'lucide-react';
import { getMerchantDetails } from '../../../apis/restaurantApi';
import { useSelector } from "react-redux";
import ResetPasswordModal from '../Authentication/ResetPasswordModal';

const DashboardHeader = ({ onMenuToggle }) => {
  const { user, token } = useSelector((state) => state.auth);
  const merchantId = user?.id || user?.merchantId;  

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await getMerchantDetails();
        setMerchant(data);
      } catch (error) {
        console.error("Failed to fetch merchant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchant();
  }, [merchantId]);

  const handleResetPasswordClick = () => {
    setIsMenuOpen(false);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSubmit = async (passwordData) => {
    setResetPasswordLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Password reset data:', passwordData);
      alert('Password reset successfully!');
      setIsResetPasswordModalOpen(false);
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert('Failed to reset password. Please try again.');
    } finally {
      setResetPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
              onClick={onMenuToggle}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <div className="h-6 w-48 lg:w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-32 lg:w-48 bg-gray-200 rounded animate-pulse mt-1 lg:mt-2"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden  rounded-md text-gray-500 hover:text-gray-700"
              onClick={onMenuToggle}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900 line-clamp-1">
                Welcome back, {merchant?.businessName || 'Merchant'}!
              </h1>
              <p className="text-xs lg:text-sm text-gray-600 line-clamp-1">
                Manage your business and track your performance
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4 relative">
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-1 lg:space-x-3 p-1 lg:p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-sm lg:text-base">
                  {merchant?.businessName?.charAt(0) || 'M'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="font-medium text-gray-900 line-clamp-1">{merchant?.businessName || 'Merchant'}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{merchant?.email}</p>
                </div>
              </button>
              
              {isMenuOpen && (
                <>
                  {/* Mobile overlay */}
                  <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>
                  
                  {/* Dropdown menu */}
                  <div className="fixed lg:absolute right-0 lg:right-auto mt-0 lg:mt-2 w-full lg:w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden top-0 lg:top-auto bottom-0 lg:bottom-auto h-screen lg:h-auto max-h-screen lg:max-h-[calc(100vh-4rem)] flex flex-col">
                    {/* Close button for mobile */}
                    <div className="lg:hidden flex justify-end p-4 border-b">
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 lg:px-6 py-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 lg:w-12 h-10 lg:h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                          {merchant?.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-base lg:text-lg">{merchant?.name || 'Merchant'}</h3>
                          <p className="text-xs opacity-90">{merchant?.businessType}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{merchant?.email}</span>
                        </div>
                        
                        {merchant?.phone && (
                          <div className="flex items-center space-x-3 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{merchant.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <hr className="border-gray-200" />
                      
                      <button 
                        onClick={handleResetPasswordClick}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors duration-150"
                      >
                        <Key className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">Reset Password</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSubmit={handleResetPasswordSubmit}
        loading={resetPasswordLoading}
        token={token} 
      />
    </>
  );
};

export default DashboardHeader;