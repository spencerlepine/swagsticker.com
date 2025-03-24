import { LineItem, OrderShipment, ShippingProfile } from 'printify-sdk-js';

export type Category = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'cloud' | 'data-science' | 'developer' | 'mobile' | 'ai' | 'database';
export type Type = 'sticker' | 'pack';
export type Size = '2x2in' | '3x3in' | '4x4in';
export interface Product {
  id: string;
  name: string;
  description: string;
  dateAdded: string;
  currency: string;
  image: string;
  type: Type;
  category?: Category;
  sizes: { value: string; price: number }[];
  defaultSize: Size;
}

export type SortByOption = 'alphabetical' | 'newest' | 'featured' | 'price-desc' | 'price-asc';
export interface FilterSearchParams {
  query?: string;
  page?: number;
  limit?: number;
  type?: Type;
  category?: Category;
  sortBy?: SortByOption;
}

export type MetadataCartItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
  product_data: {
    size: string;
    productId: string;
  };
};

export type SwagCartItem = {
  id: string;
  /**
   * The name of the product
   */
  name: string;
  /**
   * The description of the product
   */
  description: string;
  quantity: number;
  /**
   * The price of the product
   */
  price: number;
  /**
   * A URL to an image of the product
   */
  image: string;
  /**
   * The currency of the product
   */
  currency: string;
  /**
   * Values that go into the Stripe price_metadata field
   */
  price_data?: object;
  /**
   * Values that go into the Stripe product_metadata field
   */
  product_data: { size: string; productId: string; category?: string; type: string };
};

export interface FetchProductsFilters {
  category?: Category;
  type?: Type;
  query?: string;
}
export interface PaginatedProducts {
  products: Product[];
  pageLimitIsReached: boolean;
  totalItems: number
}

export interface VariantShippingData {
  profiles: ShippingProfile[];
}

export interface SwagOrderDetails {
  id: string;
  date?: string;
  total?: number;
  status?: string;
  address?: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2?: string | null;
    postal_code: string | null;
    state: string | null;
  };
  last4?: string | null;
  receiptUrl?: string | null;
  printifyOrderId?: string;
  swagOrderId?: string;
  shipments?: OrderShipment[];
  metadata?: {
    order_type: string;
    shop_order_id: number;
    shop_order_label: string;
    shop_fulfilled_at: string;
  };
  line_items?: LineItem[];
  total_price?: number;
  total_shipping?: number;
  address_to?: { email: string };
}
