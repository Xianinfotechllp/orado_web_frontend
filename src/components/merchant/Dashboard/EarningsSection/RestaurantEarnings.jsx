import { useState, useEffect } from 'react';
import apiClient from '../../../../apis/apiClient/apiClient';
import RestaurantSlider from '../Slider/RestaurantSlider';

const RestaurantEarnings = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantIndex, setSelectedRestaurantIndex] = useState(0);

  // Fetch data when selected restaurant changes
  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchEarningsData(selectedRestaurant.id);
    } else {
      setLoading(false); // No restaurant selected, stop loading
    }
  }, [selectedRestaurant]);

  const fetchEarningsData = async (restaurantId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/restaurants/${restaurantId}/earnigsv2`);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = (restaurant, index) => {
    if (!restaurant?.id) {
      console.error("Invalid restaurant selection:", restaurant);
      return;
    }
    setSelectedRestaurant(restaurant);
    setSelectedRestaurantIndex(index);
  };

  const handleRestaurantsLoad = (loadedRestaurants) => {
    setRestaurants(loadedRestaurants);
    if (loadedRestaurants.length > 0 && !selectedRestaurant) {
      // Auto-select first restaurant if none is selected
      setSelectedRestaurant(loadedRestaurants[0]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading && !selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!selectedRestaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Restaurants Available</h3>
          <p className="text-gray-600 mb-4">You don't have any approved restaurants to display earnings for.</p>
        </div>
      </div>
    );
  }

  // Fallback to empty data if not available
  const actualData = data || {
    summary: {
      totalOrderAmount: 0,
      totalNetRevenue: 0,
      totalCommission: 0,
      orderCount: 0
    },
    orders: {
      docs: []
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        <RestaurantSlider
          onRestaurantSelect={handleRestaurantSelect}
          onRestaurantsLoad={handleRestaurantsLoad}
          selectedIndex={selectedRestaurantIndex}
          className="mb-6"
        />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Restaurant Earnings</h1>
          <p className="text-gray-600">
            {selectedRestaurant.name} • {selectedRestaurant.location}
          </p>
        </div>

        {/* Loading overlay for data loading */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-lg font-medium text-gray-700">Loading earnings data...</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹{actualData.summary.totalOrderAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-green-600 font-medium">+12.5% from last month</p>
          </div>

          <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Net Earnings</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹{actualData.summary.totalNetRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-blue-600 font-medium">+8.2% from last month</p>
          </div>

          <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Commission</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">₹{actualData.summary.totalCommission.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-orange-600 font-medium">15.6% of revenue</p>
          </div>

          <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{actualData.summary.orderCount.toLocaleString('en-IN')}</p>
            <p className="text-sm text-purple-600 font-medium">+23 from yesterday</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {actualData.orders.docs.filter(order => order.orderStatus === 'delivered').length} Delivered
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {actualData.orders.docs.filter(order => order.orderStatus !== 'delivered').length} Pending
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {actualData.orders.docs.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm font-mono text-gray-600">#{order._id.substring(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {order.customerId?.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{order.customerId?.name || 'Customer'}</div>
                          <div className="text-sm text-gray-500">{order.customerId?.phone || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {order.orderItems.slice(0, 2).map((item, itemIndex) => (
                          <span key={itemIndex} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                        {order.orderItems.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                            +{order.orderItems.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.orderTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'delivered' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : order.orderStatus === 'preparing'
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          order.orderStatus === 'delivered' ? 'bg-green-500' : 
                          order.orderStatus === 'preparing' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Net: ₹{order.restaurantNetEarning?.toFixed(2) || (order.totalAmount * 0.9).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Order Details</h2>
                    <p className="text-gray-600 mt-1">#{selectedOrder._id.substring(0, 8)}...</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-20">Name:</span>
                        <span className="text-gray-900 font-semibold">{selectedOrder.customerId?.name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600 font-medium w-20">Phone:</span>
                        <span className="text-gray-900 font-semibold">{selectedOrder.customerId?.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Delivery Address
                    </h3>
                    <div className="text-gray-700 leading-relaxed">
                      <p className="font-medium">{selectedOrder.deliveryAddress?.street || 'N/A'}</p>
                      <p>{selectedOrder.deliveryAddress?.city || 'N/A'}, {selectedOrder.deliveryAddress?.state || 'N/A'}</p>
                      <p>{selectedOrder.deliveryAddress?.country || 'N/A'} - {selectedOrder.deliveryAddress?.pincode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Order Items
                  </h3>
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedOrder.orderItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12">
                                    <img className="h-12 w-12 rounded-xl object-cover border-2 border-gray-200" src={item.image} alt={item.name} />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{item.price}</td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{item.totalPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-8 rounded-2xl border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Financial Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Order Status</p>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedOrder.orderStatus === 'delivered' ? 'bg-green-500' : 
                          selectedOrder.orderStatus === 'preparing' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <p className="text-lg font-bold text-gray-900 capitalize">{selectedOrder.orderStatus}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Subtotal</p>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedOrder.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Discount Amount</p>
                      <p className="text-2xl font-bold text-blue-600">₹{(selectedOrder.discountAmount || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-indigo-600">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Offer Discount</p>
                      <p className="text-2xl font-bold text-red-600">₹{selectedOrder.offerDiscount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Payment Method</p>
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {selectedOrder.paymentMethod === 'cash' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          )}
                        </svg>
                        <p className="text-lg font-semibold text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Wallet Used</p>
                      <p className="text-2xl font-bold text-purple-600">₹{(selectedOrder.walletUsed || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Commission</p>
                      <p className="text-2xl font-bold text-orange-600">₹{selectedOrder.commissionAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="text-gray-600 text-sm font-medium mb-1">Net Earnings</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedOrder.restaurantNetEarning.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Order Time</p>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(selectedOrder.orderTime)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantEarnings;