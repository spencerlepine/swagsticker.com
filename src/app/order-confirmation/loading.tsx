import React from 'react';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

export default function OrderConfirmationLoading() {
  return (
    <div data-testid="loading-screen" className="min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Header */}
          <SkeletonBlock className="h-6 w-1/2 mx-auto" />

          {/* Content Section */}
          <div className="space-y-4">
            {/* Shipping Info */}
            <div>
              <SkeletonBlock className="h-4 w-20 mb-1" />
              <div className="space-y-1">
                <SkeletonBlock className="h-4 w-3/4" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <SkeletonBlock className="h-4 w-16 mb-1" />
              <div className="space-y-1">
                <SkeletonBlock className="h-4 w-5/6" />
                <SkeletonBlock className="h-4 w-1/2" />
              </div>
            </div>

            {/* Cart Summary */}
            <div className="space-y-2">
              {/* Sample Cart Item */}
              <div className="flex items-center space-x-2">
                <SkeletonBlock className="h-8 w-8 rounded flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <SkeletonBlock className="h-3 w-2/3" />
                  <SkeletonBlock className="h-3 w-1/4" />
                </div>
                <SkeletonBlock className="h-3 w-10" />
              </div>
              {/* Summary Breakdown */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-3 w-10" />
                </div>
                <div className="flex justify-between">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-3 w-10" />
                </div>
                <div className="flex justify-between">
                  <SkeletonBlock className="h-4 w-12" />
                  <SkeletonBlock className="h-4 w-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <SkeletonBlock className="h-10 w-full rounded-md" />

          {/* Cancel Link */}
          <div className="text-center">
            <SkeletonBlock className="h-4 w-16 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
