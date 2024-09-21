import React from 'react';
import CatalogFilters from '@/components/CatalogFilters';
import ProductCard from '@/components/ProductCard';
import { DUMMY_PRODUCTS } from '@/demoData';
import { Product } from '@/types';

export default function LandingPage() {
  const ITEMS_PER_PAGE_LIMIT = 25;
  const catalogProducts: Product[] = DUMMY_PRODUCTS.slice(0, ITEMS_PER_PAGE_LIMIT);

  return (
    <>
      <CatalogFilters />

      {catalogProducts && catalogProducts.length > 0 && (
        <div className="">
          {catalogProducts.map(product => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      )}
    </>
  );
}
