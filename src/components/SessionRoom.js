import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import SpotifySearch from './SpotifySearch';
import Player from './Player';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';
// import GuestNamePrompt from './GuestNamePrompt';

const SessionContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    grid-column: 3 / 5;
    grid-row: 1 / 4;
    flex-direction: column;
    font-family: var(--Karla);
    align-items: center;

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
    const [playback, setPlayback] = useState({});
    const [showTracks, setShowTracks] = useState(false);

    const checkHostMsg = {
        type: 'check_playback',
        user: auth.user,
        session: params,
    };

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
                    session: params.sessionCode,
                };
                ws.current.send(JSON.stringify(socketMessage));
                ws.current.send(JSON.stringify(checkHostMsg));
                console.log('WS Connected');
            };
            ws.current.onclose = () => {
                console.log('WS Closed');
            };
            return () => {
                ws.current.close();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.user]);

    // Websocket messages
    useEffect(() => {
        if (auth.user) {
            ws.current.onmessage = async (event) => {
                const msg = JSON.parse(event.data);
                // Handle responses from WS
                if (msg.status === 'success') {
                    if (msg.type === 'add_song') {
                        // Added song to the queue
                        setQueue({
                            ...queue,
                            [msg.payload.id]: msg.payload.name,
                        });
                    }

                    if (msg.type === 'check_playback') {
                        setPlayback(msg.payload);
                    }
                }
            };
        }
    });

    return (
        <SessionContainer onClick={() => setShowTracks(false)}>
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
                    <SpotifySearch
                        ws={ws}
                        queue={queue}
                        showTracks={showTracks}
                        setShowTracks={setShowTracks}
                    />
                </div>
            </div>
            <Player ws={ws} playback={playback} />
            {/* <Nav></Nav> */}
        </SessionContainer>
    );
}
