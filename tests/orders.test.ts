import supertest from 'supertest';
import { request } from './setupTests';

describe('Orders Endpoints', () => {
  let agent;

  const login = async (agent) => {
    await agent.post('/api/v1/auth/send-otp').send({ email: 'test@example.com' });
    await agent.post('/api/v1/auth/verify-otp').send({ otp: '123456' });
  };

  beforeEach(async () => {
    agent = supertest.agent(request());
    await login(agent);
  });

  describe('GET /api/v1/orders/{orderId}', () => {
    it('should retrieve a specific order', async () => {
      const response = await agent.get('/api/v1/orders/printify_order_id');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 'printify_order_id',
        status: 'fulfilled',
        shipments: null,
        address_to: { email: 'test@example.com' },
        line_items: [],
        total_price: 1000,
        total_shipping: 500,
        metadata: {},
      });
    });
  });

  // TODO: Add performance tests
  // TODO: Add failure case tests (e.g., order not found)
  // TODO: Add edge case tests (e.g., invalid orderId)
  // TODO: Add security testing (e.g., accessing another user’s order)
});