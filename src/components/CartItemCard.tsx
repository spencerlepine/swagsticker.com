import formatPriceForDisplay from '@/utils/formatPriceForDisplay';
import { CartItem } from '@/types';
import Image from 'next/image';

const CartItemCard: React.FC<{ cartItem: CartItem; handleRemove: () => void; handleAdd: () => void }> = ({ cartItem, handleRemove, handleAdd }) => {
  const { image, name, product_data, quantity, price } = cartItem;
  const { size } = product_data;
  const formattedPrice = formatPriceForDisplay(price);

  return (
    <div className="flex justify-between items-center py-4 px-4 border-b border-gray-200">
      <div className="flex items-center">
        <Image width={100} height={100} src={image} alt={name} className="w-16 h-16 mr-4 object-cover" />
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-600">{size}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <p className="text-lg text-gray-700 mr-4">{formattedPrice}</p>
        <button className="text-gray-600 hover:bg-gray-200 focus:outline-none border border-gray-500 rounded-md px-3 py-1" onClick={handleRemove}>
          -
        </button>
        <span className="px-4 font-semibold">{quantity}</span>
        <button className="text-gray-600 hover:bg-gray-200 focus:outline-none border border-gray-500 rounded-md px-3 py-1" onClick={handleAdd}>
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
