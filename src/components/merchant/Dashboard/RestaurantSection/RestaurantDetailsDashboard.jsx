import React, { useState } from 'react';
import { 
  MapPin, Clock, Star, Phone, Mail, FileText, CreditCard, 
  Users, Package, AlertCircle, CheckCircle, XCircle, 
  Calendar, Settings, X 
} from 'lucide-react';
import { toast } from 'react-toastify';
import { toggleRestaurantActiveStatus } from '../../../../apis/restaurantApi';

const RestaurantDetailsDashboard = ({ restaurantData: initialRestaurantData, onClose }) => {
  const [restaurantData, setRestaurantData] = useState(initialRestaurantData);
  const [isActive, setIsActive] = useState(initialRestaurantData.active);

  const handleToggleActive = async () => {
    try {
      const response = await toggleRestaurantActiveStatus(restaurantData._id);
      console.log(response.data)
      setIsActive(response.activeStatus);
      setRestaurantData(prev => ({ ...prev, active: response.activeStatus }));
      toast.success(`Restaurant is now ${response.activeStatus ? 'Active' : 'Inactive'}`);
    } catch (error) {
      toast.error("Failed to toggle active status");
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Details</h1>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {restaurantData.name?.charAt(0) || 'R'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{restaurantData.name}</h1>
                <p className="text-gray-600">{restaurantData.ownerName}</p>
              </div>
            </div>
            
            {/* Active Toggle */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {isActive ? 'Restaurant Open' : 'Restaurant Closed'}
                </p>
                <p className="text-xs text-gray-500">
                  {isActive ? 'Accepting orders' : 'Not accepting orders'}
                </p>
              </div>
              <button
                onClick={handleToggleActive}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isActive ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                    isActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Status</p>
                <div className="mt-1">
                  {getStatusBadge(restaurantData.approvalStatus)}
                </div>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">KYC Status</p>
                <div className="mt-1">
                  {getStatusBadge(restaurantData.kycStatus)}
                </div>
              </div>
              <Users className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-lg font-semibold">{restaurantData.rating || 'N/A'}</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission</p>
                <p className="text-lg font-semibold text-gray-900">
                  {restaurantData.commission?.value || 0}%
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Restaurant Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {restaurantData.images?.map((image, index) => (
                  <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Restaurant image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600 text-sm">{restaurantData.address?.street}</p>
                      <p className="text-gray-600 text-sm">
                        {restaurantData.address?.city}, {restaurantData.address?.state} {restaurantData.address?.zip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600 text-sm">{restaurantData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600 text-sm">{restaurantData.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Preparation Time</p>
                      <p className="text-gray-600 text-sm">{restaurantData.preparationTime} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Min Order Amount</p>
                      <p className="text-gray-600 text-sm">₹{restaurantData.minOrderAmount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Food Type</p>
                      <p className="text-gray-600 text-sm capitalize">{restaurantData.foodType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* KYC Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">KYC Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">FSSAI Number</p>
                  <p className="text-sm text-gray-600">{restaurantData.kyc?.fssaiNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">GST Number</p>
                  <p className="text-sm text-gray-600">{restaurantData.kyc?.gstNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Aadhar Number</p>
                  <p className="text-sm text-gray-600">
                    {restaurantData.kyc?.aadharNumber?.replace(/(\d{4})(?=\d)/g, '$1 ')}
                  </p>
                </div>
                {restaurantData.kycStatus === 'rejected' && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">KYC Rejected</p>
                        <p className="text-sm text-red-700">{restaurantData.kycRejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h2>
              <div className="space-y-2">
                {restaurantData.openingHours?.map((hours, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-700">{hours.day}</span>
                    <span className="text-sm text-gray-600">{hours.openingTime} - {hours.closingTime}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Created At</p>
                  <p className="text-sm text-gray-600">{formatDate(restaurantData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Updated</p>
                  <p className="text-sm text-gray-600">{formatDate(restaurantData.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Restaurant ID</p>
                  <p className="text-sm text-gray-600 font-mono">{restaurantData._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Owner ID</p>
                  <p className="text-sm text-gray-600 font-mono">{restaurantData.ownerId}</p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Manage Menu</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    restaurantData.permissions?.canManageMenu 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurantData.permissions?.canManageMenu ? 'Allowed' : 'Denied'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Accept Orders</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    restaurantData.permissions?.canAcceptOrder 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurantData.permissions?.canAcceptOrder ? 'Allowed' : 'Denied'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailsDashboard;