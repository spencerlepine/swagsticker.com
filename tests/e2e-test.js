// E2E test for checkout flow
// uses k6 for browser-based load test on local machine

import { browser } from 'k6/browser';
import { sleep } from 'k6';
import { check } from 'https://jslib.k6.io/k6-utils/1.5.0/index.js';

const debugMode = __ENV.LOAD_TEST_DEBUG_MODE;

const commonThresholds = {
  checks: ['rate >= 1'],
  browser_web_vital_lcp: ['p(95) < 2000'],
  browser_web_vital_fcp: ['p(95) < 1800'],
  browser_web_vital_cls: ['avg < 0.1'],
};

const browserOptions = {
  type: 'chromium',
  bypassCSP: true,
  throttling: { latency: 40, download: 5000, upload: 1000 },
};

export const options = debugMode ? {
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 1,
      duration: '5s',
      options: { browser: browserOptions },
    },
  },
  thresholds: commonThresholds,
} : {
  scenarios: {
    ui: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 5 },
        { duration: '30s', target: 0 },
      ],
      options: { browser: browserOptions },
    },
  },
  thresholds: commonThresholds,
  summaryTrendStats: ['avg', 'min', 'max', 'p(90)', 'p(95)'],
  discardResponseBodies: true,
  maxRedirects: 15,
  gracefulStop: '30s',
};


async function fillInput(frame, selector, value) {
  await frame.click(selector);
  await frame.type(selector, value, { delay: 10 });

  await frame.waitForFunction(
    (sel, expected) => document.querySelector(sel).value === expected,
    { timeout: 5000 },
    selector,
    value
  );
}

export default async function loadTest() {
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'load' });

    const products = ['amazon-web-services', 'figma', 'chrome']
    const productId = products[Math.floor(Math.random() * products.length)];
    await page.locator('[data-testid="searchbar-input"]').click();
    await page.locator('[data-testid="searchbar-input"]').type(productId);

    await page.locator('[data-testid="searchbar-btn"]').click();
    await page.waitForNavigation();
    await check(page, {
      'Step 1: load catalog page': p => p.url().includes(`?query=${productId}`),
    })

    await page.locator(`[data-testid="productcard-${productId}"]`).click();
    await page.waitForNavigation();
    await check(page, { 'Step 2: load product page': p => p.url() === `http://localhost:3000/product/${productId}` })

    await page.locator('[data-testid="productsize-btn-3x3in"]').click();
    await page.locator('[data-testid="addtocart-btn"]').click();
    await check(page, { 'Step 3: add item to cart': p => p.url() === `http://localhost:3000/product/${productId}` })


    await page.locator('[data-testid="signin-nav-link"]').click();
    await page.waitForNavigation();

    await check(page, { 'Step 4: load signin page': p => p.url() === 'http://localhost:3000/signin' })
    await page.locator('//h2[text()="Sign In with OTP"]').waitFor({ state: 'visible', timeout: 10000 });

    const emailInput = page.locator('[data-testid="signin-email-input"]');
    await emailInput.focus();
    await emailInput.type('test@example.com');
    await sleep(0.10);

    const submitButton = page.locator('[data-testid="signin-email-submit-btn"]');
    await submitButton.focus();
    await submitButton.click();

    await page.locator('//h2[text()="Confirm OTP"]').waitFor({ state: 'visible', timeout: 10000 });
    await check(page.locator('h2'), {
      'Step 5: receive OTP email': async lo => (await lo.textContent()) == 'Confirm OTP',
    })

    await page.locator('[data-testid="confirm-otp-input-0"]').type('1');
    await page.locator('[data-testid="confirm-otp-input-1"]').type('2');
    await page.locator('[data-testid="confirm-otp-input-2"]').type('3');
    await page.locator('[data-testid="confirm-otp-input-3"]').type('4');
    await page.locator('[data-testid="confirm-otp-input-4"]').type('5');
    await page.locator('[data-testid="confirm-otp-input-5"]').type('6');
    await page.locator('[data-testid="confirm-otp-btn"]').click();

    await page.waitForNavigation();
    await check(page, { 'Step 6: successful signin': p => p.url() === 'http://localhost:3000/' })

    await page.locator('[data-testid="cart-header-nav"]').click();
    await page.waitForNavigation();
    await check(page, { 'Step 7: load cart page': p => p.url() === 'http://localhost:3000/cart' })

    await page.locator('[data-testid="checkout-btn"]').click();
    await page.waitForNavigation();
    await check(page, { 'Step 8: load checkout page': p => p.url().startsWith('http://localhost:3000/checkout') })

    await page.waitForSelector('iframe[title="Secure address input frame"]', { visible: true, timeout: 10000 });
    await page.waitForSelector('[data-testid="shipping-address-title"]', { visible: true, timeout: 10000 });
    await sleep(1);

    const addressIframeElement = await page.$('iframe[title="Secure address input frame"]');
    await addressIframeElement.scrollIntoViewIfNeeded();
    const addressIframeContent = await addressIframeElement.contentFrame();
    await addressIframeContent.waitForSelector('input[name="name"]', { visible: true, timeout: 5000 });
    await fillInput(addressIframeContent, 'input[name="name"]', 'John Doe');
    await fillInput(addressIframeContent, 'input[name="addressLine1"]', '123 Main St');
    await addressIframeContent.click('input[name="name"]');
    await fillInput(addressIframeContent, 'input[name="locality"]', 'NYC');
    await addressIframeContent.locator('select[name="administrativeArea"]').selectOption('NY');
    await fillInput(addressIframeContent, 'input[name="postalCode"]', '10001');
    await addressIframeContent.locator('select[name="phoneCountry"]').selectOption('US');
    await fillInput(addressIframeContent, 'input[name="phone"]', '(223) 456-7890');

    const paymentIframeElement = await page.$('iframe[title="Secure payment input frame"]');
    await paymentIframeElement.scrollIntoViewIfNeeded();
    const paymentIframeContent = await paymentIframeElement.contentFrame();
    await paymentIframeContent.waitForSelector('input[name="number"]', { state: 'visible', timeout: 5000 });
    await paymentIframeContent.click('input[name="number"]');
    await fillInput(paymentIframeContent, 'input[name="number"]', '4242 4242 4242 4242');
    await fillInput(paymentIframeContent, 'input[name="expiry"]', '12 / 34');
    await fillInput(paymentIframeContent, 'input[name="cvc"]', '123');

    const reviewBtn = await page.locator('[data-testid="checkout-submit-paymentintent-btn"]')
    await reviewBtn.focus();
    await reviewBtn.click();

    await page.waitForNavigation();
    await check(page.locator('h2'), {
      'Step 9: submit checkout form': async lo => (await lo.textContent()) === 'Confirm Your Order',
    })

    await page.locator('[data-testid="confirm-order-btn"]').click();

    await page.locator('//h2[text()="Order Confirmed!"]').waitFor({ state: 'visible', timeout: 10000 });
    await check(page.locator('h2'), {
      'Step 10: submit order confirmation form': async lo => (await lo.textContent()) === 'Order Confirmed!',
    })

    const orderIdElement = await page.locator('[data-testid="confirmation-order-id"]');
    const orderIdText = await orderIdElement.textContent();
    const orderId = orderIdText.split('Order ID: ')[1];

    await page.locator('[data-testid="view-orders-link"]').click();
    await page.waitForNavigation();

    await check(page.locator(`[data-testid="card-order-id-${orderId}"]`), {
      'Step 11: verify order ID displayed': async lo => (await lo.textContent()).includes(`Order ID: ${orderId}`),
    })

    await page.locator(`[data-testid="expand-order-card-${orderId}"]`).click();

    await check(page.locator('[data-testid="order-status-title"]'), {
      'Step 12: verify order status visible': async lo => (await lo.textContent()).trim() === 'Order Status',
    })

    await page.locator('[data-testid="logout-btn"]').click();
    await page.waitForNavigation();

    await page.locator('[data-testid="footer-contact-link"]').click();
    await page.waitForNavigation();

    await check(page.locator('h2'), {
      'Step 13: verify contact page': async lo => (await lo.textContent()) === 'Contact Us',
    })

    await page.locator('[data-testid="contact-form-name-input"]').type('John Doe');
    await page.locator('[data-testid="contact-form-email-input"]').type('spencer.sayhello@gmail.com');
    await page.locator('[data-testid="contact-form-message-input"]').type('Test message');

    await page.locator('[data-testid="contact-form-submit-btn"]').click();
    await page.waitForNavigation();

    await check(page.locator('h1'), {
      'Step 14: verify contact submission': async lo => {
        const text = await lo.textContent();
        console.log('Contact form text:', text)
        return text === 'Thank You!' || text === '\n      Are you a robot? \n    ';
      },
    })

  } catch (error) {
    console.error('Test case failure', error);
    await check(page.locator('h1'), { 'Test case failure': async lo => false });
  } finally {
    await page.close();
  }
}