import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify from jose for edge environment

const PROTECTED_ROUTES = ['/account', '/api/v1/orders', 'api/v1/checkout'];
const LOGIN_URL = '/signin';

/**
 * Generates a correlation ID for the request.
 */
function generateCorrelationId(req: NextRequest): string | undefined {
  if (req.nextUrl.pathname.startsWith('/account')) {
    return undefined;
  }
  return crypto.randomUUID();
}

/**
 * Handles authentication for protected routes.
 */
async function handleAuth(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.nextUrl.origin));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
  } catch (error) {
    console.error('Invalid token:', error);
    return NextResponse.redirect(new URL(LOGIN_URL, req.nextUrl.origin));
  }

  return null;
}

/**
 * Main middleware function to intercept requests.
 */
export default async function middleware(req: NextRequest) {
  const correlationId = generateCorrelationId(req);

  const requestHeaders = new Headers(req.headers);
  if (correlationId) {
    requestHeaders.set('x-correlation-id', correlationId);
  }

  if (PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) {
    const authResponse = await handleAuth(req);
    if (authResponse) {
      return authResponse;
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Specify the routes to match for this middleware
export const config = {
  matcher: ['/api/v1/:path*', '/account', '/api/v1/orders/:path*', '/api/v1/checkout/:path*'],
};
