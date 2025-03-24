import { render, screen } from '@testing-library/react';
import LogoutBtn from './LogoutBtn';

describe('LogoutBtn', () => {
  it('renders logout button', () => {
    render(<LogoutBtn />);
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
  });
});
