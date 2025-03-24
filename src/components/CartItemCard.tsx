import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { SwagCartItem } from '@/types';
import Image from 'next/image';

const CartItemCard: React.FC<{ cartItem: SwagCartItem; handleRemove: () => void; handleAdd: (cartItem: SwagCartItem) => void }> = ({ cartItem, handleRemove, handleAdd }) => {
  const { image, name, product_data, quantity, price } = cartItem;
  const { size } = product_data;
  const formattedPrice = formatPriceForDisplay(price);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center w-full sm:w-auto">
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image src={image} alt={name} fill className="object-cover rounded-md" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">
            <a href={`/product/${product_data.productId}`} className="hover:text-blue-600 transition-colors">
              {name}
            </a>
          </h3>
          <p className="text-sm text-gray-600">Size: {size}</p>
          <p className="text-sm font-medium text-gray-900 mt-1 sm:hidden">{formattedPrice}</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <div className="hidden sm:block text-lg font-medium text-gray-900">{formattedPrice}</div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleRemove}>
            -
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => handleAdd(cartItem)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
