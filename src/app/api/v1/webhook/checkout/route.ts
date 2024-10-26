import type { Stripe as StripeType } from 'stripe';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { createDraftOrder } from '@/lib/printify';

export const POST = async (request: NextRequest) => {
  try {
    const body = await (await request.blob()).text();
    const signature = request.headers.get('stripe-signature') as string;
    const event: StripeType.Event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);

    const permittedEvents: string[] = ['checkout.session.completed', 'payment_intent.succeeded', 'payment_intent.payment_failed'];
    if (permittedEvents.includes(event.type)) {
      let data;

      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as StripeType.Checkout.Session;
          logger.info('[Stripe Webhook] Checkout succeeded', { eventType: event.type, sessionId: data.id, eventId: event.id });

          logger.info('[Stripe Webhook] Retrieving line_items', { sessionId: data.id });
          const line_items = await stripe.checkout.sessions.listLineItems(data.id, {
            expand: ['data.price.product'],
          });
          const email = data?.customer_details?.email || '';
          const phone = data?.customer_details?.phone || '';

          const swagOrderId = data.metadata?.swagOrderId;
          if (!swagOrderId) {
            logger.warn(`[Stripe Webhook] Missing swagOrderId in metadata for session ${data.id}. Unable to fullfil order`, { sessionId: data.id, eventId: event.id });
            throw new Error(`missing swagOrderId on metadata, ${data.id}`);
          }

          logger.info('[Printify] Creating Printify draft order');
          const { id: printifyOrderId } = await createDraftOrder(line_items.data, data.shipping_details, swagOrderId, data.id, email, phone);

          // TODO_PRINTIFY - validate publish endpoint! - curl request always works..
          logger.info('[Printify] Fullfilling order', { eventType: event.type, sessionId: data.id, printifyOrderId, eventId: event.id });
          // await sendOrderToProduction(printifyOrderId);
          break;

        case 'payment_intent.payment_failed':
          data = event.data.object as StripeType.PaymentIntent;
          logger.error('[Stripe Webhook] Payment failed', { message: data.last_payment_error?.message, eventType: event.type, sessionId: data.id, eventId: event.id });
          break;

        case 'payment_intent.succeeded':
          data = event.data.object as StripeType.PaymentIntent;
          logger.info('[Stripe Webhook] PaymentIntent succeeded', { eventType: event.type, status: data.status, sessionId: data.id, eventId: event.id });
          break;

        default:
          // fallback, not used
          data = (event.data.object as unknown) || {};
          return NextResponse.json({ result: event, ok: true });
      }
    }

    logger.info('[Stripe Webhook] Processed request', { eventType: event.type });
    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    logger.error('[Stripe Webhook] Error processing webhook request', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
