import React, { createContext, useContext, useEffect, useState } from 'react';

// general setup
//https://reactrouter.com/web/example/auth-workflow

const authContext = createContext();

function useProvideAuth() {
    // Set state to current user if they exist
    const currentUser = JSON.parse(localStorage.getItem('user')) || null;
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

    // Login
    const login = (callback) => {
        // Remove existing listener
        window.removeEventListener('message', incomingMessage);

        const windowFeatures = 'height=730, width=450, menubar=no,toolbar=no';
        const clientId = '4d1c7a6700194a6dab532396ed915339';
        const redirectUrl = `${process.env.REACT_APP_API_URL}/callback`;
        const scopes =
            'user-read-private user-read-email user-top-read user-modify-playback-state';

        const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
            scopes
        )}&redirect_uri=${encodeURIComponent(redirectUrl)}&show_dialog=true`;

        window.open(url, 'Spotify Login', windowFeatures);

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
        localStorage.setItem('token_expires', new Date().toString());

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
