import Printify from 'printify-sdk-js';
import { STICKER_SIZES } from '@/lib/products';
import { CartItem, PrintifyLineItem } from '@/types';

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
      front: `${process.env.NEXT_PUBLIC_URL}${cartItem.image}`,
    },
    quantity: cartItem.quantity,
  }));
};

export async function createDraftOrder(lineItems: PrintifyLineItem[]): Promise<{ printifyOrderId: string }> {
  try {
    const randomId = crypto.randomUUID();
    const randomLabel = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');

    const orderData = {
      external_id: randomId,
      label: `shipment_${randomLabel}`,
      line_items: lineItems,
      shipping_method: 1,
      is_printify_express: false,
      is_economy_shipping: false,
      send_shipping_notification: false,
      // TODO_AUTH_ORDER
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

    const result = await printify.orders.submit(orderData);
    const { id: printifyOrderId } = result;
    return { printifyOrderId };
  } catch (error) {
    console.error('[Printify] Error submitting order:', error);
    return { printifyOrderId: '' };
  }
}

export async function sendOrderToProduction(printifyOrderId: string): Promise<{ success: boolean }> {
  try {
    console.log('[Printify] sending order to product, printifyOrderId', printifyOrderId);
    await printify.orders.sendToProduction(printifyOrderId);
    return { success: true };
  } catch (error) {
    console.error('[Printify] Error sending order to production:', error);
    return { success: false };
  }
}
