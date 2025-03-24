'use client';

import { getProductById } from '@/lib/catalog';
import { PRODUCT_CONFIG } from '@/lib/products';
import { usePopupAlert } from '@/providers/AlertProvider';
import { SwagCartItem } from '@/types';
import { useShoppingCart } from 'use-shopping-cart';

const AddToCartBtn: React.FC<{ productId: string; size: string; price: number }> = ({ productId, size, price }) => {
  const { addItem } = useShoppingCart();
  const { setAlert } = usePopupAlert();

  const handleAddToCart = () => {
    const product = getProductById(productId);
    if (!product) return;

    const cartItemId = `${productId}-${size}`;
    const cartItem: SwagCartItem = {
      ...product,
      id: cartItemId,
      price: price,
      currency: PRODUCT_CONFIG.currency,
      product_data: { productId, size, category: product.category, type: product.type },
      quantity: 1,
    };

    try {
      addItem(cartItem);
      setAlert('Item added to cart', 'info');
    } catch (error) {
      setAlert('Failed to add item to cart', 'error');
      console.error('AddToCartBtn error', error);
    }
  };

  return (
    <button data-testid={`addtocart-btn`} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full" onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
