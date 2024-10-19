'use client';

import { Product, Size } from '@/types';
import AddToCartBtn from './AddToCartBtn';
import { formatPriceForDisplay } from '@/lib/stripe';
import { useState } from 'react';
import { DEFAULT_STICKER_SIZES } from '@/lib/products';

const getStickerPrice = (size: Size): number => {
  // @ts-expect-error - no risk, values are validated in unit test
  const stickerPrice = DEFAULT_STICKER_SIZES.find(item => item.value === size).price;
  return stickerPrice;
};

const ProductSizeSelector: React.FC<{ product: Product }> = ({ product }) => {
  const { sizes, defaultSize } = product;
  const defaultPrice = getStickerPrice(defaultSize);

  const [selectedSize, setSelectedSize] = useState(defaultSize);
  const [price, setPrice] = useState(defaultPrice);

  const handleSizeSelection = (newSize: Size) => {
    if (newSize !== selectedSize) {
      setSelectedSize(newSize);
      setPrice(getStickerPrice(newSize));
    }
  };

  return (
    <>
      <p className="text-xl text-gray-700 mb-8">{formatPriceForDisplay(price)}</p>
      <h4 className="text-lg font-semibold inline">Size</h4>
      <div className="flex space-x-2 mt-2">
        {sizes.map(({ value: size }) => (
          <button
            key={size}
            onClick={() => handleSizeSelection(size as Size)}
            className={`border rounded-md px-4 py-1 text-md hover:bg-gray-300 ${selectedSize === size && 'bg-gray-300'}`}
          >
            {size}
          </button>
        ))}
      </div>
      <AddToCartBtn productId={product.id} size={selectedSize} price={price} />
    </>
  );
};

export default ProductSizeSelector;
