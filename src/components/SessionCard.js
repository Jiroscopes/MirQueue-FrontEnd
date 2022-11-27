import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

const CardContainer = styled.div`
    background: var(--black);
    filter: drop-shadow(0px 5px 5px rgba(0, 0, 0, 0.2));
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-family: var(--Karla);
    height: 170px;

    @media (max-width: 720px) {
        grid-column: span 2;
    }
`;

const InfoContainer = styled.div`
    color: var(--white);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
`;

const OptionsContainer = styled.div`
    background: var(--darker-purple);
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CodeButton = styled.button`
    color: white;
    font-family: var(--Karla);
    background: transparent;
    padding: 6px 18px;
    border-radius: 6px;
    border: 1px solid var(--light-purple);
    cursor: pointer;
    transition: 0.3s all ease;

    &:hover {
        background: var(--light-purple);
    }
`;

export default function SessionCard({ session, username }) {
    // useEffect(() => {}, [session]);
    const history = useHistory();

    function joinSession() {
        history.push(`/session/${username}/${session}`);
    }
    return (
        <CardContainer>
            <InfoContainer>{session}</InfoContainer>
            <OptionsContainer>
                <CodeButton onClick={joinSession}>Join</CodeButton>
            </OptionsContainer>
        </CardContainer>
    );
}
