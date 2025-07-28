import React, { useState, useEffect } from 'react';
import { 
  Eye, FileText, User, ChevronRight, X, Check, 
  ChevronLeft, Phone, Search, Filter, Package, RefreshCw 
} from 'lucide-react';
import axios from 'axios';
import apiClient from '../../apis/apiClient/apiClient';
import { toast } from 'react-toastify';

const AgentKYCApproval = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [showDocumentModal, setShowDocumentModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recordsPerPage = 10;
  const [allAgents, setAllAgents] = useState([]);

  // Fetch agents from API
useEffect(() => {
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/agent/getAll', {
        params: {
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchText || undefined
        }
      });
      
      // Map the API response to the expected format
      setAllAgents(response.data.agents.map(agent => ({
        id: agent.id || agent._id,
        name: agent.name || agent.email,
        phoneNumber: agent.phone || 'Not provided',
        email: agent.email,
        phone: agent.phone, // Added this line for consistency with the ReviewModal
        status: agent.status || 'pending',
        documents: {
          license: agent.documents?.license || null,
          insurance: agent.documents?.insurance || null,
          rcBook: agent.documents?.rcBook || null,
          pollutionCertificate: agent.documents?.pollutionCertificate || null,
          submittedAt: agent.documents?.submittedAt || null
        },
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
        approvedAt: agent.approvedAt,
        rejectedAt: agent.rejectedAt,
        approvedBy: agent.approvedBy,
        rejectedBy: agent.rejectedBy,
        rejectionReason: agent.rejectionReason
      })));
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.response?.data?.message || 'Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  fetchAgents();
}, [searchText, selectedStatus]);

  // Filter agents based on search and status
    const filteredAgents = allAgents.filter(agent => {
    const matchesSearch = searchText === '' || 
      agent.name.toLowerCase().includes(searchText.toLowerCase()) ||
      agent.phoneNumber.includes(searchText) ||
      agent.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredAgents.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstRecord, indexOfLastRecord);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedStatus]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-amber-100 border-amber-300', 
        text: 'text-amber-800',
        dot: 'bg-amber-500',
        label: 'Pending' 
      },
      approved: { 
        bg: 'bg-emerald-100 border-emerald-300', 
        text: 'text-emerald-800',
        dot: 'bg-emerald-500',
        label: 'Approved' 
      },
      rejected: { 
        bg: 'bg-rose-100 border-rose-300', 
        text: 'text-rose-800',
        dot: 'bg-rose-500',
        label: 'Rejected' 
      }
    };
    const config = configs[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} shadow-sm`}>
        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></div>
        {config.label}
      </span>
    );
  };

const handleApprove = async (agentId) => {
  try {
    await apiClient.patch(`/admin/agent/${agentId}/approve`);
    setAllAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, status: 'approved' } : agent
      )
    );
    toast.success('Agent approved successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setSelectedAgent(null);
  } catch (err) {
    console.error('Error approving agent:', err);
    toast.error(err.response?.data?.message || 'Failed to approve agent', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};

const handleReject = async (agentId) => {
  try {
    await apiClient.patch(`/admin/agent/${agentId}/reject`, { rejectionReason: remarks });
    setAllAgents(prevAgents =>
      prevAgents.map(agent =>
        agent.id === agentId ? { ...agent, status: 'rejected' } : agent
      )
    );
    toast.success('Agent rejected successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setSelectedAgent(null);
    setRemarks('');
  } catch (err) {
    console.error('Error rejecting agent:', err);
    toast.error(err.response?.data?.message || 'Failed to reject agent', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
};
  const DocumentModal = ({ doc, docType, agent, onClose }) => (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-4xl max-h-[90vh] overflow-auto border border-orange-100 m-2">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-bold flex items-center">
              <FileText size={18} className="mr-2 sm:mr-3" />
              <span className="truncate">{docType} - {agent?.name}</span>
            </h3>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-orange-600 rounded-lg sm:rounded-xl transition-colors flex-shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-8">
          {doc ? (
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center border-2 border-orange-100">
              <img 
                src={doc} 
                alt={`${docType} document`}
                className="mx-auto rounded-lg sm:rounded-xl shadow-lg max-w-full h-auto border-2 sm:border-4 border-white"
                style={{ maxHeight: '300px' }}
              />
              <p className="text-gray-700 font-semibold mt-4 sm:mt-6 text-base sm:text-lg">{docType}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-8 text-center border-2 border-orange-100">
              <p className="text-gray-500 font-medium">No {docType} document uploaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ReviewModal = ({ agent, onClose }) => (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl max-h-[95vh] overflow-y-auto border border-orange-100 m-2">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold flex items-center">
              <Package size={20} className="mr-2 sm:mr-3 flex-shrink-0" />
              <span className="truncate">KYC Review - {agent.name}</span>
            </h2>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-orange-600 rounded-lg sm:rounded-xl transition-colors flex-shrink-0">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-200 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <User size={18} className="text-white" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{agent.name}</h3>
                <p className="text-gray-700 flex items-center text-xs sm:text-sm font-medium">
                  <Phone size={12} className="mr-1 sm:mr-2 text-orange-500 flex-shrink-0" />
                  <span className="truncate">{agent.phone}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-start">
              {getStatusBadge(agent.status)}
            </div>
          </div>

          <div className="space-y-3 mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
              <FileText size={18} className="mr-2 text-orange-500" />
              Vehicle Documents
            </h4>
            
            {['license', 'insurance', 'rcBook', 'pollutionCertificate'].map((docType) => {
              const docConfig = {
                license: { name: 'Driving License', icon: '🪪', color: 'blue' },
                insurance: { name: 'Insurance', icon: '🏥', color: 'green' },
                rcBook: { name: 'RC Book', icon: '📘', color: 'purple' },
                pollutionCertificate: { name: 'Pollution Cert', icon: '🌿', color: 'amber' }
              }[docType];
              
              return (
                <div key={docType} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                  <h5 className="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-${docConfig.color}-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0`}>
                      {docConfig.icon}
                    </div>
                    {docConfig.name}
                  </h5>
                  <button
                    onClick={() => setShowDocumentModal({ 
                      doc: agent.documents[docType], 
                      type: docConfig.name, 
                      agent 
                    })}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 bg-${docConfig.color}-500 text-white rounded-lg hover:bg-${docConfig.color}-600 transition-colors text-xs sm:text-sm font-medium shadow-sm`}
                    disabled={!agent.documents[docType]}
                  >
                    {agent.documents[docType] ? `View ${docConfig.name}` : 'Not Uploaded'}
                  </button>
                </div>
              );
            })}

            <div className="text-xs text-gray-500 mt-2">
              Submitted on: {new Date(agent.documents.submittedAt).toLocaleString()}
            </div>
          </div>

          {agent.status !== 'approved' && (
            <div className="mb-4 sm:mb-6">
              <label className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 flex items-center">
                📝 Remarks {agent.status === 'pending' ? '(Optional)' : '(Required)'}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={agent.status === 'pending' ? 'Enter notes...' : 'Enter rejection reason...'}
                className="w-full p-2 sm:p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 resize-none text-gray-800 text-xs sm:text-sm"
                rows="3"
                required={agent.status === 'rejected'}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleReject(agent.id)}
              className="flex-1 bg-rose-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-rose-600 transition-colors flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <X size={16} className="mr-2" />
              {agent.status === 'approved' ? 'Revoke Approval' : 'Reject'}
            </button>
            {agent.status !== 'approved' && (
              <button
                onClick={() => handleApprove(agent.id)}
                className="flex-1 bg-emerald-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Check size={16} className="mr-2" />
                Approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="bg-white shadow-lg border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Agent KYC Approvals</h1>
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Manage delivery partner verifications</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                <RefreshCw size={16} className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-orange-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by agent name or phone number..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border rounded-lg text-gray-800 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="w-1/2 sm:w-48">
              <div className="relative">
                <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 border rounded-lg text-gray-800 bg-white appearance-none text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs sm:text-sm text-gray-600 font-medium">
            {searchText && <span> matching "{searchText}"</span>}
            {selectedStatus !== 'all' && <span> with {selectedStatus} status</span>}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-orange-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading agent applications...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-rose-500 mb-4">
                <X size={48} className="mx-auto" />
              </div>
              <p className="text-gray-800 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-100 to-orange-50">
                    <tr>
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Agent Information
                      </th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Documents Status
                      </th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {currentAgents.length > 0 ? (
                      currentAgents.map((agent) => (
                        <tr 
                          key={agent.id} 
                          className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all duration-200 hover:shadow-sm border-b border-gray-100 last:border-b-0"
                        >
                          <td className="px-3 sm:px-4 md:px-6 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                                <User size={14} className="text-white" />
                              </div>
                              <div className="ml-2 sm:ml-3 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{agent.name}</div>
                                <div className="text-xs text-gray-600">Delivery Partner</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3">
                            <div className="flex items-center text-gray-800">
                              <Phone size={12} className="mr-1 sm:mr-2 text-orange-500 hidden sm:block" />
                              <span className="font-medium text-xs sm:text-sm truncate">{agent.phoneNumber}</span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3">
                            <div className="text-xs">
                              {Object.entries(agent.documents).map(([key, value]) => {
                                if (key !== 'submittedAt') {
                                  return (
                                    <div key={key} className="flex items-center mb-1 last:mb-0">
                                      <span className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className="ml-1 font-medium">{value ? 'Uploaded' : 'Missing'}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3">
                            {getStatusBadge(agent.status)}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3">
                            <button
                              onClick={() => setSelectedAgent(agent)}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                            >
                              <span className="truncate">{agent.status === 'approved' ? 'View' : 'Review'}</span>
                              <ChevronRight size={12} className="ml-1" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center">
                            <Search size={48} className="text-gray-300 mb-4" />
                            <p className="text-lg font-medium">No agents found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 px-4 sm:px-6 py-4 border-t border-orange-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                    <div className="text-gray-800 font-medium text-xs sm:text-sm">
                      Showing <span className="text-orange-600 font-bold">{indexOfFirstRecord + 1}</span> to{' '}
                      <span className="text-orange-600 font-bold">{Math.min(indexOfLastRecord, filteredAgents.length)}</span> of{' '}
                      <span className="text-orange-600 font-bold">{filteredAgents.length}</span> results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center transition-all duration-200 ${
                          currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
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
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600 border border-gray-200'
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
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center transition-all duration-200 ${
                          currentPage === totalPages
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        Next
                        <ChevronRight size={14} className="ml-0.5 sm:ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedAgent && (
        <ReviewModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}

      {showDocumentModal && (
        <DocumentModal
          doc={showDocumentModal.doc}
          docType={showDocumentModal.type}
          agent={showDocumentModal.agent}
          onClose={() => setShowDocumentModal(null)}
        />
      )}
    </div>
  );
};

export default AgentKYCApproval;