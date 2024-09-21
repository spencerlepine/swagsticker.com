export type Product = {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  sizes: string[];
};

export type CartItem = {
  productSlug: string;
  size: string;
  quantity: number;
};

export type CartPageItem = CartItem & Product;
