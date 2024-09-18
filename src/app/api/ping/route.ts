import { NextResponse } from 'next/server';

export const GET = async () =>
  {
    const res = new NextResponse();
    return NextResponse.json({ message: `Pong! - ${process.env.MY_SECRET_VALUE}` }, res);
  };