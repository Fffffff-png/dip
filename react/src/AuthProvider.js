import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (authToken) {
            const decodedToken = jwtDecode(authToken);
            setUser(decodedToken.sub.username);
            setUserId(decodedToken.sub.user_id);
        }
    }, [authToken]);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ authToken, user, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};