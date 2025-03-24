jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => ({ get: () => ({}) }),
}));

jest.mock('@/providers/AlertProvider', () => ({ usePopupAlert: () => ({ setAlert: jest.fn() }) }));

jest.mock('use-shopping-cart', () => ({
  useShoppingCart: () => ({
    clearCart: jest.fn(),
  }),
}));
