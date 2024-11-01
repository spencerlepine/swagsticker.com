'use client';

import { useRouter } from 'next/navigation';
import { FilterSearchParams } from '@/types';
import { SUPPORTED_PARAMS, SUPPORTED_SORT_OPTIONS } from '@/lib/catalog';
import { FaFilter } from 'react-icons/fa6';

function toTitleCase(str: string) {
  if (str && typeof str === 'string') {
    return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
  }
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <h4 className="text-stone-400 font-bold text-lg mb-2 sm:mb-0">
          <FaFilter className="inline" />
        </h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 w-full sm:w-auto">
            <label htmlFor="category" className="text-gray-500 font-light">
              CATEGORY
            </label>
            <select id="category" value={category} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto">
              {SUPPORTED_PARAMS.CATEGORY.map(category => (
                <option key={category} value={category}>
                  {toTitleCase(category)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 w-full sm:w-auto">
            <label htmlFor="type" className="text-gray-500 font-light">
              TYPE
            </label>
            <select id="type" value={type} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto">
              {SUPPORTED_PARAMS.TYPE.map(type => (
                <option key={type} value={type}>
                  {toTitleCase(type)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 w-full sm:w-auto">
            <label htmlFor="sortBy" className="text-gray-500 font-light">
              SORT BY
            </label>
            <select id="sortBy" value={sortBy} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto">
              {SUPPORTED_PARAMS.SORT_BY.map(option => (
                <option key={option} value={option}>
                  {SORT_OPTION_LABELS[option]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
        <label htmlFor="limit" className="text-gray-500 font-bold">
          Items per page
        </label>
        <select id="limit" value={limit} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 w-full sm:w-auto">
          {SUPPORTED_PARAMS.LIMIT.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CatalogFilters;
