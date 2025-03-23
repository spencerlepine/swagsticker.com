'use client';

import { useState } from 'react';
import { FaReceipt, FaTruck } from 'react-icons/fa6';
import { OrderDetails } from '@/types';
import { LineItem, OrderShipment } from 'printify-sdk-js';

export function OrderCard({ order }: { order: OrderDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  const handleToggle = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/v1/orders/${order.printifyOrderId}`, {
          method: 'GET',
          credentials: 'include',
        });

        const data: OrderDetails = await response.json();

        if (response.ok) {
          setOrderDetails(data);
        } else {
          console.error('Error fetching order');
        }
      } catch (error) {
        console.error('Request failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Helper function to render shipping tracking links
  const renderShippingTracking = () => {
    const shipments = orderDetails?.shipments || order.shipments;

    if (!shipments || shipments.length === 0) {
      return null;
    }

    // If there's only one shipment, show a single button
    if (shipments.length === 1) {
      const shipment = shipments[0];
      return (
        <a
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition duration-200 text-sm"
          href={shipment.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTruck className="w-4 h-4 mr-2" />
          {shipment.delivered_at ? (
            <>Delivered: {new Date(shipment.delivered_at).toLocaleDateString()}</>
          ) : (
            <>
              Track {shipment.carrier} ({shipment.number})
            </>
          )}
        </a>
      );
    }

    // If multiple shipments, show a list with delivery status
    return (
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        {shipments.map((shipment: OrderShipment, index: number) => (
          <a
            key={index}
            className="w-full flex items-center justify-between px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-600 hover:text-white transition duration-200 text-sm"
            href={shipment.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center">
              <FaTruck className="w-4 h-4 mr-2" />
              <span>
                {shipment.carrier} #{shipment.number}
              </span>
            </div>
            {shipment.delivered_at && <span className="ml-2 text-green-600 font-medium">Delivered: {new Date(shipment.delivered_at).toLocaleDateString()}</span>}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full border border-gray-300 rounded-md mb-4 shadow-sm">
      {/* Minimized/Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2 sm:mb-0">
          <span className="font-bold text-sm sm:text-base">Order ID: {order.id}</span>
          <span className="text-gray-600 text-sm">Date: {order.date}</span>
          <span className="text-gray-600 text-sm">Ship To: {order.address?.postal_code}</span>
          <span className="font-medium text-sm sm:text-base">Total: ${(order.total_price || order.total || 0).toFixed(2)}</span>
        </div>
        <button onClick={handleToggle} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm sm:text-base">
          {isExpanded ? 'Minimize' : 'View Details'}
        </button>
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm font-medium">Order Status</p>
                  <p className="text-gray-600 text-sm">{orderDetails?.status || 'Unknown'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={order.receiptUrl || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-200 text-sm"
                  >
                    <FaReceipt className="w-4 h-4 mr-2" />
                    View Receipt
                  </a>
                  {renderShippingTracking()}
                </div>
              </div>

              {/* Additional order details - showing line items if available */}
              {(orderDetails?.line_items || order.line_items) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Order Items</h3>
                  <div className="border rounded-md divide-y divide-gray-200">
                    {(orderDetails?.line_items || order.line_items)?.map((item: LineItem, index: number) => (
                      <div key={index} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {/* {item.image_url && (
                            <div className="mr-3 w-12 h-12 rounded overflow-hidden">
                              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )} */}
                          <div>
                            {/* <p className="font-medium text-sm">{item.metadata?.title}</p> */}
                            <p className="font-medium text-sm">Sticker</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-sm">${((item.metadata?.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              {(orderDetails?.address_to || order.address_to) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Customer Email</h3>
                  <p className="text-sm text-gray-600">{orderDetails?.address_to?.email || order.address_to?.email}</p>
                </div>
              )}

              {/* Shipping Information */}
              {(orderDetails?.address || order.address) && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{orderDetails?.address?.line1 || order.address?.line1}</p>
                    {(orderDetails?.address?.line2 || order.address?.line2) && <p>{orderDetails?.address?.line2 || order.address?.line2}</p>}
                    <p>
                      {orderDetails?.address?.city || order.address?.city}
                      {', '}
                      {orderDetails?.address?.state || order.address?.state} {orderDetails?.address?.postal_code || order.address?.postal_code}
                    </p>
                    <p>{orderDetails?.address?.country || order.address?.country}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                <div className="text-sm">
                  {orderDetails?.line_items && (
                    <div className="flex justify-between py-1">
                      <span>Subtotal:</span>
                      <span>${(orderDetails.line_items.reduce((sum: number, item: LineItem) => (sum += item.metadata?.price * item.quantity), 0) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span>Shipping:</span>
                    <span>${((orderDetails?.total_shipping || order.total_shipping || 0) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-medium">
                    <span>Total:</span>
                    <span>${(order.total_price || order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
