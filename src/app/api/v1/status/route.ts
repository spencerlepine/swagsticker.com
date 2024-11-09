import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { checkPrintifyStatus } from '@/lib/printify';
import { checkStripeStatus } from '@/lib/stripe';

export async function GET() {
  try {
    const printifyStatus = await checkPrintifyStatus();
    const stripeStatus = await checkStripeStatus();
    const status = printifyStatus === "operational" && stripeStatus === "operational" ? "operational" : "degraded";
    
    if (status === "degraded") {
      logger.error('[Status] report:', { status, printifyStatus, stripeStatus });
    }

    return NextResponse.json({ status });
  } catch (error) {
    logger.error('[Status] Error checking status', { error });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

