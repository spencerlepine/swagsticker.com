import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SignInPage from './page';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ isAuthenticated: false }),
  })
) as jest.Mock;

describe('SignInPage Component', () => {
  it('renders the email input field', async () => {
    render(<SignInPage />);

    await waitFor(() => {
      expect(screen.getByTestId('signin-email-input')).toBeInTheDocument();
    });
  });

  it('renders the submit email button', async () => {
    render(<SignInPage />);

    await waitFor(() => {
      expect(screen.getByTestId('signin-email-submit-btn')).toBeInTheDocument();
    });
  });

  it('renders the OTP input fields', async () => {
    render(<SignInPage />);

    const emailInput = screen.getByTestId('signin-email-input');
    const submitEmailButton = screen.getByTestId('signin-email-submit-btn');

    await waitFor(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    });

    fireEvent.click(submitEmailButton);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-otp-input-0')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-otp-input-1')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-otp-input-2')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-otp-input-3')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-otp-input-4')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-otp-input-5')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('confirm-otp-btn')).toBeInTheDocument();
    });
  });
});
