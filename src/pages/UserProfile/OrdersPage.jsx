import React from 'react';
import AppLayout from '../../components/userProfile/layout/AppLayout';
import Sidebar from '../../components/userProfile/navigation/Sidebar';
import OrdersContent from '../../components/userProfile/orders/OrdersContent';
import Navbar from '../../components/layout/Navbar';

const OrdersPage = () => {
  return (
    <>
        <Navbar />
        <AppLayout>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
                <OrdersContent />
                </div>
            </div>
    </AppLayout>
    </>
  );
};

export default OrdersPage;