import React from 'react';

const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

export default function AccountPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              {/* Profile Picture Placeholder */}
              <SkeletonBlock className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="space-y-2">
                {/* Email Placeholder */}
                <SkeletonBlock className="h-6 w-40" />
                {/* Subtitle Placeholder */}
                <SkeletonBlock className="h-4 w-24" />
              </div>
            </div>
            {/* Logout Button Placeholder */}
            <SkeletonBlock className="h-10 w-24 rounded-md" />
          </div>
        </div>

        {/* Order History Section Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Title Placeholder */}
          <SkeletonBlock className="h-8 w-1/3 mb-2" />
          {/* Subtitle Placeholder */}
          <SkeletonBlock className="h-4 w-40 mb-6" />

          {/* Simulate Order Cards or No Orders Message */}
          <div className="space-y-6">
            {/* Simulate 1-2 Order Cards for realistic loading */}
            <div className="space-y-4">
              {/* Order Card 1 */}
              <div className="border rounded-md p-4">
                <SkeletonBlock className="h-6 w-1/2 mb-2" />
                <SkeletonBlock className="h-4 w-1/3" />
                <SkeletonBlock className="h-4 w-2/3 mt-2" />
              </div>
              {/* Order Card 2 */}
              <div className="border rounded-md p-4">
                <SkeletonBlock className="h-6 w-1/2 mb-2" />
                <SkeletonBlock className="h-4 w-1/3" />
                <SkeletonBlock className="h-4 w-2/3 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
