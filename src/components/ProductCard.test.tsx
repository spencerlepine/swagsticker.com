import { render } from '@testing-library/react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

test('renders product card with correct data-testid', () => {
  const product: Product = {
    id: 'chrome',
    name: 'Chrome Sticker',
    image: '/chrome-sticker.jpg',
    defaultSize: '3x3in',
    description: '',
    dateAdded: '',
    currency: '',
    type: 'sticker',
    sizes: [],
  };

  const { getByTestId } = render(<ProductCard {...product} />);

  expect(getByTestId('productcard-chrome')).toBeInTheDocument();
});
