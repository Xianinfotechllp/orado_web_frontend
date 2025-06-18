import React, { useState, useEffect } from 'react';
import { Send, Plus, MessageCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { createTicket, getMyTickets, addMessageToTicket } from '../../../apis/ticketsApi';

const TicketSystem = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Create ticket form state
  const [createForm, setCreateForm] = useState({
    subject: '',
    priority: 'medium',
    message: ''
  });
  
  // Add message form state
  const [messageForm, setMessageForm] = useState({
    message: ''
  });

  const createNewTicket = async (ticketData) => {
    setLoading(true);
    try {
      const data = await createTicket(ticketData);
      console.log('cretae', data)
      setCreateForm({ subject: '', priority: 'medium', message: '' });
      fetchTickets();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to create ticket' };
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getMyTickets();
      console.log('get my ticket', data)
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMessage = async (ticketId, message) => {
    try {
      const data = await addMessageToTicket(ticketId, message);
      setMessageForm({ message: '' });
      fetchTickets();
      // Update selected ticket if it's the same one
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(data.ticket);
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add message' };
    }
  };

  useEffect(() => {
    if (activeTab === 'view') {
      fetchTickets();
    }
  }, [activeTab]);

  const handleCreateSubmit = async () => {
    if (!createForm.subject || !createForm.message) return;
    
    const result = await createNewTicket(createForm);
    if (result.success) {
      setActiveTab('view');
    }
  };

  const handleAddMessage = async () => {
    if (!messageForm.message || !selectedTicket) return;
    
    await addMessage(selectedTicket._id, messageForm.message);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return <AlertCircle className="w-4 h-4" />;
      case 'in progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
        <p className="text-gray-600">Create tickets and track your support requests</p>
      </div>

      {/* Toggle Bar */}
      <div className="bg-gray-100 p-1 rounded-lg mb-8 inline-flex">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'create'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Create Ticket
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'view'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          My Tickets
        </button>
      </div>

      {/* Create Ticket Tab */}
      {activeTab === 'create' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Ticket</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={createForm.subject}
                onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={createForm.message}
                onChange={(e) => setCreateForm({ ...createForm, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>

            <button
              onClick={handleCreateSubmit}
              disabled={loading || !createForm.subject || !createForm.message}
              className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* View Tickets Tab */}
      {activeTab === 'view' && (
        <div className="space-y-6">
          {selectedTicket ? (
            // Ticket Detail View
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-orange-600 hover:text-orange-700 mb-4 font-medium"
                  >
                    ← Back to tickets
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedTicket.subject}</h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="ml-1 capitalize">{selectedTicket.status || 'Open'}</span>
                    </span>
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">You</span>
                    <span className="text-sm text-gray-500">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{selectedTicket.message}</p>
                </div>

                {selectedTicket.replies?.map((reply, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 ${
                      reply.sender === 'admin' ? 'bg-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {reply.sender === 'admin' ? 'Support Team' : 'You'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{reply.message}</p>
                  </div>
                ))}
              </div>

              {/* Add Message Form */}
              <div className="space-y-4">
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add a message to this ticket..."
                />
                <button
                  onClick={handleAddMessage}
                  disabled={!messageForm.message}
                  className="bg-orange-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          ) : (
            // Tickets List View
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Tickets</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-600 mt-4">Loading tickets...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No tickets found</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="text-orange-600 hover:text-orange-700 font-medium mt-2"
                  >
                    Create your first ticket
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{ticket.subject}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {ticket.message}
                          </p>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {getStatusIcon(ticket.status)}
                              <span className="ml-1 capitalize">{ticket.status || 'Open'}</span>
                            </span>
                            <span className={`text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority} Priority
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <MessageCircle className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketSystem;