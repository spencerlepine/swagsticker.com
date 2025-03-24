import { render, screen } from '@testing-library/react';
import ContactPage from './page';

describe('ContactPage', () => {
  it('renders contact form name input', () => {
    render(<ContactPage />);
    expect(screen.getByTestId('contact-form-name-input')).toBeInTheDocument();
  });

  it('renders contact form email input', () => {
    render(<ContactPage />);
    expect(screen.getByTestId('contact-form-email-input')).toBeInTheDocument();
  });

  it('renders contact form message input', () => {
    render(<ContactPage />);
    expect(screen.getByTestId('contact-form-message-input')).toBeInTheDocument();
  });

  it('renders contact form submit button', () => {
    render(<ContactPage />);
    expect(screen.getByTestId('contact-form-submit-btn')).toBeInTheDocument();
  });
});
