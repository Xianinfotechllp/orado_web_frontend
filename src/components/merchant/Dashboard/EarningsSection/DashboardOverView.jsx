// DashboardOverView.jsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Filter,
  Calendar,
  PieChart,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getRestaurantEarningSummary } from "../../../../apis/restaurantApi";
import RestaurantSlider from "../Slider/RestaurantSlider";

const filterOptions = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  // { value: "year", label: "This Year" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardOverView = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const handleRestaurantSelect = (restaurant, index) => {
    if (!restaurant || !restaurant.id) {
      console.error("Invalid restaurant selection:", restaurant);
      return;
    }
    setRestaurantId(restaurant.id);
    // Reset data when restaurant changes
    setSummaryData(null);
    setRawData([]);
    setBreakdownData([]);
  };

  const handleRestaurantsLoad = (loadedRestaurants) => {
    setRestaurants(loadedRestaurants);
    if (loadedRestaurants.length > 0 && !restaurantId) {
      setRestaurantId(loadedRestaurants[0].id);
    }
  };

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!restaurantId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getRestaurantEarningSummary(
          restaurantId,
          selectedFilter
        );
        setSummaryData(response.summary);
        setRawData(response.data);

        // Prepare breakdown data based on time frame
        if (selectedFilter === "year" && response.summary.monthlyBreakdown) {
          setBreakdownData(
            response.summary.monthlyBreakdown.map((item) => ({
              name: new Date(2023, item.month - 1).toLocaleString("default", {
                month: "short",
              }),
              value: item.totalNetEarnings,
            }))
          ); // Added missing closing parentheses here
        } else if (
          selectedFilter === "month" &&
          response.summary.dailyBreakdown
        ) {
          setBreakdownData(
            response.summary.dailyBreakdown.map((item) => ({
              name: `Day ${item.day}`,
              value: item.totalNetEarnings,
            }))
          );
        } else if (
          selectedFilter === "week" &&
          response.summary.weeklyBreakdown
        ) {
          setBreakdownData(
            response.summary.weeklyBreakdown.map((item) => ({
              name: `Day ${item.dayOfWeek}`,
              value: item.totalNetEarnings,
            }))
          ); // Added missing closing parentheses here
        } else {
          setBreakdownData([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch earnings data");
        console.error("Error in fetchEarningsData:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningsData();
  }, [restaurantId, selectedFilter]);

  // Helper function to render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Helper function to render error state
  const renderError = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Restaurant Selection Slider */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
        className="mb-6"
      />

      {!restaurantId ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Please select a restaurant to view earnings data
          </p>
        </div>
      ) : (
        <>
          {/* Filter Controls */}
          <div className="flex justify-end">
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {filterOptions.find((f) => f.value === selectedFilter)?.label ||
                  "All Time"}
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 font-medium border-b">
                    Filter by Time Period
                  </div>
                  <div className="border-b"></div>
                  <div className="py-1">
                    {filterOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                          selectedFilter === option.value ? "bg-gray-100" : ""
                        }`}
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : !summaryData ? (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No earnings data available for the selected time period
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Earnings Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Amount</p>
                        <p className="text-3xl font-bold">
                          ₹{summaryData.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm mt-1 text-blue-200">
                          {summaryData.totalOrders} orders
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                </div>

                {/* Net Earnings Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Net Earnings</p>
                        <p className="text-3xl font-bold">
                          ₹{summaryData.totalNetEarnings.toLocaleString()}
                        </p>
                        <p className="text-sm mt-1 text-green-200">
                          After commissions
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                </div>

                {/* Commission Card */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Total Commission</p>
                        <p className="text-3xl font-bold">
                          ₹{summaryData.totalCommission.toLocaleString()}
                        </p>
                        <p className="text-sm mt-1 text-purple-200">
                          Avg {summaryData.averageCommissionRate}%
                        </p>
                      </div>
                      <CreditCard className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Payout Status Card */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Payout Status</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(
                            summaryData.payoutStatusCounts || {}
                          ).map(([status, count]) => (
                            <span
                              key={status}
                              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded"
                            >
                              {status}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                      <PieChart className="w-8 h-8 text-orange-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings Breakdown Chart */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <BarChart2 className="w-5 h-5" />
                      {selectedFilter
                        ? `${
                            filterOptions.find(
                              (f) => f.value === selectedFilter
                            )?.label
                          } Earnings`
                        : "Total Earnings Breakdown"}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {breakdownData.length > 0 ? (
                          <BarChart data={breakdownData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [
                                `₹${value.toLocaleString()}`,
                                "Earnings",
                              ]}
                            />
                            <Bar
                              dataKey="value"
                              fill="#4f46e5"
                              radius={4}
                              name="Net Earnings"
                            />
                          </BarChart>
                        ) : (
                          <RechartsPieChart>
                            <Pie
                              data={[
                                {
                                  name: "Total Amount",
                                  value: summaryData.totalAmount,
                                },
                                {
                                  name: "Net Earnings",
                                  value: summaryData.totalNetEarnings,
                                },
                                {
                                  name: "Commission",
                                  value: summaryData.totalCommission,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {COLORS.map((color, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                `₹${value.toLocaleString()}`,
                              ]}
                            />
                            <Legend />
                          </RechartsPieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Time Series Chart */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {selectedFilter
                        ? `${
                            filterOptions.find(
                              (f) => f.value === selectedFilter
                            )?.label
                          } Trend`
                        : "Earnings Trend"}
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        {breakdownData.length > 0 ? (
                          <LineChart data={breakdownData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [
                                `₹${value.toLocaleString()}`,
                                "Net Earnings",
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#4f46e5"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                              name="Net Earnings"
                            />
                          </LineChart>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            Select a time period to view trend data
                          </div>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="font-semibold text-lg">
                    Additional Statistics
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-500">
                      Commission Types
                    </h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Percentage: {summaryData.percentageCommissionOrders}{" "}
                        orders
                      </p>
                      <p className="text-sm">
                        Fixed: {summaryData.fixedCommissionOrders} orders
                      </p>
                    </div>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-500">
                      Average Values
                    </h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Avg Order Value: ₹
                        {(
                          summaryData.totalAmount / summaryData.totalOrders
                        ).toFixed(2)}
                      </p>
                      <p className="text-sm">
                        Avg Commission Rate: {summaryData.averageCommissionRate}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h4 className="font-medium text-gray-500">Time Period</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        Showing:{" "}
                        {filterOptions.find((f) => f.value === selectedFilter)
                          ?.label || "All Time"}
                      </p>
                      <p className="text-sm">
                        Currency: {summaryData.currency || "INR"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardOverView;
