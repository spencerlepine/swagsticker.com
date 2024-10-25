'use client';

import CartItemCard from '@/components/CartItemCard';
import { formatPriceForDisplay } from '@/lib/stripe';
import { useShoppingCart } from 'use-shopping-cart';
import { CartItem } from '@/types';
import CheckoutButton from '@/components/CheckoutBtn';

export default function CartPage() {
  const { cartCount, cartDetails, removeItem, totalPrice, addItem, decrementItem } = useShoppingCart();
  const cartItems = Object.values(cartDetails ?? {});

  const handleRemove = (cartItem: CartItem) => {
    if (cartItem.quantity === 1) {
      removeItem(cartItem.id);
    } else {
      decrementItem(cartItem.id);
    }
  };

  const subtotal = formatPriceForDisplay(totalPrice);
  return (
    <div className="my-8 mx-20">
      <div className="flex justify-between items-center p-4">
        <span className="text-lg font-semibold">Subtotal: {subtotal}</span>
        <CheckoutButton cartCount={cartCount} cartItems={cartItems} />
      </div>

      {!cartItems ||
        (cartItems.length === 0 && (
          <div className="flex justify-center items-center my-32">
            <div className="text-center text-gray-500">
              <p className="text-xl font-bold">Cart is Empty</p>
              <p className="text-sm">Browse the catalog and add products to your cart.</p>
            </div>
          </div>
        ))}

      {cartItems && cartItems.length > 0 && (
        <ul>
          {cartItems.map(cartItem => (
            <CartItemCard key={cartItem.id} handleRemove={() => handleRemove(cartItem as CartItem)} handleAdd={() => addItem(cartItem)} cartItem={cartItem as CartItem} />
          ))}
        </ul>
      )}
    </div>
  );
}
