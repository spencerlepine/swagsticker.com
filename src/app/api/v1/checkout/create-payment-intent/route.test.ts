import { POST as createPaymentIntentEndpoint } from './route';
import { stripe } from '@/lib/stripe';
import { retrieveShippingCost } from '@/lib/printify';
import { createExpiredToken, createRequest, createValidToken, testApiResponse } from '../../../../../../tests/test-helpers';
import { SwagCartItem } from '@/types';

jest.mock('@/lib/stripe', () => ({
  stripe: {
    customers: {
      list: jest.fn(),
      create: jest.fn(),
    },
    paymentIntents: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/printify', () => ({
  retrieveShippingCost: jest.fn(),
}));

describe('POST /api/v1/checkout/checkout/create-payment-intent', () => {
  const validEmail = 'test@example.com';
  const cartItems: SwagCartItem[] = [
    {
      id: 'asdf123',
      name: 'Product 1',
      currency: 'USD',
      description: 'Amazing product',
      quantity: 1,
      price: 10,
      image: 'image1.jpg',
      product_data: { type: 'sticker', size: '2x2in', productId: '123' },
    },
    {
      id: 'asdf124',
      name: 'Product 2',
      currency: 'USD',
      description: 'Amazing product',
      quantity: 2,
      price: 20,
      image: 'image2.jpg',
      product_data: { type: 'sticker', size: '4x4in', productId: '456' },
    },
  ];
  const shippingMethod = { first_item: { cost: 5 }, additional_items: { cost: 2 } };
  // const orderSubtotal = 10 + 2 * 20 + 5 + 2 * 1;
  const customer = { id: 'cus_123' };
  const paymentIntent = { client_secret: 'pi_123_secret' };

  beforeEach(() => {
    jest.clearAllMocks();
    (stripe.customers.list as jest.Mock).mockReset();
    (stripe.customers.create as jest.Mock).mockReset();
    (stripe.paymentIntents.create as jest.Mock).mockReset();
    (retrieveShippingCost as jest.Mock).mockReset();
  });

  describe('Authentication', () => {
    it('should deny access when no token is provided', async () => {
      const req = createRequest('/checkout/create-payment-intent', undefined, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 401, { error: 'No token provided' });
    });

    it('should deny access when token is invalid', async () => {
      const invalidToken = 'invalid-token';
      const req = createRequest('/checkout/create-payment-intent', invalidToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 401, { error: 'Invalid token' });
    });

    it('should deny access when token is expired', async () => {
      const expiredToken = await createExpiredToken(validEmail);
      const req = createRequest('/checkout/create-payment-intent', expiredToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 401, { error: 'Invalid token' });
    });
  });

  describe('Success cases', () => {
    it('should create a payment intent successfully', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockResolvedValueOnce(shippingMethod);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce({ data: [customer] });
      (stripe.paymentIntents.create as jest.Mock).mockResolvedValueOnce(paymentIntent);

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      const json = await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 200, { clientSecret: paymentIntent.client_secret });

      expect(retrieveShippingCost).toHaveBeenCalled();
      expect(stripe.customers.list).toHaveBeenCalledWith({ email: validEmail, limit: 1 });
      expect(stripe.paymentIntents.create).toHaveBeenCalled();
      expect(json).toHaveProperty('clientSecret', paymentIntent.client_secret);
    });

    it('should create a new customer if one does not exist', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockResolvedValueOnce(shippingMethod);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce({ data: [] });
      (stripe.customers.create as jest.Mock).mockResolvedValueOnce(customer);
      (stripe.paymentIntents.create as jest.Mock).mockResolvedValueOnce(paymentIntent);

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 200, { clientSecret: paymentIntent.client_secret });

      expect(stripe.customers.create).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should handle Stripe customer list error', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockResolvedValueOnce(shippingMethod);
      (stripe.customers.list as jest.Mock).mockRejectedValueOnce(new Error('Stripe customer list failed'));

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should handle Stripe payment intent creation error', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockResolvedValueOnce(shippingMethod);
      (stripe.customers.list as jest.Mock).mockResolvedValueOnce({ data: [customer] });
      (stripe.paymentIntents.create as jest.Mock).mockRejectedValueOnce(new Error('Stripe payment intent creation failed'));

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should handle retrieve shipping cost error', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockRejectedValueOnce(new Error('Printify shipping cost error'));

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });
    });

    it('should handle invalid cart item prices', async () => {
      const invalidCartItems = [{ name: 'Product 1', quantity: 1, price: -10, image: 'image1.jpg', product_data: { size: 'M', productId: '123' } }];
      const validToken = await createValidToken(validEmail);

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems: invalidCartItems });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 400, { error: expect.any(String) });
    });
  });

  describe('Security tests', () => {
    it('should not expose sensitive error information', async () => {
      const validToken = await createValidToken(validEmail);
      (retrieveShippingCost as jest.Mock).mockRejectedValueOnce(new Error('Database connection string: user:password@host'));

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems });
      const json = await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 500, { error: expect.any(String) });

      expect(json.error).not.toContain('user:password');
      expect(json.error).not.toContain('Database connection string');
    });

    it('should handle invalid cart data types', async () => {
      const validToken = await createValidToken(validEmail);
      const invalidCart = [{ name: 'Product 1', quantity: 'invalid', price: 10, image: 'image1.jpg', product_data: { size: 'M', productId: '123' } }];

      const req = createRequest('/checkout/create-payment-intent', validToken, 'POST', { cartItems: invalidCart });
      await testApiResponse(createPaymentIntentEndpoint, req, { params: {} }, 400, { error: expect.any(String) });
    });
  });
});
