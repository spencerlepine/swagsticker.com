'use client';

import { IoMdCart } from 'react-icons/io';
import { useShoppingCart } from 'use-shopping-cart';

const CartNavLink: React.FC = () => {
  const { cartCount } = useShoppingCart();

  return (
    <div className="flex items-center space-x-1">
      <IoMdCart className="text-gray-400 w-6 h-6" />
      <a data-testid={`cart-header-nav`} href="/cart" className="font-semibold hover:underline">
        Cart ({cartCount})
      </a>
    </div>
  );
};

export default CartNavLink;
