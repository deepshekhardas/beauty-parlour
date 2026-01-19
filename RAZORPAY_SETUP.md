# 💳 Razorpay Payment Integration Guide

## Quick Setup (5 minutes)

### Step 1: Create Razorpay Account
1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Sign up with your email
3. Complete basic verification (PAN not required for test mode)

### Step 2: Get Test API Keys
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy both:
   - **Key ID**: `rzp_test_xxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxx`

### Step 3: Update Environment Files

**Backend** (`backend/.env`):
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Frontend** (`frontend/.env`):
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

### Step 4: Restart Servers
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## Testing Payments

### Test Card Details (Razorpay Test Mode)
| Field | Value |
|-------|-------|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date (e.g., `12/25`) |
| CVV | Any 3 digits (e.g., `123`) |
| Name | Any name |
| OTP | `1234` (for test mode) |

### Test UPI
- Use any UPI ID like `success@razorpay` to simulate successful payment

### Test Netbanking
- Select any bank, use OTP `1234`

---

## Payment Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User Books    │────▶│  Create Order   │────▶│  Razorpay       │
│   Appointment   │     │  (Backend API)  │     │  Checkout       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Save Booking   │◀────│ Verify Payment  │◀────│  User Pays      │
│  with Payment   │     │  (Backend API)  │     │  (Card/UPI)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## API Endpoints

### Create Order
```bash
POST /api/payments/create-order
Content-Type: application/json

{
  "amount": 500,
  "currency": "INR"
}
```

### Verify Payment
```bash
POST /api/payments/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

---

## Going Live (Production)

1. Complete KYC on Razorpay Dashboard
2. Get **Live API Keys** from Settings
3. Replace test keys with live keys
4. Update frontend to use live key

⚠️ **Never commit API keys to Git!** Use environment variables.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Razorpay SDK failed to load" | Check internet connection, script in index.html |
| "Payment gateway error" | Verify RAZORPAY_KEY_SECRET in backend |
| "Invalid signature" | Keys mismatch between frontend/backend |
| "Amount is required" | Check request body format |

---

## Support
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Test Mode Guide](https://razorpay.com/docs/payments/payments/test-mode/)
