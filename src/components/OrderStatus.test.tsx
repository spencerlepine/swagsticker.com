import { render, screen } from '@testing-library/react';

import { OrderCard } from './OrderCard';
import { SwagOrderDetails } from '@/types';

const mockOrder: SwagOrderDetails = {
  id: '123',
  printifyOrderId: 'abc123',
  date: '2023-01-01',
  total_price: 1000,
  status: 'pending',
  address: {
    city: 'Test City',
    country: 'Test Country',
    line1: '123 Test St',
    line2: null,
    postal_code: '12345',
    state: 'TS',
  },
  last4: '1234',
  receiptUrl: 'https://example.com/receipt',
  swagOrderId: 'swag123',
  shipments: [],
  metadata: {
    order_type: 'standard',
    shop_order_id: 456,
    shop_order_label: 'Order #456',
    shop_fulfilled_at: '2023-01-02',
  },
  total_shipping: 0,
  address_to: {
    email: 'test@example.com',
  },
};

describe('OrderCard', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockOrder),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders card order id', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByTestId('card-order-id-123')).toBeInTheDocument();
  });

  it('renders expand order card button', () => {
    render(<OrderCard order={mockOrder} />);
    expect(screen.getByTestId('expand-order-card-123')).toBeInTheDocument();
  });

  it('renders order status title when expanded', async () => {
    render(<OrderCard order={mockOrder} />);
    const expandButton = screen.getByTestId('expand-order-card-123');
    expandButton.click();
    expect(await screen.findByTestId('order-status-title')).toBeInTheDocument();
  });
});
