import { NextRequest, NextResponse } from 'next/server';
import { withAuthHandler } from '@/lib/auth';
import { type Order as PrintifyOrder } from 'printify-sdk-js';
import { AuthError, withErrorHandler, UserError } from '@/utils/errors';
import logger from '@/lib/logger';
import { SwagOrderDetails } from '@/types';

/**
 * @route GET /api/v1/orders/{orderId}
 * @description Retrieves a specific Printify order by ID. Requires authentication.
 * @response {200} { "id": "string", "status": "string", "tracking": object|null, "address_to": object, "line_items": array, "total_price": number, "total_shipping": number, "metadata": object }
 */
export const GET = withErrorHandler(
  withAuthHandler(async (req: NextRequest, { params }, email: string) => {
    const { printify } = await import('@/lib/printify');

    const { orderId } = params;
    const swagTraceId = req.headers.get('x-swag-trace-id');

    if (!orderId || typeof orderId !== 'string') {
      logger.error('Invalid orderId', { params, swagTraceId });
      throw new UserError('Invalid order ID');
    }

    logger.debug('Fetching order', { orderId, email, swagTraceId });
    const order: PrintifyOrder = await printify.orders.getOne(orderId as string);
    if (!order) {
      logger.warn('Order not found', { orderId, swagTraceId });
      throw new UserError('Order not found');
    }

    if (order.address_to?.email !== email) {
      logger.warn('Unauthorized access attempt', { orderId, email, swagTraceId });
      throw new AuthError('User not authorized for this order');
    }

    const printifyOrder: SwagOrderDetails = {
      id: order.id,
      status: order.status,
      shipments: order.shipments,
      address_to: order.address_to,
      line_items: order.line_items,
      total_price: order.total_price,
      total_shipping: order.total_shipping,
      metadata: order.metadata,
    };
    logger.info('Order retrieved successfully', { orderId, email, swagTraceId });
    return NextResponse.json(printifyOrder, { status: 200 });
  })
);
