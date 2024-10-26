import { NextRequest, NextResponse } from 'next/server';

// docs: https://nextjs.org/docs/app/building-your-application/routing/middleware
export function middleware(request: NextRequest) {
  const correlationId = crypto.randomUUID(); // Generate a UUID

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-correlation-id', correlationId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}

export const config = {
  matcher: '/api/v1/:path*',
};
