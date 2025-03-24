import Stripe from 'stripe';
import type { Stripe as StripeType } from 'stripe';
import { SwagCartItem } from '@/types';
import logger from './logger';
import { SwagOrderDetails } from '@/types';

// docs: https://docs.stripe.com
// keys: https://dashboard.stripe.com/apikeys
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'swagsticker-e-commerce',
    url: process.env.NEXT_PUBLIC_URL as string,
  },
});

export async function checkStripeStatus() {
  try {
    await stripe.accounts.list({ limit: 1 });
    return 'operational';
  } catch (error) {
    logger.error('[Status] Stripe status check failed', { error });
    return 'degraded';
  }
}

export const formatCartItemsForStripe = (cartItems: SwagCartItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return cartItems.map(cartItem => {
    const lineItem = {
      price_data: {
        currency: cartItem.currency,
        product_data: {
          name: cartItem.name,
          description: cartItem.description,
          // note: Stripe will reject localhost urls. override for development
          images: [process.env.NODE_ENV === 'production' ? `${process.env.NEXT_PUBLIC_URL}${cartItem.image}` : `https://swagsticker.com${cartItem.image}`], // up to 8 images
          metadata: {
            // pass metadata to stripe, (productId, size, category, ...)
            ...(cartItem.product_data || {}),
          },
        },
        unit_amount: Math.round(cartItem.price), // Convert price to cents for Stripe
      },
      quantity: cartItem.quantity,
      // (optional) Do not allow adjustable quantity
      adjustable_quantity: {
        enabled: false,
      },
    };

    return lineItem;
  });
};

export async function getChargesByEmail(customerEmail: string): Promise<StripeType.Charge[]> {
  try {
    const customer = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (customer.data.length === 0) {
      throw new Error(`No customer found with email: ${customerEmail}`);
    }

    const customerId = customer.data[0].id;

    const hundredEightyDaysAgo = Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60;
    const charges: StripeType.ApiList<StripeType.Charge> = await stripe.charges.list({
      customer: customerId,
      created: { gte: hundredEightyDaysAgo }, // Only charges from the last 180 days
    });

    return charges.data;
  } catch (error) {
    logger.error('Error fetching charges:', error);
    return [];
  }
}

export async function getOrdersByEmail(customerEmail: string): Promise<SwagOrderDetails[]> {
  const charges: StripeType.Charge[] = await getChargesByEmail(customerEmail);

  const formattedCharges = charges.map((charge: StripeType.Charge) => ({
    id: charge.metadata?.swagOrderId,
    printifyOrderId: charge.metadata?.printifyOrderId,
    swagOrderId: charge.metadata?.swagOrderId,
    date: new Date(charge.created * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    total: charge.amount / 100,
    address: charge.shipping?.address as StripeType.Address,
    last4: charge.payment_method_details?.card?.last4 || null,
    receiptUrl: charge.receipt_url || null,
  }));

  return formattedCharges;
}
