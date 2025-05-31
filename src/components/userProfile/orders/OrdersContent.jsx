import React, { useState } from 'react';
import OrderCard from './OrderCard';
import OrderDetailsPanel from './OrderDetailsPanel';

const OrdersContent = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sample data matching the photo with full details
  const orders = [
    {
      restaurant: "Wendy's Burgers",
      location: "Zirakpur",
      address: "My Road, Nabha, Chandigarh, Punjab M001, India. (Cory Coast)",
      orderId: "20738696716003",
      date: "Wed, May 28, 2025, 12:59 PM",
      deliveryDate: "Wed, May 28, 2025, 01:20 PM",
      deliveryPartner: "NCRO ASHRAF",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop&crop=center",
      items: [
        {
          name: "Chimichuri Spicy Paneer Burger",
          quantity: 1,
          price: "227.90"
        },
        {
          name: "Classic Veggie Burger (Railway Cutlet)",
          quantity: 1,
          price: "113.90"
        }
      ],
      subtotal: "358.00",
      deliveryFee: "27.04",
      platformFee: "7.08",
      discount: "50.00",
      taxes: "10.30",
      total: "258.00",
      paymentMethod: "Bank",
      // For the card view summary
      itemsSummary: "Chimichuri Spicy Paneer Burger x 1, Classic Veggie Burger (Railway Cutlet) x 1"
    }
  ];

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Past Orders</h1>
      
      {orders.map((order, index) => (
        <OrderCard 
          key={index} 
          order={{
            ...order,
            items: order.itemsSummary // Use the summary for card view
          }}
          onViewDetails={() => setSelectedOrder(order)}
        />
      ))}
      
      <div className="mt-8 text-center">
        <button className="text-gray-600 font-medium hover:text-gray-800">
          SHOW MORE ORDERS
        </button>
      </div>

      {/* Order Details Panel */}
      {selectedOrder && (
        <OrderDetailsPanel 
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersContent;