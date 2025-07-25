import React from 'react'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown } from 'lucide-react';

const AgentDeliveryDash = () => {
  // Date picker state
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7))
  });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Dummy data
  const currentTask = {
    orderId: 'SWGY789456123a',
    pickup: 'Burger King, MG Road ',
    drop: '12th Cross, Koramangala Koramangala ',
    status: 'On the way to pickup Koramangala ',
    earnings: '₹75',
    timeElapsed: '15 mins'
  };

  const todaySummary = {
    completed: 8,
    cancelled: 2,
    earnings: '₹600',
    avgTime: '22 mins'
  };

  const taskLogs = [
     { date: '2023-06-15', completed: 7, cancelled: 1, earnings: '₹525' },
     { date: '2023-06-14', completed: 9, cancelled: 0, earnings: '₹675' },
     { date: '2023-06-13', completed: 6, cancelled: 2, earnings: '₹450' },
  ];

  // Helper function
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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

  return (
    <div className="min-h-screen bg-white p-4 mt-8 mb-4 md:p-8 font-sans rounded-2xl shadow-xl">
      <div className="min-h-screen bg-white-50 p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
        {/* Header - Replaces your current simple header */}
<div className="mb-6 md:mb-8"> {/* Adjusted margin for mobile */}
  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 -mt-8 md:p-8 relative overflow-hidden"> {/* Responsive padding */}
    {/* Background Pattern - Hidden on small screens */}
    <div className="hidden sm:block absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full transform translate-x-10 -translate-y-10 md:translate-x-16 md:-translate-y-16"></div>
    <div className="hidden sm:block absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full transform -translate-x-8 translate-y-8 md:-translate-x-12 md:translate-y-12"></div>
    
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4"> {/* Stack on mobile */}
      <div className="flex items-center gap-3 sm:gap-4"> {/* Adjusted gap */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 sm:p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300 min-w-[48px]"> {/* Icon container */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0M3 3h18v2H3V3zm3 7h12v2H6v-2zm2 5h8v2H8v-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Delivery Dashboard</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">Track your deliveries and performance</p>
        </div>
      </div>
      <div className="flex items-center bg-orange-100 px-3 py-1 sm:px-4 sm:py-2 rounded-full self-end sm:self-auto"> {/* Badge */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0M3 3h18v2H3V3zm3 7h12v2H6v-2zm2 5h8v2H8v-2z" />
        </svg>
        <span className="text-xs sm:text-sm font-semibold text-orange-700 ml-1 sm:ml-2">Active</span>
      </div>
    </div>
  </div>
</div>

          {/* Main Dashboard */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Current Task Card */}
  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 ">Current Task</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          Active
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 mr-6">Order ID</span>
          <span className="font-medium break-words">{currentTask.orderId}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 mr-4">Pickup</span>
          <span className="font-medium break-words">{currentTask.pickup}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 mr-6">Drop</span>
          <span className="font-medium break-words">{currentTask.drop}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600 mr-4">Task Status</span>
          <span className="font-medium text-orange-600 break-words">{currentTask.status}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between">
          <span className="text-gray-600">Earnings</span>
          <span className="font-medium text-green-600 break-words">{currentTask.earnings}</span>
        </div>
      </div>
    </div>
  </div>


            {/* Today's Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Summary</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm ">Completed</p>
                    <p className="text-2xl font-bold text-blue-600">{todaySummary.completed}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">{todaySummary.cancelled}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Earnings</p>
                    <p className="text-2xl font-bold text-green-600">{todaySummary.earnings}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-sm">Avg Time</p>
                    <p className="text-2xl font-bold text-black-600">{todaySummary.avgTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Logs Card */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-2 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Task Logs</h2>
                  
                  {/* Date Range Picker - Responsive Layout */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mr-20 mb-6">
                    <div className="relative w-full sm:w-auto">
                      <span className="text-gray-600 font-medium text-sm sm:text-base mr-2">From:</span>
                      <input
                        type="text"
                        value={formatDate(dateRange.from)}
                        onClick={() => setShowDatePicker(showDatePicker === 'from' ? null : 'from')}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full sm:w-32 cursor-pointer hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        readOnly
                      />
                      {showDatePicker === 'from' && <DatePicker type="from" />}
                    </div>
                    <div className="relative w-full sm:w-auto">
                      <span className="text-gray-600 font-medium text-sm sm:text-base mr-2">To:</span>
                      <input
                        type="text"
                        value={formatDate(dateRange.to)}
                        onClick={() => setShowDatePicker(showDatePicker === 'to' ? null : 'to')}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full sm:w-32 cursor-pointer hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                        readOnly
                      />
                      {showDatePicker === 'to' && <DatePicker type="to" />}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {taskLogs.map((log, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.completed}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{log.cancelled}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{log.earnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgentDeliveryDash;