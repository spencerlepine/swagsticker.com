import { jwtVerify } from 'jose';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { AuthError } from '@/utils/errors';

const JWT_SECRET = process.env.NODE_ENV === 'test' ? 'mock-secret' : process.env.JWT_SECRET!;

export const verifyJwt = (token: string | undefined): { email?: string; error?: string } => {
  if (!token) {
    return { error: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return { email: decoded.email };
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return { error: 'Invalid or expired token' };
  }
};

export async function verifyAuthToken(req: NextRequest): Promise<{ email?: string }> {
  const token = req.cookies.get('swagAuthToken')?.value;

  if (!token) {
    throw new AuthError('No token provided', 401);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const email = payload.email as string;
    return { email };
  } catch (error) {
    logger.error('Invalid token', error);
    throw new AuthError('Invalid token', 401);
  }
}

export function withAuthHandler(
  handler: (
    req: NextRequest,
    context: {
      params: { [key: string]: string | number };
    },
    email: string
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: {
      params: { [key: string]: string | number };
    }
  ) => {
    const { email: extractedTokenEmail } = await verifyAuthToken(req);

    return handler(req, context, extractedTokenEmail!);
  };
}
