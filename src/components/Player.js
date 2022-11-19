import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import SpotifySearch from './SpotifySearch';
import { useAuth } from './AuthProvider';
import { useParams } from 'react-router-dom';

const PlayerContainer = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    grid-column: 3 / 5;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    font-family: var(--Karla);
`;

const TrackContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    max-width: 500px;

    img {
        max-width: 100%;
        marign-bottom: 3px;
    }

    p {
        margin: 3px 0;
    }
`;

export default function Player({ ws, playback }) {
    const auth = useAuth();
    const params = useParams();
    const [playbackMeta, setPlaybackMeta] = useState({});
    // const [activeDevice, setActiveDevice] = useState({});
    const checkHostMsg = {
        type: 'check_playback',
        user: auth.user,
        session: params,
    };

    useEffect(() => {
        if (Object.keys(playback).length === 0) return;
        if (playback.is_playing) {
            const { item } = playback;
            setPlaybackMeta({
                img: item.album.images[0].url,
                name: item.name,
                artist: item.artists[0].name,
            });
        } else {
            console.log('no active player');
        }
        // for (const device of playback.devices) {
        //     if (device.is_active) {
        //         setActiveDevice(device);
        //         console.log(device);
        //         break;
        //     }
        // }
    }, [playback]);

    useEffect(() => {
        let interval;

        if (params.host === auth.user) {
            // Check host playback every 10s
            interval = setInterval(() => {
                ws.current.send(JSON.stringify(checkHostMsg));
            }, 10000);
        }

        if (interval) return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <PlayerContainer>
            <TrackContainer>
                <img src={playbackMeta.img} alt="" />
                <p>{playbackMeta.name}</p>
                <p>{playbackMeta.artist}</p>
            </TrackContainer>
        </PlayerContainer>
    );
}
