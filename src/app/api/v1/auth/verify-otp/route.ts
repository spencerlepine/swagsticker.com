import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const otpToken = req.cookies.get('otpToken')?.value;

    if (!otpToken) {
      return NextResponse.json({ error: 'OTP token is missing or expired' }, { status: 400 });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET!) as { otp: string, email: string };

    const { otp } = await req.json();

    if (decoded.otp === otp) {
      const authToken = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET!, {
        expiresIn: '30m',
      });

      const response = NextResponse.json({ message: 'OTP verified' }, { status: 200 });
      
      response.cookies.set('authToken', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60,
        path: '/',
      });

      response.cookies.delete('otpToken');

      return response;
    } else {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'OTP expired or invalid' }, { status: 500 });
  }
};
