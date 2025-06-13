import React, { useState } from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { logoutUser, logoutAllDevices } from '../../../apis/authApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../slices/authSlice';

const Logout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState({
    logout: false,
    logoutAll: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      setIsLoading(prev => ({ ...prev, logout: true }));
      await logoutUser();
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to logout');
    } finally {
      setIsLoading(prev => ({ ...prev, logout: false }));
      setShowLogoutModal(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!password) return;

    try {
      setIsLoading(prev => ({ ...prev, logoutAll: true }));
      await logoutAllDevices();
      dispatch(logout());
      toast.success('Logged out from all devices successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to logout from all devices');
    } finally {
      setIsLoading(prev => ({ ...prev, logoutAll: false }));
      setShowLogoutAllModal(false);
      setPassword('');
    }
  };

  return (
    <>
      {/* Main Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="ml-3 text-xl font-semibold text-gray-800">Account Logout</h1>
          </div>
        </div>

        {/* Content Grid */}
        <div className="md:flex">
          {/* Left Panel - User Info */}
          <div className="md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-orange-600 font-semibold text-2xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</h2>
              {user?.phone && <p className="text-sm text-gray-600 mt-1">{user.phone}</p>}
              <div className="mt-6 w-full">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-800">
                    <span className="font-medium">Security Tip:</span> Always logout from shared or public devices to keep your account secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Logout Options */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-6">Logout Options</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Current Device</h4>
                <p className="text-sm text-gray-600 mb-4">You're currently logged in on this device</p>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full md:w-auto bg-white border border-orange-600 text-orange-600 py-2 px-6 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from This Device</span>
                </button>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">All Devices</h4>
                <p className="text-sm text-gray-600 mb-4">This will log you out from all devices where you're currently signed in</p>
                <button
                  onClick={() => setShowLogoutAllModal(true)}
                  className="w-full md:w-auto bg-orange-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout from All Devices</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bgOp flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600">Are you sure you want to logout from this device?</p>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading.logout}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading.logout}
                className={`flex-1 py-3 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors ${
                  isLoading.logout ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading.logout ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout All Devices Modal */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 bgOp flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Logout All Devices</h3>
              <p className="text-gray-600">Enter your password to confirm logout from all devices</p>
            </div>
            
            <div className="mb-5">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                disabled={isLoading.logoutAll}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowLogoutAllModal(false);
                  setPassword('');
                }}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading.logoutAll}
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutAll}
                disabled={!password || isLoading.logoutAll}
                className={`flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                  (!password || isLoading.logoutAll) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading.logoutAll ? 'Processing...' : 'Logout All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;