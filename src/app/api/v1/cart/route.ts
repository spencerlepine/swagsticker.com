import { NextResponse } from 'next/server';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

export const POST = withApiAuthRequired(async () => {
    const session = await getSession();
    const userId = session.user.sid; // Auth0 userId

    // TODO

    const res = new NextResponse();
    return NextResponse.json({ message: `Added to cart - TODO` }, res);
});
