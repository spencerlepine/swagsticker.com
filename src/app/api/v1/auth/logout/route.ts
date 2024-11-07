import { NextResponse } from 'next/server';

export const POST = async () => {
  try {
    // Clear the authToken cookie on logout
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

    response.cookies.set('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'Error logging out' }, { status: 500 });
  }
};
