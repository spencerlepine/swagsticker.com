import { NextRequest, NextResponse } from 'next/server';
import { withAuthHandler } from '@/lib/auth';
import { withErrorHandler } from '@/utils/errors';
import validateCartItems from '@/utils/validateCartItems';
import logger from '@/lib/logger';
import { CartItem, MetadataCartItem } from '@/types';

/**
 * @route POST /api/v1/checkout/create-payment-intent
 * @description Creates a Stripe payment intent for checkout. Requires authentication
 * @request {Object} { "cartItems": [{ "name": "string", "quantity": number, "price": number, "image": "string", "product_data": { "size": "string", "productId": "string" } }] }
 * @response {200} { "clientSecret": "pi_..." }
 */
export const POST = withErrorHandler(
  withAuthHandler(async (request: NextRequest, context, email: string) => {
    const { stripe } = await import('@/lib/stripe');
    const { retrieveShippingCost } = await import('@/lib/printify');

    const swagTraceId = request.headers.get('x-swag-trace-id');
    const swagOrderId = crypto.randomUUID();
    const body = await request.json();
    const { cartItems: clientCartItems } = body;

    logger.info('[Checkout] Validating cart items', { swagTraceId });
    const cartItems: CartItem[] = validateCartItems(clientCartItems);

    logger.info('[Printify] calculating shipping methods', { swagTraceId });
    const shippingMethod = await retrieveShippingCost();
    const additionalItemCount = cartItems.length - 1;
    const totalShippingCost = shippingMethod.first_item.cost + additionalItemCount * shippingMethod.additional_items.cost;
    const itemsCost = cartItems.reduce((acc, item) => acc + item.price, 0);
    const orderSubtotal = itemsCost + totalShippingCost;

    logger.info('[Stripe] fetching customer info', { swagTraceId });
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer =
      customers.data[0] ||
      (await stripe.customers.create({
        email,
        name: email, // placeholder name
        description: 'SwagSticker Customer',
        phone: '+1234567890', // placeholder #
      }));

    logger.info('[Stripe] creating payment intent', { swagTraceId });
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'usd',
      amount: orderSubtotal,
      automatic_payment_methods: { enabled: true },
      metadata: {
        subtotal: itemsCost,
        shippingCost: totalShippingCost,
        orderSubtotal,
        swagOrderId,
        cartItems: JSON.stringify(
          cartItems.map(
            item =>
              ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
                product_data: { size: item.product_data.size, productId: item.product_data.productId },
              } as MetadataCartItem)
          )
        ),
      },
      customer: customer.id,
      receipt_email: email,
      use_stripe_sdk: true,
      capture_method: 'manual',
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  })
);
