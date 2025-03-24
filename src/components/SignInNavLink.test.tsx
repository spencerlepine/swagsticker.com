import { render, screen, waitFor } from '@testing-library/react';

import SignInNavLink from './SignInNavLink';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  verifyJwt: jest.fn(),
}));

describe('SignInNavLink Component', () => {
  it('renders the "Account" link when the user is authenticated', async () => {
    (cookies as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockReturnValueOnce({ value: 'valid_token' }),
    });
    (verifyJwt as jest.Mock).mockReturnValueOnce({ error: null });

    render(<SignInNavLink />);

    await waitFor(() => {
      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });

  it('renders the "Sign In" link when the user is not authenticated', async () => {
    (cookies as jest.Mock).mockReturnValueOnce({
      get: jest.fn().mockReturnValueOnce({ value: '' }),
    });
    (verifyJwt as jest.Mock).mockReturnValueOnce({ error: 'Invalid token' });

    render(<SignInNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('signin-nav-link')).toBeInTheDocument();
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });
});
