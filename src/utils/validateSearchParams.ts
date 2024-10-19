import { SUPPORTED_PARAMS } from '@/lib/catalog';
import { Category, FilterSearchParams, SortByOption, Type } from '@/types';

const validateSearchParams = (searchParams: { [key: string]: string | undefined }): FilterSearchParams => {
  const filters: FilterSearchParams = {};

  const page = parseInt(searchParams['page'] || '', 10);
  filters.page = !isNaN(page) && page > 1 ? page : undefined;

  const limit = parseInt(searchParams['limit'] || '', 10);
  filters.limit = SUPPORTED_PARAMS.LIMIT.includes(limit) ? limit : undefined;

  const category = searchParams['category'];
  filters.category = category && SUPPORTED_PARAMS.CATEGORY.includes(category) && category !== 'All' ? (category as Category) : undefined;

  const type = searchParams['type'];
  filters.type = type && SUPPORTED_PARAMS.TYPE.includes(type) && type !== 'All' ? (type as Type) : undefined;

  const sortBy = searchParams['sortBy'];
  filters.sortBy = sortBy && SUPPORTED_PARAMS.SORT_BY.includes(sortBy) && sortBy !== 'All' ? (sortBy as SortByOption) : undefined;

  const query = searchParams['query'];
  if (query) {
    filters.query = query;
  }

  return filters;
};

export default validateSearchParams;
