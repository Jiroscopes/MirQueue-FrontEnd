import React, { createContext, useContext, useEffect, useState } from 'react';

// general setup
//https://reactrouter.com/web/example/auth-workflow

const authContext = createContext();

function useProvideAuth() {
    // Set state to current user if they exist
    let currentUser;
    let accessToken;
    try {
        currentUser = JSON.parse(localStorage.getItem('user'));
        accessToken = localStorage.getItem('access_token');
    } catch (error) {
        currentUser = null;
        accessToken = null;
    }
    const [authToken, setAccessToken] = useState(accessToken);
    const [user, setUser] = useState(currentUser);

    // Handle the messages
    useEffect(() => {
        // Server redirects to this same page in the Popup
        // pop sees the info and closes, passing the info back.
        const data = {
            payload: window.location.search,
            source: 'spotify-login',
        };

        if (window.opener) {
            // send them to the opening window
            window.opener.postMessage(data);
            // close the popup
            window.close();
        }
    });

    useEffect(() => {
        window.addEventListener('storage', () => {
            setAccessToken(localStorage.getItem('access_token') ?? null);
            try {
                setUser(JSON.parse(localStorage.getItem('user')) ?? null);
            } catch (error) {
                setUser(null);
            }
        });
    }, []);

    // Login
    const login = async (callback) => {
        if (user && authToken) {
            // Need to verify they not lyin
            const authUrl = `${process.env.REACT_APP_API_URL}/api/user`;
            let authPayload = { accessToken };
            // Load user info
            let response;
            try {
                response = await fetch(authUrl, {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(authPayload),
                });
            } catch (error) {
                setUser(null);
                accessToken = null;
                authPayload = null;
                localStorage.clear();
            }

            if (response.status !== 200) {
                setUser(null);
                accessToken = null;
                authPayload = null;
                localStorage.clear();
            }

            if (response.status === 200) {
                callback();
                return;
            }
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

    const refreshAuth = (newTokens) => {
        user.tokens = newTokens;
        console.log('Called refresh auth');
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const updateUser = (newUser) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    // Helper function for useAuth.login()
    const incomingMessage = async (event) => {
        let { payload } = event.data;

        // No payload, no auth
        if (payload === '') {
            return;
        }

        // Remove the '?'
        payload = payload.substring(1);

        const urlParams = new URLSearchParams(payload);
        const access_token = urlParams.get('access_token');
        const authPayload = { accessToken: access_token };

        const authUrl = `${process.env.REACT_APP_API_URL}/api/user`;

        // Load user info
        let response = await fetch(authUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authPayload),
        });

        if (response.status !== 200) {
            return;
        }

        response = await response.json();

        const { username, email } = response;

        // User is nothing..?
        if (!username || !email) {
            return;
        }

        // Add user info to localstorage
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('access_token', access_token);
        // localStorage.setItem('token_expires', new Date().toString());

        // Store JSON version
        setUser(response);
    };

    // Return the user object and functions to handle auth
    // These are available globally
    return {
        user,
        updateUser,
        refreshAuth,
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
