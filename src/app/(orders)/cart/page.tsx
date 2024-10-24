'use client';

import { useRouter } from 'next/navigation';
import CartItemCard from '@/components/CartItemCard';
import { formatPriceForDisplay } from '@/lib/stripe';
import { useShoppingCart } from 'use-shopping-cart';
import { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();

  const { cartCount, cartDetails, removeItem, totalPrice, addItem, decrementItem } = useShoppingCart();
  const cartItems = Object.values(cartDetails ?? {});

  async function handleCheckoutClick() {
    // TODO_CHECKOUT - debounce click
    // TODO_CHECKOUT - error message popup
    if (!cartCount || cartCount === 0) {
      return;
    }

    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({ cartItems }),
      });
      const { checkoutUrl } = await res.json();
      if (!checkoutUrl) return alert('Unable to checkout at this time. Please try again later.');
      router.push(checkoutUrl);
    } catch (error) {
      console.error('Checkout request threw an error', error);
    }
  }

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
        <button disabled={cartCount === 0} className="bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none" onClick={handleCheckoutClick}>
          Checkout
        </button>
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
