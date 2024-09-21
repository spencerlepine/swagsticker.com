import React from 'react';
import Product from '@/types/Product';
import AddToCartBtn from './AddToCartBtn';
import Image from 'next/image';

const ProductCard: React.FC<Product> = props => {
  const { slug, title, thumbnailUrl, price, sizes } = props;
  return (
    <div>
      <a href={`/product/${slug}`}>
        <p>{title}</p>
        <Image alt={title} src={thumbnailUrl} width={100} height={100} />
        <p>${price}</p>
      </a>
      <AddToCartBtn productSlug={slug} size={sizes[0]} />
    </div>
  );
};

export default ProductCard;
