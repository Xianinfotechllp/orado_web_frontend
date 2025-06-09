import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Mail,
  MessageSquare,
  MoreVertical,
  User,
  Calendar,
  Eye,
  Edit3,
  RefreshCw,
  Download,
  PhoneCallIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import LoadingForAdmins from "../AdminUtils/LoadingForAdmins";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    sort: "newest",
    search: "",
    assignedTo: "all",
  });

  // Simulate API loading
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("adminToken");

      const response = await axios.get(
        "http://localhost:5000/tickets/admin/getall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(response.data.tickets);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load tickets. Please try again later."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update ticket status

const handleStatusUpdate = async (ticketId, newStatus) => {
  try {
    const token = sessionStorage.getItem('adminToken'); // Or however you store your token

    const response = await axios.patch(
      `http://localhost:5000/tickets/admin/ticket/${ticketId}/status`,
      { status: newStatus },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedStatus = response.data.status;

    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === ticketId ? { ...ticket, status: updatedStatus } : ticket
      )
    );
    fetchTickets()
  } catch (err) {
    console.error('Error updating ticket status:', err);
  }
};



  // Bulk actions
  const handleBulkStatusUpdate = (newStatus) => {
    setTickets(
      tickets.map((ticket) =>
        selectedTickets.includes(ticket._id)
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );
    setSelectedTickets([]);
  };

  // Filter and sort tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filters.status === "all" || ticket.status === filters.status;
    const matchesPriority =
      filters.priority === "all" || ticket.priority === filters.priority;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.user?.name.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    return filters.sort === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Status configuration with Swiggy colors
  const statusConfig = {
    open: {
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      label: "Open",
    },
    in_progress: {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "In Progress",
    },
    resolved: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Resolved",
    },
    closed: {
      icon: X,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      label: "Closed",
    },
  };

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-800", label: "High Priority" },
    medium: {
      color: "bg-orange-100 text-orange-800",
      label: "Medium Priority",
    },
    low: { color: "bg-green-100 text-green-800", label: "Low Priority" },
  };

  // Components
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config?.icon || Mail;
    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg} ${config?.border} border`}
      >
        <Icon size={12} className="mr-1.5" />
        {config?.label || status}
      </div>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const config = priorityConfig[priority];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color}`}
      >
        {config?.label || priority}
      </span>
    );
  };

  if (loading) {
    return (
      <LoadingForAdmins/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-red-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center py-4 sm:py-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Support Tickets
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage and track customer support requests
          </p>
        </div>
      </div>
    </div>
  </div>

  <div className="px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
    {/* Stats Cards - Stack on mobile, grid on larger screens */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
      {[
        {
          label: "Total",
          value: tickets.length,
          color: "bg-blue-500",
          icon: MessageSquare,
        },
        {
          label: "Open",
          value: tickets.filter((t) => t.status === "open").length,
          color: "bg-orange-500",
          icon: AlertCircle,
        },
        {
          label: "In Progress",
          value: tickets.filter((t) => t.status === "in_progress").length,
          color: "bg-blue-500",
          icon: Clock,
        },
        {
          label: "Resolved",
          value: tickets.filter((t) => t.status === "resolved").length,
          color: "bg-green-500",
          icon: CheckCircle2,
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-xs sm:shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">
                {stat.value}
              </p>
            </div>
            <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Filters and Search - Stacked on mobile */}
    <div className="bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm border border-gray-100 mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex flex-col gap-2 sm:gap-4">
          {/* Search - Full width on mobile */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-9 pr-3 py-2 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Filter Toggle - Full width on mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Filters
            <ChevronDown
              className={`h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters - Stacked on mobile */}
        {showFilters && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <select
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button
                onClick={() =>
                  setFilters({
                    status: "all",
                    priority: "all",
                    sort: "newest",
                    search: "",
                    assignedTo: "all",
                  })
                }
                className="px-2 py-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions - Simplified on mobile */}
      {selectedTickets.length > 0 && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-orange-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-orange-800 font-medium">
              {selectedTickets.length} selected
            </span>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => handleBulkStatusUpdate("resolved")}
                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200"
              >
                Resolve
              </button>
              <button
                onClick={() => handleBulkStatusUpdate("closed")}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Tickets Table - Horizontal scroll on mobile */}
    <div className="bg-white rounded-lg sm:rounded-xl shadow-xs sm:shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTickets(sortedTickets.map((t) => t._id));
                    } else {
                      setSelectedTickets([]);
                    }
                  }}
                />
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Details
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Priority
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Assigned
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Date
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {sortedTickets.length > 0 ? (
              sortedTickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 h-4 w-4"
                      checked={selectedTickets.includes(ticket._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTickets([...selectedTickets, ticket._id]);
                        } else {
                          setSelectedTickets(
                            selectedTickets.filter((id) => id !== ticket._id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">
                          {ticket.subject}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[100px] sm:max-w-none">
                          {ticket.message}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">
                          {ticket.user?.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none">
                          {ticket.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[60px] sm:max-w-none">
                      {ticket.assignedTo}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                    <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                      <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <select
                        className="text-xs border border-gray-200 rounded-md px-1 py-0.5 sm:px-2 sm:py-1 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                        value={ticket.status}
                        onChange={(e) =>
                          handleStatusUpdate(ticket._id, e.target.value)
                        }
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <MessageSquare className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300" />
                    <div className="text-xs sm:text-sm text-gray-500">
                      No tickets found
                    </div>
                    <button className="text-xs sm:text-sm text-orange-600 hover:text-orange-700">
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Pagination - Centered on mobile */}
    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
      <div className="text-xs sm:text-sm text-gray-500">
        Showing <span className="font-medium">{sortedTickets.length}</span> of{" "}
        <span className="font-medium">{tickets.length}</span> tickets
      </div>
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
        <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          1
        </button>
        <button className="px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default Ticket;
