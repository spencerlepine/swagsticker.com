import TestAgent from 'supertest/lib/agent';
import Test from 'supertest/lib/test';
import { request } from './setupNodeTests';

describe('Auth Endpoints', () => {
  const login = async (request: () => TestAgent<Test>) => {
    await request().post('/api/v1/auth/send-otp').send({ email: 'test@example.com' });
    await request().post('/api/v1/auth/verify-otp').send({ otp: '123456' });
  };

  describe('POST /api/v1/auth/logout', () => {
    it('should log out the user and clear swagAuthToken cookie', async () => {
      const response = await request().post('/api/v1/auth/logout');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Logged out successfully' });
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('swagAuthToken=; Max-Age=0')
      );
    });
  });

  describe('POST /api/v1/auth/send-otp', () => {
    it('should send OTP and set otpToken cookie', async () => {
      const response = await request()
        .post('/api/v1/auth/send-otp')
        .send({ email: 'test@example.com' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'OTP sent successfully' });
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('otpToken=')
      );
    });
  });

  describe('GET /api/v1/auth/verify', () => {
    it('should return authenticated status when logged in', async () => {
      await login(request);
      const response = await request().get('/api/v1/auth/verify');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ isAuthenticated: true });
    });

    it('should return unauthenticated status when not logged in', async () => {
      const response = await request().get('/api/v1/auth/verify');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        isAuthenticated: false,
        error: expect.any(String),
      });
    });
  });

  describe('POST /api/v1/auth/verify-otp', () => {
    it('should verify OTP and set swagAuthToken cookie', async () => {
      await request().post('/api/v1/auth/send-otp').send({ email: 'test@example.com' });
      const response = await request().post('/api/v1/auth/verify-otp').send({ otp: '123456' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'OTP verified' });
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('swagAuthToken=')
      );
      expect(response.headers['set-cookie']).toContainEqual(
        expect.stringContaining('otpToken=; Max-Age=0')
      );
    });
  });

  // TODO: Add performance tests
  // TODO: Add failure case tests (e.g., invalid email, wrong OTP)
  // TODO: Add edge case tests (e.g., expired tokens)
  // TODO: Add security testing (e.g., token tampering)
});