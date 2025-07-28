# Stripe Configuration Guide for ShopSphere

## Prerequisites
You need a Stripe account. Sign up at https://stripe.com if you don't have one.

## Setup Instructions

### 1. Get Your Stripe Keys
1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Navigate to **Developers** → **API keys**
3. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

### 2. Backend Configuration (payment-service)
Create or update `/payment-service/.env`:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 3. Frontend Configuration (client)
Update `/client/.env.local`:
```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
```

### 4. Test Cards
Use these test card numbers for development:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

Use any future expiry date, any 3-digit CVC, and any 5-digit ZIP code.

### 5. Webhook Configuration (Optional)
For local development with webhooks:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:5003/api/payments/webhook`
3. Copy the webhook signing secret and add it to payment-service `.env`

## Important Security Notes
- **NEVER** commit real API keys to version control
- **NEVER** use secret keys (`sk_`) on the frontend
- Always use environment variables for API keys
- Use test keys (`pk_test_`, `sk_test_`) for development
- Use live keys (`pk_live_`, `sk_live_`) only in production

## Troubleshooting

### "Invalid API Key provided"
- Ensure you're using the correct key type (publishable vs secret)
- Check that you've replaced the placeholder with your actual key
- Verify the key hasn't been revoked in your Stripe dashboard

### "No such payment_method"
- Ensure the payment method was created with the same Stripe account
- Check that you're using the correct test/live environment

### Payment methods not showing
- Verify the backend payment service is running
- Check that authentication is working correctly
- Ensure the consumer has saved payment methods