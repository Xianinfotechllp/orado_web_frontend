import React from 'react';
import { FaExclamationTriangle, FaUserTimes, FaCalendarCheck, FaHistory, FaCheckCircle, FaClock, FaTimes, FaEye } from 'react-icons/fa';
import { useState } from 'react';

const AgentWarningsApprovalsTerminationsDash = () => {
  const [warnings] = useState([
    { id: 1, reason: "Late delivery on 3 consecutive orders", date: "2023-06-15", severity: "Medium" },
    { id: 2, reason: "Customer complaint about unprofessional behavior", date: "2023-06-10", severity: "High" },
    { id: 3, reason: "Incomplete order verification", date: "2023-05-28", severity: "Low" },
  ]);

  const [approvals] = useState([
    { id: 1, type: "Leave Request", date: "2023-06-20", status: "Pending", duration: "2 days" },
    { id: 2, type: "Schedule Change", date: "2023-06-18", status: "Approved", duration: "Night shift" },
    { id: 3, type: "Leave Request", date: "2023-06-12", status: "Processed", duration: "1 day" },
  ]);

  const [terminations] = useState([
    // Empty for this example - no termination history
  ]);

  const getSeverityColor = (severity) => {
    const colors = {
      'High': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
      'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Low': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    };
    return colors[severity] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Approved': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      'Processed': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    };
    return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': FaClock,
      'Approved': FaCheckCircle,
      'Processed': FaCheckCircle,
      'Rejected': FaTimes,
    };
    return icons[status] || FaClock;
  };

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <FaExclamationTriangle className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Warnings / Approvals / Terminations</h1>
                  <p className="text-gray-600 text-base md:text-lg">Track disciplinary actions, approvals, and employment history</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
                <FaExclamationTriangle className="text-orange-600 text-sm" />
                <span className="text-orange-700 font-semibold text-sm">Active Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FaExclamationTriangle className="text-orange-600 text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{warnings.length}</span>
              </div>
              <h3 className="text-gray-700 font-medium">Total Warnings</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FaCalendarCheck className="text-orange-600 text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{approvals.length}</span>
              </div>
              <h3 className="text-gray-700 font-medium">Total Approvals</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FaClock className="text-orange-600 text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{approvals.filter(a => a.status === 'Pending').length}</span>
              </div>
              <h3 className="text-gray-700 font-medium">Pending Approvals</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <FaUserTimes className="text-orange-600 text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-800">{terminations.length}</span>
              </div>
              <h3 className="text-gray-700 font-medium">Terminations</h3>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Warnings Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-3 rounded-xl">
                <FaExclamationTriangle className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Warning History</h2>
            </div>

            <div className="space-y-4">
              {warnings.map((warning, index) => {
                const severityColor = getSeverityColor(warning.severity);
                return (
                  <div key={warning.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-orange-50 rounded-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-2">{warning.reason}</p>
                          <p className="text-sm text-gray-600">{warning.date}</p>
                        </div>
                        {/* <div className={`${severityColor.bg} ${severityColor.border} border px-3 py-1 rounded-full`}>
                          <span className={`${severityColor.text} font-semibold text-xs`}>{warning.severity}</span>
                        </div> */}
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 rounded-full transition-all duration-300">
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approvals Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-3 rounded-xl">
                <FaCalendarCheck className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Leave / Schedule Approvals</h2>
            </div>

            <div className="space-y-4">
              {approvals.map((approval, index) => {
                const statusColor = getStatusColor(approval.status);
                const StatusIcon = getStatusIcon(approval.status);
                return (
                  <div key={approval.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-orange-50 rounded-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-1">{approval.type}</p>
                          <p className="text-sm text-gray-600 mb-1">{approval.duration}</p>
                          <p className="text-sm text-gray-600">{approval.date}</p>
                        </div>
                        <div className={`${statusColor.bg} ${statusColor.border} border px-3 py-1 rounded-full flex items-center space-x-2`}>
                          <StatusIcon className={`${statusColor.text} text-xs`} />
                          <span className={`${statusColor.text} font-semibold text-xs`}>{approval.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 rounded-full transition-all duration-300">
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Termination History Section */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-3 rounded-xl">
                <FaHistory className="text-white text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Termination History</h2>
            </div>

            {terminations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No Termination History</h3>
                <p className="text-gray-500">This agent has a clean employment record with no terminations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {terminations.map((termination, index) => (
                  <div key={termination.id} className="group border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-orange-50 rounded-full transform translate-x-6 -translate-y-6 group-hover:scale-150 transition-transform duration-700"></div>
                    
                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium mb-2">{termination.reason}</p>
                          <p className="text-sm text-gray-600">{termination.date}</p>
                        </div>
                        <div className="bg-red-100 border border-red-200 px-3 py-1 rounded-full">
                          <span className="text-red-700 font-semibold text-xs">{termination.type}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 p-2 rounded-full transition-all duration-300">
                          <FaEye className="text-sm" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-500"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentWarningsApprovalsTerminationsDash;