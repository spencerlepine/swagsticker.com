import Stripe from 'stripe';
import { PRODUCT_CONFIG } from '@/lib/products';

// .env.template
// NEXT_PUBLIC_STRIPE_KEY="pk_asdfasdfasdfasdfasdf"
// STRIPE_SECRET_KEY="sk_asdfasdfasdfasdfasdf"
// NEXT_PUBLIC_URL=http://localhost:3000

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'swagsticker-ecommerce',
    url: process.env.NEXT_PUBLIC_URL as string,
  },
});

export const formatPriceForDisplay = (amount: number = 0): string => {
  const numberFormat = new Intl.NumberFormat([PRODUCT_CONFIG.language], {
    style: 'currency',
    currency: PRODUCT_CONFIG.currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount / 100);
};

// TODO_STRIPE
export const formatCartItemsForStripe = () => {};

// TODO_STRIPE (see notion)
