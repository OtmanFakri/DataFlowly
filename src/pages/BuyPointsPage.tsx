import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Sparkles, 
    Check, 
    CreditCard, 
    Shield, 
    Zap,
    MessageCircle,
    Database,
    Bot
} from 'lucide-react';
import { initializePaddle, createPaddleCheckout, getPriceIdFromPoints } from '../utils/paddle';
import { auth } from '../utils/config';
import AuthGuard from '../components/AuthGuard';
import type { Paddle } from '@paddle/paddle-js';

export const BuyPointsPage = () => {
    const navigate = useNavigate();
    const [pointsToBuy, setPointsToBuy] = useState(200);
    const [isLoading, setIsLoading] = useState(false);
    const [paddle, setPaddle] = useState<Paddle | null>(null);
    
    const price = ((pointsToBuy / 200) * 5).toFixed(2);

    useEffect(() => {
        // Initialize Paddle
        const initPaddle = async () => {
            try {
                const paddleInstance = await initializePaddle();
                if (paddleInstance) {
                    setPaddle(paddleInstance);
                }
            } catch (error) {
                console.error('Failed to initialize Paddle:', error);
            }
        };

        initPaddle();
    }, []);

    const handleBuyPoints = async (points?: number) => {
        // Check authentication first
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('Please sign in to purchase points.');
            navigate('/login');
            return;
        }

        if (!paddle) {
            alert('Payment system is still loading. Please try again.');
            return;
        }

        const pointsToPurchase = points || pointsToBuy;
        setIsLoading(true);
        
        try {
            // Get price ID based on points
            const priceId = getPriceIdFromPoints(pointsToPurchase);
            console.log('Purchasing points:', pointsToPurchase, 'Price ID:', priceId);
            
            // Create checkout configuration with success callback
            const checkoutData = await createPaddleCheckout(priceId, (data) => {
                console.log('Payment successful:', data);
                // The success page will handle the points update
                window.location.href = '/success?points=' + pointsToPurchase;
            });
            console.log('Opening Paddle checkout with:', checkoutData);
            
            // Open checkout
            await paddle.Checkout.open(checkoutData);
            
        } catch (error: any) {
            console.error('Payment error:', error);
            
            // Handle specific authentication errors
            if (error.message?.includes('authenticated')) {
                alert('Please sign in to make a payment. Redirecting to login...');
                navigate('/login');
            } else {
                alert('There was an error processing your payment. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const pointPackages = [
        {
            points: 200,
            price: 5.00,
            popular: false,
            bonus: null
        },
        {
            points: 500,
            price: 10.00,
            popular: true,
            bonus: '25% more points'
        },
        {
            points: 1000,
            price: 18.00,
            popular: false,
            bonus: '40% more points'
        }
    ];

    const features = [
        {
            icon: <Bot className="w-6 h-6" />,
            title: "AI Database Assistant",
            description: "Get intelligent suggestions for table structures and relationships"
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Schema Optimization",
            description: "AI-powered recommendations for better database performance"
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Natural Language Queries",
            description: "Ask questions about your database design in plain English"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Responses",
            description: "Get immediate AI assistance when you need it most"
        }
    ];

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Back</span>
                                </button>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Database className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    DataFlowly
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles size={16} />
                            <span>AI Points Purchase</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Buy AI Points
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Unlock the power of our AI assistant to help you design better databases. 
                            Each point gives you one AI query to enhance your database design.
                        </p>

                        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                            <MessageCircle size={16} />
                            <span>1 AI Point = 1 AI Assistant Query</span>
                        </div>
                    </div>

                    {/* Point Packages */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {pointPackages.map((pkg, index) => (
                            <div
                                key={index}
                                className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                                    pkg.popular 
                                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {pkg.points}
                                    </div>
                                    <div className="text-gray-600 mb-4">AI Points</div>
                                    
                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                        ${pkg.price.toFixed(2)}
                                    </div>
                                    
                                    {pkg.bonus && (
                                        <div className="text-green-600 text-sm font-medium mb-4">
                                            {pkg.bonus}
                                        </div>
                                    )}
                                    
                                    <button
                                        onClick={() => handleBuyPoints(pkg.points)}
                                        disabled={isLoading}
                                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                                            pkg.popular
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {isLoading ? 'Processing...' : 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Features Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            What You Get with AI Points
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="text-blue-600 mt-1">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security & Trust */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Secure & Trusted
                            </h3>
                            <p className="text-gray-600">
                                Your payment is processed securely by Paddle
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center justify-center space-x-3">
                                <Shield className="w-8 h-8 text-green-600" />
                                <span className="text-gray-700 font-medium">SSL Encrypted</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <CreditCard className="w-8 h-8 text-blue-600" />
                                <span className="text-gray-700 font-medium">Secure Payment</span>
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <Check className="w-8 h-8 text-green-600" />
                                <span className="text-gray-700 font-medium">Instant Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}; 