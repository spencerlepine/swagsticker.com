'use client';

import { getProductById } from '@/lib/catalog';
import { PRODUCT_CONFIG } from '@/lib/products';
import { CartItem } from '@/types';
import { useShoppingCart } from 'use-shopping-cart';

const AddToCartBtn: React.FC<{ productId: string; size: string; price: number }> = ({ productId, size, price }) => {
  const { addItem } = useShoppingCart();

  const handleAddtoCart = () => {
    const product = getProductById(productId);
    if (!product) return;

    const cartItemId = `${productId}-${size}`;
    const cartItem: CartItem = {
      ...product,
      id: cartItemId,
      price: price,
      currency: PRODUCT_CONFIG.currency,
      product_data: { productId, size, category: product.category, type: product.type },
    };
    addItem(cartItem);
  };

  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full" onClick={handleAddtoCart}>
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
