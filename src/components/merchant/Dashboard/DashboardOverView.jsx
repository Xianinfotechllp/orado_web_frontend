import React from 'react';
import { DollarSign, TrendingUp, ShoppingBag, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const dailyEarnings = [
  { day: 'Mon', earnings: 1200 },
  { day: 'Tue', earnings: 1800 },
  { day: 'Wed', earnings: 1500 },
  { day: 'Thu', earnings: 2200 },
  { day: 'Fri', earnings: 2800 },
  { day: 'Sat', earnings: 3200 },
  { day: 'Sun', earnings: 2900 },
];

const monthlyProfit = [
  { month: 'Jan', profit: 15000 },
  { month: 'Feb', profit: 18000 },
  { month: 'Mar', profit: 22000 },
  { month: 'Apr', profit: 25000 },
  { month: 'May', profit: 28000 },
  { month: 'Jun', profit: 32000 },
];
const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Today's Earnings</p>
                <p className="text-3xl font-bold">₹3,240</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Monthly Profit</p>
                <p className="text-3xl font-bold">₹32,000</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Orders</p>
                <p className="text-3xl font-bold">1,248</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Active Customers</p>
                <p className="text-3xl font-bold">842</p>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Daily Earnings</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyEarnings}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#f97316" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Monthly Profit Trend</h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProfit}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="profit" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;