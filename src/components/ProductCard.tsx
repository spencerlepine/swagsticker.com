import { DEFAULT_STICKER_SIZES } from '@/lib/products';
import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { Product } from '@/types';
import Image from 'next/image';
import { Suspense } from 'react';
import SkeletonLoader from './SkeletonLoader';

const ProductCard: React.FC<Product> = props => {
  const { id, name, image, defaultSize } = props;

  const stickerSize = defaultSize;
  // @ts-expect-error - no risk, unit test will ensure product has 'defaultSize'
  const stickerPrice = DEFAULT_STICKER_SIZES.find(item => item.value === stickerSize).price;
  const price = formatPriceForDisplay(stickerPrice);

  return (
    <div className="bg-white rounded-lg overflow-hidden w-full max-w-[200px] mx-auto sm:max-w-[280px] md:max-w-[220px] min-w-52">
      <a href={`/product/${id}`} className="block focus:border focus:border-blue-200 focus:border-2 focus:outline-none">
        <div className="relative aspect-square">
          <Suspense fallback={<SkeletonLoader />}>
            <Image width={250} height={250} src={image} alt={name} className="hover:scale-105 transition-transform transition-opacity duration-300 ease-in-out hover:opacity-75" />
          </Suspense>
        </div>
        <div className="py-4">
          <h3 className="text-md font-semibold text-gray-600 truncate">{name}</h3>
          <p className="text-lg font-bold">From {price}</p>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
