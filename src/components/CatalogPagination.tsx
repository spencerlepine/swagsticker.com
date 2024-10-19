'use client';

import { FilterSearchParams } from '@/types';
import { useRouter } from 'next/navigation';

const CatalogPagination: React.FC<{ pageLimitIsReached?: boolean; catalogFilters: FilterSearchParams }> = ({ pageLimitIsReached, catalogFilters }) => {
  const router = useRouter();

  const page = isNaN(Number(catalogFilters.page)) ? 1 : Number(catalogFilters.page);

  const handlePageChange = (direction: string) => {
    const isValidPage = direction === 'prev' ? page > 1 : !pageLimitIsReached;
    if (!isValidPage) return;

    const nextPage = direction === 'prev' ? page - 1 : page + 1;

    const existingSearchParams = { ...catalogFilters };
    existingSearchParams.page = nextPage;
    const updatedSearchParams = new URLSearchParams(existingSearchParams as Record<string, string>);

    router.push(`/?${updatedSearchParams.toString()}`);
  };

  return (
    <div className="flex justify-between w-full my-6">
      <button onClick={() => handlePageChange('prev')} disabled={!page || page === 0} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
        Previous
      </button>

      <button onClick={() => handlePageChange('next')} disabled={pageLimitIsReached} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
        Next
      </button>
    </div>
  );
};

export default CatalogPagination;
