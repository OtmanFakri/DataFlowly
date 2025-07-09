# Paddle Payment Integration Setup

This guide will help you set up Paddle payment processing for the AI points purchase functionality using the modern client-side approach.

## Prerequisites

1. A Paddle account (sign up at [paddle.com](https://paddle.com))
2. Your Paddle Client Token (found in your Paddle dashboard)
3. Product and Price IDs for different point packages
4. The `@paddle/paddle-js` package installed

## Setup Steps

### 1. Install Paddle Package

First, install the modern Paddle client package:

```bash
npm install @paddle/paddle-js
```

### 2. Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Paddle Configuration
VITE_PADDLE_ENVIRONMENT=sandbox
VITE_PADDLE_TOKEN_CLIENT=your-client-token-here
```

**Note**: Client Token is used for modern client-side Paddle integration. Get this from your Paddle dashboard under Developer Tools > Authentication.

The Paddle configuration in `src/utils/paddle.ts` is already set up to use these environment variables:

```typescript
export const PADDLE_CONFIG = {
    // Environment: 'sandbox' for testing, 'production' for live
    ENVIRONMENT: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
    
    // Your Paddle Client Token (for client-side integration)
    CLIENT_TOKEN: import.meta.env.VITE_PADDLE_TOKEN_CLIENT || '',
    
    // Your Paddle Product IDs (create these in your Paddle dashboard)
    PRODUCTS: {
        AI_POINTS_200: 'pro_01jzp6nmmg1q4vc8mvrge8sb8y',  // 200 points product
        AI_POINTS_500: 'pro_01jzp6kgvtm5rfbva8am3b9qkn',  // 500 points product
        AI_POINTS_1000: 'pro_01jzp6eb4hhf4vzvr81thy2jmn'  // 1000 points product
    },
    
    // Price IDs for the products
    PRICES: {
        AI_POINTS_200: 'pri_01jzp6p3xmx801b4y57ej9vsrx',  // 200 points price
        AI_POINTS_500: 'pri_01jzp6m6aswcqztqcxt25bwcnq',  // 500 points price
        AI_POINTS_1000: 'pri_01jzp6fa85a1h5552xypy9q9de'  // 1000 points price
    }
};
```

### 3. Get Your Client Token

To get your Paddle Client Token:

1. Log into your Paddle dashboard
2. Go to "Developer Tools" → "Authentication"
3. Copy your **Client Token** (not the API key)
4. Add it to your `.env` file as `VITE_PADDLE_TOKEN_CLIENT`

**Important**: Use the Client Token, not the API Key, for client-side integration.

### 4. Verify Your Products

Your Paddle products are already created with the following IDs:

- **200 AI Points**: `pro_01jzp6nmmg1q4vc8mvrge8sb8y`
- **500 AI Points**: `pro_01jzp6kgvtm5rfbva8am3b9qkn`
- **1000 AI Points**: `pro_01jzp6eb4hhf4vzvr81thy2jmn`

These product IDs are already configured in the code. If you need to create additional products or modify existing ones:

1. Log into your Paddle dashboard
2. Go to "Catalog" → "Products"
3. Create or modify products as needed
4. Update the `PRODUCTS` object in `src/utils/paddle.ts` with new IDs

### 5. Test the Integration

1. Create your `.env` file with the environment variables above
2. Start your development server
3. Navigate to `/buy-points`
4. Try purchasing points using test cards

### 6. Configure Webhooks (Optional but Recommended)

Set up webhooks in your Paddle dashboard to handle payment events:

1. Go to "Developer Tools" → "Webhooks"
2. Add webhook endpoint: `https://your-domain.com/api/paddle-webhook`
3. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `transaction.completed`
   - `transaction.refunded`

### 7. Backend Integration

You'll need to create backend endpoints to handle:

1. **Webhook processing**: Verify and process Paddle webhooks
2. **User points management**: Update user's AI points balance after successful payment
3. **Transaction logging**: Store payment transaction details

Example webhook handler structure:

```typescript
// Backend webhook handler
app.post('/api/paddle-webhook', async (req, res) => {
    const { event_type, data } = req.body;
    
    if (event_type === 'transaction.completed') {
        const { customer_id, product_id, custom_data } = data;
        const pointsPurchased = custom_data.points_purchased;
        
        // Update user's AI points balance
        await updateUserPoints(customer_id, pointsPurchased);
        
        // Log transaction
        await logTransaction(data);
    }
    
    res.status(200).send('OK');
});
```

### 8. Testing

1. **Sandbox Testing**: Use Paddle's sandbox environment for testing
   - Test cards: 4000 0000 0000 0002 (Visa)
   - Test email: test@example.com

2. **Production**: Switch `ENVIRONMENT` to 'production' when ready

### 9. Security Considerations

1. **Webhook Verification**: Always verify webhook signatures
2. **HTTPS**: Ensure your site uses HTTPS in production
3. **Input Validation**: Validate all user inputs
4. **Error Handling**: Implement proper error handling for failed payments

### 10. Customization

You can customize the pricing and point packages by:

1. Updating the `pointPackages` array in `BuyPointsPage.tsx`
2. Creating corresponding products in Paddle dashboard
3. Updating the `PADDLE_CONFIG.PRODUCTS` mapping

### 11. Environment Variables (Recommended)

For better security, move sensitive configuration to environment variables:

```typescript
// .env file
VITE_PADDLE_VENDOR_ID=your-vendor-id
VITE_PADDLE_ENVIRONMENT=sandbox

// In paddle.ts
export const PADDLE_CONFIG = {
    ENVIRONMENT: import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox',
    VENDOR_ID: import.meta.env.VITE_PADDLE_VENDOR_ID || 'your-vendor-id',
    // ... rest of config
};
```

## Troubleshooting

### Common Issues

1. **Paddle not loading**: Check browser console for script loading errors
2. **Payment fails**: Verify product IDs and vendor ID are correct
3. **Webhook not received**: Check webhook URL and server logs
4. **Points not credited**: Verify webhook processing and database updates

### Support

- Paddle Documentation: [docs.paddle.com](https://docs.paddle.com)
- Paddle Support: Available in your Paddle dashboard
- React Router: [reactrouter.com](https://reactrouter.com)

## Next Steps

1. Set up your Paddle account and get your Vendor ID
2. Create the required products in Paddle dashboard
3. Update the configuration with your actual IDs
4. Test the payment flow in sandbox mode
5. Set up webhook handling on your backend
6. Deploy and test in production 