import React, { useState } from 'react';
import { 
  FaRupeeSign, FaWallet, FaCalendarDay, FaCalendarWeek, 
  FaCalendarAlt, FaHistory, FaArrowUp, FaMotorcycle, 
  FaMedal, FaMoneyBillWave, FaBolt, FaClipboardList,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { Calendar, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const AgentEarningsDash = () => {
  // Dummy data
  const earningsData = {
    today: 2450,
    thisWeek: 12800,
    thisMonth: 45200,
    lifetime: 218500
  };

  // Date picker state (updated to match first component)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7))
  });
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Format date for display (updated to match first component)
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Earnings breakdown data
  const earningsBreakdown = {
    deliveryFee: 220.0,
    incentives: 80.0,
    tips: 40.0,
    surgeFee: 40.0,
    total: 340.0
  };

  // Table data with pagination
  const tableData = [
    { id: 10001, deliveryFee: 50, tip: 10, incentive: 20, surge: 15, total: 95 },
    { id: 10002, deliveryFee: 55, tip: 15, incentive: 25, surge: 10, total: 105 },
    { id: 10003, deliveryFee: 60, tip: 20, incentive: 30, surge: 20, total: 130 },
    { id: 10004, deliveryFee: 45, tip: 10, incentive: 15, surge: 5, total: 75 },
    { id: 10005, deliveryFee: 70, tip: 25, incentive: 35, surge: 10, total: 140 },
    { id: 10006, deliveryFee: 65, tip: 15, incentive: 20, surge: 10, total: 110 },
    { id: 10007, deliveryFee: 50, tip: 10, incentive: 20, surge: 15, total: 95 },
    { id: 10008, deliveryFee: 55, tip: 15, incentive: 25, surge: 10, total: 105 },
    { id: 10009, deliveryFee: 60, tip: 20, incentive: 30, surge: 20, total: 130 },
    { id: 10010, deliveryFee: 45, tip: 10, incentive: 15, surge: 5, total: 75 },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const totalPages = Math.ceil(tableData.length / recordsPerPage);
  const currentRecords = tableData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const earningsCards = [
    {
      title: "Today's Earnings",
      amount: earningsData.today,
      icon: FaCalendarDay,
      gradient: "from-orange-400 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "+12%",
      trendColor: "text-green-600"
    },
    {
      title: "This Week",
      amount: earningsData.thisWeek,
      icon: FaCalendarWeek,
      gradient: "from-blue-400 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+8%",
      trendColor: "text-green-600"
    },
    {
      title: "This Month",
      amount: earningsData.thisMonth,
      icon: FaCalendarAlt,
      gradient: "from-purple-400 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+15%",
      trendColor: "text-green-600"
    },
    {
      title: "Lifetime",
      amount: earningsData.lifetime,
      icon: FaHistory,
      gradient: "from-green-400 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+25%",
      trendColor: "text-green-600"
    }
  ];

  // DatePicker component (copied from first component)
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 pt-6 pb-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-full transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-full transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <FaWallet className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Earnings</h1>
                  <p className="text-gray-600 text-lg">Track Earnings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {earningsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${card.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer border border-white/50 overflow-hidden`}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Card content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${card.iconBg} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`${card.iconColor} text-lg`} />
                    </div>
                    <div className={`flex items-center space-x-1 ${card.trendColor} bg-white/80 px-2 py-1 rounded-full text-xs font-semibold`}>
                      <FaArrowUp className="text-xs" />
                      <span>{card.trend}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-gray-700 font-medium text-sm mb-3 group-hover:text-gray-800 transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  <div className="flex items-center space-x-1">
                    <FaRupeeSign className="text-gray-700 text-lg group-hover:text-gray-800 transition-colors duration-300" />
                    <span className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {card.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Animated bottom bar */}
                  <div className="mt-4 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${card.gradient} rounded-full transform translate-x-0 group-hover:translate-x-full transition-transform duration-1000`}
                      style={{ width: '60%' }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* New Detailed Earnings Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Earnings Breakdown</h2>
            
            {/* Updated Date Range Picker (from first component) */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
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

          {/* Earnings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaMotorcycle className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Delivery Fee</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {earningsBreakdown.deliveryFee.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaMedal className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Incentives</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {earningsBreakdown.incentives.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaMoneyBillWave className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tips Received</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {earningsBreakdown.tips.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaBolt className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Surge Fee</p>
                <p className="text-gray-800 font-semibold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {earningsBreakdown.surgeFee.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 mb-8 flex justify-between items-center border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaWallet className="text-orange-600 text-xl" />
              </div>
              <p className="text-gray-700 font-medium">Total Earnings</p>
            </div>
            <p className="text-orange-600 font-bold text-xl flex items-center">
              <FaRupeeSign className="mr-1" />
              {earningsBreakdown.total.toFixed(2)}
            </p>
          </div>

          {/* Detailed Breakdown */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaClipboardList className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Detailed Breakdown</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incentive</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-xs" />
                          {row.deliveryFee}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-xs" />
                          {row.tip}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-xs" />
                          {row.incentive}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-xs" />
                          {row.surge}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          <FaRupeeSign className="mr-1 text-xs" />
                          {row.total}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, tableData.length)} of {tableData.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              >
                <FaChevronLeft />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentEarningsDash;