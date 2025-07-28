import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Search,
  Filter,
  Calendar,
  User,
  ChevronRight,
  X,
  Check,
  ChevronLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import apiClient from "../../apis/apiClient/apiClient";
import { toast } from "react-toastify";

const AgentLeave = () => {
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recordsPerPage = 10;

  // State for leave requests
  const [allLeaves, setAllLeaves] = useState([]);

  // Fetch leave requests from API
  useEffect(() => {
    const fetchLeaveRequests = async () => {
  try {
    setLoading(true);
    const response = await apiClient.get('/admin/agent/leaves', {
      params: {
        status: selectedStatus === 'all' ? 'all' : selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)
      }
    });
    
    const transformedLeaves = response.data.map(item => ({
      id: item.leaves._id,
      agentId: item._id,
      agentName: item.fullName,
      leaveDates: `${new Date(item.leaves.leaveStartDate).toLocaleDateString()} – ${new Date(item.leaves.leaveEndDate).toLocaleDateString()}`,
      startDate: item.leaves.leaveStartDate,
      endDate: item.leaves.leaveEndDate,
      type: item.leaves.leaveType,
      reason: item.leaves.reason,
      status: item.leaves.status.toLowerCase(),
      rejectionReason: item.leaves.rejectionReason || null,
      reviewedBy: item.leaves.reviewedBy || null,
      reviewedAt: item.leaves.reviewedAt || null,
      appliedAt: item.leaves.appliedAt
    }));
    
    setAllLeaves(transformedLeaves);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    fetchLeaveRequests();
  }, []);

  // Update status helper
  // Update the updateStatus function to use your new API endpoint
const updateStatus = async (leaveId, newStatus, reason = null, agentId) => {
    try {
      // Show loading toast
      const toastId = toast.loading(`Updating leave to ${newStatus}...`);
      
      const response = await apiClient.post(
        `/admin/agent/${agentId}/leaves/${leaveId}/decision`,
        {
          decision: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          ...(newStatus.toLowerCase() === "rejected" && {
            rejectionReason: reason,
          }),
        }
      );

      // Update local state
      setAllLeaves((prev) =>
        prev.map((leave) =>
          leave.id === leaveId
            ? {
                ...leave,
                status: newStatus.toLowerCase(),
                rejectionReason: reason,
                reviewedAt: new Date().toISOString(),
              }
            : leave
        )
      );

      // Update toast to success
      toast.success(`Leave ${newStatus} successfully`, {
        id: toastId,
        duration: 4000,
      });

    } catch (err) {
      console.error("Failed to update leave status:", err);
      
      // Show error toast
      toast.error(
        `Failed to ${newStatus} leave: ${err.response?.data?.message || err.message}`,
        {
          duration: 5000,
        }
      );
    }
};
  const handleApprove = (leaveId, agentId) =>
    updateStatus(leaveId, "approved", null, agentId);
  const handleRevoke = (id) => updateStatus(id, "pending");
  const handleFilterChange = () => setCurrentPage(1);

  // Filtering
  const filtered = allLeaves.filter((l) => {
    const matchName =
      searchText === "" ||
      l.agentName.toLowerCase().includes(searchText.toLowerCase());
    const matchStatus = selectedStatus === "all" || l.status === selectedStatus;
    let matchDate = true;
    if (fromDate && toDate) {
      const s = new Date(l.startDate);
      matchDate = s >= fromDate && s <= toDate;
    }
    return matchName && matchStatus && matchDate;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const current = filtered.slice(start, start + recordsPerPage);

  useEffect(handleFilterChange, [searchText, selectedStatus, fromDate, toDate]);

  // Badges
  const statusBadge = (status) => {
    const cfg = {
      pending: {
        icon: Clock,
        bg: "bg-amber-100",
        fg: "text-amber-800",
        label: "Pending",
      },
      approved: {
        icon: CheckCircle,
        bg: "bg-emerald-100",
        fg: "text-emerald-800",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        bg: "bg-rose-100",
        fg: "text-rose-800",
        label: "Rejected",
      },
    }[status];
    const Icon = cfg.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.fg}`}
      >
        <Icon size={12} className="mr-1" />
        {cfg.label}
      </span>
    );
  };

  const leaveTypeBadge = (type) => {
    const cfg = {
      "Sick Leave": { bg: "bg-red-100", fg: "text-red-700", emoji: "🤒" },
      Personal: { bg: "bg-blue-100", fg: "text-blue-700", emoji: "👤" },
      Emergency: { bg: "bg-orange-100", fg: "text-orange-700", emoji: "🚨" },
      Vacation: { bg: "bg-green-100", fg: "text-green-700", emoji: "🏖️" },
    }[type] || { bg: "bg-gray-100", fg: "text-gray-700", emoji: "📅" };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cfg.bg} ${cfg.fg}`}
      >
        <span className="mr-1">{cfg.emoji}</span>
        {type}
      </span>
    );
  };

  // Reject modal with proper scrolling
  const RejectModal = ({ leave, onClose }) => {
    const [reason, setReason] = useState("");
    return (
      <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] border border-orange-100 flex flex-col">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-bold flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              Reject Leave
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-red-600 rounded">
              <X size={18} />
            </button>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="mb-4">
              <div className="mb-2">
                <strong>Agent:</strong> {leave.agentName}
              </div>
              <div className="mb-2">
                <strong>Dates:</strong> {leave.leaveDates}
              </div>
              <div className="mb-2">
                <strong>Type:</strong> {leaveTypeBadge(leave.type)}
              </div>
              <div className="mb-2">
                <strong>Reason:</strong>
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-words">
                {leave.reason}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                🔽 Rejection Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 text-sm resize-none"
                rows="4"
                placeholder="Enter rejection reason..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              disabled={!reason.trim()}
              onClick={() => {
                updateStatus(
                  leave.id,
                  "rejected",
                  reason.trim(),
                  leave.agentId
                );
                onClose();
              }}
              className={`px-4 py-2 rounded-lg text-white font-semibold ${
                reason.trim()
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Reject Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading leave requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* CSS styles remain the same */}
      <style>
        {`
          /* Professional mobile calendar sizing */
          @media (max-width: 640px) {
            .react-datepicker {
              font-size: 0.875rem !important;
              transform: scale(0.9) !important;
              transform-origin: top center !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            .react-datepicker__header {
              padding: 8px !important;
              background: #f97316 !important;
              color: white !important;
            }
            
            .react-datepicker__day {
              width: 2rem !important;
              height: 2rem !important;
              line-height: 2rem !important;
              margin: 0.166rem !important;
              font-size: 0.875rem !important;
            }
            
            .react-datepicker__month-container {
              width: auto !important;
            }
            
            .react-datepicker__current-month {
              font-size: 1rem !important;
              font-weight: 600 !important;
            }
            
            .react-datepicker__day-name {
              width: 2rem !important;
              font-size: 0.75rem !important;
              font-weight: 600 !important;
              color: white !important;
            }
            
            .react-datepicker__navigation {
              top: 12px !important;
            }
          }
          
          /* Simplified calendar positioning - CENTERED */
          .react-datepicker-popper {
            z-index: 1000 !important;
          }
          
          .react-datepicker-popper[data-placement^="bottom"] {
            margin-top: 10px !important;
          }
          
          /* For smaller mobile screens */
          @media (max-width: 480px) {
            .react-datepicker {
              transform: scale(0.85) !important;
              transform-origin: top center !important;
            }
            
            .react-datepicker__day {
              width: 1.8rem !important;
              height: 1.8rem !important;
              line-height: 1.8rem !important;
            }
            
            .react-datepicker__day-name {
              width: 1.8rem !important;
            }
          }
          
          /* For very small screens */
          @media (max-width: 375px) {
            .react-datepicker {
              transform: scale(0.8) !important;
              transform-origin: top center !important;
            }
          }
          
          /* Enhanced orange theme */
          .react-datepicker__day--selected {
            background-color: #f97316 !important;
            color: white !important;
            font-weight: 600 !important;
          }
          
          .react-datepicker__day--keyboard-selected {
            background-color: #fb923c !important;
            color: white !important;
          }
          
          .react-datepicker__day:hover {
            background-color: #fed7aa !important;
            color: #9a3412 !important;
          }
          
          .react-datepicker__day--today {
            background-color: #ffedd5 !important;
            color: #ea580c !important;
            font-weight: 600 !important;
          }
          
          /* Better touch targets */
          @media (max-width: 640px) {
            .react-datepicker__day {
              border-radius: 6px !important;
              cursor: pointer !important;
            }
            
            .react-datepicker__navigation {
              width: 44px !important;
              height: 44px !important;
              border-radius: 8px !important;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Leave Management
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">
                  Manage and toggle leave requests
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-orange-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search - Full width on mobile */}
              <div className="sm:col-span-1">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search agent..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* From Date - Half width on mobile - SIMPLIFIED POSITIONING */}
              <div className="w-1/2 sm:w-auto">
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                  />
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    placeholderText="From Date"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    popperPlacement="bottom"
                  />
                </div>
              </div>

              {/* To Date - Half width on mobile - SIMPLIFIED POSITIONING */}
              <div className="w-1/2 sm:w-auto">
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                  />
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    placeholderText="To Date"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                    popperPlacement="bottom"
                  />
                </div>
              </div>

              {/* Status - Half width on mobile */}
              <div className="w-1/2 sm:w-auto">
                <div className="relative">
                  <Filter
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base bg-white appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-xs sm:text-sm text-gray-600 font-medium">
              Found{" "}
              <span className="text-orange-600 font-bold">
                {filtered.length}
              </span>{" "}
              leave requests
              {searchText && <span> matching "{searchText}"</span>}
              {selectedStatus !== "all" && (
                <span> with {selectedStatus} status</span>
              )}
              {(fromDate || toDate) && <span> in selected date range</span>}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-orange-50">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Agent Name
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Leave Dates
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Rejection Reason
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {current.length ? (
                    current.map((leave) => (
                      <tr
                        key={leave.id}
                        className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 last:border-b-0"
                      >
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          <div className="flex items-start">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                              <User size={14} className="text-white" />
                            </div>
                            <div className="ml-2 sm:ml-3 min-w-0">
                              <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                                {leave.agentName}
                              </div>
                              <div className="text-xs text-gray-600">
                                Delivery Partner
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          <div className="text-xs sm:text-sm font-medium text-gray-800">
                            {leave.leaveDates}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          {leaveTypeBadge(leave.type)}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          <div className="text-xs sm:text-sm text-gray-600 break-words max-w-xs leading-relaxed">
                            {leave.reason}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          {statusBadge(leave.status)}
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          <div className="text-xs sm:text-sm text-gray-600 break-words max-w-xs leading-relaxed">
                            {leave.rejectionReason || "-"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 md:px-6 py-3 align-top">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <button
                              onClick={() =>
                                handleApprove(leave.id, leave.agentId)
                              }
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center shadow-sm"
                            >
                              <Check size={12} className="mr-1" />
                              <span className="hidden sm:inline">Approve</span>
                              <span className="sm:hidden">✓</span>
                            </button>
                            <button
                              onClick={() => setShowRejectModal(leave)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center shadow-sm"
                            >
                              <X size={12} className="mr-1" />
                              <span className="hidden sm:inline">Reject</span>
                              <span className="sm:hidden">✗</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center">
                          <Calendar size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg font-medium">
                            No leave requests found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-4 sm:px-6 py-4 border-t border-orange-100">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                  <div className="text-gray-800 font-medium text-xs sm:text-sm">
                    Showing{" "}
                    <span className="text-orange-600 font-bold">
                      {start + 1}
                    </span>{" "}
                    to{" "}
                    <span className="text-orange-600 font-bold">
                      {Math.min(start + recordsPerPage, filtered.length)}
                    </span>{" "}
                    of{" "}
                    <span className="text-orange-600 font-bold">
                      {filtered.length}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 1}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center transition-all duration-200 ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <ChevronLeft size={14} className="mr-0.5 sm:mr-1" />
                      Prev
                    </button>

                    <div className="hidden sm:flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                            currentPage === index + 1
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 border border-gray-200"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <div className="sm:hidden text-xs font-semibold text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center transition-all duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      Next
                      <ChevronRight size={14} className="ml-0.5 sm:ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <RejectModal
            leave={showRejectModal}
            onClose={() => setShowRejectModal(null)}
          />
        )}
      </div>
    </>
  );
};

export default AgentLeave;
