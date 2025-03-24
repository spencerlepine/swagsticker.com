'use client';

import React, { useState } from 'react';
import CartItemCard from '@/components/CartItemCard';
import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { useShoppingCart } from 'use-shopping-cart';
import { SwagCartItem } from '@/types';
import { usePopupAlert } from '@/providers/AlertProvider';
import { useRouter } from 'next/navigation';
import { CartEntry } from 'use-shopping-cart/core';

export default function CartPage() {
  const { cartCount, cartDetails, removeItem, totalPrice, addItem, decrementItem } = useShoppingCart();
  const cartItems: CartEntry[] = Object.values(cartDetails ?? {});
  const { setAlert } = usePopupAlert();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = (cartItem: SwagCartItem) => {
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

  const handleAdd = (cartItem: SwagCartItem) => {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-0 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-lg font-semibold text-gray-900">
              Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}): {subtotal}
            </span>
            <button
              data-testid={`checkout-btn`}
              disabled={!cartCount || isLoading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleInitiateCheckout}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>

        {/* Empty Cart State */}
        {!cartItems ||
          (cartItems.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-gray-500">
                <p className="text-xl font-semibold mb-2">Your Cart is Empty</p>
                <p className="text-sm">Browse our catalog and add products to your cart.</p>
                <button onClick={() => router.push('/')} className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Start Shopping
                </button>
              </div>
            </div>
          ))}

        {/* Cart Items */}
        {cartItems && cartItems.length > 0 && (
          <div className="space-y-4">
            {cartItems.map(cartItem => (
              <CartItemCard key={cartItem.id} handleRemove={() => handleRemove(cartItem as SwagCartItem)} handleAdd={handleAdd} cartItem={cartItem as SwagCartItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
