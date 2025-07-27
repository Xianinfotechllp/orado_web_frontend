import React, { useEffect, useState } from "react";
import { Printer, ArrowLeft, MessageCircle, Info } from "lucide-react";
import {
  getOrderDetailById,
  getCustomerOrdersHistory,
} from "../../../../apis/restaurantApi";
import { format } from "date-fns";

const OrderDetails = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetailById(orderId);
        console.log("response-----", response);
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(err.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white p-4">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white p-4">
        No order data found
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return format(date, "MMMM dd yyyy h:mm a");
  };

  // Calculate tax amount if not provided
  const taxAmount = order.tax || order.totalAmount - order.subtotal;
  return (
    <div className="w-full max-w-6xl mx-auto bg-white">
      <style jsx>{`
        .order-details {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }
        .print-icon {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
        .section-heading {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        .order-id {
          color: #666;
          font-weight: 500;
        }
        .order-amount {
          font-size: 16px;
          color: #333;
        }
        .amount {
          color: #28a745;
          font-weight: 700;
        }
        .tk-link {
          color: #007bff;
          text-decoration: none;
          cursor: pointer;
          font-size: 14px;
        }
        .tk-link:hover {
          text-decoration: underline;
        }
        .detail-card {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .detail-card-heading {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 15px;
        }
        .order-list-item {
          margin-bottom: 15px;
          padding: 10px 0;
        }
        .od-title {
          display: block;
          font-size: 13px;
          color: #666;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .od-val {
          display: block;
          font-size: 14px;
          color: #333;
          font-weight: 600;
        }
        .c-order-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }
        .c-order-details:last-child {
          border-bottom: none;
        }
        .c-order-total {
          border-top: 2px solid #28a745;
          padding-top: 12px;
          margin-top: 15px;
          font-weight: 700;
        }
        .color-t {
          color: #666;
          font-size: 14px;
        }
        .text-right {
          text-align: right;
          color: #333;
          font-weight: 600;
        }
        .categoryName {
          font-size: 14px;
          font-weight: 600;
          color: #495057;
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 4px;
          display: inline-block;
        }
        .headingproduct {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }
        .themecolor {
          color: #007bff;
          font-weight: 600;
        }
        .timeline-text {
          color: #495057;
          font-size: 14px;
        }
        .body-row {
          padding: 12px 0;
          border-bottom: 1px solid #f1f3f4;
        }
        .body-row:last-child {
          border-bottom: none;
        }
        .blueColor {
          color: #007bff;
        }
        .order-status-dropdown {
          background: #d4edda;
          color: #155724;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
        }
        .bill-right {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-left: 20px;
          min-width: 300px;
        }
        .pricing-section {
          background: white;
          border-radius: 6px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .single-product-loop {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .orderbox {
          background: white;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .w60 {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }
        .mt-10 {
          margin-top: 10px;
        }
        .pro-bd-font {
          font-family: inherit;
        }
        .bold {
          font-weight: 700;
        }
        .capitalize {
          text-transform: capitalize;
        }
        .light-tax {
          font-size: 13px;
        }
        .remark-padd {
          margin: 10px 0;
          display: block;
        }
        .order-history-container {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
        }
        @media (max-width: 768px) {
          .bill-right {
            margin-left: 0;
            margin-top: 20px;
            min-width: auto;
          }
          .detail-card {
            padding: 15px;
          }
          .order-list-item {
            margin-bottom: 12px;
          }
        }
      `}</style>

      <div className="order-details relative">
        {/* Print Icon */}
        <div className="print-icon">
          <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Printer className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Order Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="flex-1">
              <div className="section-heading flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
                Order Information
                <span className="order-id ml-2">
                  #{order.orderNumber || order._id.substring(0, 8)}
                </span>
              </div>
              <div className="order-amount text-right hidden md:block mt-2">
                <span className="order-id">Total Amount</span>:
                <span className="amount ml-2">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </h4>
          </div>

          <span className="remark-padd">
            <a className="tk-link">Add Remark</a>
          </span>

          {/* Bill Summary Section */}
          <section className="detail-card">
            <div className="flex justify-between items-center mb-4">
              <span className="detail-card-heading">Bill Summary</span>
              <span className="order-status-dropdown">{order.orderStatus}</span>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Order Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Mobile Total Amount */}
                  <div className="block md:hidden order-list-item col-span-full">
                    <span className="od-title">Total Amount</span>
                    <span className="od-val amount">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="order-list-item">
                    <span className="od-title">
                      Customer #{order.customer._id.slice(-6).toUpperCase()}
                      <MessageCircle className="w-4 h-4 inline-block ml-2 blueColor" />
                    </span>
                    <span className="od-val">{order.customer.name}</span>
                  </div>

                  {/* Store Name */}
                  <div className="order-list-item">
                    <span className="od-title">Store Name</span>
                    <span className="od-val">{order.restaurant.name}</span>
                  </div>

                  {/* Payment Method */}
                  <div className="order-list-item">
                    <span className="od-title">Payment Method</span>
                    <span className="od-val">
                      {order.paymentMethod === "cod"
                        ? "Pay On Delivery"
                        : order.paymentMethod}
                    </span>
                  </div>

                  {/* Custom Tag */}
                  <div className="order-list-item">
                    <span className="od-title">Custom Tag</span>
                    <span className="od-val">ProPower Plates</span>
                  </div>

                  {/* Email */}
                  <div className="order-list-item">
                    <span className="od-title">Email</span>
                    <span className="od-val">
                      {order.customer.email || "-"}
                    </span>
                  </div>

                  {/* Order Time */}
                  <div className="order-list-item">
                    <span className="od-title">Order Time</span>
                    <span className="od-val">
                      {formatDate(order.orderTime)}
                    </span>
                  </div>

                  {/* Scheduled Delivery Time */}
                  <div className="order-list-item">
                    <span className="od-title">Scheduled Delivery Time</span>
                    <span className="od-val">
                      {formatDate(order.scheduledTime)}
                    </span>
                  </div>

                  {/* Merchant Rating */}
                  <div className="order-list-item">
                    <span className="od-title">Merchant Rating</span>
                    <span className="od-val">
                      <a className="tk-link">Rate & Review</a>
                    </span>
                  </div>

                  {/* Merchant Review */}
                  <div className="order-list-item">
                    <span className="od-title">Merchant Review</span>
                    <span className="od-val">-</span>
                  </div>

                  {/* Customer Rating */}
                  <div className="order-list-item">
                    <span className="od-title">Customer Rating</span>
                    <span className="od-val">NA</span>
                  </div>

                  {/* Virtual Meet */}
                  <div className="order-list-item">
                    <span className="od-title">
                      Virtual Meet
                      <Info className="w-4 h-4 inline-block ml-1 text-gray-500" />
                    </span>
                    <span className="od-val capitalize">
                      {" "}
                      {order.deliveryMode || "Home delivery"}
                    </span>
                  </div>

                  {/* Customer Address */}
                  <div className="order-list-item">
                    <span className="od-title">Customer Address</span>
                    <span className="od-val">
                      {order.customer.addresses?.[0]?.address ||
                        "Address not available"}
                      <br />
                      <a className="tk-link">Show on map</a>
                    </span>
                  </div>

                  {/* House/Flat Number */}
                  <div className="order-list-item">
                    <span className="od-title">House/Flat Number</span>
                    <span className="od-val">-</span>
                  </div>

                  {/* Landmark */}
                  <div className="order-list-item">
                    <span className="od-title">Landmark</span>
                    <span className="od-val">-</span>
                  </div>

                  {/* Postal Code */}
                  <div className="order-list-item">
                    <span className="od-title">Postal Code</span>
                    <span className="od-val">-</span>
                  </div>

                  {/* Customer Review */}
                  <div className="order-list-item">
                    <span className="od-title">Customer Review</span>
                    <span className="od-val">-</span>
                  </div>

                  {/* Phone No */}
                  <div className="order-list-item">
                    <span className="od-title">Phone No.</span>
                    <span className="od-val">
                      {order.customer.phone || "-"}
                    </span>
                  </div>

                  {/* Admin Commission */}
                  <div className="order-list-item">
                    <span className="od-title">Admin Commission</span>
                    <span className="od-val">$0.00</span>
                  </div>

                  {/* Merchant Earning */}
                  <div className="order-list-item">
                    <span className="od-title">Merchant Earning</span>
                    <span className="od-val">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Agent Earning */}
                  <div className="order-list-item">
                    <span className="od-title">Agent Earning</span>
                    <span className="od-val">$0.00</span>
                  </div>

                  {/* Order Preparation Time */}
                  <div className="order-list-item">
                    <span className="od-title">
                      Order Preparation Time (in minutes)
                      <Info className="w-4 h-4 inline-block ml-1 text-gray-500" />
                    </span>
                    <span className="od-val">
                      {order.preparationTime || "-"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="order-list-item">
                    <span className="od-title">Description</span>
                    <span className="od-val">{order.instructions || "-"}</span>
                  </div>

                  {/* Transaction Status */}
                  <div className="order-list-item">
                    <span className="od-title">Transaction Status</span>
                    <span className="od-val">
                      {" "}
                      {order.paymentStatus === "pending"
                        ? "Unpaid"
                        : order.paymentStatus}
                    </span>
                  </div>

                  {/* TOOKAN Pickup Id */}
                  <div className="order-list-item">
                    <span className="od-title">TOOKAN Pickup Id</span>
                    <span className="od-val">567128396</span>
                  </div>

                  {/* TOOKAN Delivery Id */}
                  <div className="order-list-item">
                    <span className="od-title">TOOKAN Delivery Id</span>
                    <span className="od-val">567128397</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Pricing */}
              <div className="bill-right">
                <div className="pricing-section">
                  <div className="c-order-details">
                    <span className="color-t">Cart value:</span>
                    <span className="text-right">
                      ₹{order.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="c-order-details">
                    <span className="color-t">Subtotal</span>
                    <span className="text-right">
                      ₹{order.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="c-order-details">
                    <span className="color-t light-tax">Tax:</span>
                    <span className="text-right">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="c-order-details">
                    <span className="color-t light-tax">Delivery Charg:</span>
                    <span className="text-right">₹</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="c-order-details">
                      <span className="color-t">Discount:</span>
                      <span className="text-right">
                        -₹{order.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="c-order-details c-order-total">
                    <span className="color-t pro-bd-font">
                      Net payable amount:
                    </span>
                    <span className="text-right pro-bd-font bold amount">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Product Details Section */}
        <section className="detail-card">
          <div className="mb-4">
            <span className="section-heading capitalize">Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="single-product-loop">
              <div className="mb-3">
                <span className="categoryName">Wraps on the go</span>
              </div>

              <div className="orderbox">
                <div className="flex items-center">
                  <span className="w60">
                    <img
                      src="https://d2sz1kgdtrlf1n.cloudfront.net/task_images/df4e87lxg419l24zqw1jrz3to0Lzvd4onbTwt8lma851715198782255-7d94gmdri8x73d822G9n12wrvunay5k61m0kj5rjxlbG.png"
                      alt="Product"
                      className="w-full h-full object-cover rounded"
                    />
                  </span>
                  <span className="headingproduct ml-3">
                    Mix Grill Chicken Wrap
                  </span>
                </div>
              </div>

              <div className="c-order-details mt-10">
                <span className="color-t">Quantity:</span>
                <span className="text-right themecolor">1</span>
              </div>

              <div className="c-order-details mt-10">
                <span className="color-t">Price:</span>
                <span className="text-right">$500.00</span>
              </div>

              <div className="c-order-details c-order-total">
                <div className="flex justify-between">
                  <span className="color-t bold">Total Price:</span>
                  <span className="text-right bold">$500.00</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order History Section */}
        <div className="order-history-container">
          <div className="mb-4">
            <span className="section-heading capitalize">Order History</span>
            <a className="tk-link ml-4">Delivery Logs</a>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="body-row">
              <span className="text-sm text-gray-600">
                July 02 2025 9:41 AM -{" "}
              </span>
              <span className="timeline-text">
                Order marked as <b>Completed</b> through Delivery
              </span>
            </div>

            <div className="body-row">
              <span className="text-sm text-gray-600">
                July 02 2025 9:39 AM -{" "}
              </span>
              <span className="timeline-text">
                Order <b>Accepted</b> through Delivery
              </span>
            </div>

            <div className="body-row">
              <span className="text-sm text-gray-600">
                July 02 2025 9:30 AM -{" "}
              </span>
              <span className="timeline-text">
                Order marked as <b>Pending</b> by Admin
              </span>
            </div>

            <div className="body-row">
              <span className="text-sm text-gray-600">
                July 02 2025 9:30 AM -{" "}
              </span>
              <span className="timeline-text">
                Order <b>Placed by</b> Customer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
