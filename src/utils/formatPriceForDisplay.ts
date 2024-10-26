import { PRODUCT_CONFIG } from '@/lib/products';

const formatPriceForDisplay = (amount: number = 0): string => {
  const numberFormat = new Intl.NumberFormat([PRODUCT_CONFIG.language], {
    style: 'currency',
    currency: PRODUCT_CONFIG.currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount / 100);
};

export default formatPriceForDisplay;
