import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const swagTraceId = crypto.randomUUID();

  const requestHeaders = new Headers(req.headers);
  if (swagTraceId) {
    requestHeaders.set('x-swag-trace-id', swagTraceId);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
