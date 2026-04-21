import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setAuthLoading(false);
        }
    };

    const loginAsDevUser = async () => {
        await axiosInstance.post('/auth/dev-login/user');
        await fetchCurrentUser();
    };

    const loginAsDevAdmin = async () => {
        await axiosInstance.post('/auth/dev-login/admin');
        await fetchCurrentUser();
    };

    const loginAsDevTechnician = async () => {
        await axiosInstance.post('/auth/dev-login/technician');
        await fetchCurrentUser();
    };

    const loginWithGoogle = () => {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Logout request failed.', error);
        } finally {
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                authLoading,
                fetchCurrentUser,
                loginWithGoogle,
                loginAsDevUser,
                loginAsDevAdmin,
                loginAsDevTechnician,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}