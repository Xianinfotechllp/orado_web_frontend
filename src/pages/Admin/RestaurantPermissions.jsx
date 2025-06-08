import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Shield, Settings, Users, AlertCircle } from 'lucide-react';
import axios from 'axios';


const RestaurantPermissions = () => {
  const token = sessionStorage.getItem('adminToken');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/getrestuarants/permissions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data?.data || []; // array of restaurants with permissions


        setRestaurants(data);

        console.log(res.data?.data);

        const initSelections = {};
        data.forEach((rest) => {
          initSelections[rest._id] = {
            canManageMenu: rest.permissions.canManageMenu ? 'accept' : 'reject',
            canAcceptOrder: rest.permissions.canAcceptOrder ? 'accept' : 'reject',
            canRejectOrder: rest.permissions.canRejectOrder ? 'accept' : 'reject',
            canManageOffers: rest.permissions.canManageOffers ? 'accept' : 'reject',
            canViewReports: rest.permissions.canViewReports ? 'accept' : 'reject',
          };
        });
        setSelectedActions(initSelections);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching restaurants:', err);
      });
  }, []);

  const handleAction = (restaurantId, permissionKey, actionType) => {
    setSelectedActions((prev) => {
      const updatedForOne = {
        ...prev[restaurantId],
        [permissionKey]: actionType,
      };
      const newSelected = {
        ...prev,
        [restaurantId]: updatedForOne,
      };
      sendUpdatedPermissions(restaurantId, updatedForOne);
      return newSelected;
    });
  };

  const sendUpdatedPermissions = (restaurantId, updatedPermissionsMap) => {
    const permissionsToSend = {};
    console.log("Sending ID type:", typeof restaurantId, "value:", restaurantId);
    Object.entries(updatedPermissionsMap).forEach(([key, val]) => {
      permissionsToSend[key] = val === 'accept';
    });

    console.log('Sending permissions update:', {
      restaurantId,
      permissions: permissionsToSend,
    });

    axios
      .put(
        'http://localhost:5000/admin/restuarants/permissions',
        {
          restaurantId,
          permissions: permissionsToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(`Permissions updated for restaurant ${restaurantId}:`, res.data.permissions);
      })
      .catch((err) => {
        console.error('Failed to update permissions:', err);
      });
  };

  const permissionKeys = [
    { key: 'canManageMenu', label: 'Manage Menu', icon: Settings },
    { key: 'canAcceptOrder', label: 'Accept Orders', icon: Check },
    { key: 'canRejectOrder', label: 'Reject Orders', icon: X },
    { key: 'canManageOffers', label: 'Manage Offers', icon: AlertCircle },
    { key: 'canViewReports', label: 'View Reports', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-orange-500 rounded-full animate-spin absolute top-0 left-0" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">Loading Restaurant Permissions</h3>
            <p className="text-gray-500">Please wait while we fetch the data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-red-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Oops! Something went wrong</h2>
              <p className="text-gray-600">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px- py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-orange-600 mb-4">
            <Shield className="w-4 h-4 mr-2" />
            <span>Admin Dashboard</span>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium">Permissions Management</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Restaurant Permissions
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage and control restaurant access to dashboard features with precision
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-red-500">
                <tr>
                  <th className="px-8 py-6 text-left font-bold text-white text-lg">
                    Restaurant
                  </th>
                  {permissionKeys.map((perm) => {
                    const Icon = perm.icon;
                    return (
                      <th
                        key={perm.key}
                        className="px-6 py-6 text-center font-bold text-white"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Icon className="w-5 h-5" />
                          <span className="text-sm">{perm.label}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurants.map((rest, index) => (
                  <tr
                    key={rest._id}
                    className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 transform hover:scale-[1.01]"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">
                              {rest.name[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 text-lg">{rest.name}</h3>
                          <p className="text-gray-500 text-sm">{rest.email}</p>
                        </div>
                      </div>
                    </td>
                    {permissionKeys.map((perm) => {
                      const current = selectedActions[rest._id]?.[perm.key];
                      return (
                        <td key={`${rest._id}-${perm.key}`} className="px-6 py-6 text-center">
                          <div className="flex justify-center">
                            <div className="bg-gray-100 rounded-2xl p-1 shadow-inner">
                              <div className="flex" role="group">
                                <button
                                  onClick={() => handleAction(rest._id, perm.key, 'accept')}
                                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${current === 'accept'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                                    }`}
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Allow</span>
                                </button>
                                <button
                                  onClick={() => handleAction(rest._id, perm.key, 'reject')}
                                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ml-1 ${current === 'reject'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                                    }`}
                                >
                                  <X className="w-4 h-4" />
                                  <span>Deny</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {restaurants.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-500 text-lg">There are no restaurants available to manage permissions for.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default RestaurantPermissions;