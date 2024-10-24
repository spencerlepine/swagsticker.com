import type { Stripe as StripeType } from 'stripe';
import { retrieveCheckoutSession, stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderToProduction } from '@/lib/printify';

export const POST = async (request: NextRequest) => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) {
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
            throw new Error(`missing printifyOrderId on metadata, ${data.id}`);
          }

          // Make sure fulfillment hasn't already been preformed for this Checkout Session
          const checkoutSession = await retrieveCheckoutSession(data.id);
          if (checkoutSession.payment_status === 'unpaid') {
            console.error('[Stripe] Webhook error: Cannot fullfil an unpaid order');
            return NextResponse.json({ message: 'Cannot fullfil an unpaid order' }, { status: 400 });
          }

          const { success } = await sendOrderToProduction(printifyOrderId);
          if (!success) {
            console.error('[Printify] unable to publish Printify order');
            return NextResponse.json({ message: 'Unable to checkout cart items' }, { status: 400 });
          }

          return NextResponse.json({ result: event, ok: true });
        case 'payment_intent.payment_failed':
          data = event.data.object as StripeType.PaymentIntent;
          console.error(`[Stripe Webhook Event] ❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded':
          data = event.data.object as StripeType.PaymentIntent;
          console.info(`[Stripe Webhook Event] 💰 PaymentIntent status: ${data.status}`);
          break;
        default:
          console.warn(`[Stripe Webhook Event] Unhandled event: ${event.type}`);
          return NextResponse.json({ result: event, ok: true });
      }
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('[Stripe] Error processing webhook request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
