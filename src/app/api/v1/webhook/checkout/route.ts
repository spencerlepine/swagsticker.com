import type { Stripe as StripeType } from 'stripe';
import { retrieveCheckoutSession, stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderToProduction } from '@/lib/printify';
import logger from '@/lib/logger';

export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  try {
    logger.info('[Stripe Webhook] Processing Stripe webhook request');

    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) {
      logger.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET environment variable');
      throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }

    const body = await (await request.blob()).text();
    const signature = request.headers.get('stripe-signature') as string;
    const event: StripeType.Event = stripe.webhooks.constructEvent(body, signature, secret);

    const permittedEvents: string[] = ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed'];
    if (permittedEvents.includes(event.type)) {
      let data;

      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as StripeType.Checkout.Session;

          const printifyOrderId = event.data.object?.metadata?.printifyOrderId;
          if (!printifyOrderId) {
            logger.warn(`[Stripe Webhook] Missing printifyOrderId in metadata for session ${data.id}. Unable to fullfil order`, { sessionId: data.id, correlationId });
            throw new Error(`missing printifyOrderId on metadata, ${data.id}`);
          }

          logger.info('[Stripe Webhook] Verifying payment status for Checkout Session', { sessionId: data.id, correlationId });
          const checkoutSession = await retrieveCheckoutSession(data.id);
          if (checkoutSession.payment_status === 'unpaid') {
            logger.warn('[Stripe Webhook] Cannot fulfill an unpaid order', { sessionId: data.id, correlationId });
            return NextResponse.json({ message: 'Cannot fullfil an unpaid order' }, { status: 400 });
          }

          logger.info('[Printify] Sending order to production', { sessionId: data.id, correlationId, printifyOrderId });
          await sendOrderToProduction(printifyOrderId);

          logger.info('[Stripe Webhook] Successfully fulfilled order', { sessionId: data.id, correlationId, printifyOrderId });
          return NextResponse.json({ result: event, ok: true });

        case 'payment_intent.payment_failed':
          data = event.data.object as StripeType.PaymentIntent;
          logger.error('[Stripe Webhook] Payment failed', { message: data.last_payment_error?.message, sessionId: data.id });
          break;

        case 'payment_intent.succeeded':
          data = event.data.object as StripeType.PaymentIntent;
          logger.info('[Stripe Webhook] PaymentIntent succeeded', { status: data.status, sessionId: data.id });
          break;

        default:
          data = (event.data.object as unknown) || {};
          // @ts-expect-error - ignore "Property 'id' does not exist on type '{}'.ts(2339)"
          logger.warn('[Stripe Webhook] Unhandled event type', { eventType: event.type, sessionId: data?.id });
          return NextResponse.json({ result: event, ok: true });
      }
    }

    logger.info('[Stripe Webhook] Webhook processing complete', { eventId: event.id });
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    logger.error('[Stripe Webhook] Error processing webhook request', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
