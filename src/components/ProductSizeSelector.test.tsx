import { render, screen } from '@testing-library/react';

import ProductSizeSelector from './ProductSizeSelector';
import { Product } from '@/types';

jest.mock('use-shopping-cart', () => ({
  useShoppingCart: () => ({
    clearCart: jest.fn(),
  }),
}));

describe('ProductSizeSelector', () => {
  const mockProduct: Product = {
    id: 'prod-123',
    name: 'Test Sticker',
    sizes: [
      { value: 'S', price: 2 },
      { value: 'M', price: 2 },
      { value: 'L', price: 2 },
    ],
    defaultSize: '2x2in',
    description: '',
    dateAdded: '',
    currency: '',
    image: '',
    type: 'sticker',
  };

  it('renders size buttons and default price', () => {
    render(<ProductSizeSelector product={mockProduct} />);

    // Check if default price is displayed
    expect(screen.getByText('$2.30')).toBeInTheDocument();

    // Check if size buttons are displayed
    expect(screen.getByTestId('productsize-btn-S')).toBeInTheDocument();
    expect(screen.getByTestId('productsize-btn-M')).toBeInTheDocument();
    expect(screen.getByTestId('productsize-btn-L')).toBeInTheDocument();
  });

  it('renders the AddToCartBtn with the correct props', () => {
    render(<ProductSizeSelector product={mockProduct} />);

    // Check if the AddToCartBtn is rendered
    const addToCartButton = screen.getByTestId('addtocart-btn');
    expect(addToCartButton).toBeInTheDocument();

    // Ensure the AddToCartBtn has the correct props
    expect(addToCartButton).toHaveAttribute('data-testid', 'addtocart-btn');
  });
});
