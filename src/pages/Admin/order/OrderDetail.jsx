import React, { useEffect, useState } from 'react';
import OrderHistory from './OrderHistory';
import { useParams } from 'react-router-dom'; 
import { getAdminOrderDetails } from '../../../apis/adminApis/adminFuntionsApi';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const  data  = await getAdminOrderDetails(orderId);
      console.log(data)
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading order details…</div>;
  }

  if (!order) {
    return <div className="p-4 text-red-600">Order not found.</div>;
  }

  // Helper functions
  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusDisplay = (status) => {
    if (!status) return null;
    return status.replace(/_/g, ' ');
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch(status.toLowerCase()) {
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'accepted_by_restaurant': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i className="yf yf-arrow-back text-gray-600"></i>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Order Information
            <span className="ml-2 text-gray-500 font-normal">
              #{order._id ? order._id.substring(order._id.length - 8) : null}
            </span>
          </h1>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <span className="text-gray-600">Total Amount:</span>
          <span className="ml-2 text-2xl font-bold text-blue-600">
            {order.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : null}
          </span>
        </div>
      </div>

      {/* Add Remark Button */}
      <div className="mb-6">
        <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Remark
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Bill Summary</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
            {getStatusDisplay(order.orderStatus)}
          </span>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - Customer Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mobile-only total amount */}
                <div className="col-span-1 sm:hidden bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-600 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {order.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : null}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">
                    Customer {order.customer?._id ? `#${order.customer._id.substring(order.customer._id.length - 6)}` : null}
                  </div>
                  <div className="text-blue-600 hover:text-blue-800 font-medium">
                    {order.customer?.name || null}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Store Name</div>
                  <div className="text-blue-600 hover:text-blue-800 font-medium">
                    {order.restaurant?.name || null}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Store Phone No.</div>
                  <div>{order.restaurant?.phone || null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Payment Method</div>
                  <div>
                    {order.paymentMethod ? 
                      (order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Online Payment') : 
                      null}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Custom Tag</div>
                  <div>{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Email</div>
                  <div>{order.customer?.email || null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Order Time</div>
                  <div>{formatDateTime(order.orderTime)}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Scheduled Delivery Time</div>
                  <div>{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Customer Rating</div>
                  <div className="text-gray-400">{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Virtual Meet</div>
                  <a href="#" target="_blank" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    {null}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Pickup Address</div>
                  <div className="text-sm">
                    {order.restaurant?.address ? 
                      `${order.restaurant.address.street}, ${order.restaurant.address.city}, ${order.restaurant.address.state}, ${order.restaurant.address.zip}` : 
                      null}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Customer Review</div>
                  <div className="text-gray-400">{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Phone No.</div>
                  <div>{order.customer?.phone || null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Admin Commission</div>
                  <div className="font-medium">{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Restaurants Earning</div>
                  <div className="font-medium">{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Agent Earning</div>
                  <div className="font-medium">{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Order Preparation Time (in minutes)</div>
                  <div>{order.preparationTime || null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Description</div>
                  <div className="text-gray-400">{order.instructions || '-'}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Cancelled By</div>
                  <div>{null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Promo Applied</div>
                  <div>{order.offerName || null}</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm mb-1">Transaction Status</div>
                  <div>{null}</div>
                </div>
              </div>
            </div>

            {/* Right Section - Pricing Summary */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-xl sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Pricing Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cart value:</span>
                    <span>{order.subtotal ? `₹${order.subtotal.toFixed(2)}` : null}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-red-500">
                        {order.discountAmount ? `-₹${order.discountAmount.toFixed(2)}` : null}
                      </span>
                    </div>
                    {order.offerName && (
                      <div className="text-xs text-gray-500 text-right mt-1">
                        (Promo Applied: {order.offerName})
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      {order.subtotal && order.discountAmount ? 
                        `₹${(order.subtotal - order.discountAmount).toFixed(2)}` : 
                        null}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span>{order.tax ? `₹${order.tax.toFixed(2)}` : null}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Net payable amount:</span>
                      <span className="text-blue-600">
                        {order.totalAmount ? `₹${order.totalAmount.toFixed(2)}` : null}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {order.orderItems?.length > 0 ? (
              order.orderItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-3">{item.name || 'Product'}</h3>
                    
                    <div className="flex items-center mb-4">
                      <img 
                        src={item.image || "assets/images/placeholder_3.png"} 
                        alt={item.name || 'Product'} 
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <span className="ml-4 font-medium">SKU: {null}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="text-blue-600 font-medium">{item.quantity || null}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span>
                          {item.totalPrice && item.quantity ? 
                            `₹${(item.totalPrice / item.quantity).toFixed(2)}` : 
                            null}
                        </span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between font-bold">
                        <span>Total Price:</span>
                        <span>{item.totalPrice ? `₹${item.totalPrice.toFixed(2)}` : null}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No order items found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="space-y-6">
        <OrderHistory />
      </div>
    </div>
  );
};

export default OrderDetails;