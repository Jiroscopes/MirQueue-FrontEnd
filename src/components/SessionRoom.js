import React, { useEffect, useRef, useState } from 'react';
import SpotifySearch from './SpotifySearch';
import { useAuth } from './AuthProvider';
import GuestNamePrompt from './GuestNamePrompt';
import { useParams } from 'react-router-dom';

export default function SessionRoom() {
    let ws = useRef(null);
    let auth = useAuth();
    let params = useParams();
    const [showGuestPrompt, setShowGuestPrompt] = useState(false);
    const [sessionHost, setSessionHost] = useState(null);

    useEffect(() => {
        setSessionHost(params.host);

        if (!auth.user) {
            setShowGuestPrompt(true);
            return;
        }
    }, [auth.user, sessionHost, params.host]);

    // Websocket connections
    useEffect(() => {
        if (auth.user) {
            ws.current = new WebSocket(`${process.env.REACT_APP_WS_URL}`);
            ws.current.onopen = () => {
                let socketMessage = {
                    type: 'joined_session',
                    user: auth.user,
                };
                ws.current.send(JSON.stringify(socketMessage));
                console.log('WS Connected');
            };
            ws.current.onclose = () => {
                console.log('WS Closed');
            };
            return () => {
                ws.current.close();
            };
        }
    });

    // Websocket messages
    useEffect(() => {
        if (auth.user) {
            ws.current.onmessage = (message) => {
                console.log(message);
            };
        }
    });

    return (
        <div className="session">
            {/* {showGuestPrompt ? (
                <GuestNamePrompt
                    setShowGuestPrompt={setShowGuestPrompt}
                    showGuestPrompt={showGuestPrompt}
                />
            ) : (
                ''
            )} */}
            <div className="search-bar">
                <div className="search-bar-input-container">
                    <SpotifySearch ws={ws} />
                </div>
            </div>
            {/* <Nav></Nav> */}
        </div>
    );
}
