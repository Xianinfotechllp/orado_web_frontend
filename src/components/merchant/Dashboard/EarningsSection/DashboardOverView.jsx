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
import RestaurantSlider from "../Slider/RestaurantSlider";
import apiClient from "../../../../apis/apiClient/apiClient";

const filterOptions = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const DashboardOverView = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalCartTotal: 0,
    totalOrderAmount: 0,
    totalNetRevenue: 0,
    totalCommission: 0,
    orderCount: 0,
  });
  const [ordersData, setOrdersData] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  const handleRestaurantSelect = (restaurant) => {
    if (!restaurant || !restaurant.id) {
      console.error("Invalid restaurant selection:", restaurant);
      return;
    }
    setRestaurantId(restaurant.id);
    setSummaryData({
      totalCartTotal: 0,
      totalOrderAmount: 0,
      totalNetRevenue: 0,
      totalCommission: 0,
      orderCount: 0,
    });
    setOrdersData([]);
    setPaymentStats([]);
  };

  const handleRestaurantsLoad = (loadedRestaurants) => {
    setRestaurants(loadedRestaurants);
    if (loadedRestaurants.length > 0 && !restaurantId) {
      setRestaurantId(loadedRestaurants[0].id);
    }
  };

  const getRestaurantEarningSummary = async (restaurantId, timeFrame = "") => {
    try {
      let startDate, endDate;
      const now = new Date();

      if (timeFrame === "today") {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
      } else if (timeFrame === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = startOfWeek;
        endDate = now;
      } else if (timeFrame === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
      }

      const response = await apiClient.get(
        `/restaurants/${restaurantId}/earningsv2`,
        {
          params: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            page: 1,
            limit: 1000,
          },
        }
      );

      const { summary, paymentSummary, orders } = response.data;

      return {
        summary: {
          totalCartTotal: summary?.totalCartTotal || 0,
          totalOrderAmount: summary?.totalOrderAmount || 0,
          totalNetRevenue: summary?.totalNetRevenue || 0,
          totalCommission: summary?.totalCommission || 0,
          orderCount: summary?.orderCount || 0,
        },
        paymentSummary: paymentSummary || [],
        orders: orders?.docs || [],
      };
    } catch (error) {
      console.error("Error fetching restaurant earnings:", error);
      throw error;
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
        setOrdersData(response.orders);
        setPaymentStats(response.paymentSummary);
      } catch (err) {
        console.error("Error in fetchEarningsData:", err);
        setError(err.message || "Failed to fetch earnings data");
        setSummaryData({
          totalCartTotal: 0,
          totalOrderAmount: 0,
          totalNetRevenue: 0,
          totalCommission: 0,
          orderCount: 0,
        });
        setOrdersData([]);
        setPaymentStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningsData();
  }, [restaurantId, selectedFilter]);

  const renderLoading = () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

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

  const prepareChartData = () => {
    if (!ordersData || ordersData.length === 0) return [];

    const groupedData = ordersData.reduce((acc, order) => {
      if (!order || !order.orderTime) return acc;

      const date = new Date(order.orderTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          name: date,
          totalAmount: 0,
          totalCartTotal: 0,
          netEarnings: 0,
          commission: 0,
          orderCount: 0,
        };
      }
      acc[date].totalAmount += order.totalAmount || 0;
      acc[date].totalCartTotal += order.cartTotal || 0;
      acc[date].netEarnings += order.restaurantNetEarning || 0;
      acc[date].commission += order.commissionAmount || 0;
      acc[date].orderCount += 1;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const chartData = prepareChartData();
  const avgOrderValue =
    summaryData.orderCount > 0
      ? (summaryData.totalOrderAmount / summaryData.orderCount).toFixed(2)
      : "0.00";

  const avgCommissionRate =
    summaryData.orderCount > 0
      ? (
          (summaryData.totalCommission / summaryData.totalOrderAmount) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-6 p-4 ">
      {/* Restaurant Selection Slider */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
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
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-screen-md px-4 py-3 ">
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="p-[2px] rounded-full bg-gradient-to-r from-gray-800 via-gray-500 to-gray-950 shadow-lg">
                  <div className="bg-white rounded-full p-1">
                    <div
                      className="inline-flex rounded-full bg-gray-100 p-1"
                      role="group"
                    >
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSelectedFilter(option.value);
                            if (option.value === "custom") {
                              // Add your custom date picker logic here if needed
                            }
                          }}
                          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                            selectedFilter === option.value
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* If you need the custom date picker functionality */}
                {selectedFilter === "custom" && (
                  <div className="absolute right-0 bottom-full mb-2 w-64 bg-white border rounded-md shadow-lg z-50 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <label className="mr-2 text-xs font-medium text-gray-600">
                          From:
                        </label>
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="border border-gray-300 rounded px-2 py-1 text-xs w-24"
                          dateFormat="MM/dd"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="mr-2 text-xs font-medium text-gray-600">
                          To:
                        </label>
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          className="border border-gray-300 rounded px-2 py-1 text-xs w-24"
                          dateFormat="MM/dd"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Cart Value Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200  ">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Gross Revenue</p>
                      <p className="text-2xl font-bold">
                        ₹{summaryData.totalCartTotal.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {summaryData.orderCount} orders
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Net Revenue Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Net Revenue</p>
                      <p className="text-2xl font-bold">
                        ₹{summaryData.totalNetRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        After commissions
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Commission Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Commission</p>
                      <p className="text-2xl font-bold">
                        ₹{summaryData.totalCommission.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Avg {avgCommissionRate}%
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Card */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Payment Methods</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {paymentStats.length > 0 ? (
                          paymentStats.slice(0, 3).map((stat) => (
                            <span
                              key={stat._id}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {stat._id || "Unknown"}: {stat.count}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">No data</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <PieChart className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Earnings Breakdown Chart */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <h3 className="font-medium flex items-center gap-2 text-sm mb-4">
                    <BarChart2 className="w-4 h-4" />
                    Earnings Breakdown
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartData.length > 0 ? (
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                            ]}
                          />
                          <Bar
                            dataKey="totalCartTotal"
                            fill="#4f46e5"
                            radius={4}
                            name="Total Cart Value"
                          />
                          <Bar
                            dataKey="netEarnings"
                            fill="#10b981"
                            radius={4}
                            name="Net Earnings"
                          />
                        </BarChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No data available
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Time Series Chart */}
                <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
                  <h3 className="font-medium flex items-center gap-2 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    Earnings Trend
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartData.length > 0 ? (
                        <LineChart data={chartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="totalCartTotal"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            name="Total Cart Value"
                          />
                          <Line
                            type="monotone"
                            dataKey="netEarnings"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Net Earnings"
                          />
                        </LineChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No data available
                        </div>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 mt-4">
                <h3 className="font-medium text-sm mb-4">
                  Additional Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-2">
                      PAYMENT METHODS
                    </h4>
                    <div className="space-y-1">
                      {paymentStats.length > 0 ? (
                        paymentStats.map((stat) => (
                          <div
                            key={stat._id}
                            className="flex justify-between text-sm"
                          >
                            <span>{stat._id || "Unknown"}</span>
                            <span>{stat.count} orders</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No payment data</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-2">
                      AVERAGE VALUES
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Order Value</span>
                        <span>₹{avgOrderValue}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Commission Rate</span>
                        <span>{avgCommissionRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-500 mb-2">TIME PERIOD</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Showing</span>
                        <span>
                          {filterOptions.find((f) => f.value === selectedFilter)
                            ?.label || "All Time"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Currency</span>
                        <span>INR</span>
                      </div>
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
