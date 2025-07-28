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
import { ChevronDown } from "lucide-react";
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
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Default: last 7 days
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
            status:
              statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
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
      <div className="absolute z-50 top-full left-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-200 p-2 w-full max-w-[280px]">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-3 h-3 rotate-90" />
          </button>
          <span className="text-xs font-semibold text-gray-700">
            {months[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-medium text-gray-500 p-1"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`text-center text-xs p-1 cursor-pointer rounded transition-all duration-200 ${
                isSelected(day)
                  ? "bg-orange-500 text-white font-semibold"
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
        <div className="flex justify-between mt-2">
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
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            Today
          </button>
          <button
            onClick={() => setShowDatePicker(null)}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
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
          status:
            statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
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
      <div className="min-h-screen bg-orange-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FiX className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <FiX className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 transition-all duration-300">
        <h1 className="text-2xl md:text-4xl font-extrabold text-orange-500 mb-4 md:mb-10 tracking-wide flex items-center">
          <svg
            className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Agent Selfie Logs
        </h1>

        {/* Filters */}
        <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm pr-8"
                value={formatDate(dateRange.from)}
                onClick={() =>
                  setShowDatePicker(showDatePicker === "from" ? null : "from")
                }
                readOnly
              />
              <button
                onClick={() => {
                  const today = new Date();
                  setDateRange((prev) => ({ ...prev, from: today }));
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-orange-600 hover:text-orange-800"
              >
                Today
              </button>
            </div>
            {showDatePicker === "from" && <DatePicker type="from" />}
          </div>
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm pr-8"
                value={formatDate(dateRange.to)}
                onClick={() =>
                  setShowDatePicker(showDatePicker === "to" ? null : "to")
                }
                readOnly
              />
              <button
                onClick={() => {
                  const today = new Date();
                  setDateRange((prev) => ({ ...prev, to: today }));
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-orange-600 hover:text-orange-800"
              >
                Today
              </button>
            </div>
            {showDatePicker === "to" && <DatePicker type="to" />}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-left text-sm">
            <thead className="bg-orange-500 text-white uppercase">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLogs(currentItems.map((log) => log.id));
                      } else {
                        setSelectedLogs([]);
                      }
                    }}
                    checked={
                      selectedLogs.length > 0 &&
                      currentItems.every((item) =>
                        selectedLogs.includes(item.id)
                      )
                    }
                  />
                </th>
                <th className="px-4 py-3">Agent Name</th>
                <th className="px-4 py-3">Phone Number</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Selfie</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLogs.includes(log.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLogs([...selectedLogs, log.id]);
                          } else {
                            setSelectedLogs(
                              selectedLogs.filter((id) => id !== log.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{log.agentName}</td>
                    <td className="px-4 py-3">{log.phone}</td>
                    <td className="px-4 py-3">{log.date}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={log.status}
                          onChange={(e) =>
                            handleStatusChange(log.id, e.target.value)
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded-full focus:outline-none focus:ring-1 ${
                            log.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : log.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                          style={{
                            maxWidth: "120px",
                            width: "auto",
                            appearance: "none",
                            paddingRight: "1.75rem",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown className="w-3 h-3 text-gray-700" />
                        </div> */}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewingImage(log.selfieUrl)}
                        className="text-orange-600 hover:text-orange-800 flex items-center transition-colors duration-200"
                      >
                        <FiEye className="mr-1" /> View
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {log.status === "Approved" ? (
                        <FiCheck className="text-green-600" />
                      ) : log.status === "Rejected" ? (
                        <FiX className="text-red-600" />
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleStatusChange(log.id, "Approved")
                            }
                            className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(log.id, "Rejected")
                            }
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <FiX />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No logs found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, filteredLogs.length)} of{" "}
              {filteredLogs.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                      currentPage === page
                        ? "bg-orange-600 text-white shadow-md"
                        : "text-orange-600 hover:bg-orange-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-orange-600 hover:bg-orange-100"
                }`}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-all duration-200 hover:shadow-sm"
            >
              <FiDownload className="mr-2" /> Export CSV
            </button>
            {selectedLogs.length > 0 && (
              <button
                onClick={bulkApprove}
                className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 hover:shadow-sm"
              >
                <FiCheck className="mr-2" /> Approve Selected (
                {selectedLogs.length})
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:shadow-sm"
          >
            <FiSettings className="mr-2" /> Settings
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50 transition-all duration-300 ease-in-out">
            <h3 className="font-bold text-orange-700 mb-3">
              Selfie Submission Settings
            </h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mandatorySelfie"
                checked={mandatorySelfie}
                onChange={() => setMandatorySelfie(!mandatorySelfie)}
                className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500 transition-colors"
              />
              <label htmlFor="mandatorySelfie" className="ml-2 text-gray-700">
                Require daily selfie submission from delivery agents
              </label>
            </div>
            {mandatorySelfie && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apply to zones (leave blank for all zones)
                </label>
                <input
                  type="text"
                  placeholder="Comma-separated zone names"
                  className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm transition-all duration-200"
                />
              </div>
            )}
          </div>
        )}

        {/* modal function of view button for selfie  */}

        {viewingImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
              onClick={() => setViewingImage(null)}
            />

            {/* Modal Container */}
            <div className="relative z-10 max-w-2xl w-full animate-in slide-in-from-bottom-4 zoom-in-95 duration-400 ease-out">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Agent Verification
                        </h3>
                        <p className="text-orange-100 text-sm">
                          Review delivery agent identity
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewingImage(null)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  {/* Image container with loading state */}
                  <div className="flex justify-center mb-8 min-h-[300px]">
                    <div className="relative w-full flex items-center justify-center">
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                      )}
                      <img
                        src={viewingImage}
                        alt="Agent verification photo"
                        className={`max-w-full max-h-[60vh] rounded-xl shadow-lg object-cover transition-transform duration-300 hover:scale-[1.02] ${
                          !imageLoaded ? "opacity-0" : "opacity-100"
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(false)}
                      />
                    </div>
                  </div>

                  {/* Action Buttons - Disabled while loading */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => {
                        const logId = logs.find(
                          (log) => log.selfieUrl === viewingImage
                        )?.id;
                        if (logId) handleStatusChange(logId, "Rejected");
                        setViewingImage(null);
                      }}
                      disabled={!imageLoaded}
                      className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                        !imageLoaded
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => {
                        const logId = logs.find(
                          (log) => log.selfieUrl === viewingImage
                        )?.id;
                        if (logId) handleStatusChange(logId, "Approved");
                        setViewingImage(null);
                      }}
                      disabled={!imageLoaded}
                      className={`flex items-center justify-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                        !imageLoaded
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Approve</span>
                    </button>
                  </div>

                  {/* Status indicator */}
                  <div className="mt-6 flex justify-center">
                    <div
                      className="flex items-center space-x-2 text-sm ${
              !imageLoaded ? 'text-orange-500' : 'text-gray-500'
            }"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          !imageLoaded
                            ? "bg-orange-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      />
                      <span>
                        {!imageLoaded
                          ? "Loading selfie..."
                          : "Secure verification in progress"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animation keyframes in style tag */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        /* Mobile-specific dropdown styles */
        @media (max-width: 640px) {
          select {
            max-width: 120px !important;
            font-size: 12px !important;
            padding: 0.25rem 1.5rem 0.25rem 0.5rem !important;
          }
          
          .relative .absolute {
            right: 0 !important;
          }
          
          .relative .absolute svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentSelfieLogs;
