import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/errors';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '@/lib/mailer';
import { RouteHandler } from '@/types';

const JWT_SECRET = process.env.NODE_ENV === 'test' ? 'mock-secret' : process.env.JWT_SECRET!;

/**
 * @route POST /api/v1/auth/send-otp
 * @description Sends a one-time password (OTP) to the provided email. Sets `otpToken` cookie with JWT
 * @request {Object} { "email": "user@example.com" }
 * @response {200} { "message": "OTP sent successfully" }
 */
export const POST: RouteHandler = withErrorHandler(async (req: NextRequest) => {
  const { email } = await req.json();

  if (!email) {
    throw new Error('Email is required');
  }

  const otp = process.env.NODE_ENV === 'production' ? Math.floor(100000 + Math.random() * 900000).toString() : (123456).toString();
  const otpToken = jwt.sign({ otp, email }, JWT_SECRET, { expiresIn: '5m' });
  await sendOTPEmail(email, otp);

  const response = NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
  response.cookies.set('otpToken', otpToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60,
    path: '/',
  });

  return response;
});
