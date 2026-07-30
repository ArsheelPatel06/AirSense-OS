import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../platforms/auth/AuthContext';

interface ProtectedRouteProps {
    allowedPlatforms?: string[];
    children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedPlatforms, children }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedPlatforms && allowedPlatforms.length > 0) {
        const hasAccess = allowedPlatforms.some(platform => user.platforms.includes(platform));
        if (!hasAccess) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        You do not have permission to access this platform. Please contact your administrator.
                    </p>
                    <button
                        onClick={() => window.location.href = user.default_redirect}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
            );
        }
    }

    // If children are passed (wrapper mode), render them; otherwise use Outlet (layout route mode)
    return children ? <>{children}</> : <Outlet />;
};
