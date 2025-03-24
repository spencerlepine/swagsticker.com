import { render, screen, waitFor } from '@testing-library/react';

import SignInNavLink from './SignInNavLink';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));
const mockCookies = cookies as jest.Mock;

jest.mock('@/lib/auth', () => ({
  verifyJwt: jest.fn(),
}));
const mockVerifyJwt = verifyJwt as jest.Mock;

describe('SignInNavLink Component', () => {
  it('renders the "Account" link when the user is authenticated', async () => {
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: 'valid_token' }),
    });
    mockVerifyJwt.mockReturnValue({ error: null }); // No error means the user is authenticated

    render(<SignInNavLink />);

    await waitFor(() => {
      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });

  it('renders the "Sign In" link when the user is not authenticated', async () => {
    mockCookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: '' }), // No token
    });
    mockVerifyJwt.mockReturnValue({ error: 'Invalid token' }); // Invalid token means the user is not authenticated

    render(<SignInNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('signin-nav-link')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
