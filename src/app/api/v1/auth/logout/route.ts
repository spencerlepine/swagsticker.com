import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/utils/errors';
import { RouteHandler } from '@/types';

/**
 * @route POST /api/v1/auth/logout
 * @description Logs out user, clears `swagAuthToken` cookie.
 * @response {200} { message: string } - "Logged out successfully"
 */
export const POST: RouteHandler = withErrorHandler(async () => {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  response.cookies.set('swagAuthToken', '', {
    httpOnly: true,
    secure: true,
    maxAge: 0,
    path: '/',
  });

  return response;
});
