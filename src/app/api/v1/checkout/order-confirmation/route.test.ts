import { POST as capturePaymentEndpoint } from './route';
import { sendOrderNotifEmail } from '@/lib/mailer';
import { createDraftOrder } from '@/lib/printify';
import { stripe } from '@/lib/stripe';
import { type Address } from 'printify-sdk-js';
import { createExpiredToken, createRequest, createValidToken, testApiResponse } from '../../../../../../tests/test-helpers';

jest.mock('@/lib/stripe', () => ({
  stripe: {
    paymentIntents: {
      retrieve: jest.fn(),
      update: jest.fn(),
      capture: jest.fn(),
    },
    customers: {
      list: jest.fn(),
    },
    charges: {
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/printify', () => ({
  createDraftOrder: jest.fn(),
}));

jest.mock('@/lib/mailer', () => ({
  sendOrderNotifEmail: jest.fn(),
}));

describe('POST /api/v1/capture-payment', () => {
  const validEmail = 'test@example.com';
  const paymentIntentId = 'pi_123';
  const swagOrderId = 'swag-123';
  const printifyOrderId = 'print-123';
  const cartItems = '[{"id": "prod-1", "quantity": 1}]';
  const customerName = 'John Doe';
  const phoneNumber = '123-456-7890';
  const country = 'US';
  const state = 'CA';
  const line1 = '123 Main St';
  const line2 = 'Apt 4B';
  const city = 'Anytown';
  const postalCode = '12345';

  const validPaymentIntent = {
    id: paymentIntentId,
    status: 'requires_capture',
    receipt_email: validEmail,
    metadata: {
      cartItems: cartItems,
      swagOrderId: swagOrderId,
    },
    shipping: {
      phone: phoneNumber,
      address: {
        country: country,
        state: state,
        line1: line1,
        line2: line2,
        city: city,
        postal_code: postalCode,
      },
    },
    latest_charge: 'ch_123',
  };

  const validCustomer = {
    data: [
      {
        name: customerName,
      },
    ],
  };

  const validAddress: Address = {
    first_name: customerName.split(' ')[0],
    last_name: customerName.split(' ')[1],
    email: validEmail,
    phone: phoneNumber,
    country: country,
    region: state,
    address1: line1,
    address2: line2,
    city: city,
    zip: postalCode,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (stripe.paymentIntents.retrieve as jest.Mock).mockReset();
    (stripe.paymentIntents.update as jest.Mock).mockReset();
    (stripe.paymentIntents.capture as jest.Mock).mockReset();
    (stripe.customers.list as jest.Mock).mockReset();
    (stripe.charges.update as jest.Mock).mockReset();
    (createDraftOrder as jest.Mock).mockReset();
    (sendOrderNotifEmail as jest.Mock).mockReset();
  });

  describe('Authentication', () => {
    it('should deny access when no authentication token is provided', async () => {
      const req = createRequest('/checkout/order-confirmation', undefined, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 401, { error: 'No token provided' });
    });

    it('should deny access when token is invalid', async () => {
      const invalidToken = 'invalid-token';
      const req = createRequest('/checkout/order-confirmation', invalidToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 401, { error: 'Invalid token' });
    });

    it('should deny access when token is expired', async () => {
      const expiredToken = await createExpiredToken(validEmail);
      const req = createRequest('/checkout/order-confirmation', expiredToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 401, { error: 'Invalid token' });
    });
  });

  describe('Success cases', () => {
    it('should capture payment and create order with valid data', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce(validPaymentIntent);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce(validCustomer);
      (createDraftOrder as jest.Mock).mockResolvedValueOnce({ id: printifyOrderId });

      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      const json = await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 200, { orderId: printifyOrderId });

      expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith(paymentIntentId);
      expect(stripe.customers.list).toHaveBeenCalledWith({ email: validEmail, limit: 1 });
      expect(createDraftOrder).toHaveBeenCalledWith(JSON.parse(cartItems), validAddress, swagOrderId);
      expect(stripe.paymentIntents.update).toHaveBeenCalledWith(paymentIntentId, { metadata: { printifyOrderId: printifyOrderId } });
      expect(stripe.charges.update).toHaveBeenCalledWith('ch_123', {
        metadata: { cartItems: '[{"id": "prod-1", "quantity": 1}]', printifyOrderId: printifyOrderId, swagOrderId: swagOrderId },
      });
      expect(sendOrderNotifEmail).toHaveBeenCalledWith(swagOrderId, printifyOrderId, paymentIntentId);
      expect(stripe.paymentIntents.capture).toHaveBeenCalledWith(paymentIntentId);

      expect(json.orderId).toBe(printifyOrderId);
    });
  });

  describe('Error handling', () => {
    it('should throw UserError when paymentIntentId is missing', async () => {
      const validToken = await createValidToken(validEmail);
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', {});
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 400, { error: 'paymentIntentId is required' });
    });

    it('should throw UserError when paymentIntent status is not requires_capture', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce({ ...validPaymentIntent, status: 'succeeded' });
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 400, { error: 'PaymentIntent cannot be captured' });
    });

    it('should throw AuthError when email does not match PaymentIntent email', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce({ ...validPaymentIntent, receipt_email: 'different@example.com' });
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 403, { error: 'Email does not match the PaymentIntent' });
    });

    it('should handle stripe API errors gracefully', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockRejectedValueOnce(new Error('Stripe API error'));
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should handle printify API errors gracefully', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce(validPaymentIntent);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce(validCustomer);
      (createDraftOrder as jest.Mock).mockRejectedValueOnce(new Error('Printify API error'));

      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should handle mailer API errors gracefully', async () => {
      const validToken = await createValidToken(validEmail);
      (stripe.paymentIntents.retrieve as jest.Mock).mockResolvedValueOnce(validPaymentIntent);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce(validCustomer);
      (createDraftOrder as jest.Mock).mockResolvedValueOnce({ id: printifyOrderId });
      (sendOrderNotifEmail as jest.Mock).mockRejectedValueOnce(new Error('Mailer API error'));

      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });
  });

  describe('Security tests', () => {
    it('should reject requests with malformed paymentIntentId', async () => {
      const validToken = await createValidToken(validEmail);
      const maliciousPaymentIntentId = 'pi_123; DROP TABLE orders;';
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: maliciousPaymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should not expose sensitive information when errors occur', async () => {
      const validToken = await createValidToken(validEmail);
      const sensitiveError = new Error('Database connection string: user:password@host');
      (stripe.paymentIntents.retrieve as jest.Mock).mockRejectedValueOnce(sensitiveError);
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: paymentIntentId });
      const json = await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
      expect(json.error).not.toContain('user:password');
      expect(json.error).not.toContain('Database connection string');
    });
  });

  describe('Performance and limits', () => {
    it('should handle excessively long paymentIntentId inputs', async () => {
      const validToken = await createValidToken(validEmail);
      const veryLongPaymentIntentId = 'a'.repeat(10000);
      const req = createRequest('/checkout/order-confirmation', validToken, 'POST', { paymentIntentId: veryLongPaymentIntentId });
      await testApiResponse(capturePaymentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });
  });
});
