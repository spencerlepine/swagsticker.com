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

export type CartItem = {
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
}

export interface PrintifyLineItem {
  print_provider_id: number;
  blueprint_id: number;
  variant_id: number; // Assuming variantIds has numeric keys for sticker sizes
  print_areas: {
    front: string;
  };
  quantity: number;
}

interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string; // optional
  address1: string;
  address2?: string; // optional
  city: string;
  zip: string;
}

export interface SubmitOrderData {
  external_id: string;
  label: string;
  line_items: PrintifyLineItem[];
  shipping_method: number;
  is_printify_express: boolean;
  is_economy_shipping: boolean;
  send_shipping_notification: boolean;
  address_to: PrintifyAddress;
}

export interface PrintifyShippingProfile {
  variant_ids: number[];
  first_item: {
    cost: number;
    currency: string;
  };
  additional_items: {
    cost: number;
    currency: string;
  };
  countries: string[];
}

export interface VariantShippingData {
  profiles: PrintifyShippingProfile[];
}

export interface StripeShippingMethod {
  shipping_rate_data: {
    type: 'fixed_amount';
    fixed_amount: {
      amount: number;
      currency: string; // Assuming PRODUCT_CONFIG.currency is of type string
    };
    display_name: string;
    delivery_estimate: {
      minimum: {
        unit: 'business_day'; // You could also make this a union type if there are other units
        value: number;
      };
      maximum: {
        unit: 'business_day'; // Same as above
        value: number;
      };
    };
  };
}

interface Address {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
  state: string;
}

export interface StripeShippingDetails {
  address: Address;
  name: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status?: string;
  trackingNumber?: string;
  address: {
    city: string | null;
    country: string | null;
    line1: string  | null;
    line2?: string | null;
    postal_code: string  | null;
    state: string | null;
  };
  last4?: string | null;
  receiptUrl?: string  | null;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
}
