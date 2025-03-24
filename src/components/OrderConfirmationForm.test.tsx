import { render, screen, waitFor } from '@testing-library/react';
import OrderConfirmationForm from './OrderConfirmationForm';

const mockProps = {
  cartItems: [
    {
      id: '1',
      name: 'Test Sticker',
      description: 'Test Description',
      quantity: 1,
      price: 500,
      image: 'https://example.com/test.jpg',
      currency: 'USD',
      product_data: { size: '3x3in', productId: 'prod1', type: 'sticker' },
    },
  ],
  subtotal: '5.00',
  shippingCost: '2.00',
  orderSubtotal: '7.00',
  email: 'test@example.com',
  address: {
    city: 'Test City',
    country: 'USA',
    line1: '123 Test St',
    line2: null,
    postal_code: '12345',
    state: 'TS',
  },
  shipping: {
    name: 'Test User',
    phone: '123-456-7890',
  },
};

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn().mockResolvedValue({
    retrievePaymentIntent: jest.fn().mockResolvedValue({
      paymentIntent: { id: 'pi_123', status: 'requires_capture' },
      error: null,
    }),
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
  })
) as jest.Mock;

describe('OrderConfirmationForm', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost?payment_intent_client_secret=pi_secret',
      },
    });

    jest.mock('@stripe/stripe-js', () => ({
      loadStripe: jest.fn().mockResolvedValue({
        retrievePaymentIntent: jest.fn().mockResolvedValue({
          paymentIntent: {
            id: 'pi_123',
            status: 'requires_capture',
          },
          error: null,
        }),
      }),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirm order button', async () => {
    render(<OrderConfirmationForm {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('confirm-order-btn')).toBeInTheDocument();
    });
  });

  it('renders confirmation order id and view orders link on success', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ publishableKey: 'pk_test_123' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ swagOrderId: 'order123' }),
      }) as jest.Mock;

    render(<OrderConfirmationForm {...mockProps} />);
    await waitFor(() => {
      expect(screen.getByTestId('confirm-order-btn')).toBeInTheDocument();
    });

    const confirmButton = await screen.findByTestId('confirm-order-btn');
    confirmButton.click();

    expect(await screen.findByTestId('confirmation-order-id')).toBeInTheDocument();
    expect(screen.getByTestId('view-orders-link')).toBeInTheDocument();
  });
});
