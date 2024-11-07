import jwt from 'jsonwebtoken';

export const verifyJwt = (token: string | undefined): { email?: string; error?: string } => {
  if (!token) {
    return { error: 'No token provided' };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };;
    return { email: decoded.email };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return { error: 'Invalid or expired token' };
  }
};
