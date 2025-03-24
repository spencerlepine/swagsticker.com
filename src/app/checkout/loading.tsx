import React from 'react';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

export default function CheckoutPageLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Placeholder */}
      <SkeletonBlock className="h-8 w-32 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form Section - Left (2/3 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SkeletonBlock className="h-6 w-1/4 mb-4" /> {/* Title */}
            <SkeletonBlock className="h-36 w-full" /> {/* Address Element */}
          </div>

          {/* Payment Details Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SkeletonBlock className="h-6 w-1/4 mb-4" /> {/* Title */}
            <SkeletonBlock className="h-16 w-full mb-4" /> {/* Payment Notice */}
            <SkeletonBlock className="h-24 w-full" /> {/* Payment Element */}
          </div>

          {/* Billing Address Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SkeletonBlock className="h-6 w-1/4 mb-4" /> {/* Title */}
            <SkeletonBlock className="h-36 w-full" /> {/* Address Element */}
          </div>

          {/* Review Button */}
          <SkeletonBlock className="h-14 w-full rounded-lg" />

          {/* Cancel Link */}
          <div className="mt-4 text-center">
            <SkeletonBlock className="h-4 w-16 mx-auto" />
          </div>
        </div>

        {/* Cart Summary Section - Right (1/3 column) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <SkeletonBlock className="h-6 w-1/3 mb-4" /> {/* Title */}
            <div className="space-y-4">
              {/* Cart Item Placeholder */}
              <div className="flex items-center space-x-4">
                <SkeletonBlock className="h-12 w-12 rounded flex-shrink-0" /> {/* Image */}
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" /> {/* Item Name */}
                  <SkeletonBlock className="h-4 w-1/3" /> {/* Price x Quantity */}
                </div>
                <SkeletonBlock className="h-4 w-12" /> {/* Total */}
              </div>
              {/* Summary Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-20" /> {/* Subtotal Label */}
                  <SkeletonBlock className="h-4 w-12" /> {/* Subtotal Value */}
                </div>
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-20" /> {/* Shipping Label */}
                  <SkeletonBlock className="h-4 w-12" /> {/* Shipping Value */}
                </div>
                <div className="flex justify-between">
                  <SkeletonBlock className="h-5 w-16" /> {/* Total Label */}
                  <SkeletonBlock className="h-5 w-16" /> {/* Total Value */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
