import ProductCard from '@/components/ProductCard';
import CatalogPagination from '@/components/CatalogPagination';
import CatalogFilters from '@/components/CatalogFilters';
import validateSearchParams from '@/utils/validateSearchParams';
import { fetchProducts } from '@/lib/catalog';

export const dynamic = 'force-dynamic'; // Dynamic server-side rendering

const LandingPage: React.FC<{ searchParams: { [key: string]: string | undefined } }> = ({ searchParams }) => {
  const { page: currentPage, limit, ...catalogFilters } = validateSearchParams(searchParams);
  const { pageLimitIsReached, products } = fetchProducts(catalogFilters, currentPage, limit, catalogFilters.sortBy);

  return (
    <div className="my-8">
      <CatalogFilters catalogFilters={catalogFilters} />

      <hr className="my-3" />

      {!products || products.length === 0 ? (
        <div className="flex justify-center items-center my-32">
          <div className="text-center text-gray-500">
            <p className="text-xl font-bold">No Results Found</p>
            <p className="text-sm">We can&apos;t find any item matching your search.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-left my-4">
          {products.map(product => (
            <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 max-w-sm">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      )}

      <CatalogPagination pageLimitIsReached={pageLimitIsReached} catalogFilters={catalogFilters} />
    </div>
  );
};

export default LandingPage;
