import { render } from '@testing-library/react';
import WrappedSearchBar from './SearchBar';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({ get: () => ({}) }),
}));

test('renders search bar with correct data-testid and functionality', () => {
  const { getByTestId } = render(<WrappedSearchBar />);

  expect(getByTestId('searchbar-input')).toBeInTheDocument();
  expect(getByTestId('searchbar-btn')).toBeInTheDocument();
});
