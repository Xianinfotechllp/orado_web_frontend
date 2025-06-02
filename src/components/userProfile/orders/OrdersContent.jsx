import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import OrderDetailsPanel from './OrderDetailsPanel';
import { getCustomerOrders } from '../../../apis/orderApi'; // adjust path as needed

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getCustomerOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Past Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <OrderCard
            key={order._id}
            order={{
              restaurant: "Restaurant Name", // Replace with real data if needed
              location: "Customer Location",
              address: "N/A", // you can derive from coordinates if needed
              orderId: order._id,
              date: new Date(order.orderTime).toLocaleString(),
              deliveryDate: new Date(order.updatedAt).toLocaleString(),
              deliveryPartner: order.assignedAgent || "Unassigned",
              image: order.orderItems.image || "https://via.placeholder.com/150",
              items: order.orderItems.map(i => `${i.name} x ${i.quantity}`).join(', '),
              subtotal: order.subtotal,
              deliveryFee: order.deliveryCharge,
              discount: order.discountAmount,
              taxes: order.tax,
              total: order.totalAmount,
              paymentMethod: order.paymentMethod,
              itemsSummary: order.orderItems.map(i => `${i.name} x ${i.quantity}`).join(', ')
            }}
            onViewDetails={() => setSelectedOrder(order)}
          />
        ))
      )}

      {orders.length > 0 && (
        <div className="mt-8 text-center">
          <button className="text-gray-600 font-medium hover:text-gray-800">
            SHOW MORE ORDERS
          </button>
        </div>
      )}

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
