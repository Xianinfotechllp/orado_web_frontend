import React, { useState, useEffect } from "react";
import {
  FiDownload,
  FiSettings,
  FiCheck,
  FiX,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { ChevronDown, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import apiClient from "../../apis/apiClient/apiClient";

const AgentSelfieLogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [mandatorySelfie, setMandatorySelfie] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch selfie logs from API
  useEffect(() => {
    const fetchSelfieLogs = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/admin/agent/selfies", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
            search: searchTerm || undefined,
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString(),
          },
        });

        setLogs(
          response.data.selfies.map((selfie) => ({
            id: selfie._id,
            agentId: selfie.agentId._id,
            agentName: selfie.agentId.fullName || "Unknown Agent",
            phone: selfie.agentId.phoneNumber || "N/A",
            date: new Date(selfie.takenAt).toLocaleDateString(),
            status: selfie.status || "Pending",
            selfieUrl: selfie.imageUrl,
            zone: selfie.agentId.zone || "N/A",
          }))
        );
      } catch (err) {
        console.error("Error fetching selfie logs:", err);
        setError(err.response?.data?.message || "Failed to fetch selfie logs");
        toast.error("Failed to load selfie logs");
      } finally {
        setLoading(false);
      }
    };

    fetchSelfieLogs();
  }, [currentPage, statusFilter, searchTerm, dateRange]);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const DatePicker = ({ type }) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];

    const generateCalendar = (month, year) => {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay();
      const days = [];

      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      return days;
    };

    const days = generateCalendar(currentMonth, currentYear);

    const handleDateClick = (day) => {
      if (day) {
        const selectedDate = new Date(currentYear, currentMonth, day);
        setDateRange((prev) => ({
          ...prev,
          [type]: selectedDate,
        }));
        setShowDatePicker(null);
      }
    };

    const changeMonth = (increment) => {
      let newMonth = currentMonth + increment;
      let newYear = currentYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      } else if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    };

    const isSelected = (day) => {
      if (!day) return false;
      const date = new Date(currentYear, currentMonth, day);
      return date.getTime() === dateRange[type].getTime();
    };

    const isToday = (day) => {
      if (!day) return false;
      const today = new Date();
      return (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      );
    };

    return (
      <div className="absolute z-50 top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 p-3 w-full max-w-[280px]">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-3 h-3 rotate-90" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`text-center text-sm p-2 cursor-pointer rounded transition-colors ${
                isSelected(day)
                  ? "bg-orange-600 text-white font-medium"
                  : isToday(day)
                  ? "bg-orange-100 text-orange-600 font-medium"
                  : day
                  ? "hover:bg-gray-100 text-gray-700"
                  : "text-gray-300"
              }`}
            >
              {day || ""}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <button
            onClick={() => {
              const today = new Date();
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
              setDateRange((prev) => ({
                ...prev,
                [type]: today,
              }));
            }}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Today
          </button>
          <button
            onClick={() => setShowDatePicker(null)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  // Filter logs based on search and status
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  // Update selfie status
  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiClient.patch(`/agent/selfies/${id}/status`, {
        status: newStatus,
      });

      setLogs(
        logs.map((log) => (log.id === id ? { ...log, status: newStatus } : log))
      );

      toast.success(`Selfie ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  // Bulk approve selected selfies
  const bulkApprove = async () => {
    try {
      await axios.post("/agent/selfies/bulk-approve", { ids: selectedLogs });

      setLogs(
        logs.map((log) =>
          selectedLogs.includes(log.id) ? { ...log, status: "Approved" } : log
        )
      );

      setSelectedLogs([]);
      toast.success(`${selectedLogs.length} selfies approved`);
    } catch (err) {
      console.error("Error bulk approving:", err);
      toast.error(err.response?.data?.message || "Failed to bulk approve");
    }
  };

  // Export to CSV
  const exportToCSV = async () => {
    try {
      const response = await axios.get("/agent/selfies/export", {
        params: {
          status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
          search: searchTerm || undefined,
          startDate: dateRange.from.toISOString(),
          endDate: dateRange.to.toISOString(),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `selfie-logs-${new Date().toISOString()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("CSV exported successfully");
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error(err.response?.data?.message || "Failed to export CSV");
    }
  };

  // Pagination controls
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading selfie logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md border border-gray-200">
          <FiX className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiEye size={26} className="text-orange-600" />
            Agent Selfie Logs
          </h1>
          <p className="text-gray-600 text-sm mt-1">Monitor and verify agent identity submissions</p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Agent
              </label>
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-600"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-600 bg-white"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* From Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-orange-600 focus:outline-none cursor-pointer"
                  value={formatDate(dateRange.from)}
                  onClick={() => setShowDatePicker(showDatePicker === "from" ? null : "from")}
                  readOnly
                />
              </div>
              {showDatePicker === "from" && <DatePicker type="from" />}
            </div>

            {/* To Date */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-orange-600 focus:outline-none cursor-pointer"
                  value={formatDate(dateRange.to)}
                  onClick={() => setShowDatePicker(showDatePicker === "to" ? null : "to")}
                  readOnly
                />
              </div>
              {showDatePicker === "to" && <DatePicker type="to" />}
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2">
              <button
                onClick={exportToCSV}
                className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 flex items-center gap-1"
              >
                <FiDownload size={14} />
                Export
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 flex items-center gap-1"
              >
                <FiSettings size={14} />
                Settings
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Found <span className="font-medium text-orange-600">{filteredLogs.length}</span> selfie logs
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLogs.length > 0 && (
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedLogs.length} items selected
              </span>
              <button
                onClick={bulkApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center gap-2"
              >
                <FiCheck size={14} />
                Approve Selected
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-gray-600">
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 rounded focus:ring-orange-600"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLogs(currentItems.map((log) => log.id));
                        } else {
                          setSelectedLogs([]);
                        }
                      }}
                      checked={
                        selectedLogs.length > 0 &&
                        currentItems.every((item) => selectedLogs.includes(item.id))
                      }
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-medium">Agent Name</th>
                  <th className="px-6 py-3 text-left font-medium">Phone</th>
                  <th className="px-6 py-3 text-left font-medium">Date</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                  <th className="px-6 py-3 text-left font-medium">Selfie</th>
                  {/* <th className="px-6 py-3 text-left font-medium">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.length > 0 ? (
                  currentItems.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLogs.includes(log.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLogs([...selectedLogs, log.id]);
                            } else {
                              setSelectedLogs(selectedLogs.filter((id) => id !== log.id));
                            }
                          }}
                          className="h-4 w-4 text-orange-600 rounded focus:ring-orange-600"
                        />
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-800">{log.agentName}</td>
                      <td className="px-6 py-3 text-gray-600">{log.phone}</td>
                      <td className="px-6 py-3 text-gray-600">{log.date}</td>
                      <td className="px-6 py-3">
                        <select
                          value={log.status}
                          onChange={(e) => handleStatusChange(log.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-orange-600 ${
                            log.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : log.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => setViewingImage(log.selfieUrl)}
                          className="text-orange-600 hover:text-orange-800 flex items-center gap-1 transition-colors"
                        >
                          <FiEye size={14} />
                          View
                        </button>
                      </td>
                      {/* <td className="px-6 py-3">
                        {log.status === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(log.id, "Approved")}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(log.id, "Rejected")}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <FiEye size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="font-medium">No selfie logs found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredLogs.length)}</span> of{" "}
                  <span className="font-medium">{filteredLogs.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`}
                  >
                    <FiChevronLeft size={14} />
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-8 h-8 rounded text-sm font-medium ${
                          currentPage === page
                            ? "bg-orange-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-orange-600 text-white hover:bg-orange-700"
                    }`}
                  >
                    Next
                    <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-6 bg-white shadow-sm border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selfie Submission Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mandatorySelfie"
                  checked={mandatorySelfie}
                  onChange={() => setMandatorySelfie(!mandatorySelfie)}
                  className="h-4 w-4 text-orange-600 rounded focus:ring-orange-600"
                />
                <label htmlFor="mandatorySelfie" className="ml-2 text-sm text-gray-700">
                  Require daily selfie submission from delivery agents
                </label>
              </div>
              {mandatorySelfie && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apply to zones (leave blank for all zones)
                  </label>
                  <input
                    type="text"
                    placeholder="Comma-separated zone names"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-600"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Image Viewing Modal */}
        {viewingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setViewingImage(null)}
            />
            <div className="relative z-10 max-w-2xl w-full">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Agent Verification Photo
                  </h3>
                  <button
                    onClick={() => setViewingImage(null)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <FiX size={18} className="text-gray-400" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <img
                      src={viewingImage}
                      alt="Agent verification photo"
                      className="max-w-full max-h-96 rounded-lg shadow-sm object-cover"
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(false)}
                    />
                  </div>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        const logId = logs.find((log) => log.selfieUrl === viewingImage)?.id;
                        if (logId) handleStatusChange(logId, "Rejected");
                        setViewingImage(null);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 flex items-center gap-2"
                    >
                      <FiX size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        const logId = logs.find((log) => log.selfieUrl === viewingImage)?.id;
                        if (logId) handleStatusChange(logId, "Approved");
                        setViewingImage(null);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center gap-2"
                    >
                      <FiCheck size={16} />
                      Approve
                    </button>
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

export default AgentSelfieLogs;
