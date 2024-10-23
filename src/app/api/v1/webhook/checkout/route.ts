import type { Stripe as StripeType } from 'stripe';
import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

async function fulfillCheckout(printifyOrderId: string) {
  console.log('Fulfilling Checkout Session - printifyOrderId:' + printifyOrderId);
  // TODO_PRINTIFY
  return;

  // // TODO: Make this function safe to run multiple times,
  // // even concurrently, with the same session ID

  // // TODO: Make sure fulfillment hasn't already been
  // // peformed for this Checkout Session

  // const checkoutSession = await retrieveCheckoutSession(sessionId)
  // const { shipping_details, line_items, metadata } = checkoutSession
  // const { printifyOrderId } = metadata

  // // Check the Checkout Session's payment_status property
  // // to determine if fulfillment should be peformed
  // if (checkoutSession.payment_status !== 'unpaid') {
  //   // TODO: Perform fulfillment of the line items

  //   // TODO: Record/save fulfillment status for this
  //   // Checkout Session
  //   await sendOrderToProduction(printifyOrderId)
}

export const POST = async (request: NextRequest) => {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
    if (!secret) {
      throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
    }

    const body = await (await request.blob()).text();
    const signature = request.headers.get('stripe-signature') as string;
    const event: StripeType.Event = stripe.webhooks.constructEvent(body, signature, secret);

    if (['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
      // @ts-expect-error - acceptable error
      const printifyOrderId = event.data.object?.metadata?.printifyOrderId;
      if (!printifyOrderId) {
        throw new Error(`missing printifyOrderId on metadata, ${event.id}`);
      }

      await fulfillCheckout(printifyOrderId);
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
