import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import '../css/style.css';
import { useAuth } from './AuthProvider';

const CodeModalContainer = styled.div`
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
    margin: 0 5px;

    :hover {
        background: ${(props) =>
            props.inverted ? 'var(--black)' : 'var(--light-purple)'};
        color: ${(props) =>
            props.inverted ? 'var(--light-purple)' : 'var(--white)'};
    }
`;

const CodeDiv = styled.div`
    color: var(--white);
    font-family: var(--Karla);
    font-size: 1.1rem;
    margin: 0 0 20px 0;
    background: ${(props) => (props.error ? 'red' : 'var(--light-purple)')};
    padding: 10px 5px;
    word-break: break-all;
    border-radius: 5px;
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

export default function GenerateCodeModal({ showCodeModal, toggleCodeModal }) {
    // State
    // const [generatedCode, setGeneratedCode] = useState('Loading...');
    const [clipboardCopied, setClipboardCopied] = useState(false);
    const [sessionCode, setSessionCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const auth = useAuth();
    const history = useHistory();

    function closeModal() {
        toggleCodeModal(!showCodeModal);
    }

    // Stop 'close' click event from going to parent
    function stopPropagation(e) {
        e.stopPropagation();
    }

    async function updateClipboard() {
        if (sessionCode) {
            try {
                await navigator.clipboard.writeText(
                    `/session/${auth.user}/${sessionCode}`
                );
                setClipboardCopied(true);
            } catch (err) {
                setClipboardCopied(false);
            }
        }
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
        if (!sessionCode) {
            return;
        }

        if (sessionCode.length < 4) {
            setErrorMessage('Session name must be 4 or more characters.');
            return;
        }

        let res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/session/code`,
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: sessionCode,
                }),
            }
        );

        // Conflicting session codes
        if (res.status === 409) {
            setErrorMessage('Session already exists.');
            return;
        }

        if (res.status !== 200) {
            setErrorMessage('Something went wrong!');
            return;
        }

        history.push(`/session/${auth.user}/${sessionCode}`);
    }

    return (
        <CodeModalContainer onClick={closeModal}>
            <CodeModal onClick={stopPropagation}>
                <CloseButton onClick={closeModal}>
                    Close <span>X</span>
                </CloseButton>
                <ModalContent>
                    <p className="session-code-heading">Session Code:</p>
                    <CodeInput type="text" onChange={handleInput} />
                    <CodeDiv error={errorMessage ? true : undefined}>
                        {errorMessage || `${auth.user}/${sessionCode ?? ''}`}
                    </CodeDiv>
                    <div>
                        <CodeButton onClick={updateClipboard}>
                            {clipboardCopied ? 'Copied!' : 'Copy Code'}
                        </CodeButton>
                        <CodeButton
                            inverted={true}
                            onClick={() => {
                                sendCode();
                            }}
                        >
                            Start Session
                        </CodeButton>
                    </div>
                </ModalContent>
            </CodeModal>
        </CodeModalContainer>
    );
}
