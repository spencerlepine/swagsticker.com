'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { useShoppingCart } from 'use-shopping-cart';

const OrderConfirmation = () => {
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex justify-center items-center my-32">
      <div className="text-center">
        <Image width={100} height={100} src="/icons/check-mark.png" alt="Check Mark Icon" className="w-32 h-32 object-cover mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Thank you for your order!</h3>
        <p className="text max-w-md text-gray-500">Your order has been placed. When ready, a shipping tracking number will be sent via email.</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
