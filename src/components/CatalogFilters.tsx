'use client';

import { useRouter } from 'next/navigation';
import { FilterSearchParams } from '@/types';
import { SUPPORTED_PARAMS, SUPPORTED_SORT_OPTIONS } from '@/lib/catalog';

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
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <h4 className="text-gray-500 font-bold text-lg">Filter |</h4>
        <label htmlFor="category" className="text-gray-500 font-light">
          CATEGORY
        </label>
        <select id="category" value={category} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 inline">
          {SUPPORTED_PARAMS.CATEGORY.map(category => (
            <option key={category} value={category}>
              {toTitleCase(category)}
            </option>
          ))}
        </select>
        <label htmlFor="type" className="text-gray-500 font-light">
          TYPE
        </label>
        <select id="type" value={type} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 inline">
          {SUPPORTED_PARAMS.TYPE.map(type => (
            <option key={type} value={type}>
              {toTitleCase(type)}
            </option>
          ))}
        </select>
        <label htmlFor="sortBy" className="text-gray-500 font-light">
          SORT BY
        </label>
        <select id="sortBy" value={sortBy} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 inline">
          {SUPPORTED_PARAMS.SORT_BY.map(option => (
            <option key={option} value={option}>
              {SORT_OPTION_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="limit" className="text-gray-500 font-bold">
          Items per page
        </label>
        <select id="limit" value={limit} onChange={handleDropdownChange} className="border border-gray-300 rounded px-2 py-1 inline">
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
