import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, ChevronRight } from 'lucide-react';

const AdminPermission = () => {
  const token = sessionStorage.getItem('adminToken');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedActions, setSelectedActions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/admin/getrestuarants/permissions', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data.data;
        setRestaurants(data);

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
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurant permissions');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [token]);

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

  const sendUpdatedPermissions = async (restaurantId, updatedPermissionsMap) => {
    try {
      const permissionsToSend = {};
      Object.entries(updatedPermissionsMap).forEach(([key, val]) => {
        permissionsToSend[key] = val === 'accept';
      });

      await axios.put(
        'http://localhost:5000/admin/permissions/restuarants',
        {
          restaurantId,
          permissions: permissionsToSend,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error('Failed to update permissions:', err);
    }
  };

  const permissionKeys = [
    { key: 'canManageMenu', label: 'Manage Menu' },
    { key: 'canAcceptOrder', label: 'Accept Orders' },
    { key: 'canRejectOrder', label: 'Reject Orders' },
    { key: 'canManageOffers', label: 'Manage Offers' },
    { key: 'canViewReports', label: 'View Reports' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        <X className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-700">Error Loading Permissions</h2>
        <p className="text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Restaurant Permissions</h1>
            <p className="text-gray-500 mt-1">
              Grant or restrict restaurant access to manage specific dashboard features.
            </p>
          </div>
          <div className="flex items-center text-sm text-orange-600 mt-4 md:mt-0">
            <span>Admin Dashboard</span>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium">Permissions</span>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-orange-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider">
                    Restaurant
                  </th>
                  {permissionKeys.map((perm) => (
                    <th
                      key={perm.key}
                      className="px-6 py-3 text-center font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {perm.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {restaurants.map((rest) => (
                  <tr key={rest._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold">
                          {rest.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{rest.name}</div>
                          <div className="text-gray-500 text-xs">{rest.email}</div>
                        </div>
                      </div>
                    </td>
                    {permissionKeys.map((perm) => {
                      const current = selectedActions[rest._id]?.[perm.key];
                      return (
                        <td key={`${rest._id}-${perm.key}`} className="px-4 py-4 text-center">
                          <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button
                              onClick={() => handleAction(rest._id, perm.key, 'accept')}
                              className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-medium rounded-l-md ${
                                current === 'accept'
                                  ? 'bg-orange-500 text-white border-orange-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              Allow
                            </button>
                            <button
                              onClick={() => handleAction(rest._id, perm.key, 'reject')}
                              className={`flex items-center gap-1 px-3 py-1.5 border text-xs font-medium rounded-r-md ${
                                current === 'reject'
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              <X className="w-4 h-4" />
                              Deny
                            </button>
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
            <div className="text-center py-16">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-800">No restaurants found</h3>
              <p className="text-gray-500">There are no restaurants available to manage permissions for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPermission;
