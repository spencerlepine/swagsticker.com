import { render, screen } from '@testing-library/react';

import Footer from './Footer';

describe('Footer', () => {
  it('renders footer contact link', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer-contact-link')).toBeInTheDocument();
  });
});
