import React, { useState } from 'react';
import { Eye, Phone, Mail, MapPin, Wallet, Star, X, Shield, UserCheck } from 'lucide-react';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dummy data based on the schema
  const users = [
    {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      userType: 'customer',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      walletBalance: 1250.75,
      loyaltyPoints: 2340,
      totalSpending: 12450.50,
      active: true,
      verification: {
        emailVerified: true,
        phoneVerified: true
      },
      addresses: [
        {
          type: 'Home',
          displayName: 'Home',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001'
        }
      ],
      lastActivity: new Date('2024-01-15'),
      createdAt: new Date('2023-06-15')
    },
    {
      _id: '507f1f77bcf86cd799439012',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0124',
      userType: 'customer',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      walletBalance: 890.25,
      loyaltyPoints: 1850,
      totalSpending: 8920.75,
      active: true,
      verification: {
        emailVerified: true,
        phoneVerified: false
      },
      addresses: [
        {
          type: 'Work',
          displayName: 'Office',
          street: '456 Business Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210'
        }
      ],
      lastActivity: new Date('2024-01-14'),
      createdAt: new Date('2023-08-20')
    },
    {
      _id: '507f1f77bcf86cd799439013',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-0125',
      userType: 'merchant',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      walletBalance: 3240.80,
      loyaltyPoints: 980,
      totalSpending: 15670.25,
      active: true,
      verification: {
        emailVerified: true,
        phoneVerified: true
      },
      addresses: [
        {
          type: 'Other',
          displayName: 'Restaurant Location',
          street: '789 Food Court',
          city: 'Chicago',
          state: 'IL',
          zip: '60601'
        }
      ],
      lastActivity: new Date('2024-01-16'),
      createdAt: new Date('2023-04-10')
    },
    {
      _id: '507f1f77bcf86cd799439014',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0126',
      userType: 'agent',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      walletBalance: 567.40,
      loyaltyPoints: 1200,
      totalSpending: 4320.90,
      active: true,
      isAgent: true,
      agentApplicationStatus: 'approved',
      verification: {
        emailVerified: true,
        phoneVerified: true
      },
      addresses: [
        {
          type: 'Home',
          displayName: 'Residence',
          street: '321 Agent Lane',
          city: 'Miami',
          state: 'FL',
          zip: '33101'
        }
      ],
      lastActivity: new Date('2024-01-13'),
      createdAt: new Date('2023-09-05')
    },
    {
      _id: '507f1f77bcf86cd799439015',
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '+1-555-0127',
      userType: 'customer',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      walletBalance: 2100.60,
      loyaltyPoints: 3200,
      totalSpending: 18750.30,
      active: false,
      verification: {
        emailVerified: false,
        phoneVerified: true
      },
      addresses: [
        {
          type: 'Home',
          displayName: 'Home Address',
          street: '654 Sunset Blvd',
          city: 'Phoenix',
          state: 'AZ',
          zip: '85001'
        }
      ],
      lastActivity: new Date('2024-01-10'),
      createdAt: new Date('2023-03-22')
    }
  ].sort((a, b) => b.totalSpending - a.totalSpending); // Sort by total spending (top spender first)

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const getUserTypeColor = (userType) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      merchant: 'bg-green-100 text-green-800',
      agent: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return colors[userType] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-orange-500 text-white p-6">
        <h1 className="text-3xl font-bold">User Management Dashboard</h1>
        <p className="text-orange-100 mt-2">Manage and monitor all platform users</p>
      </div>

      {/* Stats Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-orange-600">{users.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <UserCheck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-orange-600">{users.filter(u => u.active).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Top Spender</p>
            <p className="text-lg font-bold text-orange-600">{formatCurrency(users[0]?.totalSpending || 0)}</p>
          </div>
        </div>

        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm">
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-lg font-bold text-orange-600">
              {formatCurrency(users.reduce((sum, user) => sum + user.totalSpending, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
          <div className="bg-orange-500 text-white px-6 py-4">
            <h2 className="text-xl font-semibold">Users (Sorted by Total Spending)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Total Spending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Wallet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-orange-100">
                {users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-orange-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={user.profilePicture} 
                          alt={user.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {user.name}
                            {index === 0 && <Star className="w-4 h-4 text-orange-500 ml-2" />}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.userType)}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(user.totalSpending)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(user.walletBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bgOp flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold">User Details</h3>
              <button
                onClick={closeModal}
                className="hover:bg-orange-600 p-2 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Profile Section */}
              <div className="flex items-center mb-6">
                <img 
                  className="h-20 w-20 rounded-full object-cover" 
                  src={selectedUser.profilePicture} 
                  alt={selectedUser.name}
                />
                <div className="ml-6">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getUserTypeColor(selectedUser.userType)} mt-2`}>
                    {selectedUser.userType}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-3">Contact Information</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-orange-600 mr-3" />
                      <span className="text-sm">{selectedUser.email}</span>
                      {selectedUser.verification.emailVerified && 
                        <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                      }
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-orange-600 mr-3" />
                      <span className="text-sm">{selectedUser.phone}</span>
                      {selectedUser.verification.phoneVerified && 
                        <span className="ml-2 text-green-600 text-xs">✓ Verified</span>
                      }
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-3">Financial Information</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Wallet className="w-4 h-4 text-orange-600 mr-3" />
                      <span className="text-sm">Wallet: {formatCurrency(selectedUser.walletBalance)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-orange-600 mr-3" />
                      <span className="text-sm">Loyalty Points: {selectedUser.loyaltyPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 text-orange-600 mr-3 text-sm font-bold">$</span>
                      <span className="text-sm font-semibold">Total Spending: {formatCurrency(selectedUser.totalSpending)}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-3">Address Information</h5>
                  {selectedUser.addresses.map((address, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-orange-600 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium">{address.displayName} ({address.type})</div>
                          <div className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.state} {address.zip}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Account Information */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-3">Account Information</h5>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${selectedUser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedUser.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Joined:</span> {formatDate(selectedUser.createdAt)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Last Activity:</span> {formatDate(selectedUser.lastActivity)}
                    </div>
                    {selectedUser.isAgent && (
                      <div className="text-sm">
                        <span className="font-medium">Agent Status:</span> 
                        <span className="ml-2 px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                          {selectedUser.agentApplicationStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;