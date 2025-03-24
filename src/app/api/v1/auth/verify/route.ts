import { NextRequest, NextResponse } from 'next/server';
import { AuthError, withErrorHandler } from '@/utils/errors';
import { verifyJwt } from '@/lib/auth';
import { RouteHandler } from '@/types';

/**
 * @route GET /api/v1/auth/verify
 * @description Checks if user is authenticated using `swagAuthToken` cookie
 * @response {200} { "isAuthenticated": true }
 * @response {401} { "isAuthenticated": false, "error": "error message" }
 */
export const GET: RouteHandler = withErrorHandler(async (req: NextRequest) => {
  const token = req.cookies.get('swagAuthToken')?.value;

  if (!token) throw new AuthError('No token provided', 401);

  const { error } = verifyJwt(token);

  if (error) {
    return NextResponse.json({ isAuthenticated: false, error }, { status: 401 });
  }

  return NextResponse.json({ isAuthenticated: true }, { status: 200 });
});
