import { NextRequest, NextResponse } from 'next/server';
import { withAuthHandler } from '@/lib/auth';
import { withErrorHandler, UserError, AuthError } from '@/utils/errors';
import logger from '@/lib/logger';
import { sendOrderNotifEmail } from '@/lib/mailer';
import { type Address as PrintifyAddress } from 'printify-sdk-js';
import type { Stripe as StripeType } from 'stripe';
import { MetadataCartItem } from '@/types';

/**
 * @route POST /api/v1/checkout/order-confirmation
 * @description Captures a Stripe payment intent and creates a Printify draft order. Requires authentication.
 * @request {Object} { "paymentIntentId": "pi_..." }
 * @response {200} { "orderId": "printify_order_id", "swagOrderId": "swag_order_id" }
 */
export const POST = withErrorHandler(
  withAuthHandler(async (request: NextRequest, context, email: string) => {
    const { createDraftOrder } = await import('@/lib/printify');
    const { stripe } = await import('@/lib/stripe');

    const swagTraceId = request.headers.get('x-swag-trace-id');
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      throw new UserError('paymentIntentId is required');
    }

    // Validate payment intent status
    const paymentIntent: StripeType.PaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'requires_capture') {
      throw new UserError('PaymentIntent cannot be captured');
    }

    // Validate email matches
    if (email !== paymentIntent.receipt_email) {
      throw new AuthError('Email does not match the PaymentIntent');
    }

    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    const customer: StripeType.Customer = customers.data[0];
    const printifyAddress: PrintifyAddress = {
      first_name: customer.name?.split(' ')[0] || email,
      last_name: customer.name?.split(' ')[1] || '',
      email: email,
      phone: paymentIntent.shipping?.phone || '',
      country: paymentIntent.shipping?.address?.country || '',
      region: paymentIntent.shipping?.address?.state || '',
      address1: paymentIntent.shipping?.address?.line1 || '',
      address2: paymentIntent.shipping?.address?.line2 || '',
      city: paymentIntent.shipping?.address?.city || '',
      zip: paymentIntent.shipping?.address?.postal_code || '',
    };

    // Create Printify draft order
    logger.info('[Checkout] creating draft order', { swagTraceId, swagOrderId: paymentIntent.metadata.swagOrderId });
    const { id: printifyOrderId } = await createDraftOrder(JSON.parse(paymentIntent.metadata.cartItems) as MetadataCartItem[], printifyAddress, paymentIntent.metadata.swagOrderId);

    // Parallel operations - update metadata and send email
    const results = await Promise.allSettled([
      stripe.paymentIntents.update(paymentIntentId, {
        metadata: { printifyOrderId },
      }),
      stripe.charges.update(paymentIntent.latest_charge as string, {
        metadata: {
          printifyOrderId,
          cartItems: paymentIntent.metadata.cartItems,
          swagOrderId: paymentIntent.metadata.swagOrderId,
        },
      }),
      sendOrderNotifEmail(paymentIntent.metadata.swagOrderId, printifyOrderId, paymentIntentId, email),
    ]);
    results.forEach(result => {
      if (result.status === 'rejected') {
        throw new Error(`Unable to send email`, result.reason);
      }
    });

    // Capture the payment
    logger.info('[Checkout] capturing payment', {
      swagTraceId,
      printifyOrderId,
      paymentIntentId,
    });
    await stripe.paymentIntents.capture(paymentIntentId);

    return NextResponse.json({ orderId: printifyOrderId, swagOrderId: paymentIntent.metadata.swagOrderId }, { status: 200 });
  })
);
