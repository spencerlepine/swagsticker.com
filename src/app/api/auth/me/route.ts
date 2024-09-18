// Auth0 endpoint
// source: https://auth0.com/docs/quickstart/webapp/nextjs/interactive
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = withApiAuthRequired(async () => {
  const session = await getSession();
  return NextResponse.json(session?.user);
});