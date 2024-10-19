'use client';

import { PRODUCT_CONFIG } from '@/lib/products';
import { ReactNode } from 'react';
import { CartProvider as USCProvider } from 'use-shopping-cart';

export default function CartProvider({ children }: { children: ReactNode }) {
  return (
    <USCProvider
      mode="payment"
      cartMode="client-only"
      stripe="ignore-me-not-used"
      successUrl="ignore-me-not-used"
      cancelUrl="ignore-me-not-used"
      billingAddressCollection={true}
      shouldPersist={true}
      currency={PRODUCT_CONFIG.currency}
      allowedCountries={PRODUCT_CONFIG.allowCountries}
      language={PRODUCT_CONFIG.language}
    >
      {children}
    </USCProvider>
  );
}
