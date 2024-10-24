import { CartItem } from '@/types';
import { PRODUCT_CONFIG, STICKER_PRICES, STICKER_SIZES } from '@/lib/products';

export const validateCartItems = (cartItems: CartItem[]): CartItem[] => {
  const ALLOWED_SIZES = Object.values(STICKER_SIZES);
  const MAX_ITEMS_ALLOWED = 50;
  const MAX_ITEM_QUANTITY = 10;
  const MAX_STRING_LENGTH = 500;
  const VALID_CURRENCY = PRODUCT_CONFIG.currency;

  try {
    if (!Array.isArray(cartItems) || cartItems.length > MAX_ITEMS_ALLOWED || cartItems.length === 0) {
      return [];
    }

    const validCartItems: CartItem[] = [];

    for (const item of cartItems) {
      // Basic type checks
      if (typeof item !== 'object' || !item.product_data || typeof item.product_data !== 'object') {
        return [];
      }

      // Validate strings and their lengths
      if (
        !item.name ||
        !item.description ||
        !item.image ||
        !item.currency ||
        !item.product_data.productId ||
        !item.product_data.size ||
        !item.product_data.type ||
        typeof item.name !== 'string' ||
        typeof item.description !== 'string' ||
        typeof item.image !== 'string' ||
        typeof item.currency !== 'string' ||
        typeof item.product_data.productId !== 'string' ||
        typeof item.product_data.size !== 'string' ||
        typeof item.product_data.type !== 'string' ||
        item.name.length > MAX_STRING_LENGTH ||
        item.description.length > MAX_STRING_LENGTH ||
        item.image.length > MAX_STRING_LENGTH ||
        item.product_data.productId.length > MAX_STRING_LENGTH
      ) {
        console.warn('Cart validation failed: Invalid string properties', {
          name: item.name,
          description: item.description,
          image: item.image,
          currency: item.currency,
          productId: item.product_data.productId,
          size: item.product_data.size,
          type: item.product_data.type,
        });
        return [];
      }

      // Validate size
      if (!ALLOWED_SIZES.includes(item.product_data.size)) {
        console.warn('Cart validation failed: Invalid size', {
          size: item.product_data.size,
          allowedSizes: ALLOWED_SIZES,
        });
        return [];
      }

      // Validate currency
      if (item.currency !== VALID_CURRENCY) {
        return [];
      }

      // Validate quantity
      const quantity = Number(item.quantity) || 1;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
        return [];
      }

      // Get price from server-side configuration
      const price = STICKER_PRICES[item.product_data.size];
      if (!price) {
        console.warn('Cart validation failed: Price not found for size', {
          size: item.product_data.size,
        });
        return [];
      }

      // Construct validated item
      const validCartItem: CartItem = {
        id: item.id,
        price,
        currency: VALID_CURRENCY,
        quantity,
        description: item.description.trim(),
        name: item.name.trim(),
        image: item.image.trim(),
        product_data: {
          size: item.product_data.size,
          productId: item.product_data.productId.trim(),
          type: item.product_data.type.trim(),
          ...(item.product_data.category && {
            category: item.product_data.category.trim(),
          }),
        },
      };

      validCartItems.push(validCartItem);
    }

    return validCartItems;
  } catch (error) {
    console.error('[CartValidation] Unable to verify cart items:', error);
    return [];
  }
};

export default validateCartItems;
