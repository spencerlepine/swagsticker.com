# SwagSticker API

> _Last updated: March 2025_

### POST /api/v1/auth/logout

Logs out user, clears `swagAuthToken` cookie.

**Response**:

- **200**:

```json
{ message: string } - "Logged out successfully"
```

---

### POST /api/v1/auth/send-otp

Sends a one-time password (OTP) to the provided email. Sets `otpToken` cookie with JWT

**Request**:

```json
{ "email": "user@example.com" }
```

**Response**:

- **200**:

```json
{ "message": "OTP sent successfully" }
```

---

### GET /api/v1/auth/verify

Checks if user is authenticated using `swagAuthToken` cookie

**Response**:

- **200**:

```json
{ "isAuthenticated": true }
```

- **401**:

```json
{ "isAuthenticated": false, "error": "error message" }
```

---

### POST /api/v1/auth/verify-otp

Verifies OTP using `otpToken` cookie, sets `swagAuthToken` cookie on success

**Request**:

```json
{ "otp": "123456" }
```

**Response**:

- **200**:

```json
{ "message": "OTP verified" }
```

---

### GET /api/v1/checkout/config

Returns Stripe publishable key. Requires authentication

**Response**:

- **200**:

```json
{ "publishableKey": "pk_..." }
```

---

### POST /api/v1/checkout/create-payment-intent

Creates a Stripe payment intent for checkout. Requires authentication

**Request**:

```json
{ "cartItems": [{ "name": "string", "quantity": number, "price": number, "image": "string", "product_data": { "size": "string", "productId": "string" } }] }
```

**Response**:

- **200**:

```json
{ "clientSecret": "pi_..." }
```

---

### POST /api/v1/checkout/order-confirmation

Captures a Stripe payment intent and creates a Printify draft order. Requires authentication.

**Request**:

```json
{ "paymentIntentId": "pi_..." }
```

**Response**:

- **200**:

```json
{ "orderId": "printify_order_id" }
```

---

### GET /api/v1/orders/{orderId}

Retrieves a specific Printify order by ID. Requires authentication.

**Response**:

- **200**:

```json
{ "id": "string", "status": "string", "tracking": object|null, "address_to": object, "line_items": array, "total_price": number, "total_shipping": number, "metadata": object }
```

---

### GET /api/v1/status

Checks the operational status of Printify and Stripe services.

**Response**:

- **200**:

```json
{ "status": "operational" | "degraded" }
```

---
