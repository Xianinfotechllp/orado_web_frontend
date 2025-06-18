import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, TrendingUp, Calendar, ChevronDown } from 'lucide-react';
import RestaurantEarningSummary from './RestaurantEarningSummary';

const RestaurantEarningsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [earningsData, setEarningsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showTimeFilterDropdown, setShowTimeFilterDropdown] = useState(false);
  const itemsPerPage = 10;
  const token = sessionStorage.getItem('adminToken');

  const timeFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true); 
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          ...(selectedRestaurant ? { restaurantId: selectedRestaurant } : {}),
          ...(timeFilter !== 'all' ? { period: timeFilter } : {}),
        };
        console.log("Params:", params);

        const response = await axios.get('http://localhost:5000/restaurants/6836c9a9451788eb5e4e9e0d/earnings', {
          params,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('earning', response.data)
        setEarningsData(response.data.data);
      } catch (err) {
        console.error("Error fetching earnings:", err.response ? err.response.data : err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEarnings();
  }, [currentPage, timeFilter]);

  const handleViewSummary = async (restaurantId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/restaurants/${restaurantId}/earnings/summary`,
        {
          params: {
            timeFrame: timeFilter === 'all' ? undefined : timeFilter
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setSummaryData(response.data.summary);
      setSelectedRestaurant(restaurantId);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setShowTimeFilterDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading && !earningsData.length) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
      <p className="text-red-600 font-medium">Error: {error}</p>
    </div>
  );

  if (selectedRestaurant && summaryData) {
    return (
      <div className="mt-8">
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium mb-6 transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          Back to Table
        </button>
        <RestaurantEarningSummary 
          summary={summaryData}
          currency="INR"
          timeFilter={timeFilter}
        />
      </div>
    );
  }

  const totalPages = Math.ceil(earningsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = earningsData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light flex items-center gap-3 tracking-wide">
            <TrendingUp className="w-7 h-7" />
            Restaurant Earnings Overview
          </h2>
          
          <div className="relative">
            <button
              onClick={() => setShowTimeFilterDropdown(!showTimeFilterDropdown)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all duration-200"
            >
              <Calendar className="w-5 h-5" />
              <span>
                {timeFilterOptions.find(opt => opt.value === timeFilter)?.label || 'Filter'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTimeFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showTimeFilterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 border border-gray-100 overflow-hidden">
                {timeFilterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeFilterChange(option.value)}
                    className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors duration-200 flex items-center gap-2 ${
                      timeFilter === option.value ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-50 border-b border-orange-100">
            <tr>
              <th className="text-left p-6 font-medium text-orange-900 tracking-wide">Restaurant Name</th>
              <th className="text-right p-6 font-medium text-orange-900 tracking-wide">Order Amount</th>
              <th className="text-right p-6 font-medium text-orange-900 tracking-wide">Commission</th>
              <th className="text-right p-6 font-medium text-orange-900 tracking-wide">Net Revenue</th>
              <th className="text-center p-6 font-medium text-orange-900 tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((restaurant, index) => (
              <tr 
                key={restaurant.id || index} 
                className="border-b border-gray-50 hover:bg-orange-25 transition-all duration-200 hover:shadow-sm"
              >
                <td className="p-6 font-medium text-gray-900">{restaurant.restaurantName}</td>
                <td className="p-6 text-right text-gray-700 font-light">{formatCurrency(restaurant.orderAmount)}</td>
                <td className="p-6 text-right text-gray-700 font-light">{formatCurrency(restaurant.commissionAmount)}</td>
                <td className="p-6 text-right font-medium text-green-600">{formatCurrency(restaurant.netRevenue)}</td>
                <td className="p-6 text-center">
                  <button
                    onClick={() => handleViewSummary(restaurant.restaurantId)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white text-sm font-medium rounded-2xl hover:bg-orange-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-30 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Eye className="w-4 h-4" />
                    View Summary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="bg-orange-25 px-8 py-6 border-t border-orange-100 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium tracking-wide">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, earningsData.length)} of {earningsData.length} restaurants
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:shadow-sm"
            >
              Previous
            </button>
            <span className="px-6 py-2 text-sm text-gray-600 bg-white rounded-xl border border-gray-200 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-6 py-2 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium hover:shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantEarningsTable;