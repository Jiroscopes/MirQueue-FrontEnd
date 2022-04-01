import React, { useEffect, useRef, useState } from 'react';
import SpotifySearch from './SpotifySearch';
// import Nav from './Nav';
import { useAuth } from './AuthProvider';
import GuestNamePrompt from './GuestNamePrompt';

export default function SessionRoom() {
    let ws = useRef(null);
    let auth = useAuth();
    const [showGuestPrompt, setShowGuestPrompt] = useState(false);

    // Add session code or route away
    useEffect(() => {
        if (!auth.user) {
            setShowGuestPrompt(true);
            return;
        }
    }, [auth.user]);

    // Websocket connections
    useEffect(() => {
        // if (auth.user) {
        //   ws.current = new WebSocket(`${process.env.REACT_APP_WS_URL}`);
        //   ws.current.onopen = () => {
        //     let socketMessage = {
        //       type: 'joined_session',
        //       user: auth.user,
        //     };
        //     ws.current.send(JSON.stringify(socketMessage));
        //     console.log('WS Connected');
        //   };
        //   ws.current.onclose = () => {
        //     console.log('WS Closed');
        //   };
        //   return () => {
        //     ws.current.close();
        //   };
        // }
    });

    // Websocket messages
    // useEffect(() => {
    // if (auth.user) {
    //     ws.current.onmessage = (message) => {
    //         // console.log(message);
    //     };
    // }
    // });

    return (
        <div className="session">
            {showGuestPrompt ? (
                <GuestNamePrompt
                    setShowGuestPrompt={setShowGuestPrompt}
                    showGuestPrompt={showGuestPrompt}
                />
            ) : (
                ''
            )}
            <div className="search-bar">
                <div className="search-bar-input-container">
                    <SpotifySearch ws={ws} />
                </div>
            </div>
            {/* <Nav></Nav> */}
        </div>
    );
}
