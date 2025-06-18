import React, { useEffect, useState } from 'react';
import { Trash2, EyeOff, Eye, TrendingUp, MapPin, Clock, AlertCircle, Loader } from 'lucide-react';
import { getAllSurgeAreas } from "../../../apis/surgeApi";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Constants for better maintainability
const SURGE_TYPES = {
  PEAK_HOURS: 'Peak Hours',
  EVENT_BASED: 'Event Based'
};

const SURGE_REASONS = {
  HIGH_DEMAND: 'High Demand',
  FLIGHT_SCHEDULE: 'Flight Schedule',
  SPORTS_EVENT: 'Sports Event'
};

const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive'
};

const API_BASE_URL =  'http://localhost:5000';

const deleteSurgeArea = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/surge-areas/${id}`, {
      method: "DELETE",
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting surge area:", error);
    throw error;
  }
};

const toggleSurgeAreaStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/surge-areas/${id}/toggle-status`, {
      method: "PATCH"
    });
console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error toggling surge area status:", error);
    throw error;
  }
};

const SurgeAreaList = () => {
  const [surgeAreas, setSurgeAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);
const fetchSurgeAreas = async () => {
  setLoading(true);
  setError(null);

  try {
    const data = await getAllSurgeAreas();
    console.log(data);

    if (data) {
      if (Array.isArray(data.data) && data.data.length > 0) {
        setSurgeAreas(data.data);
      } else {
        setError('No surge areas found');
        toast.error('No surge areas found');
      }
    } else {
      setError(data.message || 'Failed to fetch surge areas');
      toast.error(data.message || 'Failed to fetch surge areas');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError('Server error while fetching surge areas');
    toast.error('Server error while fetching surge areas');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSurgeAreas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this surge area?')) return;
    
    setActionLoading(prev => ({ ...prev, [`delete-${id}`]: true }));
    try {
      const data = await deleteSurgeArea(id);
      if (data.success) {
        setSurgeAreas(prev => prev.filter(item => item._id !== id));
        toast.success('Surge area deleted successfully');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete surge area');
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete-${id}`]: false }));
    }
  };
const handleToggleStatus = async (id) => {
  setActionLoading(prev => ({ ...prev, [`toggle-${id}`]: true }));
  try {
    const data = await toggleSurgeAreaStatus(id);
    if (data.success) {
      setSurgeAreas(prev => 
        prev.map(item => 
          item._id === id ? { ...item, active: !item.active } : item
        )
      );
      // Use the response data for the message
      toast.success(`Surge area ${data.data.active ? 'activated' : 'deactivated'} successfully`);
    } else {
      toast.error(data.message || 'Failed to toggle status');
    }
  } catch (err) {
    console.error('Toggle error:', err);
    toast.error(err.message || 'Failed to toggle surge area status');
  } finally {
    setActionLoading(prev => ({ ...prev, [`toggle-${id}`]: false }));
  }
};
  

  const getSurgeTypeColor = (type) => {
    switch (type) {
      case SURGE_TYPES.PEAK_HOURS: return 'bg-blue-100 text-blue-800';
      case SURGE_TYPES.EVENT_BASED: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurgeReasonIcon = (reason) => {
    switch (reason) {
      case SURGE_REASONS.HIGH_DEMAND: return <TrendingUp className="w-4 h-4" />;
      case SURGE_REASONS.FLIGHT_SCHEDULE: return <Clock className="w-4 h-4" />;
      case SURGE_REASONS.SPORTS_EVENT: return <AlertCircle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const formatDateRange = (startTime, endTime) => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    if (isSameDay) {
      return (
        <>
          <div className="font-medium">
            {startDate.toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </>
      );
    }
    
    return (
      <>
        <div className="font-medium">
          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
        <div className="text-gray-500">
          {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                <div className="h-8 bg-gray-300 rounded w-48"></div>
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading surge areas</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchSurgeAreas}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Surge Areas</h1>
          </div>
          <p className="text-gray-600">Manage and monitor surge pricing areas across your service regions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Areas</p>
                <p className="text-2xl font-bold text-gray-900">{surgeAreas.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Areas</p>
                <p className="text-2xl font-bold text-green-600">
                  {surgeAreas.filter(a => a.active).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive Areas</p>
                <p className="text-2xl font-bold text-gray-500">
                  {surgeAreas.filter(a => !a.active).length}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <EyeOff className="w-6 h-6 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {surgeAreas.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No surge areas found</h3>
              <p className="text-gray-500">Get started by creating your first surge area.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type & Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coverage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surgeAreas.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getSurgeReasonIcon(item.surgeReason)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.surgeReason}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSurgeTypeColor(item.surgeType)}`}>
                            {item.surgeType}
                          </span>
                          <div className="text-lg font-semibold text-gray-900">{item.surgeValue}x</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{item.radius}m radius</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDateRange(item.startTime, item.endTime)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.active ? STATUS.ACTIVE : STATUS.INACTIVE}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleStatus(item._id)}
                            disabled={actionLoading[`toggle-${item._id}`]}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                              item.active
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            } ${actionLoading[`toggle-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label={item.active ? 'Deactivate' : 'Activate'}
                          >
                            {actionLoading[`toggle-${item._id}`] ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={actionLoading[`delete-${item._id}`]}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors ${
                              actionLoading[`delete-${item._id}`] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            aria-label="Delete"
                          >
                            {actionLoading[`delete-${item._id}`] ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurgeAreaList;