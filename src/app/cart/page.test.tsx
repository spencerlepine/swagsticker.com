import { render, screen, waitFor } from '@testing-library/react';
import CartPage from './page';

jest.mock('use-shopping-cart', () => ({ useShoppingCart: () => ({}) }));
jest.mock('@/providers/AlertProvider', () => ({ usePopupAlert: () => ({ setAlert: jest.fn() }) }));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CartPage Component', () => {
  it('renders the checkout button', async () => {
    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByTestId('checkout-btn')).toBeInTheDocument();
    });
  });
});
