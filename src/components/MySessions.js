import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SessionCard from './SessionCard';
import { useAuth } from './AuthProvider';

const MySessionsContainer = styled.div`
    display: grid;
    grid-template-rows: 100px repeat(3, 170px);
    grid-template-columns: repeat(3, 1fr);
    grid-column: span 4;
    grid-row: auto;
    padding: 25px;
    gap: 25px;
    overflow: scroll;
    height: 100vh;

    h1 {
        color: var(--white);
        grid-column: span 3;
        font-family: var(--Karla);
        align-self: center;
    }

    @media (max-width: 1450px) {
        grid-template-columns: repeat(2, 1fr);

        h1 {
            grid-column: span 2;
        }
    }

    @media (max-width: 1024px) {
        grid-column: span 5;
    }

    @media (max-width: 720px) {
        grid-template-columns: repeat(1, 1fr);
    }
`;

export default function MySessions() {
    const [sessions, setSessions] = useState([]);
    const auth = useAuth();

    useEffect(() => {
        async function getUsersSessions() {
            // Get the users own sessions
            let res = await fetch(
                `${process.env.REACT_APP_API_URL}/api/user/sessions`,
                {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const allSessions = await res.json();
            setSessions(allSessions);
        }

        getUsersSessions();
    }, []);
    return (
        <MySessionsContainer>
            <h1>{auth.user}'s Sessions</h1>
            {sessions.map((session) => {
                return (
                    <SessionCard
                        username={auth.user}
                        session={session}
                        key={session}
                    />
                );
            })}
        </MySessionsContainer>
    );
}
