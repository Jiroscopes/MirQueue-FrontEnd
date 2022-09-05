import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import '../css/style.css';
import { useAuth } from './AuthProvider';

const JoinModal = styled.div`
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CodeModal = styled.div`
    background: var(--black);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    text-align: center;
    padding: 20px;

    @media (min-width: 768px) {
        padding: 15px;
        width: 500px;
    }

    p {
        color: var(--light-purple);
        margin: 0;
        font-size: 1.1rem;
        font-family: var(--Karla);
    }

    .session-code-heading {
        font-size: 1.5rem;
    }

    .small-text {
        font-size: 1rem;
    }
`;

const ModalContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 10px;
    padding: 20px;
`;

const CodeButton = styled.button`
    background: ${(props) =>
        props.inverted ? 'var(--light-purple)' : 'transparent'};
    border: 1px solid var(--light-purple);
    padding: 10px;
    border-radius: 5px;
    color: ${(props) =>
        props.inverted ? 'var(--white)' : 'var(--light-purple)'};
    cursor: pointer;
    transition: 0.3s all ease;
    margin: 10px 5px;
`;

const CloseButton = styled.p`
    align-self: flex-end;
    cursor: pointer;
`;

const CodeInput = styled.input`
    padding: 10px;
    margin: 20px 0 20px 0;
    width: 350px;
    background: var(--black);
    border: 2px solid var(--light-purple);
    border-radius: 5px;
    color: var(--light-purple);
`;

export default function JoinSessionModal({
    showJoinSessionModal,
    setShowJoinSessionModal,
}) {
    const [clipboardCopied, setClipboardCopied] = useState(false);
    const [sessionCode, setSessionCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const auth = useAuth();
    const history = useHistory();

    function closeModal() {
        setShowJoinSessionModal(!showJoinSessionModal);
    }

    // Stop 'close' click event from going to parent
    function stopPropagation(e) {
        e.stopPropagation();
    }

    function handleInput(e) {
        let { value } = e.target;

        // Reset error message
        setErrorMessage(null);

        if (value === '') {
            setSessionCode(null);
        }

        setSessionCode(value);
    }

    async function sendCode() {
        let accessToken = localStorage.getItem('access_token');

        if (!sessionCode) {
            return;
        }

        if (sessionCode.length < 4) {
            setErrorMessage('Session name must be 4 or more characters.');
            return;
        }

        let res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/session/valid/`,
            {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: sessionCode, // will contain host
                }),
            }
        );

        // Session code does not exist
        if (res.status === 400) {
            setErrorMessage('Not valid.');
            return;
        }

        if (res.status !== 200) {
            setErrorMessage('Something went wrong!');
            return;
        }

        history.push(`/session/${sessionCode}`);
    }

    return (
        <JoinModal onClick={closeModal}>
            <CodeModal onClick={stopPropagation}>
                <CloseButton onClick={closeModal}>
                    Close <span>X</span>
                </CloseButton>
                <ModalContent>
                    <p className="session-code-heading">Session Code:</p>
                    <CodeInput type="text" onChange={handleInput} />
                    <div>
                        <CodeButton
                            inverted={true}
                            onClick={() => {
                                sendCode();
                            }}
                        >
                            Join Session
                        </CodeButton>
                    </div>
                </ModalContent>
            </CodeModal>
        </JoinModal>
    );
}
