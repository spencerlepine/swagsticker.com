import Printify, { Address as PrintifyAddress, NewLineItem, ShippingProfile } from 'printify-sdk-js';
import { PRODUCT_CONFIG, retrieveStickerPNGFileUrl, STICKER_SIZES } from '@/lib/products';
import { MetadataCartItem, VariantShippingData } from '@/types';
import logger from './logger';

// docs: https://developers.printify.com/
// keys: https://printify.com/app/account/api
// NOTE: run this command to find your shopId: curl -X GET https://api.printify.com/v1/shops.json --header "Authorization: Bearer $PRINTIFY_API_TOKEN"
export const printify = new Printify({
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

export async function checkPrintifyStatus() {
  try {
    await printify.shops.list();
    return 'operational';
  } catch (error) {
    logger.error('[Status] Printify status check failed', { error });
    return 'degraded';
  }
}

export const formatCartItemsForPrintify = (cartItems: MetadataCartItem[]): NewLineItem[] => {
  return cartItems.map(item => ({
    print_provider_id: PRINTIFY_PRINT_PROVIDER_ID,
    blueprint_id: PRINTIFY_BLUEPRINT_ID,
    variant_id: PRINTIFY_VARIANT_IDS[item.product_data.size],
    print_areas: {
      front: retrieveStickerPNGFileUrl(item.product_data?.productId),
    },
    quantity: item.quantity || 1,
  }));
};

export async function createDraftOrder(cartItems: MetadataCartItem[], address: PrintifyAddress, swagOrderId: string): Promise<{ id: string }> {
  const printifyLineItems: NewLineItem[] = formatCartItemsForPrintify(cartItems);

  const orderData = {
    external_id: swagOrderId,
    label: `swagOrderId_${swagOrderId}`,
    line_items: printifyLineItems,
    shipping_method: 1,
    is_printify_express: false,
    is_economy_shipping: false,
    send_shipping_notification: true,
    address_to: address,
  };

  const order = await printify.orders.submit(orderData);
  return order;
}

export async function retrieveShippingCost(): Promise<ShippingProfile> {
  logger.info('[Printify] retrieving shipping options');
  const shipping: VariantShippingData = await printify.catalog.getVariantShipping(PRINTIFY_BLUEPRINT_ID.toString(), PRINTIFY_PRINT_PROVIDER_ID.toString());

  const fallbackShippingOptions = {
    variant_ids: [95743, 95744, 95745, 95746],
    first_item: { cost: 509, currency: 'USD' },
    additional_items: { cost: 9, currency: 'USD' },
    countries: ['US'],
  };

  // US-only
  // 1 option, "Standard" only
  return shipping.profiles.find(profile => profile.countries.includes(PRODUCT_CONFIG.allowCountries[0])) || fallbackShippingOptions;
}
