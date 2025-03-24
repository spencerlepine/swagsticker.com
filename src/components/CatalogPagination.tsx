'use client';

import { FilterSearchParams } from '@/types';
import { useRouter } from 'next/navigation';

const CatalogPagination: React.FC<{
  pageLimitIsReached?: boolean;
  catalogFilters: FilterSearchParams;
  totalPages?: number;
  currentPage?: number;
}> = ({ pageLimitIsReached, catalogFilters, totalPages, currentPage }) => {
  const router = useRouter();

  const page = Math.max(1, Number(currentPage) || 1);

  const handlePageChange = (direction: 'prev' | 'next') => {
    const isPrevValid = page > 1;
    const isNextValid = !pageLimitIsReached && (!totalPages || page < totalPages);

    if ((direction === 'prev' && !isPrevValid) || (direction === 'next' && !isNextValid)) return;

    const nextPage = direction === 'prev' ? page - 1 : page + 1;
    const updatedSearchParams = new URLSearchParams({
      ...Object.fromEntries(Object.entries(catalogFilters).map(([key, value]) => [key, String(value)])),
      page: nextPage.toString(),
    });

    router.push(`/?${updatedSearchParams.toString()}`);
  };

  return (
    <div className="flex items-center justify-end gap-4 my-8">
      <button
        onClick={() => handlePageChange('prev')}
        disabled={page === 1}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Previous
      </button>

      {totalPages ? (
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
      ) : (
        <span className="text-sm text-gray-600">Page {page}</span>
      )}

      <button
        onClick={() => handlePageChange('next')}
        disabled={!!(pageLimitIsReached || (totalPages && page >= totalPages))}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Next
      </button>
    </div>
  );
};

export default CatalogPagination;
