'use client';

import SearchBar from '@/components/SearchBar';
import { useShoppingCart } from 'use-shopping-cart';

const Header: React.FC = () => {
  const { cartCount } = useShoppingCart();

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl font-bold">
          SwagSticker
        </a>
        <SearchBar />
        <div className="flex space-x-4">
          <a href="/cart" className="text-blue-500 hover:underline">
            Cart ({cartCount})
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
