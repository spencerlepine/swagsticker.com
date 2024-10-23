import { createCheckoutSession, formatCartItemsForStripe } from '@/lib/stripe';
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
  try {
    const body = await request.json();
    const { cartItems: clientCartItems } = body;

    const cartItems = validateCartItems(clientCartItems);
    if (!cartItems) {
      console.error('[Checkout] invalid client cart', clientCartItems);
      return NextResponse.json({ message: 'Unable to checkout cart items' }, { status: 400 });
    }

    // TODO_PRINTIFY
    const printifyOrderId = 'asdf1234';
    const stripeLineItems = formatCartItemsForStripe(cartItems);
    const session = await createCheckoutSession(stripeLineItems, { printifyOrderId });

    if (!session || !session.url) {
      console.error('[Stripe] error creating checkout session:', session);
      return NextResponse.json({ message: 'Unable to create Stripe checkout session' }, { status: 400 });
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
