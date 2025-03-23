import { GET as getStripeKeyEndpoint } from './route';
import { createRequest, createValidToken, testApiResponse } from '../../../../../../tests/test-helpers';

describe('GET /api/v1/checkout/config', () => {
  const validEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the publishable Stripe key when available', async () => {
    const validToken = await createValidToken(validEmail);

    process.env.NEXT_PUBLIC_STRIPE_KEY = 'pk_test_1234';
    const req = createRequest('/checkout/config', validToken);
    await testApiResponse(getStripeKeyEndpoint, req, { params: {} }, 200, {
      publishableKey: 'pk_test_1234',
    });
  });

  it('should return 500 when Stripe key is missing', async () => {
    const validToken = await createValidToken(validEmail);

    delete process.env.NEXT_PUBLIC_STRIPE_KEY;
    const req = createRequest('/checkout/config', validToken);
    await testApiResponse(getStripeKeyEndpoint, req, { params: {} }, 500, {
      error: 'Internal Server Error',
    });
  });

  it('should return 401 if the user is not authenticated', async () => {
    process.env.NEXT_PUBLIC_STRIPE_KEY = 'pk_test_1234';
    const req = createRequest('/checkout/config', 'invalid-token');
    await testApiResponse(getStripeKeyEndpoint, req, { params: {} }, 401, {
      error: 'Invalid token',
    });
  });
});
