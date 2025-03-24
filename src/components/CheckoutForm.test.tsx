import { render, screen, waitFor } from '@testing-library/react';

import CheckoutForm from './CheckoutForm';

const mockProps = {
  cartItems: [] as [],
  subtotal: '20.00',
  shippingCost: '5.00',
  orderSubtotal: '25.00',
  clientSecret: 'test_secret',
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
  })
) as jest.Mock;

describe('CheckoutForm Component', () => {
  it('renders the shipping address title', async () => {
    render(<CheckoutForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('shipping-address-title')).toBeInTheDocument();
    });
  });

  it('renders the checkout submit payment intent button', async () => {
    render(<CheckoutForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('checkout-submit-paymentintent-btn')).toBeInTheDocument();
    });
  });
});
