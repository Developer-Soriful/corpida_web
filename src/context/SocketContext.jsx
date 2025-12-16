import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set()); // Using Set for unique IDs

    const BACKEND_URL = 'http://localhost:5000'; // Fallback

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (token) {
            // Initialize Socket Connection
            const newSocket = io(BACKEND_URL, {
                auth: { token: token },
                // extraHeaders: { Authorization: `Bearer ${token}` } // Option if auth prop fails
            });

            setSocket(newSocket);

            // Connection Events
            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            // Global Events
            newSocket.on('user-online', ({ userId }) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(userId);
                    return newSet;
                });
            });

            newSocket.on('user-offline', ({ userId }) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
            });

            // Cleanup on unmount or token change
            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, []); // Dependency on token if needed, but usually mount is enough

    
    return (
        <SocketContext.Provider value={{ socket, onlineUsers: Array.from(onlineUsers) }}>
            {children}
        </SocketContext.Provider>
    );
};
