import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToCartBtn from './AddToCartBtn';
import { getProductById } from '@/lib/catalog';
import { useShoppingCart } from 'use-shopping-cart';
import { usePopupAlert } from '@/providers/AlertProvider';

jest.mock('@/lib/catalog', () => ({
  getProductById: jest.fn(),
}));
jest.mock('@/providers/AlertProvider', () => ({ usePopupAlert: jest.fn() }));
jest.mock('use-shopping-cart', () => ({
  useShoppingCart: jest.fn(),
}));

describe('AddToCartBtn', () => {
  const mockSetAlert = jest.fn();
  const mockAddItem = jest.fn();

  beforeEach(() => {
    (usePopupAlert as jest.Mock).mockReturnValueOnce({ setAlert: mockSetAlert });
    (useShoppingCart as jest.Mock).mockReturnValueOnce({ addItem: mockAddItem });

    (getProductById as jest.Mock).mockReturnValueOnce({
      id: 'prod-123',
      name: 'Test Product',
      category: 'category',
      type: 'type',
      price: 100,
    });
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('adds an item to the cart and shows a success alert', async () => {
    render(<AddToCartBtn productId="prod-123" size="M" price={100} />);

    const button = screen.getByTestId('addtocart-btn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        id: 'prod-123-M',
        category: 'category',
        name: 'Test Product',
        type: 'type',
        price: 100,
        currency: 'USD',
        product_data: { productId: 'prod-123', size: 'M', category: 'category', type: 'type' },
        quantity: 1,
      });
      expect(mockSetAlert).toHaveBeenCalledWith('Item added to cart', 'info');
    });
  });

  it('handles failure when adding an item to the cart', async () => {
    mockAddItem.mockImplementationOnce(() => {
      throw new Error('Add item failed');
    });

    render(<AddToCartBtn productId="prod-123" size="M" price={100} />);

    const button = screen.getByTestId('addtocart-btn');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSetAlert).toHaveBeenCalledWith('Failed to add item to cart', 'error');
    });
  });
});
