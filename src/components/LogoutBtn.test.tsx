import { render, screen } from '@testing-library/react';

import LogoutBtn from './LogoutBtn';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LogoutBtn', () => {
  it('renders logout button', () => {
    render(<LogoutBtn />);
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
  });
});
