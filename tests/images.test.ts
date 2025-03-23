import { STICKER_BACKUP_THUMBNAIL_ASSETS_BASE_URL, STICKER_PNG_ASSETS_BASE_URL, STICKER_PRODUCTS } from '@/lib/products';
import fs from 'fs';
import path from 'path';

describe('Sticker Products', () => {
  // Test 1: Verify thumbnail image exists for every product
  describe('Local image verification', () => {
    test.each(STICKER_PRODUCTS)('has a thumbnail image for $id in public/images', ({ id, image }) => {
      const expectedPath = path.join(__dirname, '..', 'public', 'images', `${id}.jpg`);
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
