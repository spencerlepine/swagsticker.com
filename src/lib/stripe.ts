import Stripe from 'stripe';
import { PRODUCT_CONFIG } from '@/lib/products';
import { CartItem, PrintifyShippingProfile, StripeShippingMethod } from '@/types';
import logger from './logger';

// docs: https://docs.stripe.com
// keys: https://dashboard.stripe.com/apikeys
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20',
  appInfo: {
    name: 'swagsticker-ecommerce',
    url: process.env.NEXT_PUBLIC_URL as string,
  },
});

export const formatCartItemsForStripe = (cartItems: CartItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return cartItems.map(cartItem => {
    const lineItem = {
      price_data: {
        currency: cartItem.currency,
        product_data: {
          name: cartItem.name,
          description: 'cartItem.description', // cartItem.description,
          // images: [`${process.env.NEXT_PUBLIC_URL}${cartItem.image}`], // up to 8 images
          images: [`https://swagsticker.com${cartItem.image}`], // up to 8 images
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

const calculateStripeShipping = (cartItemCount: number, shippingMethod: PrintifyShippingProfile): StripeShippingMethod => {
  const additionalItemCount = cartItemCount - 1;
  const totalShippingCost = shippingMethod.first_item.cost + additionalItemCount * shippingMethod.additional_items.cost;

  return {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: totalShippingCost,
        currency: shippingMethod.first_item.currency,
      },
      display_name: `Shipping to US (Standard)`,
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 2, // hard-coded, based on website (could pull from shippingMethod.handling_time)
        },
        maximum: {
          unit: 'business_day',
          value: 5, // hard-coded, based on website (could pull from shippingMethod.handling_time)
        },
      },
    },
  };
};

// docs: https://docs.stripe.com/api/checkout/sessions/create
export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingMethod: PrintifyShippingProfile,
  metadata: { [key: string]: string } = {}
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  logger.info('[Stripe] Formatting shipping methods for Stripe');
  const stripeShippingMethod: StripeShippingMethod = calculateStripeShipping(cartItems.length, shippingMethod);

  logger.info('[Stripe] Formatting cart items for Stripe');
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = formatCartItemsForStripe(cartItems);
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    payment_method_types: ['card'],
    line_items: stripeLineItems,
    metadata: metadata,
    mode: 'payment',
    return_url: `${process.env.NEXT_PUBLIC_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    shipping_address_collection: {
      // US-only
      allowed_countries: PRODUCT_CONFIG.allowCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
    shipping_options: [stripeShippingMethod],
    automatic_tax: { enabled: true },
    // customer: 'customerId',
    // customer_email: 'customer@gmail.com',
  });

  return session;
}
