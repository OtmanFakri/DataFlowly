import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/config';

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
    showLoading?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
    children, 
    redirectTo = '/login',
    showLoading = true 
}) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
            
            if (!user) {
                navigate(redirectTo);
            }
        });

        return () => unsubscribe();
    }, [navigate, redirectTo]);

    if (isLoading && showLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Authentication</h2>
                    <p className="text-gray-600">Please wait...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate(redirectTo);
    }

    return <>{children}</>;
};

export default AuthGuard; 