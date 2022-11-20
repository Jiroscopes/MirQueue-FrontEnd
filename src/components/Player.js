import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlay,
    faPause,
    faForwardStep,
    faBackwardStep,
} from '@fortawesome/free-solid-svg-icons';
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
    color: var(--white);
    position: absolute;
    z-index: 0;
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
        filter: drop-shadow(0px 0px 20px #000);
    }

    .trackName {
        margin-top: 20px;
        color: var(--white);
    }

    p {
        color: var(--light-purple);
        margin: 3px 0;
    }
`;

const ControlContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
`;

export default function Player({ ws, playback }) {
    const auth = useAuth();
    const params = useParams();
    const [playbackMeta, setPlaybackMeta] = useState({});
    const [playState, setPlayState] = useState(false); // true == is playing, false == pause
    const [active, setActive] = useState(false); // Is there an active device?
    // const [activeDevice, setActiveDevice] = useState({});

    useEffect(() => {
        if (Object.keys(playback).length === 0) return;
        if (playback.is_playing) {
            setActive(true);
            setPlayState(true);
            const { item } = playback;
            setPlaybackMeta({
                img: item.album.images[0].url,
                name: item.name,
                artist: item.artists[0].name,
            });
        } else {
            // There was a player at some point
            if (active) {
                setPlayState(false);
            } else {
                setPlayState(false);
                setActive(false);
            }
        }
        // for (const device of playback.devices) {
        //     if (device.is_active) {
        //         setActiveDevice(device);
        //         console.log(device);
        //         break;
        //     }
        // }
    }, [playback, active]);

    useEffect(() => {
        let interval;

        if (params.host === auth.user) {
            // Check host playback every 10s bc rate limit
            interval = setInterval(() => {
                ws.current.send(
                    JSON.stringify({
                        type: 'check_playback',
                        user: auth.user,
                        session: params,
                    })
                );
            }, 10000);
        }

        if (interval) return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function checkPlayback() {
        ws.current.send(
            JSON.stringify({
                type: 'check_playback',
                user: auth.user,
                session: params,
            })
        );
    }

    function togglePlayback() {
        if (!active) return;

        ws.current.send(
            JSON.stringify({
                type: 'toggle_playback',
                user: auth.user,
                session: params,
            })
        );

        setPlayState(!playState);
    }

    function nextTrack() {
        ws.current.send(
            JSON.stringify({
                type: 'next_track',
                user: auth.user,
                session: params,
            })
        );
        // checkPlayback();
    }

    function prevTrack() {
        ws.current.send(
            JSON.stringify({
                type: 'prev_track',
                user: auth.user,
                session: params,
            })
        );
        // checkPlayback();
    }

    return (
        <PlayerContainer>
            {active ? (
                <TrackContainer>
                    <img src={playbackMeta.img} alt="" />
                    <p className="trackName">{playbackMeta.name}</p>
                    <p>{playbackMeta.artist}</p>
                    {params.host === auth.user ? (
                        <ControlContainer>
                            <FontAwesomeIcon
                                icon={faBackwardStep}
                                className="playback-control-icons"
                                onClick={prevTrack}
                            />
                            {playState ? (
                                <FontAwesomeIcon
                                    icon={faPause}
                                    className="playback-control-icons"
                                    onClick={togglePlayback}
                                />
                            ) : (
                                <FontAwesomeIcon
                                    icon={faPlay}
                                    className="playback-control-icons"
                                    onClick={togglePlayback}
                                />
                            )}
                            <FontAwesomeIcon
                                icon={faForwardStep}
                                className="playback-control-icons"
                                onClick={nextTrack}
                            />
                        </ControlContainer>
                    ) : (
                        ''
                    )}
                </TrackContainer>
            ) : (
                'No active device. Make sure you have Spotify ready.'
            )}
        </PlayerContainer>
    );
}
