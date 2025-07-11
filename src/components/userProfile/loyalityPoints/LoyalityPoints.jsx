import React, { useState } from 'react';
import { ChevronRight, Gift, Clock, CheckCircle, XCircle } from 'lucide-react';

const LoyaltyPoints = () => {
  const [activeTab, setActiveTab] = useState('points');

  // Dummy data - easily replaceable with API data
  const loyaltyData = {
    availablePoints: 120,
    earnPoints: {
      amount: 10,
      minPurchase: 200.00
    },
    redeemPoints: {
      points: 2,
      value: 50.00,
      minOrder: 5.00
    },
    conditions: [
      { id: 1, text: "Minimum Order amount required for using Loyalty Points is $ 5.00." },
      { id: 2, text: "Minimum Order amount for Earning Loyalty Points is $ 10.00." },
      { id: 3, text: "Loyalty Points will expire after 7 Days." },
      { id: 4, text: "Maximum 20 Loyalty Points can be earned per Order." },
      { id: 5, text: "Maximum 10% of cart value can be paid with Loyalty Points." },
      { id: 6, text: "Loyalty usage will be applicable with other offers." },
      { id: 7, text: "All items & conditions are subject to change without prior information." }
    ],
    history: [
      { id: 25615006, type: 'earned', points: 20, date: 'Jul 10 2025, 03:02 PM' },
      { id: 25595482, type: 'used', points: -2, date: 'Jul 08 2025, 10:21 PM' },
      { id: 25577764, type: 'earned', points: 20, date: 'Jul 07 2025, 11:20 AM' },
      { id: 25577751, type: 'earned', points: 20, date: 'Jul 07 2025, 11:17 AM' },
      { id: 25577708, type: 'earned', points: 20, date: 'Jul 07 2025, 11:09 AM' },
      { id: 25475297, type: 'earned', points: 20, date: 'Jul 05 2025, 08:01 AM' },
      { id: 25491241, type: 'earned', points: 20, date: 'Jul 05 2025, 08:01 AM' },
      { id: 25511785, type: 'earned', points: 20, date: 'Jul 02 2025, 09:41 AM' }
    ]
  };

  const tabs = [
    { id: 'points', label: 'Loyalty Points', icon: Gift },
    { id: 'conditions', label: 'Rewards & Conditions', icon: CheckCircle },
    { id: 'history', label: 'History', icon: Clock }
  ];

  const renderPointsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Points */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {loyaltyData.availablePoints}
            </div>
            <div className="text-gray-600 text-sm">Available Points</div>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Earn Points */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              Get {loyaltyData.earnPoints.amount}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Loyalty Points on purchase of <span className="font-semibold">${loyaltyData.earnPoints.minPurchase}</span>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redeem Points */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800 mb-2">
              {loyaltyData.redeemPoints.points} Loyalty Points = ${loyaltyData.redeemPoints.value}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Use these Loyalty Points on your next Order
            </div>
            <div className="mt-4 flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <div className="text-2xl">💰</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Redeem Points</div>
                <div className="text-sm text-gray-600">Use your points now</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-800">Earn More</div>
                <div className="text-sm text-gray-600">Start shopping</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderConditionsTab = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reward Conditions</h2>
      <div className="space-y-4">
        {loyaltyData.conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{condition.text}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Points</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loyaltyData.history.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {transaction.type === 'earned' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium text-gray-800">{transaction.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700 capitalize">{transaction.type} by</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'points' && renderPointsTab()}
        {activeTab === 'conditions' && renderConditionsTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  );
};

export default LoyaltyPoints;