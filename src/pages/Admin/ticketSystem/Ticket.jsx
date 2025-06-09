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
} from "lucide-react";
import axios from "axios";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading tickets...</p>
        </div>
      </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Support Tickets
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track customer support requests
              </p>
            </div>
          
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Tickets",
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
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tickets, users, or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown
                  className={`h-4 w-4 ml-2 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={filters.priority}
                    onChange={(e) =>
                      setFilters({ ...filters, priority: e.target.value })
                    }
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  <select
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedTickets.length > 0 && (
            <div className="px-6 py-3 bg-orange-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-orange-800 font-medium">
                  {selectedTickets.length} ticket
                  {selectedTickets.length > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkStatusUpdate("resolved")}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate("closed")}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTickets(sortedTickets.map((t) => t._id));
                        } else {
                          setSelectedTickets([]);
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {sortedTickets.length > 0 ? (
                  sortedTickets.map((ticket, index) => (
                    <tr
                      key={ticket._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          checked={selectedTickets.includes(ticket._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTickets([
                                ...selectedTickets,
                                ticket._id,
                              ]);
                            } else {
                              setSelectedTickets(
                                selectedTickets.filter(
                                  (id) => id !== ticket._id
                                )
                              );
                            }
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              {ticket.subject}
                            </div>
                            <div className="text-sm text-gray-500 ">
                              {ticket.message}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.user?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ticket.user?.email}
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center  gap-2 items-center ">
                            <PhoneCallIcon size={14}/>  {ticket.user?.phone}{" "}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {ticket.assignedTo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <select
                            className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
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
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <MessageSquare className="h-12 w-12 text-gray-300" />
                        <div className="text-sm text-gray-500">
                          No tickets found matching your criteria
                        </div>
                        <button className="text-sm text-orange-600 hover:text-orange-700">
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{sortedTickets.length}</span>{" "}
            of <span className="font-medium">{tickets.length}</span> tickets
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              1
            </button>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
