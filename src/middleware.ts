// Auth0 middleware for protected page routes
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
	  '/account', // for `src/account/page.tsx`
	 ], 
};