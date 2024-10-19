'use client';

import SearchBar from './SearchBar';
import { useShoppingCart } from 'use-shopping-cart';

const Header: React.FC = () => {
  const { cartCount } = useShoppingCart();

  // TODO_AUTH_ACCOUNT
  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold">
          SwagSticker
        </a>
        <SearchBar />
        <div className="flex space-x-4">
          {false ? (
            <a href="/account" className="text-blue-500 hover:underline">
              Account
            </a>
          ) : (
            <a href="/api/auth/login" className="text-blue-500 hover:underline">
              Sign in
            </a>
          )}
          <a href="/cart" className="text-blue-500 hover:underline">
            Cart ({cartCount})
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
