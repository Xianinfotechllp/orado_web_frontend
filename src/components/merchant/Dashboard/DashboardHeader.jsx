// components/DashboardHeader.jsx
import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Bell, Key, Mail, Phone } from 'lucide-react';
import { getMerchantDetails } from '../../../apis/restaurantApi';
import { useSelector } from "react-redux";
import ResetPasswordModal from '../Authentication/ResetPasswordModal';

const DashboardHeader = () => {
  const { user, token } = useSelector((state) => state.auth); // Get token from Redux
  const merchantId = user?.id || user?.merchantId;  
  console.log("token:", token); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const data = await getMerchantDetails(merchantId);
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
    setIsMenuOpen(false); // Close the dropdown menu
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSubmit = async (passwordData) => {
    setResetPasswordLoading(true);
    
    try {
      // Here you would typically call your API to reset the password
      // Example: await resetPassword(merchantId, passwordData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Password reset data:', passwordData);
      
      // Show success message (you might want to use a toast notification)
      alert('Password reset successfully!');
      
      // Close the modal
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
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {merchant?.businessName || 'Merchant'}!
            </h1>
            <p className="text-gray-600">Manage your business and track your performance</p>
          </div>
          
          <div className="flex items-center space-x-4 relative">
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white">
                  {merchant?.businessName?.charAt(0) || 'M'}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{merchant?.businessName || 'Merchant'}</p>
                  <p className="text-sm text-gray-500">{merchant?.email}</p>
                </div>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                        {merchant?.name?.charAt(0) || 'M'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{merchant?.name || 'Merchant'}</h3>
                        <p className="text-xs opacity-90">{merchant?.businessType}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="p-6 space-y-4">
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
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reset Password Modal */}
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