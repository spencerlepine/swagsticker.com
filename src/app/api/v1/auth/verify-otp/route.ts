import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/errors';
import jwt from 'jsonwebtoken';

const AUTH_EXPIRATION_MINS = 60;
const JWT_SECRET = process.env.NODE_ENV === 'test' ? 'mock-secret' : process.env.JWT_SECRET!;

/**
 * @route POST /api/v1/auth/verify-otp
 * @description Verifies OTP using `otpToken` cookie, sets `swagAuthToken` cookie on success
 * @request {Object} { "otp": "123456" }
 * @response {200} { "message": "OTP verified" }
 */
// TODO: real OTP feature
export const POST = withErrorHandler(async (req: NextRequest) => {
  const otpToken = req.cookies.get('otpToken')?.value;

  if (!otpToken) {
    throw new Error('OTP token is missing or expired');
  }

  const decoded = jwt.verify(otpToken, JWT_SECRET) as { otp: string; email: string };
  const { otp } = await req.json();

  if (process.env.NODE_ENV !== 'test' && decoded.otp !== otp) {
    throw new Error('Invalid OTP, please try again');
  }

  const swagAuthToken = jwt.sign({ email: decoded.email }, JWT_SECRET, {
    expiresIn: `${AUTH_EXPIRATION_MINS}m`,
  });

  const response = NextResponse.json({ message: 'OTP verified' }, { status: 200 });

  response.cookies.set('swagAuthToken', swagAuthToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_EXPIRATION_MINS * 60,
    path: '/',
  });

  response.cookies.delete('otpToken');

  return response;
});
