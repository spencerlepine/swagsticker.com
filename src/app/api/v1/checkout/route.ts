import logger from '@/lib/logger';
import { createDraftOrder } from '@/lib/printify';
import { createCheckoutSession } from '@/lib/stripe';
import { UserError } from '@/utils/errors';
import validateCartItems from '@/utils/validateCartItems';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @openapi
 * /v1/checkout:
 *   post:
 *     summary: Creates a Stripe checkout session.
 *     tags:
 *       - Checkout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *                     image:
 *                       type: string
 *                     currency:
 *                       type: string
 *                     price_data:
 *                       type: object
 *                     product_data:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: string
 *                         productId:
 *                           type: string
 *                         category:
 *                           type: string
 *                         type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkoutUrl:
 *                   type: string
 *       400:
 *         description: Error creating checkout session.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
export const POST = async (request: NextRequest) => {
  const correlationId = request.headers.get('x-correlation-id');

  try {
    logger.info('[Checkout] Processing checkout request', { correlationId });

    const body = await request.json();
    const { cartItems: clientCartItems } = body;

    logger.info('[Checkout] Validating cart items', { correlationId });
    const cartItems = validateCartItems(clientCartItems);

    // TODO_PRINTIFY (move this to final webhook)
    logger.info('[Printify] Creating Printify draft order', { correlationId });
    const { id: printifyOrderId } = await createDraftOrder(cartItems);

    // TODO_PRINTIFY (calulateShipping())

    logger.info('[Stripe] Creating checkout session', { correlationId, printifyOrderId });
    const session = await createCheckoutSession(cartItems, { printifyOrderId });

    logger.info('[Checkout] Checkout session created successfully', { checkoutUrl: session.url, correlationId, printifyOrderId, sessionId: session.id });
    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof UserError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error('[Checkout] Error processing checkout request', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
