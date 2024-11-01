'use client';

import SearchBar from '@/components/SearchBar';
import { useShoppingCart } from 'use-shopping-cart';
import { IoMdCart } from 'react-icons/io';

const Header: React.FC = () => {
  const { cartCount } = useShoppingCart();

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-stone-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-xl text-sky-300 font-bold font-mono">
          SwagSticker
        </a>
        <SearchBar />
        <div className="flex space-x-1">
          <IoMdCart className="text-gray-400 w-6 h-6" />
          <a href="/cart" className="font-semibold  hover:underline">
            Cart ({cartCount})
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
