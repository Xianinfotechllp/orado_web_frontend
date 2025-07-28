import React, { useState, useEffect } from 'react';
import {
  User, AlertTriangle, PlusCircle, Trash2,
  ChevronDown, Search, Ban, RotateCcw, Clock
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import apiClient from '../../apis/apiClient/apiClient';
import { toast } from 'react-toastify';


const AgentWarningTerm = () => {
  // State management
  const [allAgents, setAllAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [warningReason, setWarningReason] = useState('');
  const [severity, setSeverity] = useState('Minor');
  const [terminateReason, setTerminateReason] = useState('');
  const [terminateDate, setTerminateDate] = useState(new Date());

  // Fetch all agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/agent/getAll');
        setAllAgents(response.data.agents);
        if (response.data.agents.length > 0) {
          setSelectedAgentId(response.data.agents[0].id);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  // Update current agent when selection changes
  useEffect(() => {
    if (selectedAgentId) {
      const agent = allAgents.find(a => a.id === selectedAgentId);
      setCurrentAgent(agent);
      setWarnings(agent?.warnings || []);
    }
  }, [selectedAgentId, allAgents]);

  // Add warning handler
  const addWarning = async () => {
    if (!warningReason || !selectedAgentId) {
      toast.error('Please enter a warning reason');
      return;
    }

    try {
      const toastId = toast.loading('Issuing warning...');
      const response = await apiClient.post(
        `/admin/agent/${selectedAgentId}/give-warning`,
        { reason: warningReason, severity }
      );

      // Update state
      setAllAgents(allAgents.map(agent => 
        agent.id === selectedAgentId ? response.data.agent : agent
      ));
      setWarningReason('');
      toast.success('Warning issued successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue warning');
    }
  };

  // Terminate agent handler
  const terminateAgent = async () => {
    if (!terminateReason || !selectedAgentId) {
      toast.error('Please enter a termination reason');
      return;
    }

    try {
      const toastId = toast.loading('Processing termination...');
      const response = await apiClient.post(
        `/admin/agent/${selectedAgentId}/terminate`,
        { 
          reason: terminateReason,
          letter: `Termination letter for ${currentAgent?.name}`,
          terminationDate: terminateDate
        }
      );

      // Update state
      setAllAgents(allAgents.map(agent => 
        agent.id === selectedAgentId ? response.data.agent : agent
      ));
      setTerminateReason('');
      toast.success('Agent terminated successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to terminate agent');
    }
  };

  // Delete warning handler
  const deleteWarning = async (warningId) => {
    try {
      const toastId = toast.loading('Removing warning...');
      await apiClient.delete(`/admin/agent/${selectedAgentId}/warnings/${warningId}`);
      
      // Update state
      setWarnings(warnings.filter(w => w.id !== warningId));
      toast.success('Warning removed successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove warning');
    }
  };

  // Severity badge component
  const getSeverityBadge = (severity) => {
    const config = {
      Minor: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
      Major: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
      Critical: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
    }[severity];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></span>
        {severity}
      </span>
    );
  };

  // Status badge component
  const getStatusBadge = (status) => {
    return status === 'terminated' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Terminated
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  // Custom date picker input
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
    >
      {value}
    </button>
  ));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Agent Warning & Termination
        </h1>

        {/* Agent Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Agent
          </label>
          <select
            value={selectedAgentId || ''}
            onChange={(e) => setSelectedAgentId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            {allAgents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </option>
            ))}
          </select>
        </div>

        {/* Agent Info */}
        {currentAgent && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{currentAgent.name}</h2>
                <p className="text-gray-600">{currentAgent.email}</p>
                <p className="text-gray-600">{currentAgent.phone}</p>
              </div>
              <div>
                {getStatusBadge(currentAgent.termination?.terminated ? 'terminated' : 'active')}
              </div>
            </div>
          </div>
        )}

        {/* Warning History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Warning History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {warnings.map(warning => (
                  <tr key={warning.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(warning.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {warning.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(warning.severity || 'Minor')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {warning.issuedBy?.name || 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteWarning(warning.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {warnings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No warnings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Warning Form */}
        <div className="mb-8 p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Issue New Warning</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warning Reason
              </label>
              <textarea
                value={warningReason}
                onChange={(e) => setWarningReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                rows={3}
                placeholder="Enter detailed reason for warning..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={addWarning}
              disabled={!warningReason || loading}
              className={`px-4 py-2 rounded-lg font-medium ${!warningReason || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
            >
              <PlusCircle className="inline mr-2" size={18} />
              Issue Warning
            </button>
          </div>
        </div>

        {/* Termination Form */}
        {currentAgent && !currentAgent.termination?.terminated && (
          <div className="p-6 border border-gray-200 rounded-lg bg-red-50">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Terminate Agent</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termination Date
                </label>
                <DatePicker
                  selected={terminateDate}
                  onChange={(date) => setTerminateDate(date)}
                  customInput={<CustomDateInput />}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Termination Reason
                </label>
                <textarea
                  value={terminateReason}
                  onChange={(e) => setTerminateReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Enter detailed reason for termination..."
                />
              </div>
            </div>
            <div className="mt-4 space-x-4">
              <button
                onClick={terminateAgent}
                disabled={!terminateReason || loading}
                className={`px-4 py-2 rounded-lg font-medium ${!terminateReason || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                <Ban className="inline mr-2" size={18} />
                Terminate Agent
              </button>
              <button
                onClick={() => {
                  setTerminateReason('');
                  setTerminateDate(new Date());
                }}
                className="px-4 py-2 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                <RotateCcw className="inline mr-2" size={18} />
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentWarningTerm;