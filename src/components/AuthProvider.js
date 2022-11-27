import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// general setup
//https://reactrouter.com/web/example/auth-workflow

const authContext = createContext();

function useProvideAuth() {
    // Set state to current user if they exist
    let currentUser = Cookies.get('mirqueue_user') ?? null;
    const [user, setUser] = useState(currentUser);

    // Handle the messages
    useEffect(() => {
        // Server redirects to this same page in the Popup
        // pop sees the info and closes, passing the info back.
        const data = {
            source: 'spotify-login',
        };

        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage(data);
            // close the popup
            window.close();
        }
    });

    // Login
    const login = async (callback) => {
        if (isAuthenticated()) {
            callback();
            return;
        }

        // Remove existing listener
        window.removeEventListener('message', incomingMessage);

        const windowFeatures = 'height=730, width=450, menubar=no,toolbar=no';
        window.open(
            `${process.env.REACT_APP_API_URL}/login`,
            'Spotify Login',
            windowFeatures
        );

        // Listen for message from Popup
        window.addEventListener(
            'message',
            async (event) => {
                if (event.data.source === 'spotify-login') {
                    await incomingMessage(event);
                    callback();
                }
            },
            false
        );
    };

    // Logout
    const logout = () => {
        console.log('logout');
    };

    const isAuthenticated = () => {
        return Cookies.get('mirqueue_user') ?? null;
    };

    const refreshAuth = (newUser) => {
        setUser(newUser);
    };

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    // Helper function for useAuth.login()
    const incomingMessage = async (event) => {
        let currentUser = Cookies.get('mirqueue_user') ?? null;

        // Store username
        setUser(currentUser);
    };

    // Return the user object and functions to handle auth
    // These are available globally
    return {
        user,
        updateUser,
        refreshAuth,
        isAuthenticated,
        login,
        logout,
    };
}

export function useAuth() {
    return useContext(authContext);
}

export default function AuthProvider({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
