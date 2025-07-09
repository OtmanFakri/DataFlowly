import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, Database, AlertCircle } from 'lucide-react';
import { auth, db } from '../utils/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getPointsFromPriceId } from '../utils/paddle';

export const PaymentSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isUpdating, setIsUpdating] = useState(true);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pointsAdded, setPointsAdded] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Check authentication status first
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setAuthChecked(true);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!authChecked) return; // Wait for auth check to complete

        const updateUserPoints = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError('User not authenticated. Please sign in to receive your points.');
                    setIsUpdating(false);
                    return;
                }

                // Get points from URL parameters or Paddle data
                const pointsParam = searchParams.get('points');
                const priceId = searchParams.get('price_id');
                
                let pointsToAdd = 0;
                
                if (pointsParam) {
                    pointsToAdd = parseInt(pointsParam);
                } else if (priceId) {
                    pointsToAdd = getPointsFromPriceId(priceId);
                } else {
                    // Default fallback
                    pointsToAdd = 200;
                }

                setPointsAdded(pointsToAdd);

                // Get current user document
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const currentPoints = userDoc.data().point || 0;
                    const newPoints = currentPoints + pointsToAdd;
                    
                    // Update user points
                    await updateDoc(userDocRef, {
                        point: newPoints
                    });
                    
                    setUpdateSuccess(true);
                } else {
                    // Create new user document if it doesn't exist
                    await updateDoc(userDocRef, {
                        point: pointsToAdd
                    });
                    setUpdateSuccess(true);
                }
            } catch (err) {
                console.error('Error updating user points:', err);
                setError('Failed to update points. Please contact support with your payment confirmation.');
            } finally {
                setIsUpdating(false);
            }
        };

        updateUserPoints();
    }, [searchParams, authChecked]);

    const handleContinueToDashboard = () => {
        navigate('/dashboard');
    };

    const handleCreateNewDiagram = () => {
        navigate('/app/new');
    };

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleContactSupport = () => {
        // You can replace this with your actual support contact
        window.open('mailto:support@dataflowly.com?subject=Payment%20Success%20Points%20Issue', '_blank');
    };

    // Show loading while checking authentication
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h2>
                    <p className="text-gray-600">Verifying your account...</p>
                </div>
            </div>
        );
    }

    if (isUpdating) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h2>
                    <p className="text-gray-600">Adding points to your account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    
                    <div className="space-y-3">
                        {!isAuthenticated && (
                            <button
                                onClick={handleSignIn}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Sign In to Receive Points
                            </button>
                        )}
                        
                        <button
                            onClick={handleContactSupport}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Contact Support
                        </button>
                        
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Thank you for your purchase! Your AI points have been added to your account.
                    </p>

                    {/* Points Added */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-md mx-auto">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <Sparkles className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">
                                +{pointsAdded} AI Points
                            </span>
                        </div>
                        <p className="text-gray-600">
                            Your points are now available for AI assistant queries
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleContinueToDashboard}
                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        
                        <button
                            onClick={handleCreateNewDiagram}
                            className="flex items-center justify-center space-x-2 bg-white text-gray-700 py-4 px-8 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 transition-all duration-200"
                        >
                            <Database className="w-5 h-5" />
                            <span>Create New Diagram</span>
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 bg-blue-50 rounded-2xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            What's Next?
                        </h3>
                        <ul className="text-left text-gray-600 space-y-2">
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Use your AI points to get intelligent database design suggestions</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Ask the AI assistant questions about your database structure</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Get optimization recommendations for better performance</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage; 