import axios from "axios";
import { useState, useEffect } from "react";
import {
  Plus,
  Check,
  User,
  Clock,
  MapPin,
  Truck,
  Package,
  Phone,
  Info,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "../../apis/apiClient/apiClient";

const DispatchSidebar = ({ onOrderSelect}) => {
  const [activeTab, setActiveTab] = useState("unassigned");
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableAgents, setAvailableAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState(null);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch dispatch orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(
        "/admin/order/dispatch-status"
      );
      if (res.data.messageType === "success") {
        setDispatchOrders(res.data.data);
        setError(null);
      } else {
        setError("Unable to fetch orders");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableAgents = async () => {
    setIsLoadingAgents(true);
    try {
      const res = await apiClient.get("/admin/agent/list");
      if (res.data.messageType === "success") {
        const availableAgents = res.data.data.filter(
          (agent) =>
            agent.status === "Free" && agent.currentStatus === "AVAILABLE"
        );
        setAvailableAgents(availableAgents);
      }
    } catch (err) {
      console.error("Failed to fetch agents", err);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  // Open assign modal
  const openAssignModal = (order) => {
    setSelectedOrder(order);
    fetchAvailableAgents();
    setShowAssignModal(true);
    setSelectedAgent("");
    setAssignmentError(null);
  };

  // Assign agent to order
  const assignAgent = async () => {
    if (!selectedAgent) {
      setAssignmentError("Please select an agent");
      return;
    }

    setIsAssigning(true);
    setAssignmentError(null);

    try {
      const res = await axios.post(
        "https://orado-backend.onrender.com/admin/agent/manual-assign",
        {
          orderId: selectedOrder.orderId,
          agentId: selectedAgent,
        }
      );

      if (res.data.messageType === "success") {
        // Refresh both orders and available agents
        await Promise.all([fetchOrders(), fetchAvailableAgents()]);
        setShowAssignModal(false);

        // Show success message
        toast.success("Agent assigned successfully!");
        setAssignmentError("Agent assigned successfully!");
        setTimeout(() => setAssignmentError(null), 3000);
      } else {
        setAssignmentError(res.data.message || "Failed to assign agent");
      }
    } catch (err) {
      setAssignmentError("Failed to connect to server");
    } finally {
      setIsAssigning(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const groupedTasks = {
    unassigned: dispatchOrders.filter(
      (o) =>
        (o.agentAssignmentStatus === "unassigned" || 
         o.agentAssignmentStatus === "not_assigned") && // Handle both cases
        o.orderStatus !== "completed" &&
        o.orderStatus !== "delivered"
    ),
    assigned: dispatchOrders.filter(
      (o) =>
        (o.agentAssignmentStatus === "assigned" ||
         o.agentAssignmentStatus === "accepted" ||
         o.agentAssignmentStatus === "manually_assigned_by_admin") && // Include manual assignments
        o.orderStatus !== "completed" &&
        o.orderStatus !== "delivered"
    ),
    completed: dispatchOrders.filter(
      (o) => o.orderStatus === "completed" || o.orderStatus === "delivered"
    ),
  };
  const getTabCount = (tab) => groupedTasks[tab]?.length || 0;

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatAddress = (address) => {
    if (typeof address === "string") return address;
    if (address?.street) {
      return `${address.street.split(",")[0]}, ${address.city}`;
    }
    return "Address not available";
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "accepted_by_restaurant":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      case "ready_for_pickup":
        return "bg-purple-100 text-purple-800";
      case "out_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatOrderStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const TaskStatusBadge = ({ status }) => {
    const statusConfig = {
      unassigned: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        icon: <Clock className="h-3 w-3" />,
      },
      assigned: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <User className="h-3 w-3" />,
      },
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <Check className="h-3 w-3" />,
      },
    };

    return (
      <div
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}
      >
        {statusConfig[status].icon}
        <span className="ml-1 capitalize">{status}</span>
      </div>
    );
  };

  const TaskCard = ({ task, status ,onSelect, isSelected }) => {
    const [showDetails, setShowDetails] = useState(false);
const handleClick = () => {
    onSelect(task);
  };
    return (
      <div   className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${
        isSelected ? 'bg-blue-50' : ''
      }`}    onClick={handleClick} >
        <div className="flex items-start p-4">
          {/* Left Action Button */}
          <div className="flex flex-col items-center mr-3">
            <button
              onClick={() =>
                status === "unassigned" ? openAssignModal(task) : null
              }
              className={`flex items-center justify-center h-10 w-10 rounded-full ${
                status === "unassigned"
                  ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  : status === "assigned"
                  ? "bg-green-500 hover:bg-green-600 cursor-default"
                  : "bg-green-600 hover:bg-green-700 cursor-default"
              } text-white transition-colors duration-200`}
            >
              {status === "unassigned" ? (
                <Plus className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </button>
            <span className="text-xs text-gray-500 mt-1 text-center">
              {status === "unassigned"
                ? "Assign Agent"
                : status === "assigned"
                ? task.assignedAgent || "Assigned"
                : "Completed"}
            </span>
          </div>

          {/* Task Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium text-gray-900">
                Order #{task.orderId.slice(-6).toUpperCase()}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  {formatTime(task.orderTime)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TaskStatusBadge status={status} />
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="text-xs mb-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded ${getOrderStatusColor(
                  task.orderStatus
                )}`}
              >
                {formatOrderStatus(task.orderStatus)}
              </span>
              {status === "assigned" && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                  <span className="text-xs">
                    {console.log(task)}
                    Agent: {task.agentCurrentStatus}
                  </span>
                </span>
              )}
            </div>

            {/* Pickup Section */}
            <div className="flex items-start space-x-2 mb-2">
              <div className="h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                <MapPin className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {task.restaurantName || "Restaurant Name"}
                </div>
                <div className="text-xs text-gray-500">
                  {formatAddress(task.restaurantAddress)}
                </div>
              </div>
              <a
                href={`tel:${task.customerPhone}`}
                className="text-blue-500 hover:text-blue-700"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>

            {/* Divider */}
            <div className="border-l-2 border-gray-300 ml-3 h-4"></div>

            {/* Delivery Section */}
            <div className="flex items-start space-x-2 mt-2">
              <div className="h-6 w-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                <Package className="h-3 w-3" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {task.customerName || "Customer Name"}
                </div>
                <div className="text-xs text-gray-500">
                  {formatAddress(task.deliveryAddress)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(task.deliveryTime || task.orderTime)}
              </div>
            </div>

            {/* Additional Details */}
            {showDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="font-medium text-gray-700">Order ID:</div>
                    <div className="text-gray-500">{task.orderId}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">
                      Total Amount:
                    </div>
                    <div className="text-gray-500">₹{task.totalAmount}</div>
                  </div>
                  {status !== "unassigned" && (
                    <>
                      <div>
                        <div className="font-medium text-gray-700">Agent:</div>
                        <div className="text-gray-500">
                          {task.assignedAgent}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Agent Phone:
                        </div>
                        <a
                          href={`tel:${task.agentPhone}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {task.agentPhone}
                        </a>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Agent Status:
                        </div>
                        <div className="text-gray-500">
                          {task.agentCurrentStatus}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Availability:
                        </div>
                        <div className="text-gray-500">
                          {task.agentAvailability}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Dispatch Tasks
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchOrders}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
            <span className="text-xs text-gray-500 self-center">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Manage delivery agent assignments
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["unassigned", "assigned", "completed"].map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 text-sm font-medium relative ${
              activeTab === key
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center justify-center">
              <span className="capitalize">{key}</span>
              <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {getTabCount(key)}
              </span>
            </div>
            {activeTab === key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchOrders}
                className="mt-1 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Retry <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && groupedTasks[activeTab]?.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Truck className="h-10 w-10 text-gray-400 mb-3" />
          <h3 className="text-sm font-medium text-gray-900">
            No {activeTab} tasks
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "unassigned"
              ? "All orders have been assigned"
              : activeTab === "assigned"
              ? "No orders currently in progress"
              : "No completed orders yet"}
          </p>
          <button
            onClick={fetchOrders}
            className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Refresh list
          </button>
        </div>
      )}

      {/* Task List */}
      {!isLoading && groupedTasks[activeTab]?.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
            Showing {groupedTasks[activeTab].length} {activeTab} orders
          </div>
          <div className="divide-y divide-gray-200">
         {groupedTasks[activeTab].map((task) => (
  <TaskCard 
    key={task.orderId} 
    task={task} 
    status={activeTab}
    onSelect={onOrderSelect}
    isSelected={selectedOrder?.orderId === task.orderId}
  />
))}
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Assign Delivery Agent
                </h3>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignmentError(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">
                  Order:{" "}
                  <span className="font-medium">
                    #{selectedOrder?.orderId.slice(-6).toUpperCase()}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Restaurant:{" "}
                  <span className="font-medium">
                    {selectedOrder?.restaurantName}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="agent"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Agent
                </label>
                {isLoadingAgents ? (
                  <div className="py-2 text-center text-gray-500">
                    Loading available agents...
                  </div>
                ) : (
                  <select
                    id="agent"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Select an agent --</option>
                    {availableAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.phone})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {assignmentError && (
                <div className="mb-4 text-sm text-red-600">
                  {assignmentError}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignmentError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={assignAgent}
                  disabled={isAssigning}
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                    isAssigning
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isAssigning ? "Assigning..." : "Assign Agent"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DispatchSidebar;
