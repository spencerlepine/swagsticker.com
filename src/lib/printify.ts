import Printify from 'printify-sdk-js';
import { retrieveStickerPNGFileUrl, STICKER_SIZES } from '@/lib/products';
import { CartItem, PrintifyLineItem, SubmitOrderData } from '@/types';
import logger from './logger';

// docs: https://developers.printify.com/
// keys: https://printify.com/app/account/api
// NOTE: run this command to find your shopId: curl -X GET https://api.printify.com/v1/shops.json --header "Authorization: Bearer $PRINTIFY_API_TOKEN"
const printify = new Printify({
  shopId: process.env.PRINTIFY_SHOP_ID as string, // global query by shop_id
  accessToken: process.env.PRINTIFY_API_TOKEN as string,
});

// Hard-coded configuration for "Kiss Cut Stickers"
const PRINTIFY_BLUEPRINT_ID = 1268; // {"id":1268,"title":"Kiss-Cut Vinyl Decals"} - printify.catalog.listBlueprints()
const PRINTIFY_PRINT_PROVIDER_ID = 215; // {"id":215,"title":"Stickers & Posters"} - printify.catalog.getBlueprintProviders(blueprintId);
const PRINTIFY_VARIANT_IDS = {
  // printify.catalog.getBlueprintVariants(blueprintId, printProviderId)
  [STICKER_SIZES.TWO_BY_TWO_IN]: 95743,
  [STICKER_SIZES.THREE_BY_THREE_IN]: 95744,
  [STICKER_SIZES.FOUR_BY_FOUR_IN]: 95745,
};

export const formatCartItemsForPrintify = (cartItems: CartItem[]): PrintifyLineItem[] => {
  return cartItems.map(cartItem => ({
    print_provider_id: PRINTIFY_PRINT_PROVIDER_ID,
    blueprint_id: PRINTIFY_BLUEPRINT_ID,
    variant_id: PRINTIFY_VARIANT_IDS[cartItem.product_data.size],
    print_areas: {
      front: retrieveStickerPNGFileUrl(cartItem.product_data.productId),
    },
    quantity: cartItem.quantity,
  }));
};

export async function createDraftOrder(cartItems: CartItem[]): Promise<{ id: string }> {
  logger.info('[Printify] Formatting cart items for Printify');
  const printifyLineItems: PrintifyLineItem[] = formatCartItemsForPrintify(cartItems);

  const randomId = crypto.randomUUID();
  const randomLabel = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');

  const orderData: SubmitOrderData = {
    external_id: randomId,
    label: `shipment_${randomLabel}`,
    // TODO_PRINTIFY (pull/format from stripe)
    line_items: printifyLineItems,
    shipping_method: 1,
    is_printify_express: false,
    is_economy_shipping: false,
    send_shipping_notification: false,
    // TODO_PRINTIFY (pull address from stripe)
    address_to: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'testing@beta.com',
      phone: '0574 69 21 90',
      country: 'BE',
      region: '',
      address1: 'ExampleBaan 121',
      address2: '45',
      city: 'Retie',
      zip: '2470',
    },
  };

  const order = await printify.orders.submit(orderData);
  return order;
}

export async function sendOrderToProduction(printifyOrderId: string) {
  logger.info('[Printify] Sending order to production', { printifyOrderId });
  await printify.orders.sendToProduction(printifyOrderId);
}
