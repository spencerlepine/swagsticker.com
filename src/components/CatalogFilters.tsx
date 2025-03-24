'use client';

import { useRouter } from 'next/navigation';
import { FilterSearchParams } from '@/types';
import { SUPPORTED_PARAMS, SUPPORTED_SORT_OPTIONS } from '@/lib/catalog';
import { FaFilter } from 'react-icons/fa6';

function toTitleCase(str: string) {
  if (str && typeof str === 'string') {
    return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
  }
  return str;
}

export const SORT_OPTION_LABELS = {
  [SUPPORTED_SORT_OPTIONS.NAME_ALPHABETICAL]: 'Alphabetical',
  [SUPPORTED_SORT_OPTIONS.DATE_NEWEST]: 'Newest',
  [SUPPORTED_SORT_OPTIONS.FEATURED]: 'Featured',
  [SUPPORTED_SORT_OPTIONS.PRICE_HIGH_TO_LOW]: 'Price: High to Low',
  [SUPPORTED_SORT_OPTIONS.PRICE_LOW_TO_HIGH]: 'Price: Low to High',
};

const CatalogFilters: React.FC<{ catalogFilters: FilterSearchParams }> = ({ catalogFilters }) => {
  const { category, type, sortBy, limit } = catalogFilters;
  const router = useRouter();

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    const existingSearchParams = JSON.parse(JSON.stringify(catalogFilters));
    const paramKey = event.target.getAttribute('id');

    if (paramKey) {
      existingSearchParams[paramKey] = newValue;
    }
    const updatedSearchParams = new URLSearchParams(existingSearchParams);

    router.push(`/?${updatedSearchParams.toString()}`);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter Section */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <FaFilter className="w-5 h-5 text-gray-600" />
            <h4 className="text-lg font-semibold text-gray-900">Filters</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="category" className="text-sm text-gray-600 whitespace-nowrap">
                Category:
              </label>
              <select
                id="category"
                value={category}
                onChange={handleDropdownChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition-colors duration-200 w-full sm:w-auto">
                {SUPPORTED_PARAMS.CATEGORY.map(cat => (
                  <option key={cat} value={cat}>
                    {toTitleCase(cat)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="type" className="text-sm text-gray-600 whitespace-nowrap">
                Type:
              </label>
              <select
                id="type"
                value={type}
                onChange={handleDropdownChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition-colors duration-200 w-full sm:w-auto">
                {SUPPORTED_PARAMS.TYPE.map(t => (
                  <option key={t} value={t}>
                    {toTitleCase(t)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm text-gray-600 whitespace-nowrap">
                Sort By:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleDropdownChange}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition-colors duration-200 w-full sm:w-auto">
                {SUPPORTED_PARAMS.SORT_BY.map(option => (
                  <option key={option} value={option}>
                    {SORT_OPTION_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Per Page */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="limit" className="text-sm text-gray-600 whitespace-nowrap">
            Items per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={handleDropdownChange}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-400 transition-colors duration-200 w-full sm:w-auto">
            {SUPPORTED_PARAMS.LIMIT.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;
