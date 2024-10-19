import Fuse from 'fuse.js';
import { STICKER_PRICES, STICKER_PRODUCTS } from '@/lib/products';
import { Category, FetchProductsFilters, PaginatedProducts, Product } from '@/types';

export const CATALOG_CONFIG = {
  maxPerPageLimit: 50,
  defaultPerPageLimit: 20,
};

export const SUPPORTED_SORT_OPTIONS = {
  NAME_ALPHABETICAL: 'alphabetical',
  DATE_NEWEST: 'newest',
  FEATURED: 'featured',
  PRICE_HIGH_TO_LOW: 'price-desc',
  PRICE_LOW_TO_HIGH: 'price-asc',
};

export const SUPPORTED_PARAMS = {
  CATEGORY: ['All', 'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'data-science', 'developer', 'mobile', 'ai', 'database'],
  TYPE: ['All', 'sticker', 'pack'],
  SORT_BY: [
    SUPPORTED_SORT_OPTIONS.FEATURED,
    SUPPORTED_SORT_OPTIONS.NAME_ALPHABETICAL,
    SUPPORTED_SORT_OPTIONS.DATE_NEWEST,
    SUPPORTED_SORT_OPTIONS.PRICE_HIGH_TO_LOW,
    SUPPORTED_SORT_OPTIONS.PRICE_LOW_TO_HIGH,
  ],
  LIMIT: [10, CATALOG_CONFIG.defaultPerPageLimit, CATALOG_CONFIG.maxPerPageLimit],
};

export const fetchProducts = (
  filters: FetchProductsFilters = {},
  page: number = 1,
  limit: number = CATALOG_CONFIG.defaultPerPageLimit,
  sortBy: string = SUPPORTED_SORT_OPTIONS.FEATURED
): PaginatedProducts => {
  const { category, type, query } = filters;

  // 1. Filter Products
  // let filteredProducts = STICKER_PRODUCTS.filter(product => {
  //   // @ts-expect-error - ignore this
  //   const categoryMatch = category === 'All' ? true : product.category === category
  //   // @ts-expect-error - ignore this too
  //   const typeMatch = type === 'All' ? true : product.type === type
  //   return categoryMatch && typeMatch;
  // });
  let filteredProducts = STICKER_PRODUCTS.filter(product => {
    let keepProduct = true;
    // @ts-expect-error - ignore this
    if (category && category !== 'All' && product.category !== category) {
      keepProduct = false;
    }
    // @ts-expect-error - ignore this
    if (type && type !== 'All' && product.type !== type) {
      keepProduct = false;
    }
    return keepProduct;
  });

  // 2. Search Products
  if (query) {
    const fuse = new Fuse(filteredProducts, {
      keys: ['name'],
      includeScore: true,
    });

    const results = fuse.search(query);
    filteredProducts = results.map(result => result.item);
  }

  // 3. Sort Products
  if (sortBy !== SUPPORTED_SORT_OPTIONS.FEATURED) {
    const sortedProducts = filteredProducts.sort((productA: Product, productB: Product) => {
      if (sortBy === SUPPORTED_SORT_OPTIONS.DATE_NEWEST) {
        return new Date(productA.dateAdded).getTime() - new Date(productB.dateAdded).getTime();
      }

      if (sortBy === SUPPORTED_SORT_OPTIONS.NAME_ALPHABETICAL) {
        return productA.name.localeCompare(productB.name);
      }
      if (sortBy === SUPPORTED_SORT_OPTIONS.PRICE_HIGH_TO_LOW) {
        return STICKER_PRICES[productB.defaultSize] - STICKER_PRICES[productA.defaultSize];
      }

      if (sortBy === SUPPORTED_SORT_OPTIONS.PRICE_LOW_TO_HIGH) {
        return STICKER_PRICES[productA.defaultSize] - STICKER_PRICES[productB.defaultSize];
      }

      return 0;
    });
    filteredProducts = sortedProducts;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalCount = filteredProducts.length;

  const pageLimitIsReached = page * limit >= totalCount;

  return {
    products: paginatedProducts,
    pageLimitIsReached: pageLimitIsReached,
  };
};

export const getProductById = (id: string): Product | undefined => STICKER_PRODUCTS.find(product => product.id === id);

export const getRelatedProductsByCategory = (productId: string, category: Category, limit: number): Product[] => {
  return STICKER_PRODUCTS.filter(product => product.category === category && product.id !== productId).slice(0, limit);
};
