import { render } from '@testing-library/react';
import WrappedSearchBar from './SearchBar';

test('renders search bar with correct data-testid and functionality', () => {
  const { getByTestId } = render(<WrappedSearchBar />);

  expect(getByTestId('searchbar-input')).toBeInTheDocument();
  expect(getByTestId('searchbar-btn')).toBeInTheDocument();
});
