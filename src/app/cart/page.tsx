'use client';

import React, { useState } from 'react';
import CartItemCard from '@/components/CartItemCard';
import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { useShoppingCart } from 'use-shopping-cart';
import { CartItem } from '@/types';
import { usePopupAlert } from '@/providers/AlertProvider';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartCount, cartDetails, removeItem, totalPrice, addItem, decrementItem } = useShoppingCart();
  const cartItems = Object.values(cartDetails ?? {});
  const { setAlert } = usePopupAlert();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = (cartItem: CartItem) => {
    try {
      if (cartItem.quantity === 1) {
        removeItem(cartItem.id);
      } else {
        decrementItem(cartItem.id);
      }
    } catch (error) {
      setAlert('Failed to remove cart item', 'error');
      console.error('RemoveFromCartBtn error', error);
    }
  };

  const handleAdd = (cartItem: CartItem) => {
    try {
      addItem(cartItem);
    } catch (error) {
      setAlert('Failed to add cart item', 'error');
      console.error('AddToCartBtn error', error);
    }
  };

  const handleInitiateCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/checkout/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          router.push('/signin');
          return;
        }
        throw new Error('Checkout error');
      }

      const { clientSecret } = await response.json();
      if (!clientSecret) {
        throw new Error('Client secret not received');
      }

      router.push(`/checkout?clientSecret=${clientSecret}`);
    } catch (error) {
      setAlert('Checkout is currently unavailable', 'error');
      console.error('CheckoutBtn error', error);
      router.push(`/cart`);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = formatPriceForDisplay(totalPrice);
  return (
    <div className="my-8 mx-20">
      <div className="flex justify-between items-center p-4">
        <span className="text-lg font-semibold">Subtotal: {subtotal}</span>
        <button
          data-testid={`checkout-btn`}
          disabled={!cartCount || isLoading}
          className="btn bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none"
          onClick={handleInitiateCheckout}
        >
          {isLoading ? 'Processing...' : 'Checkout'}
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
            <CartItemCard key={cartItem.id} handleRemove={() => handleRemove(cartItem as CartItem)} handleAdd={handleAdd} cartItem={cartItem as CartItem} />
          ))}
        </ul>
      )}
    </div>
  );
}
