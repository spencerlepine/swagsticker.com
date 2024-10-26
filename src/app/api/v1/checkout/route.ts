import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { UserError } from '@/utils/errors';
import logger from '@/lib/logger';
import { retrieveShippingCost } from '@/lib/printify';
import validateCartItems from '@/utils/validateCartItems';

export async function POST(request: Request) {
  const correlationId = request.headers.get('x-correlation-id');

  try {
    const body = await request.json();
    const { cartItems: clientCartItems } = body;

    logger.info('[Checkout] Validating cart items', { correlationId });
    const cartItems = validateCartItems(clientCartItems);

    logger.info('[Printify] calculating shipping methods', { correlationId });
    const shippingMethods = await retrieveShippingCost();

    const swagOrderId = crypto.randomUUID();
    logger.info('[Stripe] Creating checkout session', { correlationId, swagOrderId });
    const session = await createCheckoutSession(cartItems, shippingMethods, { swagOrderId });

    return NextResponse.json({ id: session.id, client_secret: session.client_secret });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error('[Checkout] Error processing checkout request', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
