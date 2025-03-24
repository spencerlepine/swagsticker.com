import { AuthenticatedHandler, RouteContext, RouteHandler } from '@/types';
import { SignJWT } from 'jose';
import { NextRequest } from 'next/server';

const swagTraceId = 'test-corr-id';
const jwtSecret = 'mock-secret';
const baseUrl = 'http://localhost/api/v1';

export async function createToken(email: string, expiresIn: string): Promise<string> {
  const encoder = new TextEncoder();
  return new SignJWT({ email }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(expiresIn).sign(encoder.encode(jwtSecret));
}

export async function createExpiredToken(email: string): Promise<string> {
  return createToken(email, '0s');
}

export async function createValidToken(email: string): Promise<string> {
  return createToken(email, '1h');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRequest(path: string, token?: string, method: string = 'GET', body?: any): NextRequest {
  const headers: Record<string, string> = {
    'x-swag-trace-id': swagTraceId,
  };

  if (token) {
    headers.Cookie = `swagAuthToken=${token}`;
  }

  const requestBody = body ? JSON.stringify(body) : undefined;
  const req = new NextRequest(`${baseUrl}${path}`, { headers, method, body: requestBody });
  return req;
}

export async function testApiResponse(
  endpointMethod: RouteHandler | AuthenticatedHandler,
  req: NextRequest,
  context: RouteContext,
  expectedStatus: number,
  expectedResponse: Record<string, string | number | boolean | object | null>
) {
  const response = await endpointMethod(req, context, 'random@email.com');
  const json = await response.json();

  expect(response.status).toBe(expectedStatus);

  Object.entries(expectedResponse).forEach(([key, value]) => {
    expect(json).toHaveProperty(key, value);
  });

  return json;
}
