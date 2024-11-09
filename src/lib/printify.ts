import Printify from 'printify-sdk-js';
import { PRODUCT_CONFIG, retrieveStickerPNGFileUrl, STICKER_SIZES } from '@/lib/products';
import { PrintifyLineItem, PrintifyShippingProfile, StripeShippingDetails, SubmitOrderData, VariantShippingData } from '@/types';
import type { Stripe as StripeType } from 'stripe';
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

export async function checkPrintifyStatus() {
  try {
    await printify.shops.list();
    return "operational";
  } catch (error) {
    logger.error('[Status] Printify status check failed', { error });
    return "degraded";
  }
}

export const formatCartItemsForPrintify = (lineItems: StripeType.LineItem[]): PrintifyLineItem[] => {
  return lineItems.map(item => ({
    print_provider_id: PRINTIFY_PRINT_PROVIDER_ID,
    blueprint_id: PRINTIFY_BLUEPRINT_ID,
    // @ts-expect-error - metadata is valid, hard to find stripe type tho
    variant_id: PRINTIFY_VARIANT_IDS[item.price?.product?.metadata?.size],
    print_areas: {
      // @ts-expect-error - metadata is valid, hard to find stripe type tho
      front: retrieveStickerPNGFileUrl(item.price?.product?.metadata?.productId),
    },
    quantity: item.quantity || 1,
  }));
};

const formatStripeAddress = (stripeAddress: StripeShippingDetails, email: string | null, phone: string | null) => ({
  first_name: stripeAddress.name.split(' ')[0],
  last_name: stripeAddress.name.split(' ')[1],
  email: email || 'placeholder@gmail.com',
  phone: phone || '0574 69 21 90',
  country: stripeAddress.address.country,
  region: stripeAddress.address.state,
  // state: stripeAddress.address.state, // Printify is European startup, they don't use "state"
  address1: stripeAddress.address.line1,
  address2: stripeAddress.address.line2,
  city: stripeAddress.address.city,
  zip: stripeAddress.address.postal_code,
});

export async function createDraftOrder(
  cartItems: StripeType.LineItem[],
  stripeShippingDetails: StripeType.Checkout.Session.ShippingDetails | null,
  swagOrderId: string,
  stripeSessionId: string,
  email: string | null,
  phone: string | null
): Promise<{ id: string }> {
  const printifyLineItems: PrintifyLineItem[] = formatCartItemsForPrintify(cartItems);

  const address = formatStripeAddress(stripeShippingDetails as StripeShippingDetails, email, phone);
  const orderData: SubmitOrderData = {
    external_id: stripeSessionId,
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

export async function retrieveShippingCost(): Promise<PrintifyShippingProfile> {
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

export async function sendOrderToProduction(printifyOrderId: string) {
  logger.info('[Printify] Sending order to production', { printifyOrderId });
  await printify.orders.sendToProduction(printifyOrderId);
}
