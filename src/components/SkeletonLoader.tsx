const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-[200px] mx-auto sm:max-w-[280px] md:max-w-[220px] min-w-52">
      <div className="relative aspect-square bg-gray-300 animate-pulse"></div>
      <div className="py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
