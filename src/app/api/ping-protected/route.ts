import { NextResponse } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

export const GET = withApiAuthRequired(async () => {
    // const session = await getSession();
    // const userId = session.user.sid; // Auth0 userId
    const res = new NextResponse();
    return NextResponse.json({ message: `Pong! [secret] - ${process.env.MY_SECRET_VALUE}` }, res);
});