import React, { useState } from 'react';
import styled from 'styled-components';
import '../css/style.css';
// import { useAuth } from './AuthProvider';
import GenerateCodeModal from './GenerateCodeModal';
import Nav from './Nav';

const DashboardHome = styled.div`
    width: 100%;
    height: 100vh;
    background: var(--dark-blue);
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .ButtonContainer {
        grid-row-start: 2;
        grid-column-start: 1;

        @media (min-width: 768px) {
            grid-row-start: 2;
            grid-column-start: 2;
        }
    }
`;

const CreateSessionButton = styled.button`
    font-family: var(--Karla);
    font-size: 1.1rem;
    color: var(--light-purple);
    background: transparent;
    border: 1px solid var(--light-purple);
    border-radius: 20px;
    width: 40%;
    height: 100%;
    max-height: 250px;
    margin: 0 5%;
    transition: 0.5s all ease;
    cursor: pointer;
    float: left;
    :hover {
        color: var(--white-purple);
        background: var(--light-purple);
    }
`;

export default function Dashboard() {
    const [showCodeModal, setShowCodeModal] = useState(false);

    function toggleModal() {
        setShowCodeModal(!showCodeModal);
    }

    return (
        <DashboardHome>
            {showCodeModal ? (
                <GenerateCodeModal
                    showCodeModal={showCodeModal}
                    setShowCodeModal={setShowCodeModal}
                />
            ) : (
                ''
            )}
            <Nav></Nav>
            <div className="ButtonContainer">
                <CreateSessionButton onClick={toggleModal}>
                    Create Session
                </CreateSessionButton>
                <CreateSessionButton>Join Session</CreateSessionButton>
            </div>
        </DashboardHome>
    );
}