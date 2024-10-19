import { getRelatedProductsByCategory } from '@/lib/catalog';
import ProductCard from './ProductCard';
import { Category } from '@/types';

const RelatedProducts: React.FC<{ productId: string; category: Category }> = ({ productId, category }) => {
  const relatedProducts = getRelatedProductsByCategory(productId, category, 10);

  if (!relatedProducts || relatedProducts.length < 5) return null;

  return (
    <section className="w-full my-8">
      <h2 className="font-semibold text-2xl mb-2">Related</h2>
      <div className=" flex gap-4 overflow-x-auto justify-start">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
