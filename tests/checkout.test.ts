import supertest from 'supertest';
import { request } from './setupTests';

describe('Checkout Endpoints', () => {
  let agent;

  const login = async (agent) => {
    await agent.post('/api/v1/auth/send-otp').send({ email: 'test@example.com' });
    await agent.post('/api/v1/auth/verify-otp').send({ otp: '123456' });
  };

  beforeEach(async () => {
    agent = supertest.agent(request());
    await login(agent);
  });

  describe('GET /api/v1/checkout/config', () => {
    it('should return Stripe publishable key', async () => {
      process.env.NEXT_PUBLIC_STRIPE_KEY = 'pk_test_123';
      const response = await agent.get('/api/v1/checkout/config');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ publishableKey: 'pk_test_123' });
    });
  });

  describe('POST /api/v1/checkout/create-payment-intent', () => {
    it('should create a Stripe payment intent', async () => {
      const cartItems = [
        {
          name: 'Sticker',
          quantity: 2,
          price: 1000,
          image: 'img.jpg',
          product_data: { size: 'M', productId: 'prod_123' },
        },
      ];
      const response = await agent
        .post('/api/v1/checkout/create-payment-intent')
        .send({ cartItems });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ clientSecret: 'pi_123_secret' });
    });
  });

  describe('POST /api/v1/checkout/order-confirmation', () => {
    it('should capture payment and create Printify order', async () => {
      const response = await agent
        .post('/api/v1/checkout/order-confirmation')
        .send({ paymentIntentId: 'pi_123' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        orderId: 'printify_order_id',
        swagOrderId: 'swag_order_id',
      });
    });
  });

  // TODO: Add performance tests
  // TODO: Add failure case tests (e.g., invalid payment intent)
  // TODO: Add edge case tests (e.g., large cart items)
  // TODO: Add security testing (e.g., unauthorized access)
});