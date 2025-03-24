import { STICKER_BACKUP_THUMBNAIL_ASSETS_BASE_URL, STICKER_PNG_ASSETS_BASE_URL, STICKER_PRODUCTS } from '@/lib/products';
import { STICKER_SIZES, PRODUCT_CONFIG, STICKER_PRICES, DEFAULT_STICKER_SIZES, retrieveStickerPNGFileUrl } from '@/lib/products';
import fs from 'fs';
import path from 'path';

describe('Sticker Images', () => {
  // Test 1: Verify thumbnail image exists for every product
  describe('Local image verification', () => {
    test.each(STICKER_PRODUCTS)('has a thumbnail image for $id in public/images', ({ id, image }) => {
      const expectedPath = path.join(__dirname, '..', '..', 'public', 'images', `${id}.jpg`);
      expect(fs.existsSync(expectedPath)).toBe(true);

      // Also verify the image path in the data matches the convention
      expect(image).toBe(`/images/${id}.jpg`);
    });
  });

  // Test 2: Verify GitHub product image exists
  describe('GitHub image verification', () => {
    test.each(STICKER_PRODUCTS)(
      'has a public PNG asset for $id on GitHub',
      async ({ id }) => {
        const imageUrl = `${STICKER_PNG_ASSETS_BASE_URL}/${id}.png`;

        // Make a HEAD request to check if the file exists
        const response = await fetch(imageUrl, { method: 'HEAD' });
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
      },
      10000 // Timeout of 10 seconds for network requests
    );

    test.each(STICKER_PRODUCTS)(
      'has a public JPG thumbnail asset for $id on GitHub',
      async ({ id }) => {
        const imageUrl = `${STICKER_BACKUP_THUMBNAIL_ASSETS_BASE_URL}/${id}.jpg`;

        // Make a HEAD request to check if the file exists
        const response = await fetch(imageUrl, { method: 'HEAD' });
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
      },
      10000 // Timeout of 10 seconds for network requests
    );
  });

  // Optional: Basic data structure validation
  describe('Data structure validation', () => {
    test.each(STICKER_PRODUCTS)('$id has all required properties', product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('dateAdded');
      expect(product).toHaveProperty('type');
      expect(product).toHaveProperty('category');
    });
  });
});

describe('Product Configuration', () => {
  test('STICKER_SIZES constants should be defined correctly', () => {
    expect(STICKER_SIZES).toEqual({
      TWO_BY_TWO_IN: '2x2in',
      THREE_BY_THREE_IN: '3x3in',
      FOUR_BY_FOUR_IN: '4x4in',
    });
  });

  test('PRODUCT_CONFIG should have correct default values', () => {
    expect(PRODUCT_CONFIG).toEqual({
      language: 'en-US',
      allowCountries: ['US'],
      currency: 'USD',
      defaultSize: '2x2in',
    });
  });

  test('STICKER_PRICES should match expected pricing', () => {
    expect(STICKER_PRICES).toEqual({
      '2x2in': 230,
      '3x3in': 250,
      '4x4in': 270,
    });
  });

  test('DEFAULT_STICKER_SIZES should contain all sizes with correct prices', () => {
    expect(DEFAULT_STICKER_SIZES).toHaveLength(3);

    DEFAULT_STICKER_SIZES.forEach(size => {
      expect(size).toHaveProperty('value');
      expect(size).toHaveProperty('price');
      expect(STICKER_PRICES[size.value]).toBe(size.price);
    });
  });

  test('retrieveStickerPNGFileUrl should return correct URL format', () => {
    const slug = 'test-sticker';
    const expected = 'https://github.com/spencerlepine/swagsticker.com/raw/refs/heads/assets/pngs/test-sticker.png';
    expect(retrieveStickerPNGFileUrl(slug)).toBe(expected);
  });
});

describe('STICKER_PRODUCTS', () => {
  test('STICKER_PRODUCTS should be an array of products', () => {
    expect(Array.isArray(STICKER_PRODUCTS)).toBe(true);
    expect(STICKER_PRODUCTS.length).toBeGreaterThan(0);
  });

  test('Each product should have required properties', () => {
    STICKER_PRODUCTS.forEach(product => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('image');
      expect(product).toHaveProperty('dateAdded');
      expect(product).toHaveProperty('type');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('currency');
      expect(product).toHaveProperty('defaultSize');
      expect(product).toHaveProperty('sizes');
    });
  });

  test('Product IDs should be unique', () => {
    const ids = STICKER_PRODUCTS.map(product => product.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });

  test('All products should have type "sticker"', () => {
    STICKER_PRODUCTS.forEach(product => {
      expect(product.type).toBe('sticker');
    });
  });

  test('All products should use the configured currency', () => {
    STICKER_PRODUCTS.forEach(product => {
      expect(product.currency).toBe(PRODUCT_CONFIG.currency);
    });
  });

  test('Product images should follow expected pattern', () => {
    STICKER_PRODUCTS.forEach(product => {
      expect(product.image).toMatch(/^\/images\/[\w-]+\.jpg$/);
    });
  });

  test('Products should have valid categories', () => {
    const validCategories = ['frontend', 'backend', 'fullstack', 'database', 'devops', 'cloud', 'developer', 'mobile', 'ai'];

    STICKER_PRODUCTS.forEach(product => {
      expect(validCategories).toContain(product.category);
    });
  });

  test('Product sizes should match DEFAULT_STICKER_SIZES', () => {
    STICKER_PRODUCTS.forEach(product => {
      expect(product.sizes).toEqual(DEFAULT_STICKER_SIZES);
    });
  });

  test('Date format should be ISO 8601', () => {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

    STICKER_PRODUCTS.forEach(product => {
      expect(product.dateAdded).toMatch(isoDateRegex);
    });
  });
});
