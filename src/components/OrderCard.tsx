'use client';

import { useState } from 'react';
import { FaReceipt, FaTruck } from 'react-icons/fa6';
import { SwagOrderDetails } from '@/types';
import { LineItem, OrderShipment } from 'printify-sdk-js';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

export function OrderCard({ order }: { order: SwagOrderDetails }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderDetails, setSwagOrderDetails] = useState<SwagOrderDetails | null>(null);

  const handleToggle = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/orders/${order.printifyOrderId}`, {
          method: 'GET',
          credentials: 'include',
        });
        const data: SwagOrderDetails = await response.json();
        if (response.ok) {
          setSwagOrderDetails(data);
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

  const renderShippingTracking = (shipments?: OrderShipment[]) => {
    if (!shipments || shipments.length === 0) return null;

    return (
      <div className="flex flex-col gap-2">
        {shipments.map((shipment: OrderShipment, index: number) => (
          <a
            key={index}
            className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            href={shipment.url}
            target="_blank"
            rel="noopener noreferrer">
            <div className="flex items-center">
              <FaTruck className="w-4 h-4 mr-2" />
              <span>
                {shipment.carrier} #{shipment.number}
              </span>
            </div>
            {shipment.delivered_at && <span className="text-green-600 font-medium">Delivered: {new Date(shipment.delivered_at).toLocaleDateString()}</span>}
          </a>
        ))}
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="p-4 border-t border-gray-200">
      <div className="space-y-6">
        {/* Status and Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <SkeletonBlock className="h-10 w-full sm:w-32" />
            {order.shipments?.length && <SkeletonBlock className="h-10 w-full sm:w-64" />}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <SkeletonBlock className="h-4 w-24 mb-2" />
          <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-3 w-12" />
                  </div>
                  <SkeletonBlock className="h-4 w-16" />
                </div>
              ))}
          </div>
        </div>

        {/* Customer Email */}
        <div>
          <SkeletonBlock className="h-4 w-32 mb-2" />
          <SkeletonBlock className="h-4 w-48" />
        </div>

        {/* Shipping Address */}
        <div>
          <SkeletonBlock className="h-4 w-32 mb-2" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-4 w-32" />
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <SkeletonBlock className="h-4 w-24 mb-2" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
          <span data-testid={`card-order-id-${order.id}`} className="font-semibold text-sm">
            Order ID: {order.id}
          </span>
          <span className="text-gray-600 text-sm">Date: {order.date}</span>
          <span className="text-gray-600 text-sm">Ship To: {order.address?.postal_code}</span>
          <span className="font-semibold text-sm">Total: ${(order.total_price || order.total || 0).toFixed(2)}</span>
        </div>
        <button
          onClick={handleToggle}
          data-testid={`expand-order-card-${order.id}`}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {isExpanded ? 'Minimize' : 'View Details'}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded &&
        (isLoading ? (
          renderSkeleton()
        ) : (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p data-testid="order-status-title" className="text-sm font-medium text-gray-900">
                    Order Status
                  </p>
                  <p className="text-sm text-gray-600">{orderDetails?.status || 'Unknown'}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={order.receiptUrl || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaReceipt className="w-4 h-4 mr-2" />
                    View Receipt
                  </a>
                  {renderShippingTracking(orderDetails?.shipments || order.shipments)}
                </div>
              </div>

              {/* Order Items */}
              {(orderDetails?.line_items || order.line_items) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Order Items</h3>
                  <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {(orderDetails?.line_items || order.line_items || []).map((item: LineItem, index: number) => (
                      <div key={index} className="p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div>
                            <p className="font-medium text-sm text-gray-900">Sticker</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-sm text-gray-900">${((item.metadata?.price * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Email */}
              {(orderDetails?.address_to || order.address_to) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Email</h3>
                  <p className="text-sm text-gray-600">{orderDetails?.address_to?.email || order.address_to?.email}</p>
                </div>
              )}

              {/* Shipping Address */}
              {(orderDetails?.address || order.address) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{orderDetails?.address?.line1 || order.address?.line1}</p>
                    {(orderDetails?.address?.line2 || order.address?.line2) && <p>{orderDetails?.address?.line2 || order.address?.line2}</p>}
                    <p>
                      {orderDetails?.address?.city || order.address?.city}, {orderDetails?.address?.state || order.address?.state}{' '}
                      {orderDetails?.address?.postal_code || order.address?.postal_code}
                    </p>
                    <p>{orderDetails?.address?.country || order.address?.country}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h3>
                <div className="text-sm text-gray-600">
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
                  <div className="flex justify-between py-1 font-medium text-gray-900">
                    <span>Total:</span>
                    <span>${(order.total_price || order.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
