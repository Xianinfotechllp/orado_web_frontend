
import { useState, useEffect, useRef } from "react";
import {
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiPlus,
  FiChevronDown,
  FiInfo,
  FiSearch,
} from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getAdminOrders } from "../../../apis/adminApis/adminFuntionsApi";
import { Link } from "react-router-dom";
import { updateOrderStatus } from "../../../apis/adminApis/orderApi";
import socket, {
  connectSocket,
  disconnectSocket,
} from "../../../services/socket";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrdersTable = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "orderTime",
    direction: "asc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const notificationSound = useRef(null);

  const tabs = [
    "All",
    "pending",
    "accepted_by_restaurant",
    "rejected_by_restaurant",
    "preparing",
    "ready",
    "picked_up",
    "on_the_way",
    "delivered",
    "cancelled_by_customer",
  ];

  const adminStatusOptions = [
    "pending",
    "accepted_by_restaurant",
    "rejected_by_restaurant",
    "preparing",
    "ready",
    "picked_up",
    "on_the_way",
    "delivered",
    "cancelled_by_customer",,
  ];

  const statusDisplayNames = {
    pending: "Pending",
    pending_agent_acceptance: "Pending Agent",
    accepted_by_restaurant: "Accepted",
    rejected_by_restaurant: "Rejected",
    preparing: "Preparing",
    ready: "Ready",
    assigned_to_agent: "Assigned",
    picked_up: "Picked Up",
    on_the_way: "On The Way",
    in_progress: "In Progress",
    arrived: "Arrived",
    completed: "Completed",
    delivered: "Delivered",
    cancelled_by_customer: "Cancelled",
    awaiting_agent_assignment: "Awaiting Agent",
    rejected_by_agent: "Agent Rejected",
  };

 const enableAudio = async () => {
  try {
    notificationSound.current = new Audio('/sound/bell.wav');
    notificationSound.current.preload = 'auto';
    
    // Try to load the audio first
    await notificationSound.current.load();
    
    // Play/pause to warm up (with muted audio)
    notificationSound.current.muted = true;
    await notificationSound.current.play();
    notificationSound.current.pause();
    notificationSound.current.currentTime = 0;
    notificationSound.current.muted = false;
    
    setAudioEnabled(true);
    localStorage.setItem('audioNotificationsEnabled', 'true');
    toast.success('Sound notifications enabled');
  } catch (e) {
    console.error('Audio initialization failed:', e);
    toast.error('Sound notifications failed to enable. Please interact with page first.');
  }
};
  const disableAudio = () => {
    setAudioEnabled(false);
    localStorage.removeItem('audioNotificationsEnabled');
  };





  useEffect(() => {
    if (localStorage.getItem('audioNotificationsEnabled') === 'true') {
      enableAudio();
    }

    // Request notification permission on component mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);



  const testNotification = () => {
  // Test sound notification
  if (audioEnabled && notificationSound.current) {
    notificationSound.current.play().catch(e => {
      console.log('Audio play failed:', e);
      disableAudio();
    });
  }

  // Test browser notification
  if (Notification.permission === 'granted') {
    new Notification('Test Notification', { 
      body: 'This is a test notification from the admin panel',
      icon: '/path/to/icon.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Test Notification', { 
          body: 'This is a test notification from the admin panel',
          icon: '/path/to/icon.png'
        });
      }
    });
  }

  // Test toast notification
  toast.info('Test notification triggered!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getAdminOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

 const handleNewOrder = (orderData) => {
  console.log('New order received:', orderData);
  setOrders(prev => [orderData, ...prev]);
  
  toast.success(`New Order #${orderData.orderId} Received!`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
  
  if (audioEnabled && notificationSound.current) {
    // Reset audio position and play
    notificationSound.current.currentTime = 0;
    notificationSound.current.play().catch(e => {
      console.log('Audio play failed:', e);
      // If play fails, disable audio and inform user
      disableAudio();
      toast.info('Sound notifications disabled due to browser restrictions. Please enable again.');
    });
  }
  
  if (Notification.permission === 'granted') {
    new Notification('New Order', { 
      body: `New order #${orderData.orderId} received`,
      icon: '/path/to/icon.png'
    });
  }
};

  useEffect(() => {
    const adminId = sessionStorage.getItem('userId');
    if (!adminId) {
      console.error('No admin ID found');
      return;
    }

    connectSocket();

    const handleConnect = () => {
      console.log('Socket connected - joining admin rooms');
      socket.emit('join-room', {
        userId: adminId,
        userType: 'admin'
      });
      fetchData().catch(console.error);
    };

    socket.on('connect', handleConnect);
    socket.on('new_order', handleNewOrder);

    if (socket.connected) {
      handleConnect();
    } else {
      fetchData().catch(console.error);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('new_order', handleNewOrder);
      disconnectSocket();
    };
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab !== "All" && order.orderStatus !== activeTab) {
      return false;
    }
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.orderId.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.restaurantName.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "pending_agent_acceptance":
      case "awaiting_agent_assignment":
        return "bg-yellow-100 text-yellow-800";
      case "accepted_by_restaurant":
      case "preparing":
      case "ready":
      case "assigned_to_agent":
      case "picked_up":
      case "on_the_way":
      case "in_progress":
      case "arrived":
        return "bg-blue-100 text-blue-800";
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "rejected_by_restaurant":
      case "cancelled_by_customer":
      case "rejected_by_agent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderAudioControl = () => (
    <button 
      onClick={audioEnabled ? disableAudio : enableAudio}
      className={`p-2 rounded-lg flex items-center ${audioEnabled ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
      title={audioEnabled ? "Disable sound notifications" : "Enable sound notifications"}
    >
      {audioEnabled ? (
        <>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span className="text-xs">Sound On</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span className="text-xs">Sound Off</span>
        </>
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-lg p-2 mr-3 text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
            <p className="text-sm text-gray-500">
              Manage and track all customer orders
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {renderAudioControl()}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={fetchData}
              title="Refresh"
            >
              <FiRefreshCw size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Filter"
            >
              <FiFilter size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Export"
            >
              <FiDownload size={18} />
            </button>


  <button
    onClick={testNotification}
    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center"
    title="Test notifications"
  >
    <FiInfo className="mr-1" />
    <span className="text-xs">Test Notifications</span>
  </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm whitespace-nowrap">
              <FiPlus className="mr-2" /> Create Order
            </button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="bg-white border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative ${
                activeTab === tab
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "All" ? "All" : statusDisplayNames[tab]}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container with Fixed Height */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("orderTime")}
                      >
                        <div className="flex items-center">
                          Order Time
                          {sortConfig.key === "orderTime" && (
                            <FiChevronDown
                              className={`ml-1 transform ${
                                sortConfig.direction === "desc"
                                  ? "rotate-180"
                                  : ""
                              }`}
                              size={14}
                            />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-6 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : sortedOrders.length > 0 ? (
                      sortedOrders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                            <Link
                              to={`/admin/dashboard/order/table/details/${order.orderId}`}
                              className="hover:underline"
                            >
                              {order.orderId}
                            </Link>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <select
                              value={order.orderStatus}
                              onChange={(e) =>
                                handleStatusChange(
                                  order.orderId,
                                  e.target.value
                                )
                              }
                              className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                                order.orderStatus
                              )} cursor-pointer`}
                            >
                              {adminStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {statusDisplayNames[status] || status}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {order.restaurantId ? (
                              <Link
                                to={`/admin/dashboard/merchants/merchant-details/${order.restaurantId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {order.restaurantName}
                              </Link>
                            ) : (
                              <span>{order.restaurantName}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.orderTime).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {order.customerId ? (
                                  <Link
                                    to={`/admin/dashboard/customer/${order.customerId}/details`}
                                    className="font-medium text-blue-600 hover:underline"
                                  >
                                    {order.customerName}
                                  </Link>
                                ) : (
                                  <span>{order.customerName}</span>
                                )}
                              </span>
                              <span className="text-xs text-gray-500">
                                {order.address}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.amount}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-gray-400 hover:text-gray-600">
                              <BsThreeDotsVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-400 mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                              />
                            </svg>
                            <p className="text-gray-500 mb-2">
                              No orders found
                            </p>
                            {searchQuery && (
                              <button
                                className="text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => setSearchQuery("")}
                              >
                                Clear search
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Pagination at Bottom */}
        {sortedOrders.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sticky bottom-0">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">
                    {Math.min(10, sortedOrders.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedOrders.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    aria-current="page"
                    className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTable;
