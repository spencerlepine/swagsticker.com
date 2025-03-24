import { NextRequest } from 'next/server';
import middleware, { config } from './middleware';

describe('middleware', () => {
  it('adds x-swag-trace-id header to request', async () => {
    const request = new Request('http://localhost/api/v1/test', {
      headers: new Headers(),
    }) as NextRequest;

    const response = await middleware(request);
    const headers = response.headers;

    expect(headers.has('x-middleware-request-x-swag-trace-id')).toBe(true);
    expect(headers.get('x-middleware-request-x-swag-trace-id')).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('handles requests without headers', async () => {
    const request = new Request('http://localhost/api/v1/test') as NextRequest;
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.has('x-middleware-request-x-swag-trace-id')).toBe(true);
  });

  it('matches configured api path', () => {
    expect(config.matcher).toEqual(['/api/v1/:path*']);
  });
});
