// Paddle Configuration
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

// Modern Paddle checkout configuration
export const createPaddleCheckout = async (priceId: string, successCallback?: (data: any) => void) => {
    // Get current user ID if available
    const { auth } = await import('./config');
    const userId = auth.currentUser?.uid;
    
    if (!userId) {
        throw new Error('User must be authenticated to make a payment');
    }
    
    return {
        items: [{ priceId: priceId, quantity: 1 }],
        settings: {
            displayMode: "overlay" as const,
            theme: "light" as const,
            successUrl: window.location.origin + "/success",
            // Remove closeOnSuccess or set it to false if you want to handle success manually
            // closeOnSuccess: true // This was causing the validation error
        },
        customData: {
            points_purchased: getPointsFromPriceId(priceId),
            user_id: userId
        },
        // Add success callback if provided
        ...(successCallback && {
            eventCallback: (data: any) => {
                if (data.name === 'checkout.completed') {
                    successCallback(data);
                }
            }
        })
    };
};

// Helper function to get points from price ID
export const getPointsFromPriceId = (priceId: string): number => {
    switch (priceId) {
        case PADDLE_CONFIG.PRICES.AI_POINTS_200:
            return 200;
        case PADDLE_CONFIG.PRICES.AI_POINTS_500:
            return 500;
        case PADDLE_CONFIG.PRICES.AI_POINTS_1000:
            return 1000;
        default:
            return 0;
    }
};

// Helper function to get price ID from points
export const getPriceIdFromPoints = (points: number): string => {
    switch (points) {
        case 200:
            return PADDLE_CONFIG.PRICES.AI_POINTS_200;
        case 500:
            return PADDLE_CONFIG.PRICES.AI_POINTS_500;
        case 1000:
            return PADDLE_CONFIG.PRICES.AI_POINTS_1000;
        default:
            return PADDLE_CONFIG.PRICES.AI_POINTS_200; // Default to 200 points
    }
};

// Initialize Paddle with modern client-side approach
export const initializePaddle = async () => {
    try {
        const { initializePaddle } = await import('@paddle/paddle-js');
        
        const paddle = await initializePaddle({
            environment: PADDLE_CONFIG.ENVIRONMENT as 'sandbox' | 'production',
            token: PADDLE_CONFIG.CLIENT_TOKEN,
        });
        
        return paddle;
    } catch (error) {
        console.error('Failed to initialize Paddle:', error);
        throw error;
    }
};

// Usage example function
export const openCheckout = async (points: number) => {
    try {
        const paddle = await initializePaddle();
        if (!paddle) {
            throw new Error('Failed to initialize Paddle');
        }
        
        const priceId = getPriceIdFromPoints(points);
        
        const checkoutConfig = await createPaddleCheckout(priceId, (data) => {
            console.log('Payment successful:', data);
            // Handle successful payment here
            window.location.href = '/success';
        });
        
        paddle.Checkout.open(checkoutConfig);
    } catch (error) {
        console.error('Failed to open checkout:', error);
        throw error;
    }
};

// Alternative configuration that might work with closeOnSuccess
export const createPaddleCheckoutWithClose = (priceId: string) => {
    return {
        items: [{ priceId: priceId, quantity: 1 }],
        settings: {
            displayMode: "overlay" as const,
            theme: "light" as const,
            // Don't set successUrl when using closeOnSuccess
            // successUrl: window.location.origin + "/success",
        },
        customData: {
            points_purchased: getPointsFromPriceId(priceId)
        }
    };
};

// Webhook verification and point update utilities
export const verifyPaddleWebhook = async (webhookData: any, signature: string) => {
    // This would typically be done server-side
    // For now, we'll return true - in production, you should verify the signature
    return true;
};

export const updateUserPointsFromWebhook = async (webhookData: any) => {
    try {
        const { db } = await import('./config');
        const { doc, updateDoc, getDoc } = await import('firebase/firestore');
        
        // Extract user ID and points from webhook data
        const userId = webhookData.data?.custom_data?.user_id;
        const priceId = webhookData.data?.items?.[0]?.price_id;
        
        if (!userId || !priceId) {
            throw new Error('Missing user ID or price ID in webhook data');
        }
        
        const pointsToAdd = getPointsFromPriceId(priceId);
        
        // Get current user document
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const currentPoints = userDoc.data().point || 0;
            const newPoints = currentPoints + pointsToAdd;
            
            // Update user points
            await updateDoc(userDocRef, {
                point: newPoints
            });
            
            console.log(`Updated user ${userId} points: ${currentPoints} + ${pointsToAdd} = ${newPoints}`);
            return { success: true, pointsAdded: pointsToAdd, newTotal: newPoints };
        } else {
            // Create new user document if it doesn't exist
            await updateDoc(userDocRef, {
                point: pointsToAdd
            });
            
            console.log(`Created new user ${userId} with ${pointsToAdd} points`);
            return { success: true, pointsAdded: pointsToAdd, newTotal: pointsToAdd };
        }
    } catch (error) {
        console.error('Error updating user points from webhook:', error);
        throw error;
    }
};