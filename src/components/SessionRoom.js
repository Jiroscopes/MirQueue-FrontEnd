import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SpotifySearch from './SpotifySearch';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';
// import GuestNamePrompt from './GuestNamePrompt';

const SessionContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    grid-column: 3 / 5;
    flex-direction: column;
    font-family: var(--Karla);

    @media (max-width: 768px) {
        grid-column: 2 / 5;
    }
`;

export default function SessionRoom() {
    let ws = useRef(null);
    let auth = useAuth();
    let params = useParams();
    // const [showGuestPrompt, setShowGuestPrompt] = useState(false);
    const [sessionHost, setSessionHost] = useState(null);
    const [queue, setQueue] = useState({});

    useEffect(() => {
        setSessionHost(params.host);

        if (!auth.user) {
            // setShowGuestPrompt(true);
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
    }, [auth.user]);

    // Websocket messages
    useEffect(() => {
        if (auth.user) {
            ws.current.onmessage = async (event) => {
                const msg = JSON.parse(event.data);
                console.log(msg);
                if (msg.status === 'success') {
                    // Added song to the queue
                    setQueue({ ...queue, [msg.track.id]: msg.track.name });
                }
            };
        }
    });

    return (
        <SessionContainer>
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
                    <SpotifySearch ws={ws} queue={queue} />
                </div>
            </div>
            {/* <Nav></Nav> */}
        </SessionContainer>
    );
}
