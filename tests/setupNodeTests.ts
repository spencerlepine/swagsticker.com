// TODO: framework-agnostic API route tests

jest.mock('@/lib/printify', () => ({
  checkPrintifyStatus: jest.fn().mockResolvedValue('operational'),
  retrieveShippingCost: jest.fn().mockResolvedValue({
    first_item: { cost: 500 },
    additional_items: { cost: 200 },
  }),
  createDraftOrder: jest.fn().mockResolvedValue({ id: 'printify_order_id' }),
  orders: {
    getOne: jest.fn().mockResolvedValue({
      id: 'printify_order_id',
      status: 'fulfilled',
      shipments: null,
      address_to: { email: 'test@example.com' },
      line_items: [],
      total_price: 1000,
      total_shipping: 500,
      metadata: {},
    }),
  }
}));

jest.mock('@/lib/stripe', () => ({
  checkStripeStatus: jest.fn().mockResolvedValue('operational'),
  stripe: {
    customers: {
      list: jest.fn().mockResolvedValue({ data: [] }),
      create: jest.fn().mockResolvedValue({ id: 'cus_123', email: 'test@example.com', name: 'Test User' }),
    },
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ id: 'pi_123', client_secret: 'pi_123_secret', status: 'requires_capture' }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'pi_123',
        status: 'requires_capture',
        receipt_email: 'test@example.com',
        latest_charge: 'ch_123',
        shipping: { address: { country: 'US', state: 'CA', city: 'SF', line1: '123 St', postal_code: '94105' }, phone: '1234567890' },
        metadata: { cartItems: '[]', swagOrderId: 'swag_order_id' },
      }),
      update: jest.fn().mockResolvedValue({}),
      capture: jest.fn().mockResolvedValue({}),
    },
    charges: {
      update: jest.fn().mockResolvedValue({}),
    },
  },
}));

jest.mock('@/lib/mailer', () => ({
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendOrderNotifEmail: jest.fn().mockResolvedValue(true),
}));

