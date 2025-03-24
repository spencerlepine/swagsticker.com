import { GET as verifyAuthEndpoint } from './route';
import { verifyJwt } from '@/lib/auth';
import { createRequest, testApiResponse, createValidToken, createExpiredToken } from '../../../../../../tests/test-helpers';

jest.mock('@/lib/auth', () => ({
  verifyJwt: jest.fn(),
}));

describe('verifyAuthEndpoint /api/v1/auth/verify', () => {
  const validEmail = 'test@example.com';
  let validToken = 'valid-token';
  let expiredToken = 'expired-token';

  beforeEach(async () => {
    jest.clearAllMocks();
    validToken = await createValidToken(validEmail);
    expiredToken = await createExpiredToken(validEmail);
  });

  describe('Success cases', () => {
    it('should return isAuthenticated as true for a valid token', async () => {
      (verifyJwt as jest.Mock).mockReturnValueOnce({ error: null });

      const req = createRequest('/auth/verify', validToken);
      const json = await testApiResponse(verifyAuthEndpoint, req, { params: {} }, 200, { isAuthenticated: true });

      expect(json).toHaveProperty('isAuthenticated', true);
      expect(verifyJwt).toHaveBeenCalledWith(validToken);
    });
  });

  describe('Failure cases', () => {
    it('should return isAuthenticated as false for an invalid token', async () => {
      (verifyJwt as jest.Mock).mockReturnValueOnce({ error: 'Invalid token' });

      const req = createRequest('/auth/verify', 'invalid-token');
      const json = await testApiResponse(verifyAuthEndpoint, req, { params: {} }, 401, { isAuthenticated: false, error: 'Invalid token' });

      expect(json).toHaveProperty('isAuthenticated', false);
      expect(json).toHaveProperty('error', 'Invalid token');
      expect(verifyJwt).toHaveBeenCalledWith('invalid-token');
    });

    it('should return isAuthenticated as false for an expired token', async () => {
      (verifyJwt as jest.Mock).mockReturnValueOnce({ error: 'Token expired' });

      const req = createRequest('/auth/verify', expiredToken);
      const json = await testApiResponse(verifyAuthEndpoint, req, { params: {} }, 401, { isAuthenticated: false, error: 'Token expired' });

      expect(json).toHaveProperty('isAuthenticated', false);
      expect(json).toHaveProperty('error', 'Token expired');
      expect(verifyJwt).toHaveBeenCalledWith(expiredToken);
    });

    it('should handle requests with no token', async () => {
      const req = createRequest('/auth/verify');
      await testApiResponse(verifyAuthEndpoint, req, { params: {} }, 401, { error: 'No token provided' });
    });
  });

  describe('Security tests', () => {
    it('should reject requests with malformed token', async () => {
      (verifyJwt as jest.Mock).mockReturnValueOnce({ error: 'Invalid token' });

      const malformedToken = 'malformed-token';
      const req = createRequest('/auth/verify', malformedToken);
      await testApiResponse(verifyAuthEndpoint, req, { params: {} }, 401, { isAuthenticated: false, error: 'Invalid token' });
    });
  });
});
