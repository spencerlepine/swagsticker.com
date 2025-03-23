// E2E test for checkout flow
// uses k6 for browser-based load test on local machine

import { browser } from 'k6/browser';
import { sleep } from 'k6';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

export const options = {
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      options: {
        browser: {
          type: 'chromium',
          bypassCSP: true,
          headless: true, // Update me for local testing
        },
      },
    },
  },
  thresholds: {
    checks: ['rate >= 0.95'],
    browser_web_vital_lcp: ['p(95) < 2500'],
  },
  summaryTrendStats: ['avg', 'min', 'max', 'p(90)', 'p(95)'],
  discardResponseBodies: true,
  maxRedirects: 10,
};

export default async function loadTest() {
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'load' });

    const productId = 'figma';
    await page.locator('[data-testid="searchbar-input"]').click();
    await page.locator('[data-testid="searchbar-input"]').type(productId);
    await page.locator('[data-testid="searchbar-btn"]').click();
    await page.waitForNavigation();
    check(page, {
      'Step 1: load catalog page': p => p.url().includes('?query=figma'),
    });

    await page.locator(`[data-testid="productcard-${productId}"]`).click();
    await page.waitForNavigation();
    await check(page, { 'Step 2: load product page': p => p.url() === 'http://localhost:3000/product/figma' });

    await page.locator('[data-testid="productsize-btn-3x3in"]').click();

    await page.locator('[data-testid="addtocart-btn"]').click();
    await check(page, { 'Step 3: add item to cart': p => p.url() === 'http://localhost:3000/product/figma' });

    await page.locator('[data-testid="signin-nav-link"]').click();
    await page.waitForNavigation();
    await check(page, { 'Step 4: load signin page': p => p.url() === 'http://localhost:3000/signin' });
    await page.locator('//h2[text()="Sign In with OTP"]').waitFor({ state: 'visible', timeout: 10000 });

    const emailInput = page.locator('[data-testid="signin-email-input"]');
    await emailInput.focus();
    await emailInput.type('test@example.com');
    await sleep(0.25);

    const submitButton = page.locator('[data-testid="signin-email-submit-btn"]');
    await submitButton.focus();
    await submitButton.click();

    await page.locator('//h2[text()="Confirm OTP"]').waitFor({ state: 'visible', timeout: 10000 });
    await check(page.locator('h2'), {
      'Step 5: receive OTP email': async lo => (await lo.textContent()) == 'Confirm OTP',
    });

    await page.locator('[data-testid="confirm-otp-input-0"]').type('1');
    await page.locator('[data-testid="confirm-otp-input-1"]').type('2');
    await page.locator('[data-testid="confirm-otp-input-2"]').type('3');
    await page.locator('[data-testid="confirm-otp-input-3"]').type('4');
    await page.locator('[data-testid="confirm-otp-input-4"]').type('5');
    await page.locator('[data-testid="confirm-otp-input-5"]').type('6');
    await page.locator('[data-testid="confirm-otp-btn"]').click();

    await page.waitForNavigation();
    await check(page, {
      'Step 6: successful signin': p => p.url() === 'http://localhost:3000/',
    });

    await page.locator('[data-testid="cart-header-nav"]').click();
    await page.waitForNavigation();
    await check(page, { 'Step 7: load cart page': p => p.url() === 'http://localhost:3000/cart' });

    await page.locator('[data-testid="checkout-btn"]').click();
    await page.waitForNavigation();
    await check(page, { 'Step 8: load checkout page': p => p.url().startsWith('http://localhost:3000/checkout') });

    await page.waitForSelector('iframe[title="Secure address input frame"]', { visible: true, timeout: 10000 });
    await page.waitForSelector('[data-testid="shipping-address-title"]', { visible: true, timeout: 10000 });
    const iframeElement = await page.$('iframe[title="Secure address input frame"]');
    const iframeContent = await iframeElement.contentFrame();
    await iframeContent.waitForSelector('input[name="name"]', { visible: true, timeout: 10000 });
    await iframeContent.click('input[name="name"]');
    await iframeContent.type('input[name="name"]', 'John Doe');
    await iframeContent.type('input[name="addressLine1"]', '123 Main St');
    await iframeContent.click('input[name="name"]');
    await iframeContent.type('input[name="locality"]', 'NYC');
    await iframeContent.locator('select[name="administrativeArea"]').selectOption('NY');
    await iframeContent.type('input[name="postalCode"]', '10001');
    await iframeContent.type('input[name="phone"]', '12345678901');
    await iframeContent.click('input[name="name"]');

    const paymentIframeElement = await page.$('iframe[title="Secure payment input frame"]');
    const paymentIframeContent = await paymentIframeElement.contentFrame();
    await paymentIframeContent.type('input[name="number"]', '4242424242424242');
    await paymentIframeContent.type('input[name="expiry"]', '1232');
    await paymentIframeContent.type('input[name="cvc"]', '123');

    await page.locator('[data-testid="checkout-submit-paymentintent-btn"]').click();

    await page.waitForNavigation();
    await check(page.locator('h2'), {
      'Step 9: submit checkout form': async lo => (await lo.textContent()) === 'Order Confirmation',
    });

    await page.locator('[data-testid="confirm-order-btn"]').click();

    await page.locator('//h2[text()="Thank you for your order!"]').waitFor({ state: 'visible', timeout: 10000 });
    await check(page.locator('h2'), {
      'Step 10: submit order confirmation form': async lo => (await lo.textContent()) === 'Thank you for your order!',
    });

    await page.locator('[data-testid="view-orders-link"]').click();
  } finally {
    await page.close();
  }
}
