'use client';

import { SwagCartItem } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

interface CartSummaryProps {
  cartItems: SwagCartItem[];
  subtotal: string;
  shippingCost: string;
  orderSubtotal: string;
  isLoading?: boolean;
}

export default function CartSummary(props: CartSummaryProps) {
  const { cartItems, subtotal, shippingCost, orderSubtotal, isLoading = false } = props;
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const [isExpanded, setIsExpanded] = useState(false);

  const items = cartItems.map(item => ({
    image: item.image || '/images/placeholder-image.jpg',
    name: item.name || 'Unnamed Item',
    price: item.price || 0,
    quantity: item.quantity || 1,
  }));

  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ))}
      <div className="space-y-2 pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  const FullSummary = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{item.name}</p>
              <p className="text-sm text-gray-600">
                ${(item.price / 100).toFixed(2)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${(Number(subtotal) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>${(Number(shippingCost) / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>${(Number(orderSubtotal) / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <LoadingSkeleton />
      </div>
    );
  }

  if (isSmallScreen) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <button onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded} className="w-full text-left flex justify-between items-center py-2 font-medium">
          <span>Cart Summary</span>
          <span>
            ${(Number(orderSubtotal) / 100).toFixed(2)}
            <span className="ml-2">{isExpanded ? '▲' : '▼'}</span>
          </span>
        </button>
        {isExpanded && (
          <div className="mt-4">
            <FullSummary />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
      <FullSummary />
    </div>
  );
}
