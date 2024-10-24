import Stripe from 'stripe';
import { PRODUCT_CONFIG } from '@/lib/products';
import { CartItem } from '@/types';

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

export const formatPriceForDisplay = (amount: number = 0): string => {
  const numberFormat = new Intl.NumberFormat([PRODUCT_CONFIG.language], {
    style: 'currency',
    currency: PRODUCT_CONFIG.currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount / 100);
};

export const formatCartItemsForStripe = (cartItems: CartItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  return cartItems.map(cartItem => {
    const lineItem = {
      price_data: {
        currency: cartItem.currency,
        product_data: {
          name: cartItem.name,
          description: cartItem.description,
          images: [`${process.env.NEXT_PUBLIC_URL}${cartItem.image}`], // up to 8 images
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

// docs: https://docs.stripe.com/api/checkout/sessions/create
export async function createCheckoutSession(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  metadata: { [key: string]: string } = {}
): Promise<Stripe.Response<Stripe.Checkout.Session>> {
  return stripe.checkout.sessions.create({
    line_items: lineItems,
    metadata: metadata,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    // TODO_AUTH_ORDERS
    // customer: 'customerId',
    // customer_email: 'customer@gmail.com',
    shipping_address_collection: {
      allowed_countries: PRODUCT_CONFIG.allowCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
    // TODO_PRINTIFY - calculate this dynamically with Printify request  + USD 0.09 per item!
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 459,
            currency: PRODUCT_CONFIG.currency,
          },
          display_name: 'Standard',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 2,
            },
            maximum: {
              unit: 'business_day',
              value: 5,
            },
          },
        },
      },
      // {
      //   shipping_rate_data: {
      //     type: 'fixed_amount',
      //     fixed_amount: {
      //       amount: 429,
      //       currency: 'usd',
      //     },
      //     display_name: 'Economy',
      //     delivery_estimate: {
      //       minimum: {
      //         unit: 'business_day',
      //         value: 4,
      //       },
      //       maximum: {
      //         unit: 'business_day',
      //         value: 8,
      //       },
      //     },
      //   },
      // },
    ],
    automatic_tax: {
      enabled: true, // Enable tax based on location
    },
  });
}

// TODO_AUTH_ORDERS
export async function retrieveCheckoutSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });
}

export async function validateStripeSession(sessionId?: string) {
  if (!sessionId) return { validSession: false };

  try {
    const session = await retrieveCheckoutSession(sessionId);

    if (session.object !== 'checkout.session') return { validSession: false };

    // TODO_AUTH_ORDERS - only this users' orders

    return { validSession: true };
  } catch (error) {
    return { validSession: false };
  }
}
