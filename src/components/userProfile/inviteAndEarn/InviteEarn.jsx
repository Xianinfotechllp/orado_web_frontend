import React, { useState } from 'react';
import { Copy, Users, Gift, Share2, Check } from 'lucide-react';

const InviteEarn = () => {
  const [activeTab, setActiveTab] = useState('invite');
  const [copied, setCopied] = useState(false);
  
  const inviteLink = 'https://fooddelivery.com/invite/ABC123XYZ';
  const inviteCode = 'FOOD100';
  
  const referralData = [
    { name: 'John Doe', email: 'john@example.com', status: 'Completed', earnings: '₹100', joinDate: '2024-01-15' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', earnings: '₹0', joinDate: '2024-01-14' },
    { name: 'Mike Johnson', email: 'mike@example.com', status: 'Completed', earnings: '₹100', joinDate: '2024-01-13' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Completed', earnings: '₹100', joinDate: '2024-01-12' },
    { name: 'Alex Brown', email: 'alex@example.com', status: 'Pending', earnings: '₹0', joinDate: '2024-01-11' },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-orange-600">FoodDelivery</h1>
              </div> */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('invite')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'invite'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4" />
                    <span>Invite & Earn</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'referrals'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>My Referrals</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="bg-orange-100 px-4 py-2 rounded-full">
                <span className="text-orange-600 font-semibold">Wallet: ₹350</span>
              </div> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'invite' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold">Invite & Earn ₹100</h2>
                    <p className="text-xl text-orange-100">
                      Invite friends and earn ₹100 in your wallet for each successful referral!
                    </p>
                    <div className="flex items-center space-x-4 text-orange-100">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5" />
                        <span>₹100 for you</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>₹50 for your friend</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <Share2 className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Invite Link */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Share Your Invite Link</h3>
                  <p className="text-gray-600">Share this link with your friends to earn rewards</p>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 bg-transparent text-gray-700 text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(inviteLink)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Invite Code */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Share Your Invite Code</h3>
                  <p className="text-gray-600">Your friends can use this code during signup</p>
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border">
                    <div className="flex-1">
                      <span className="text-2xl font-bold text-orange-600 tracking-wider">{inviteCode}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(inviteCode)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-orange-600 font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Share</h4>
                  <p className="text-gray-600 text-sm">Share your invite link or code with friends</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-orange-600 font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Sign Up</h4>
                  <p className="text-gray-600 text-sm">Your friend signs up using your invite</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-orange-600 font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Earn</h4>
                  <p className="text-gray-600 text-sm">Get ₹100 when they complete their first order</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Referrals</p>
                    <p className="text-2xl font-bold text-gray-800">{referralData.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Successful</p>
                    <p className="text-2xl font-bold text-green-600">
                      {referralData.filter(r => r.status === 'Completed').length}
                    </p>
                  </div>
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {referralData.filter(r => r.status === 'Pending').length}
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Earned</p>
                    <p className="text-2xl font-bold text-orange-600">₹300</p>
                  </div>
                  <Gift className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Referrals Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">My Referrals</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referralData.map((referral, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{referral.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{referral.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            referral.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            referral.status === 'Completed' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {referral.earnings}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {referral.joinDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteEarn;