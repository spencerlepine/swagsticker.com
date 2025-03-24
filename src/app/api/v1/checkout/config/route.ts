import { NextResponse } from 'next/server';
import { withAuthHandler } from '@/lib/auth';
import { withErrorHandler } from '@/utils/errors';
import { AuthenticatedHandler } from '@/types';

/**
 * @route GET /api/v1/checkout/config
 * @description Returns Stripe publishable key. Requires authentication
 * @response {200} { "publishableKey": "pk_..." }
 */
export const GET: AuthenticatedHandler = withErrorHandler(
  withAuthHandler(async () => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_KEY!;

    if (!publishableKey) {
      throw new Error('Stripe configuration error');
    }

    return NextResponse.json({ publishableKey }, { status: 200 });
  })
);
