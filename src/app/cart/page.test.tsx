import { render, screen, waitFor } from '@testing-library/react';
import CartPage from './page';

describe('CartPage Component', () => {
  it('renders the checkout button', async () => {
    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId('checkout-btn')).toBeInTheDocument();
    });
  });
});
