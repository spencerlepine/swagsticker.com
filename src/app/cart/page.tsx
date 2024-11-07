'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import CartItemCard from '@/components/CartItemCard';
import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { useShoppingCart } from 'use-shopping-cart';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';

export default function CartPage() {
  const { cartCount, cartDetails, removeItem, totalPrice, addItem, decrementItem } = useShoppingCart();
  const cartItems = Object.values(cartDetails ?? {});
  const router = useRouter();

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleRemove = (cartItem: CartItem) => {
    if (cartItem.quantity === 1) {
      removeItem(cartItem.id);
    } else {
      decrementItem(cartItem.id);
    }
  };

  const fetchClientSecret = () => {
    return fetch('/api/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cartItems }),
    })
      .then(res => {
        if (!res.ok) {
          router.push('/signin');
          throw new Error('Failed to fetch client secret');
        }
        return res.json();
      })
      .then(data => data.client_secret)
      .catch(error => {
        console.error(error);
      });
  };

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
  };

  if (showCheckout) {
    return (
      <div className="py-4 my-8">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  const subtotal = formatPriceForDisplay(totalPrice);
  return (
    <div className="my-8 mx-20">
      <div className="flex justify-between items-center p-4">
        <span className="text-lg font-semibold">Subtotal: {subtotal}</span>
        <button disabled={!cartCount} className="btn bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none" onClick={handleCheckoutClick}>
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
