import React, { useState, useEffect, useRef } from "react";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  ArrowLeft,
  Star,
  MessageCircle,
  Navigation,
  Package,
  ChefHat
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../apis/orderApi";
import Navbar from "../layout/Navbar";
import AgentContactButton from "./AgentContact";
import io from "socket.io-client";
import store from "../../store/store";
import { useSelector } from "react-redux";
import RestaurantContactButton from './RestaurantContactButton'
import ChatPage from "../userProfile/helpSection/ChatPage";
import HelpModal from "../userProfile/helpSection/HelpModal";

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState("pending");
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [chatType, setChatType] = React.useState('admin')
  const user = useSelector((state) => state.auth.user); 

  // Initialize socket connection
  useEffect(() => {
    const token = store.getState().auth.token;
    if (!token) {
      console.log("No token available, falling back to polling");
      fetchOrderData();
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    console.log("Connecting to socket at:", socketUrl);

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected!");
      socketRef.current = socketInstance;
      setSocketConnected(true);
      
      // Setup all listeners
      setupSocketListeners(socketInstance);
      
      // Fetch initial data
      fetchOrderData();
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketConnected(false);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    });

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);

  // Setup socket listeners
  const setupSocketListeners = (socket) => {
    console.log("Setting up socket listeners");
    
    socket.on("order_status_update", (data) => {
      console.log("Received status update:", data);
      if (data.orderId === orderId) {
        setCurrentStatus(data.newStatus);
        setOrderData(prev => prev ? {
          ...prev,
          orderStatus: data.newStatus
        } : null);
      }
    });

    socket.on("order_completed", (data) => {
      console.log("Received order completed:", data);
      if (data.orderId === orderId) {
        setCurrentStatus("completed");
        setOrderData(prev => prev ? {
          ...prev,
          orderStatus: "completed"
        } : null);
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  };

  // Fetch order data
  const fetchOrderData = async () => {
    try {
      console.log("Fetching order data...");
      const data = await getOrderById(orderId);
      console.log("Order data received:", data);
      
      setOrderData(data);
      setCurrentStatus(data.orderStatus);
      
      // Join room after getting data
      if (socketRef.current?.connected && data.customerId?._id) {
        console.log("Joining user room with ID:", data.customerId._id);
        socketRef.current.emit("join-room", {
          userId: data.customerId._id, // IMPORTANT: Use just the ID
          userType: "user"
        });
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debugging effect
  useEffect(() => {
    console.log("Current socket status:", {
      connected: socketConnected,
      socket: socketRef.current,
      orderId,
      customerId: orderData?.customerId?._id
    });
  }, [socketConnected, orderData]);


  // Status timeline configuration
  const statusSteps = [
    { 
      key: "accepted_by_restaurant", 
      label: "Order Confirmed", 
      description: "Restaurant has accepted your order",
      icon: CheckCircle,
      completed: ["preparing", "ready", "picked_up", "in_progress", "arrived", "completed"].includes(currentStatus),
      active: currentStatus === "accepted_by_restaurant"
    },
    { 
      key: "preparing", 
      label: "Being Prepared", 
      description: "Your delicious meal is being cooked",
      icon: ChefHat,
      completed: ["ready", "picked_up", "in_progress", "arrived", "completed"].includes(currentStatus),
      active: currentStatus === "preparing"
    },
    { 
      key: "ready", 
      label: "Ready for Pickup", 
      description: "Food is ready, delivery partner will pick up soon",
      icon: Package,
      completed: ["picked_up", "in_progress", "arrived", "completed"].includes(currentStatus),
      active: currentStatus === "ready"
    },
    { 
      key: "picked_up", 
      label: "Picked Up", 
      description: "Delivery partner has picked up your order",
      icon: Navigation,
      completed: ["in_progress", "arrived", "completed"].includes(currentStatus),
      active: currentStatus === "picked_up"
    },
    { 
      key: "in_progress", 
      label: "Out for Delivery", 
      description: "Your order is on the way!",
      icon: Truck,
      completed: ["arrived", "completed"].includes(currentStatus),
      active: currentStatus === "in_progress" || currentStatus === "arrived"
    },
    { 
      key: "completed", 
      label: "Delivered", 
      description: "Your order has been delivered",
      icon: CheckCircle,
      completed: currentStatus === "completed",
      active: currentStatus === "completed"
    }
  ];

  const getStatusColor = (step) => {
    if (step.completed) return "text-green-600 bg-green-100";
    if (step.active) return "text-orange-600 bg-orange-100";
    return "text-gray-400 bg-gray-100";
  };

  const getStatusTextColor = (step) => {
    if (step.completed) return "text-green-700";
    if (step.active) return "text-orange-700";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="text-center mt-10">
        <div className="text-red-600 mb-4">Order not found</div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleOpenHelp = () => {
      console.log('user', user);
    setHelpModalOpen(true);
  };

  const handleCloseHelp = () => {
    setHelpModalOpen(false);
  };

  const handleChatStart = (type) => {
    setHelpModalOpen(false);
    setShowChat(true);
    setChatType(type); 
  };

  const handleBackFromChat = () => {
    setShowChat(false);
  };

  if (showChat) {
    return <ChatPage orderId={orderData._id} onBack={handleBackFromChat} chatType={chatType} user={user} restaurantId={orderData.restaurantId} />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-18">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate(-2)} 
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Track Order</h1>
                  <p className="text-gray-600">Order #{orderData._id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Ordered at {new Date(orderData.createdAt).toLocaleString()}</p>
                <p className="font-semibold text-orange-600">
                  ETA: {new Date(new Date(orderData.createdAt).getTime() + 45 * 60000).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Timeline</h2>
                
                <div className="space-y-6">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${getStatusColor(step)} flex-shrink-0`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold ${getStatusTextColor(step)}`}>
                              {step.label}
                            </h3>
                            <span className={`text-sm ${getStatusTextColor(step)}`}>
                              {step.completed ? "Completed" : step.active ? "In Progress" : "Pending"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                          {step.active && !step.completed && (
                            <div className="mt-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                                <span className="text-orange-600 text-sm font-medium">In Progress</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Partner Info */}
              {orderData.assignedAgent && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Delivery Partner</h2>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                      {orderData.assignedAgent?.fullName?.charAt(0) || 'D'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {orderData.assignedAgent?.fullName || 'Delivery Partner'}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="text-gray-600 text-sm">
                          {orderData.assignedAgent?.rating ? `${orderData.assignedAgent.rating} rating` : 'No rating'}
                        </span>
                        {orderData.assignedAgent?.vehicleNumber && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 text-sm">
                              {orderData.assignedAgent.vehicleNumber}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <AgentContactButton orderData={orderData} />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      💡 Your delivery partner will call you once they reach your location
                    </p>
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="text-orange-600" size={24} />
                  <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {orderData.deliveryAddress?.type || 'Delivery Address'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {[
                      orderData.deliveryAddress?.street,
                      orderData.deliveryAddress?.area,
                      orderData.deliveryAddress?.city,
                      orderData.deliveryAddress?.state,
                      orderData.deliveryAddress?.pincode,
                    ].filter(Boolean).join(', ')}
                  </p>
                  {orderData.deliveryAddress?.landmark && (
                    <p className="text-gray-600 text-sm mt-2">Near {orderData.deliveryAddress.landmark}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                {/* Restaurant Info */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{orderData.restaurantId?.name || 'Restaurant'}</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="text-yellow-400 fill-current" size={14} />
                    <span>{orderData.restaurantId?.rating || '4.3'}</span>
                    <span>•</span>
                    <span>25-30 mins</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
                  <div className="space-y-3">
                    {orderData.orderItems?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={item.image || 'https://via.placeholder.com/40'} 
                            alt={item.name} 
                            className="w-10 h-10 rounded" 
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-800">₹{item.totalPrice?.toFixed(2) || '0.00'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{orderData.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{orderData.deliveryCharge?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST & Other Charges</span>
                    <span>₹{orderData.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-800">
                      <span>Total Paid</span>
                      <span>₹{orderData.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Payment Method</span>
                    <span className="text-gray-800 font-semibold capitalize">
                      {orderData.paymentMethod || 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <RestaurantContactButton orderData={orderData} />
                  <button 
                    onClick={handleOpenHelp}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Need Help?
                  </button>
                </div>

                {/* Help Text */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <span className="font-medium">Need to cancel?</span><br />
                    You can cancel your order until it's being prepared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Help Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={handleCloseHelp}
        orderId={orderData._id}
        onChatStart={handleChatStart}
        restaurantName={orderData.restaurantId?.name}
      />
    </>
  );
}