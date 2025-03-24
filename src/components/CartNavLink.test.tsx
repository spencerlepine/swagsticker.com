import { render, screen, waitFor } from '@testing-library/react';
import CartNavLink from './CartNavLink';
import { useShoppingCart } from 'use-shopping-cart';

jest.mock('use-shopping-cart', () => ({
  useShoppingCart: jest.fn(),
}));

describe('CartBtn Component', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('renders the cart button with the correct cart count', async () => {
    (useShoppingCart as jest.Mock).mockReturnValueOnce({ cartCount: 3 });

    render(<CartNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-header-nav')).toBeInTheDocument();
      expect(screen.getByText('Cart (3)')).toBeInTheDocument();
    });
  });

  it('renders the cart button with zero count if no items in cart', async () => {
    (useShoppingCart as jest.Mock).mockReturnValueOnce({ cartCount: 0 });

    render(<CartNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-header-nav')).toBeInTheDocument();
      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    });
  });
});
