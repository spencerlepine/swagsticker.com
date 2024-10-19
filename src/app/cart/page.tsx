'use client';

import CartItemCard from '@/components/CartItemCard';
import { formatPriceForDisplay } from '@/lib/stripe';
import { useShoppingCart } from 'use-shopping-cart';
import { CartItem } from '@/types';

export default function CartPage() {
  const {
    cartCount,
    cartDetails,
    removeItem,
    totalPrice,
    // redirectToCheckout, // don't use this out-of-box, redirect with POST request from my route endpoint
    addItem,
    decrementItem,
  } = useShoppingCart();
  const cartItems = Object.values(cartDetails ?? {});

  async function handleCheckoutClick() {
    alert('feature: work-in-progress');
    // TODO_STRIPE
    // if (cartCount && cartCount > 0) {
    //   try {
    //     const res = await fetch('/api/v1/checkout', {
    //       method: 'POST',
    //       body: JSON.stringify(cartDetails),
    //     });
    //     const data = await res.json();
    //     // TODO_STRIPE - checkout redirect
    //     // instead of useShoppingCart stripe, use our own stripe-js
    //     const result = await redirectToCheckout(data.sessionId);
    //     if (result?.error) {
    //       console.error(result);
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
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
