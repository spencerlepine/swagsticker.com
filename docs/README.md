# SwagSticker Documentation

## System Diagram

![System Diagram](./swagsticker.com-system-diagram.png)

![Infra](./swagsticker-infra.png)

## Product Catalog

- **Edit product listings:** [`src/lib/products.ts`](https://github.com/spencerlepine/swagsticker.com/blob/dev/src/lib/products.ts)
- **Edit image assets:**

```sh
git clone https://github.com/spencerlepine/swagsticker.com.git
cd swagsticker.com
git checkout assets
# *make changes*
git push origin assets
```

## Checkout Flow

![Stripe Checkout Flow](./checkout-flow.png)

```mermaid
sequenceDiagram
    participant Client
    participant WebServer as Web Server
    participant StripeAPI as Stripe API
    participant PrintifyAPI as Printify API

    Client ->> WebServer: GET /api/config
    WebServer -->> Client: { publishableKey }

    Client ->> WebServer: POST /create-payment-intent { cartItems }
    WebServer ->> PrintifyAPI: POST /v1/shops/{shop_id}/orders/shipping.json
    PrintifyAPI -->> WebServer: { standard: <shippingCost> }
    WebServer ->> PrintifyAPI: POST /v1/shops/{shop_id}/orders.json
    PrintifyAPI -->> WebServer: { orderId }
    WebServer ->> StripeAPI: POST /v1/payment_intents { amount }
    StripeAPI -->> WebServer: { paymentIntentId, clientSecret }
    WebServer -->> Client: { paymentIntentId, clientSecret }

    Client ->> Client: redirect to /checkout page

    Client ->> StripeAPI: POST /v1/payment_intents/{paymentIntentId}/confirm { card details, address }
    StripeAPI -->> Client: { confirmation }

    Client ->> Client: /redirect to confirm-order page

    Client ->> WebServer: POST /order-confirmation { paymentIntentId }
    WebServer ->> PrintifyAPI: POST /v1/shops/{shop_id}/orders/{order_id}/send_to_production.json
    PrintifyAPI -->> WebServer: { status }
    WebServer ->> StripeAPI: POST /v1/payment_intents/{paymentIntentId}/capture
    StripeAPI -->> WebServer: { captureStatus }
    WebServer -->> Client: 200 OK
```

## Load Testing

Run local load tests using [k6](https://k6.io) (browser-based)

```sh
cp .env.development .env.test
NODE_ENV=test npm run dev
```

```sh
brew install k6@0.57.0
go install go.k6.io/xk6/cmd/xk6@latest
k6 build --with github.com/grafana/xk6-browser
k6 run tests/e2e-test.js
```
