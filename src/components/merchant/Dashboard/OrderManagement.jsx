import React, { useState } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 98765 43210',
    address: '123 MG Road, Bangalore',
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 320 },
      { name: 'Naan', quantity: 2, price: 60 },
    ],
    total: 440,
    status: 'pending',
    orderTime: '12:30 PM',
    estimatedDelivery: '1:15 PM',
  },
  {
    id: 'ORD002',
    customerName: 'Priya Patel',
    customerPhone: '+91 87654 32109',
    address: '456 Brigade Road, Bangalore',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 280 },
      { name: 'Garlic Bread', quantity: 1, price: 120 },
    ],
    total: 400,
    status: 'accepted',
    orderTime: '12:45 PM',
    estimatedDelivery: '1:30 PM',
  },
  {
    id: 'ORD003',
    customerName: 'Amit Kumar',
    customerPhone: '+91 76543 21098',
    address: '789 Commercial Street, Bangalore',
    items: [
      { name: 'Chicken Biryani', quantity: 2, price: 350 },
    ],
    total: 700,
    status: 'preparing',
    orderTime: '1:00 PM',
    estimatedDelivery: '1:45 PM',
  },
];

const statusColors = {
  pending: 'bg-yellow-500',
  accepted: 'bg-blue-500',
  preparing: 'bg-orange-500',
  ready: 'bg-purple-500',
  delivered: 'bg-green-500',
};

const statusLabels = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
};

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = ['pending', 'accepted', 'preparing', 'ready', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow.slice(currentIndex);
  };

  return (
    <div className="space-y-6">

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="overflow-hidden bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {order.orderTime} • Est. delivery: {order.estimatedDelivery}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]} text-white`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="font-bold text-xl text-gray-900">₹{order.total}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">{order.customerName}</p>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {order.customerPhone}
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <h4 className="font-medium text-gray-900 mb-2">Update Status</h4>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {getStatusOptions(order.status).map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                  
                  {order.status === 'pending' && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleStatusChange(order.id, 'accepted')}
                        className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                      >
                        Accept
                      </button>
                      <button
                        className="flex-1 px-3 py-1 border border-red-600 text-red-600 hover:bg-red-50 rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement