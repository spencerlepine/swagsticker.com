import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpToken = jwt.sign({ otp, email }, process.env.JWT_SECRET!, { expiresIn: '5m' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"SwagSticker.com" <noreply@swagsticker.com>',
      to: email,
      subject: `Your OTP Code: ${otp}`,
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    const response = NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    response.cookies.set('otpToken', otpToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
};
