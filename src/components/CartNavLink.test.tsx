import { render, screen, waitFor } from '@testing-library/react';

import CartNavLink from './CartNavLink';
import { useShoppingCart } from 'use-shopping-cart';

jest.mock('use-shopping-cart', () => ({
  useShoppingCart: jest.fn(),
}));
const mockedUseShoppingCart = useShoppingCart as jest.Mock;

describe('CartBtn Component', () => {
  it('renders the cart button with the correct cart count', async () => {
    // Mock cartCount value
    mockedUseShoppingCart.mockReturnValue({ cartCount: 3 });

    render(<CartNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-header-nav')).toBeInTheDocument();
      expect(screen.getByText('Cart (3)')).toBeInTheDocument();
    });
  });

  it('renders the cart button with zero count if no items in cart', async () => {
    // Mock cartCount value as 0
    mockedUseShoppingCart.mockReturnValue({ cartCount: 0 });

    render(<CartNavLink />);

    await waitFor(() => {
      expect(screen.getByTestId('cart-header-nav')).toBeInTheDocument();
      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    });
  });
});
