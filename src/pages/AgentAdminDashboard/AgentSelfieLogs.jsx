import React from 'react'
import { FiDownload, FiSettings, FiCheck, FiX, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const dummySelfieLogs = [
  { 
    id: '1',
    agentName: 'Ramesh Kumar', 
    phone: '9876543210', 
    date: '2023-07-17', 
    status: 'Pending', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    zone: 'North Delhi'
  },
  { 
    id: '2',
    agentName: 'Sita Patel', 
    phone: '8765432109', 
    date: '2023-07-17', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    zone: 'South Delhi'
  },
  { 
    id: '3',
    agentName: 'Mohan Singh', 
    phone: '7654321098', 
    date: '2023-07-16', 
    status: 'Rejected', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    zone: 'East Delhi'
  },
  { 
    id: '4',
    agentName: 'Priya Sharma', 
    phone: '6543210987', 
    date: '2023-07-16', 
    status: 'Pending', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    zone: 'West Delhi'
  },
  { 
    id: '5',
    agentName: 'Amit Verma', 
    phone: '5432109876', 
    date: '2023-07-15', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    zone: 'Central Delhi'
  },
  { 
    id: '6',
    agentName: 'Neha Joshi', 
    phone: '9321076543', 
    date: '2023-07-15', 
    status: 'Rejected', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    zone: 'North West Delhi'
  },
  { 
    id: '7',
    agentName: 'Arjun Mehta', 
    phone: '9210765432', 
    date: '2023-07-14', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    zone: 'South West Delhi'
  },
  { 
    id: '8',
    agentName: 'Kavita Desai', 
    phone: '9107654321', 
    date: '2023-07-14', 
    status: 'Pending', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    zone: 'North East Delhi'
  },
  { 
    id: '9',
    agentName: 'Rahul Yadav', 
    phone: '9876012345', 
    date: '2023-07-13', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    zone: 'Shahdara'
  },
  { 
    id: '10',
    agentName: 'Sneha Kapoor', 
    phone: '8760123456', 
    date: '2023-07-13', 
    status: 'Rejected', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    zone: 'Rohini'
  },
  { 
    id: '11',
    agentName: 'Vikram Thakur', 
    phone: '7650123456', 
    date: '2023-07-12', 
    status: 'Pending', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/6.jpg',
    zone: 'Dwarka'
  },
  { 
    id: '12',
    agentName: 'Ayesha Khan', 
    phone: '6540123456', 
    date: '2023-07-12', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    zone: 'Karol Bagh'
  },
  { 
    id: '13',
    agentName: 'Manoj Rawat', 
    phone: '5430123456', 
    date: '2023-07-11', 
    status: 'Rejected', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    zone: 'Janakpuri'
  },
  { 
    id: '14',
    agentName: 'Pooja Mishra', 
    phone: '4320123456', 
    date: '2023-07-11', 
    status: 'Approved', 
    selfieUrl: 'https://randomuser.me/api/portraits/women/7.jpg',
    zone: 'Saket'
  },
  { 
    id: '15',
    agentName: 'Sandeep Rathi', 
    phone: '3210123456', 
    date: '2023-07-10', 
    status: 'Pending', 
    selfieUrl: 'https://randomuser.me/api/portraits/men/8.jpg',
    zone: 'Narela'
  }
];

const AgentSelfieLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const [logs, setLogs] = useState(dummySelfieLogs);
  const [showSettings, setShowSettings] = useState(false);
  const [mandatorySelfie, setMandatorySelfie] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Date picker state
  const [dateRange, setDateRange] = useState({
    from: new Date('2023-07-01'),
    to: new Date('2023-07-31')
  });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // DatePicker component
  const DatePicker = ({ type }) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
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
        if (type === 'from') {
          setDateRange({...dateRange, from: selectedDate});
        } else {
          setDateRange({...dateRange, to: selectedDate});
        }
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
      if (type === 'from') {
        return date.getTime() === dateRange.from.getTime();
      } else {
        return date.getTime() === dateRange.to.getTime();
      }
    };

    const isInRange = (day) => {
      if (!day) return false;
      const date = new Date(currentYear, currentMonth, day);
      return date >= dateRange.from && date <= dateRange.to;
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
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-[10px] font-medium text-gray-500 p-1">
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
                isSelected(day) ? 'bg-orange-500 text-white font-semibold' : 
                isInRange(day) ? 'bg-orange-100 text-orange-600' :
                day ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-300'
              }`}
            >
              {day || ''}
            </div>
          ))}
        </div>
        <button 
          onClick={() => setShowDatePicker(null)}
          className="mt-2 w-full py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
        >
          Close
        </button>
      </div>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm);
    const matchesDate = 
      new Date(log.date) >= dateRange.from && 
      new Date(log.date) <= dateRange.to;
    const matchesStatus = 
      statusFilter === 'All' || log.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = (id, newStatus) => {
    setLogs(logs.map(log => 
      log.id === id ? { ...log, status: newStatus } : log
    ));
  };

  const bulkApprove = () => {
    setLogs(logs.map(log => 
      selectedLogs.includes(log.id) ? { ...log, status: 'Approved' } : log
    ));
    setSelectedLogs([]);
  };

  const exportToCSV = () => {
    console.log('Exporting to CSV:', filteredLogs);
    alert('CSV export functionality would be implemented here');
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8 font-sans">
  <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-3xl shadow-lg md:shadow-2xl p-4 md:p-8 transition-all duration-300">
    <h1 className="text-2xl md:text-4xl font-extrabold text-orange-500 mb-4 md:mb-10 tracking-wide flex items-center">
      <svg className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Agent Selfie Logs
    </h1>
  


        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="text"
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                value={formatDate(dateRange.from)}
                onClick={() => setShowDatePicker(showDatePicker === 'from' ? null : 'from')}
                readOnly
              />
              {showDatePicker === 'from' && <DatePicker type="from" />}
            </div>
            <div className="flex-1 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="text"
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                value={formatDate(dateRange.to)}
                onClick={() => setShowDatePicker(showDatePicker === 'to' ? null : 'to')}
                readOnly
              />
              {showDatePicker === 'to' && <DatePicker type="to" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="relative">
              <select
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm appearance-none"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Agent</label>
            <input
              type="text"
              placeholder="Name or Phone"
              className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
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
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedLogs(currentItems.map(log => log.id));
                      } else {
                        setSelectedLogs([]);
                      }
                    }}
                    checked={selectedLogs.length > 0 && currentItems.every(item => selectedLogs.includes(item.id))}
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
                currentItems.map(log => (
                  <tr 
                    key={log.id} 
                    className="border-b border-orange-100 hover:bg-orange-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={selectedLogs.includes(log.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedLogs([...selectedLogs, log.id]);
                          } else {
                            setSelectedLogs(selectedLogs.filter(id => id !== log.id));
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
                          onChange={e => handleStatusChange(log.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full focus:outline-none focus:ring-1 ${
                            log.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            log.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}
                          style={{
                            maxWidth: '120px',
                            width: 'auto',
                            appearance: 'none',
                            paddingRight: '1.75rem',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
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
                      {log.status === 'Approved' ? (
                        <FiCheck className="text-green-600" />
                      ) : log.status === 'Rejected' ? (
                        <FiX className="text-red-600" />
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleStatusChange(log.id, 'Approved')}
                            className="text-green-600 hover:text-green-800 transition-colors duration-200"
                          >
                            <FiCheck />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(log.id, 'Rejected')}
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
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
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
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors duration-200 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-100'}`}
              >
                <FiChevronLeft />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg transition-all duration-200 ${currentPage === page ? 'bg-orange-600 text-white shadow-md' : 'text-orange-600 hover:bg-orange-100'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors duration-200 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-orange-600 hover:bg-orange-100'}`}
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
                <FiCheck className="mr-2" /> Approve Selected ({selectedLogs.length})
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
            <h3 className="font-bold text-orange-700 mb-3">Selfie Submission Settings</h3>
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
    
    {/* Clean backdrop with Swiggy orange theme */}
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
      onClick={() => setViewingImage(null)}
    />
    
    {/* Modal Container */}
    <div className="relative z-10 max-w-2xl w-full animate-in slide-in-from-bottom-4 zoom-in-95 duration-400 ease-out">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header with Swiggy orange theme */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Agent Verification</h3>
                <p className="text-orange-100 text-sm">Review delivery agent identity</p>
              </div>
            </div>
            
            <button 
              onClick={() => setViewingImage(null)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-8">
          {/* Clean image container */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={viewingImage} 
                alt="Agent verification photo" 
                className="max-w-full max-h-[60vh] rounded-xl shadow-lg object-cover transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>
          
          {/* Action Buttons with Swiggy styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => {
                const logId = logs.find(log => log.selfieUrl === viewingImage)?.id;
                if (logId) handleStatusChange(logId, 'Rejected');
                setViewingImage(null);
              }}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Reject</span>
            </button>
            
            <button 
              onClick={() => {
                const logId = logs.find(log => log.selfieUrl === viewingImage)?.id;
                if (logId) handleStatusChange(logId, 'Approved');
                setViewingImage(null);
              }}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Approve</span>
            </button>
          </div>
          
          {/* Status indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span>Secure verification in progress</span>
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
}

export default AgentSelfieLogs;