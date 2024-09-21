import { CartItem, Product } from "./types";

export const DUMMY_PRODUCTS: Product[] = [
  {
    slug: 'amazon-web-services',
    title: 'Amazon Web Services Sticker',
    description: 'Amazon Web Services logo sticker for laptops.',
    thumbnailUrl: 'next.svg', // public/next.svg
    price: 2.3,
    sizes: ['2x2 in', '3x3 in', '4x4 in'],
  },
  {
    slug: 'github-octocat',
    title: 'GitHub Octocat Sticker',
    description: 'GitHub Octocat logo sticker for laptops.',
    thumbnailUrl: 'next.svg', // public/next.svg
    price: 2.4,
    sizes: ['2x2 in', '3x3 in', '4x4 in'],
  },
];

// Queried from CartItems DB
export const DUMMY_CART: CartItem[] = [{ productSlug: 'github-octocat', size: '2x2 in', quantity: 1 }];