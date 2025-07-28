import React, { useState, useEffect } from 'react';
import {
  User, AlertTriangle, PlusCircle, Trash2,
  Ban, RotateCcw
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

  /* ------------------------- data fetching ------------------------- */
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/admin/agent/getAll');
        console.log("Fetched agents:", res.data.agents);
        setAllAgents(res.data.agents);
        if (res.data.agents.length) setSelectedAgentId(res.data.agents[0].id);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      const agent = allAgents.find(a => a.id === selectedAgentId);
      setCurrentAgent(agent);
      setWarnings(agent?.warnings || []);
    }
  }, [selectedAgentId, allAgents]);

  /* ------------------------- handlers ------------------------- */
  const addWarning = async () => {
    if (!warningReason || !selectedAgentId) {
      toast.error('Please enter a warning reason');
      return;
    }
    try {
      const toastId = toast.loading('Issuing warning...');
      const { data } = await apiClient.post(
        `/admin/agent/${selectedAgentId}/give-warning`,
        { reason: warningReason, severity }
      );
      setAllAgents(allAgents.map(a => (a.id === selectedAgentId ? data.agent : a)));
      setWarningReason('');
      toast.success('Warning issued successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue warning');
    }
  };

  const terminateAgent = async () => {
    if (!terminateReason || !selectedAgentId) {
      toast.error('Please enter a termination reason');
      return;
    }
    try {
      const toastId = toast.loading('Processing termination...');
      const { data } = await apiClient.post(
        `/admin/agent/${selectedAgentId}/terminate`,
        {
          reason: terminateReason,
          letter: `Termination letter for ${currentAgent?.name}`,
          terminationDate: terminateDate
        }
      );
      setAllAgents(allAgents.map(a => (a.id === selectedAgentId ? data.agent : a)));
      setTerminateReason('');
      toast.success('Agent terminated successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to terminate agent');
    }
  };

  const deleteWarning = async (warningId) => {
    try {
      const toastId = toast.loading('Removing warning...');
      await apiClient.delete(`/admin/agent/${selectedAgentId}/warnings/${warningId}`);
      setWarnings(warnings.filter(w => w.id !== warningId));
      toast.success('Warning removed successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove warning');
    }
  };

  /* ------------------------- UI helpers ------------------------- */
  const getSeverityBadge = (sev = 'minor') => {
    const key = sev.toLowerCase();
    const cfg = {
      minor:    { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' },
      major:    { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
      critical: { bg: 'bg-red-100',   text: 'text-red-800',   dot: 'bg-red-500'    }
    }[key] || cfg.minor;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        <span className={`w-2 h-2 mr-2 rounded-full ${cfg.dot}`}></span>
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) =>
    status === 'terminated' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        Terminated
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Active
      </span>
    );

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-orange-600 focus:outline-none"
    >
      {value}
    </button>
  ));

  /* ------------------------- render ------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-8">
          {/* ---------- Header ---------- */}
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-8">
            <User size={26} className="text-orange-600" />
            Agent Warning &amp; Termination
          </h1>

          {/* ---------- Agent selection ---------- */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Agent
            </label>
            <select
              value={selectedAgentId || ''}
              onChange={e => setSelectedAgentId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-orange-600"
            >
              {allAgents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>
          </div>

          {/* ---------- Agent info ---------- */}
          {currentAgent && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-100 border border-gray-200 rounded-md p-4 mb-10">
              <div>
                <h2 className="text-lg font-medium text-gray-800">{currentAgent.name}</h2>
                <p className="text-gray-600 text-sm">{currentAgent.email}</p>
                <p className="text-gray-500 text-sm">{currentAgent.phone}</p>
              </div>
              {getStatusBadge(currentAgent.termination?.terminated ? 'terminated' : 'active')}
            </div>
          )}

          {/* ---------- Warning history ---------- */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Warning History</h3>
            <div className="border border-gray-200 rounded-lg overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Reason</th>
                    <th className="px-5 py-3 text-left">Severity</th>
                    <th className="px-5 py-3 text-left">Issued By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {warnings.map(w => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">{new Date(w.issuedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-gray-700">{w.reason}</td>
                      <td className="px-5 py-3">{getSeverityBadge(w.severity)}</td>
                      <td className="px-5 py-3 text-gray-600">{w.issuedBy?.name || 'System'}</td>
                    </tr>
                  ))}
                  {!warnings.length && (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-gray-500">
                        No warnings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ---------- Issue warning form ---------- */}
          <div className="mb-10 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-600" />
              Issue New Warning
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warning Reason
                </label>
                <textarea
                  value={warningReason}
                  onChange={e => setWarningReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-orange-600"
                  placeholder="Enter reason..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-orange-600"
                >
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <button
              onClick={addWarning}
              disabled={!warningReason || loading}
              className={`mt-4 px-4 py-2 rounded-md text-sm font-medium ${
                !warningReason || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <PlusCircle size={16} className="inline mr-2" />
              Issue Warning
            </button>
          </div>

          {/* ---------- Termination form ---------- */}
          {currentAgent && !currentAgent.termination?.terminated && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Ban size={18} className="text-red-600" />
                Terminate Agent
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Termination Date
                  </label>
                  <DatePicker
                    selected={terminateDate}
                    onChange={setTerminateDate}
                    customInput={<CustomDateInput />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Termination Reason
                  </label>
                  <textarea
                    value={terminateReason}
                    onChange={e => setTerminateReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:ring-2 focus:ring-orange-600"
                    placeholder="Enter detailed reason..."
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                <button
                  onClick={terminateAgent}
                  disabled={!terminateReason || loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    !terminateReason || loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  <Ban size={16} className="inline mr-2" />
                  Terminate
                </button>
                <button
                  onClick={() => {
                    setTerminateReason('');
                    setTerminateDate(new Date());
                  }}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <RotateCcw size={16} className="inline mr-2" />
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentWarningTerm;
