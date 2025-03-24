import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/errors';
import logger from '@/lib/logger';
import { RouteHandler } from '@/types';

/**
 * @route GET /api/v1/status
 * @description Checks the operational status of Printify and Stripe services.
 * @response {200} { "status": "operational" | "degraded" }
 */
export const GET: RouteHandler = withErrorHandler(async () => {
  const { checkPrintifyStatus } = await import('@/lib/printify');
  const { checkStripeStatus } = await import('@/lib/stripe');

  const printifyStatus = await checkPrintifyStatus();
  const stripeStatus = await checkStripeStatus();
  const status = printifyStatus === 'operational' && stripeStatus === 'operational' ? 'operational' : 'degraded';

  if (status === 'degraded') {
    logger.error('[Status] report:', { status, printifyStatus, stripeStatus });
  }

  return NextResponse.json({ status }, { status: 200 });
});
