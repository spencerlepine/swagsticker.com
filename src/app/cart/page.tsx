import { DUMMY_CART, DUMMY_PRODUCTS } from '@/demoData';
import { CartPageItem } from '@/types';

const CartItemCard: React.FC<CartPageItem> = ({ productSlug, size, quantity, title }) => (
  <li key={productSlug}>
    <h4>{title}</h4>
    <p>{size}</p>
    <p>{quantity}</p>
  </li>
);

export default async function CartPage() {
  const cartItems: CartPageItem[] = DUMMY_CART.map(cartItem => ({
    ...cartItem,
    ...DUMMY_PRODUCTS.find(product => product.slug === cartItem.productSlug),
  }));

  return (
    <div>
      <h2>Cart</h2>
      <button>Checkout</button>
      {cartItems && cartItems.length > 0 && (
        <ul>
          {cartItems.map(cartItem => (
            <CartItemCard key={cartItem.productSlug} {...cartItem} />
          ))}
        </ul>
      )}
    </div>
  );
}
