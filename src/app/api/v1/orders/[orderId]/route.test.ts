import { GET as getOrderEndpoint } from './route';
import { printify } from '@/lib/printify';
import { createExpiredToken, createRequest, createValidToken, testApiResponse } from '../../../../../../tests/test-helpers';
import { OrderDetails } from '@/types';

jest.mock('@/lib/printify', () => ({
  printify: {
    orders: {
      getOne: jest.fn(),
    },
  },
}));

describe('GET /api/v1/orders/[orderId]', () => {
  // Test constants
  const validOrderId = '123';
  const validEmail = 'test@example.com';

  // Sample order data
  const mockOrder: OrderDetails = {
    id: validOrderId,
    date: '2023-10-26T12:00:00Z',
    total_price: 24.99,
    total_shipping: 4.79,
    status: 'pending',
    address_to: { email: validEmail },
    last4: '1234',
    receiptUrl: 'https://example.com/receipt',
    printifyOrderId: 'print-123',
    swagOrderId: 'swag-456',
    metadata: {
      order_type: 'API',
      shop_order_id: 123456,
      shop_order_label: 'SwagOrderId_asdfASDF',
      shop_fulfilled_at: 'pending',
    },
    line_items: [
      {
        product_id: 'asdf1234',
        quantity: 1,
        variant_id: 1234,
        print_provider_id: 1234,
        cost: 250,
        shipping_cost: 450,
        status: 'on-hold',
        metadata: {
          title: 'Github Sticker',
          price: 250,
          variant_label: 'Kiss-cut sticker',
          sku: 'asdfASDF',
          country: 'US',
        },
        sent_to_production_at: 'null',
        fulfilled_at: 'null',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (printify.orders.getOne as jest.Mock).mockReset();
  });

  // Authentication Tests
  describe('Authentication', () => {
    it('should deny access when no authentication token is provided', async () => {
      const req = createRequest(`/orders/${validOrderId}`);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 401, { error: 'No token provided' });
    });

    it('should deny access when token is invalid', async () => {
      const invalidToken = 'invalid-token';
      const req = createRequest(`/orders/${validOrderId}`, invalidToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 401, { error: 'Invalid token' });
    });

    it('should deny access when token is expired', async () => {
      const expiredToken = await createExpiredToken(validEmail);
      const req = createRequest(`/orders/${validOrderId}`, expiredToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 401, { error: 'Invalid token' });
    });
  });

  // Success Tests
  describe('Success cases', () => {
    it('should return order details for valid request', async () => {
      const validToken = await createValidToken(validEmail);
      (printify.orders.getOne as jest.Mock).mockResolvedValueOnce(mockOrder);

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      const json = await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 200, {
        id: validOrderId,
        status: 'pending',
        total_price: 24.99,
      });

      // Additional assertions
      expect(json).toHaveProperty('address_to');
      expect(json).toHaveProperty('line_items');
      expect(json).toHaveProperty('total_shipping');
      expect(json).toHaveProperty('metadata');

      expect(printify.orders.getOne).toHaveBeenCalledWith(validOrderId);
    });

    it('should format response correctly with only necessary fields', async () => {
      const validToken = await createValidToken(validEmail);
      const enhancedOrder = {
        ...mockOrder,
        unnecessary_field: 'should not be included',
        internal_data: 'not for client',
      };

      (printify.orders.getOne as jest.Mock).mockResolvedValueOnce(enhancedOrder);

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      const json = await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 200, {
        id: validOrderId,
        status: 'pending',
        total_price: 24.99,
      });

      // Verify fields are filtered correctly
      expect(json).not.toHaveProperty('unnecessary_field');
      expect(json).not.toHaveProperty('internal_data');
    });
  });

  // Error handling tests
  describe('Error handling', () => {
    it('should throw UserError when orderId is missing', async () => {
      const missingOrderId = '';
      const validToken = await createValidToken(validEmail);
      const req = createRequest(`/orders/${missingOrderId}`, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: missingOrderId } }, 400, { error: 'Invalid order ID' });
    });

    it('should throw UserError when order is not found', async () => {
      const validToken = await createValidToken(validEmail);
      (printify.orders.getOne as jest.Mock).mockResolvedValueOnce(null);

      const req = createRequest(`/orders/${'999'}`, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: '999' } }, 400, { error: 'Order not found' });
    });

    it('should throw AuthError when user email does not match order email', async () => {
      const validToken = await createValidToken(validEmail);
      (printify.orders.getOne as jest.Mock).mockResolvedValueOnce({
        ...mockOrder,
        address_to: { email: 'different@example.com' },
      });

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 403, { error: 'User not authorized for this order' });
    });

    it('should handle API service errors gracefully', async () => {
      const validToken = await createValidToken(validEmail);
      (printify.orders.getOne as jest.Mock).mockRejectedValueOnce(new Error('Printify service unavailable'));

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 500, { error: expect.any(String) });
    });
  });

  // Security tests
  describe('Security tests', () => {
    it('should reject requests with malformed orderId', async () => {
      const validToken = await createValidToken(validEmail);
      const maliciousOrderId = '123; DROP TABLE users;';

      const req = createRequest(maliciousOrderId, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 400, { error: expect.any(String) });
    });

    it('should not expose sensitive information when errors occur', async () => {
      const validToken = await createValidToken(validEmail);
      const sensitiveError = new Error('Database connection string: user:password@host');
      (printify.orders.getOne as jest.Mock).mockRejectedValueOnce(sensitiveError);

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      const json = await testApiResponse(getOrderEndpoint, req, { params: { orderId: validOrderId } }, 500, { error: expect.any(String) });

      // Verify sensitive info is not leaked
      expect(json.error).not.toContain('user:password');
      expect(json.error).not.toContain('Database connection string');
    });

    it('should properly handle attempts to use invalid object types', async () => {
      const validToken = await createValidToken(validEmail);

      const req = createRequest(`/orders/${validOrderId}`, validToken);
      // @ts-expect-error - array is not valid param
      await testApiResponse(getOrderEndpoint, req, { params: { orderId: ['123', '456'] } }, 400, { error: expect.any(String) });
    });
  });

  // Performance/limits tests
  describe('Performance and limits', () => {
    it('should handle very long orderId inputs', async () => {
      const validToken = await createValidToken(validEmail);
      const veryLongOrderId = 'a'.repeat(10000);

      const req = createRequest(`/orders/${veryLongOrderId}`, validToken);
      await testApiResponse(getOrderEndpoint, req, { params: {} }, 400, { error: expect.any(String) });
    });
  });
});
