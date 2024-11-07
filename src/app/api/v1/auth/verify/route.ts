import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get('authToken')?.value;
  const { error } = verifyJwt(token);

  if (error) {
    return NextResponse.json({ isAuthenticated: false, error }, { status: 403 });
  }

  return NextResponse.json({ isAuthenticated: true }, { status: 200 });
};