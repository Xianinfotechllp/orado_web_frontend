import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Users, Truck, Store, Bell,
  Image as ImageIcon, Link as LinkIcon,
  Calendar, Clock, Repeat,
  XCircle, CheckCircle, AlertTriangle, Info, Rocket, Trash2, Search,
  ChevronDown, ChevronUp, Check, X
} from "lucide-react";
import apiClient from "../../../../apis/apiClient/apiClient";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dummy sent/scheduled notifications
const SENT_HISTORY = [
  { id: 1, title: "50% Off Deal", type: "Offer", audience: "Customers", status: "sent", sentOn: "12:10 PM" },
  { id: 2, title: "Service Down", type: "Alert", audience: "Agents", status: "failed", sentOn: "09:30 AM" },
  { id: 3, title: "Daily Tip", type: "Info", audience: "Customers", status: "pending", sentOn: "Tomorrow" },
  { id: 4, title: "Big Wednesday", type: "Offer", audience: "Customers", status: "sent", sentOn: "09:01 AM" },
  { id: 5, title: "Free Delivery", type: "Offer", audience: "Agents", status: "sent", sentOn: "Yesterday" },
  { id: 6, title: "Insider Update", type: "Info", audience: "Restaurants", status: "sent", sentOn: "Today 8:38" },
  { id: 7, title: "KYC Alert", type: "Alert", audience: "Restaurants", status: "failed", sentOn: "Yesterday 22:00" },
  { id: 8, title: "Happy Lunch", type: "Offer", audience: "Customers", status: "pending", sentOn: "Tomorrow" },
  { id: 9, title: "Order Surge", type: "Info", audience: "Agents", status: "sent", sentOn: "Today 10:45" },
  { id: 10, title: "HOLIDAY CLOSURE", type: "Alert", audience: "Restaurants", status: "pending", sentOn: "Aug 12, 14:00" },
  { id: 11, title: "Refer & Earn", type: "Offer", audience: "Customers", status: "sent", sentOn: "Jul 24, 15:20" },
  { id: 12, title: "Onboarding Steps", type: "Info", audience: "Agents", status: "sent", sentOn: "Mon 17:30" },
  { id: 13, title: "Payment Issue", type: "Alert", audience: "Restaurants", status: "failed", sentOn: "Sun 18:44" },
  { id: 14, title: "Festival Bonus", type: "Offer", audience: "Customers", status: "sent", sentOn: "Aug 10, 11:59" },
  { id: 15, title: "Push Demo", type: "Info", audience: "Customers", status: "pending", sentOn: "Tonight" },
];

// Status badge component
const StatusBadge = ({ status }) => {
  const map = {
    sent: { label: "Sent", bg: "bg-emerald-100", fg: "text-emerald-800", icon: CheckCircle },
    failed: { label: "Failed", bg: "bg-rose-100", fg: "text-rose-800", icon: XCircle },
    pending: { label: "Pending", bg: "bg-amber-100", fg: "text-amber-800", icon: AlertTriangle }
  };
  const { label, bg, fg, icon: Icon } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${bg} ${fg}`}>
      <Icon size={12} className="mr-1" />{label}
    </span>
  );
};

// Type badge component
const TypeBadge = ({ type }) => {
  const map = {
    Offer: { icon: Bell, class: "text-orange-600" },
    Alert: { icon: AlertTriangle, class: "text-red-600" },
    Info: { icon: Info, class: "text-blue-600" }
  };
  const { icon: Icon, class: cls } = map[type] || { icon: Bell, class: "text-gray-600" };
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border bg-orange-50 ${cls}`}>
      <Icon size={12} className="mr-1" />{type}
    </span>
  );
};

// MultiSelectDropdown component with checkboxes
const MultiSelectDropdown = ({ 
  options, 
  selected, 
  setSelected, 
  placeholder, 
  loading,
  disabled
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleItem = (id) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selected.length === options.length) {
      setSelected([]);
    } else {
      setSelected(options.map(item => item._id || item.id || item.userId));
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading || disabled}
        className={`w-full px-4 py-2 text-left border rounded-lg flex items-center justify-between ${
          loading ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700"
        } ${isOpen ? "border-orange-500 ring-1 ring-orange-500" : "border-gray-300"}`}
      >
        <span className="truncate">
          {loading ? 'Loading...' : 
           selected.length === 0 ? placeholder :
           selected.length === options.length ? `All ${placeholder}` :
           `${selected.length} selected`}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && !loading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-200">
            <label className="flex items-center px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selected.length === options.length}
                onChange={selectAll}
                className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Select All</span>
            </label>
          </div>
          <div className="divide-y divide-gray-100">
            {options.map(item => (
              <label 
                key={item._id || item.id || item.userId} 
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item._id || item.id || item.userId)}
                  onChange={() => toggleItem(item._id || item.id || item.userId)}
                  className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 mr-3"
                />
                <span className="text-sm text-gray-700">
                  {item.name || item.email || item.phone}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PushNotificationPanel = () => {
  // Form state
  const [audience, setAudience] = useState("customer"); // Single audience selection
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [deepLink, setDeepLink] = useState("");
  const [scheduleType, setScheduleType] = useState("now");
  const [scheduledDate, setScheduledDate] = useState(null);
  const [recurrence, setRecurrence] = useState({ 
    frequency: "Daily", 
    time: "", 
    endsOn: null 
  });
  const [showPreview, setShowPreview] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [history, setHistory] = useState(SENT_HISTORY);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]); // Single array for selected IDs
  const [customersList, setCustomersList] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Audience options (removed "all" option)
  const audiences = [
    { key: "customer", icon: Users, label: "Customers" },
    { key: "agent", icon: Truck, label: "Agents" },
    { key: "restaurant", icon: Store, label: "Restaurants" }
  ];

  // Get current list based on selected audience
  const currentList = useMemo(() => {
    switch (audience) {
      case "customer": return customersList;
      case "agent": return agentsList;
      case "restaurant": return restaurantsList;
      default: return [];
    }
  }, [audience, customersList, agentsList, restaurantsList]);

  // Fetch lists when audience changes
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoadingLists(true);
        setSelectedIds([]); // Reset selected IDs when audience changes
        
        if (audience === "customer") {
          const res = await apiClient.get('/admin/customer-list');
          setCustomersList(res.data.data?.customers?.map(customer => ({
            _id: customer.userId,
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          })) || []);
        }
        
        if (audience === "agent") {
          const res = await apiClient.get('/admin/agent/list');
          setAgentsList(res.data.data?.map(agent => ({
            _id: agent.id,
            name: agent.name,
            phone: agent.phone
          })) || []);
        }
        
        if (audience === "restaurant") {
          const res = await apiClient.get('/admin/restaurants/dropdown-list');
          setRestaurantsList(res.data.data?.map(restaurant => ({
            _id: restaurant._id,
            name: restaurant.name
          })) || []);
        }
      } catch (err) {
        console.error('Error fetching lists:', err);
        toast.error('Failed to load recipient lists');
      } finally {
        setLoadingLists(false);
      }
    };
    
    fetchLists();
  }, [audience]);

  // Handle audience selection - now only allows one selection
  const handleAudience = (key) => {
    setAudience(key);
  };

  // Handle image upload
  const handleImage = (e) => setImage(e.target.files[0] || null);

  // Handle recurrence changes
  const handleRecurrenceChange = (field, val) => {
    setRecurrence((prev) => ({ ...prev, [field]: val }));
  };

  // Handle form submission - updated to send JSON in request body
  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Prepare the request payload
      const payload = {
        userType: audience,
        title,
        body: message,
        deepLinkUrl: deepLink,
        data: {
          click_action: "FLUTTER_NOTIFICATION_CLICK",
          ...(deepLink && { deepLinkUrl: deepLink }),
        },
        userIds: selectedIds
      };

      // Add scheduling information if needed
      if (scheduleType === "once" && scheduledDate) {
        payload.scheduledAt = scheduledDate.toISOString();
      } else if (scheduleType === "recurring") {
        payload.recurrence = {
          frequency: recurrence.frequency,
          time: recurrence.time,
          endsOn: recurrence.endsOn?.toISOString()
        };
      }

      // Make the API call with JSON payload
      const response = await apiClient.post('/admin/send-push-notification', payload);

      if (response.data.success) {
        toast.success(`Notification sent successfully! ${response.data.sentCount} delivered`);
        // Add to history
        setHistory(prev => [{
          id: Date.now(),
          title,
          type: "Info",
          audience: audience === 'customer' ? 'Customers' :
                  audience === 'agent' ? 'Agents' : 'Restaurants',
          status: "sent",
          sentOn: new Date().toLocaleTimeString()
        }, ...prev]);
        
        clearForm();
      } else {
        toast.error(response.data.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(
        error.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setIsSending(false);
      setShowPreview(false);
    }
  };

  // Clear form - updated to reset single audience state
  const clearForm = () => {
    setAudience("customer");
    setTitle("");
    setMessage("");
    setImage(null);
    setDeepLink("");
    setScheduleType("now");
    setScheduledDate(null);
    setRecurrence({ frequency: "Daily", time: "", endsOn: null });
    setSelectedIds([]);
    setShowPreview(false);
  };

  // Get preview image URL
  const previewImageURL =
    image && typeof image !== "string" ? URL.createObjectURL(image) : null;

  // Filter history based on status
  const filteredHistory = useMemo(() => {
    return statusFilter === "all"
      ? history
      : history.filter((item) => item.status === statusFilter);
  }, [statusFilter, history]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Push Notification Panel
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Create and manage push notifications for customers, agents & restaurants
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-orange-100">
          <form onSubmit={handleSend} className="p-6 space-y-6">
            {/* Audience Selection - Updated to single selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👥 Audience
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {audiences.map((aud) => (
                  <button
                    key={aud.key}
                    type="button"
                    onClick={() => handleAudience(aud.key)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      audience === aud.key
                        ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <aud.icon className="w-4 h-4 mr-2" />
                    {aud.label}
                  </button>
                ))}
              </div>

              {/* Specific Recipient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select {audience.charAt(0).toUpperCase() + audience.slice(1)}
                </label>
                <MultiSelectDropdown
                  options={currentList}
                  selected={selectedIds}
                  setSelected={setSelectedIds}
                  placeholder={`All ${audience}s`}
                  loading={loadingLists}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Title
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Notification Title Here"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Short heading (max 50 chars)
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📝 Message
              </label>
              <textarea
                rows={3}
                required
                maxLength={140}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Notification Message Body"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Body (max 140 chars)
              </p>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🖼 Image (optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImage}
                  />
                </label>
                {image && (
                  <>
                    <img
                      src={previewImageURL}
                      alt="Preview"
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Banner or product image for rich push platforms
              </p>
            </div>

            {/* Deep Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <LinkIcon className="w-4 h-4 inline mr-1" />
                Deep Link URL (optional)
              </label>
              <input
                type="url"
                value={deepLink}
                onChange={(e) => setDeepLink(e.target.value)}
                placeholder="https://yourapp.com/specialoffer"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Where the user is redirected upon tapping
              </p>
            </div>

            {/* Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏰ Schedule
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {["now", "once", "recurring"].map((type) => {
                  const labels = {
                    now: "Send Now",
                    once: "Schedule Once",
                    recurring: "Recurring",
                  };
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setScheduleType(type)}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        scheduleType === type
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {labels[type]}
                    </button>
                  );
                })}
              </div>

              {/* Schedule Options */}
              {scheduleType === "once" && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <DatePicker
                    selected={scheduledDate}
                    onChange={(date) => setScheduledDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Select date and time"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                </div>
              )}

              {scheduleType === "recurring" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Repeat className="w-5 h-5 text-orange-500" />
                    <select
                      value={recurrence.frequency}
                      onChange={(e) =>
                        handleRecurrenceChange("frequency", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <input
                      type="time"
                      value={recurrence.time}
                      onChange={(e) =>
                        handleRecurrenceChange("time", e.target.value)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <DatePicker
                      selected={recurrence.endsOn}
                      onChange={(date) =>
                        handleRecurrenceChange("endsOn", date)
                      }
                      placeholderText="Select end date"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex flex-wrap justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!title || !message}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="w-4 h-4 mr-2" />
                Preview
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </button>

              <button
                type="submit"
                disabled={!title || !message || isSending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Notification History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
          <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Notification History
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
              >
                <option value="all">All</option>
                <option value="sent">Sent</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sent On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No notifications found
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {notification.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <TypeBadge type={notification.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.audience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={notification.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {notification.sentOn}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-4 py-3 bg-orange-500 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Notification Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-orange-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-orange-500" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">{title || "Notification Title"}</h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {message || "Notification message content will appear here."}
                </p>
                {previewImageURL && (
                  <img
                    src={previewImageURL}
                    alt="Notification preview"
                    className="w-full rounded-lg object-cover max-h-48"
                  />
                )}
                {deepLink && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    <LinkIcon className="w-3 h-3 mr-1" />
                    {deepLink}
                  </div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                {scheduleType === "now" && (
                  <p>This notification will be sent immediately.</p>
                )}
                {scheduleType === "once" && (
                  <p>
                    Scheduled for:{" "}
                    <span className="font-medium">
                      {scheduledDate
                        ? scheduledDate.toLocaleString()
                        : "No date selected"}
                    </span>
                  </p>
                )}
                {scheduleType === "recurring" && (
                  <p>
                    Recurring:{" "}
                    <span className="font-medium">
                      {recurrence.frequency} at {recurrence.time || "no time set"}{" "}
                      {recurrence.endsOn
                        ? `until ${recurrence.endsOn.toLocaleDateString()}`
                        : "with no end date"}
                    </span>
                  </p>
                )}
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Close
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PushNotificationPanel;