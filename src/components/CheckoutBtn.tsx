'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { CartEntry } from 'use-shopping-cart/core';

const CheckoutButton: React.FC<{ cartCount?: number; cartItems: CartEntry[] }> = ({ cartCount, cartItems }) => {
  const router = useRouter();
  const isProcessing = useRef(false);
  const [error, setError] = useState('');

  const handleCheckoutClick = async () => {
    if (!cartCount || cartCount === 0 || isProcessing.current) {
      return;
    }

    isProcessing.current = true;

    try {
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({ cartItems }),
      });

      const { checkoutUrl } = await res.json();
      if (!checkoutUrl) {
        setError('Unable to checkout at this time. Please try again later.');
        return;
      }
      router.push(checkoutUrl);
    } catch (err) {
      console.error('Checkout request threw an error', err, error);
      setError('An error occurred during checkout. Please try again later.');
    } finally {
      isProcessing.current = false;
    }
  };

  return (
    <button disabled={cartCount === 0 || isProcessing.current} className="bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none" onClick={handleCheckoutClick}>
      Checkout
    </button>
  );
};

export default CheckoutButton;
