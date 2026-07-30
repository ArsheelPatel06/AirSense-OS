import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../../services/apiClient';

interface User {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    platforms: string[];
    permissions: string[];
    tenant_id: string | null;
    default_redirect: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUser(response.data.data);
            } catch (error) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await apiClient.post('/auth/logout', { refresh_token: refreshToken });
            }
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
