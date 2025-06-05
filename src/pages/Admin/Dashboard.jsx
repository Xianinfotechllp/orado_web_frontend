import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import {
  FiUsers, FiHome, FiDollarSign, FiActivity, FiShoppingBag
} from "react-icons/fi";

// Mock Data
const statData = [
  {
    title: "Total Users",
    value: "2,453",
    change: "12.5%",
    isPositive: true,
    icon: <FiUsers size={22} />,
  },
  {
    title: "Total Restaurants",
    value: "324",
    change: "8.2%",
    isPositive: true,
    icon: <FiHome size={22} />,
  },
  {
    title: "Total Revenue",
    value: "₹1,24,500",
    change: "5.7%",
    isPositive: true,
    icon: <FiDollarSign size={22} />,
  },
  {
    title: "Active Orders",
    value: "56",
    change: "3.1%",
    isPositive: false,
    icon: <FiActivity size={22} />,
  },
];

const salesData = [
  { day: "Mon", sales: 500 },
  { day: "Tue", sales: 1000 },
  { day: "Wed", sales: 750 },
  { day: "Thu", sales: 1200 },
  { day: "Fri", sales: 900 },
  { day: "Sat", sales: 1500 },
  { day: "Sun", sales: 1300 },
];

const activityData = [
  { date: "01", activity: 400 },
  { date: "02", activity: 800 },
  { date: "03", activity: 650 },
  { date: "04", activity: 1100 },
  { date: "05", activity: 900 },
  { date: "06", activity: 1000 },
];

const recentOrders = [
  { id: 1001, restaurant: "Burger Haven", amount: 450, status: "Completed" },
  { id: 1002, restaurant: "Spice Villa", amount: 320, status: "Pending" },
  { id: 1003, restaurant: "Ocean Grill", amount: 650, status: "Completed" },
  { id: 1004, restaurant: "Pizza Planet", amount: 280, status: "Pending" },
];

const topRestaurants = [
  { name: "Grill House", revenue: 4500 },
  { name: "Tandoori Nights", revenue: 4200 },
  { name: "Pizza Stop", revenue: 3900 },
  { name: "Seafood Bay", revenue: 3500 },
];

const StatCard = ({ icon, title, value, change, isPositive }) => (
  <div className="bg-white hover:shadow-xl transition duration-300 shadow rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
    <div className={`p-3 rounded-xl ${isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 tracking-wide">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
      <p className={`text-xs mt-1 font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {change} {isPositive ? "↑" : "↓"} this week
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8 max-w-[1500px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Sales Overview</h2>
            <select className="text-sm border border-gray-300 rounded px-3 py-1 bg-white">
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#FC8019" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Restaurants */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Restaurants</h2>
          <div className="space-y-5">
            {topRestaurants.map((rest, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{rest.name}</p>
                  <span className="text-sm text-gray-500">₹{rest.revenue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(rest.revenue / 4500) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <FiShoppingBag className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">#{order.id}</p>
                    <p className="text-sm text-gray-500">{order.restaurant}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">₹{order.amount}</p>
                  <p className={`text-xs font-semibold ${order.status === "Completed" ? "text-green-600" : "text-red-500"}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">User Activity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FC8019" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FC8019" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="#FC8019"
                fillOpacity={1}
                fill="url(#colorAct)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
