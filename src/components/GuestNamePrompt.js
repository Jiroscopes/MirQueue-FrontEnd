import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import '../css/style.css';
import { /*checkGuestName,*/ validString } from '../utils';
import { useAuth } from './AuthProvider';

const PromptContainer = styled.div`
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Prompt = styled.div`
    background: var(--white-purple);
    display: flex;
    flex-direction: column;
    padding: 20px;
    justify-content: center;
    border-radius: 10px;
    font-family: var(--Karla);
    color: var(--light-purple);
    font-size: 1.3rem;
    /* align-items: center; */
    text-align: center;

    @media (min-width: 768px) {
        /* padding: 5px 10px; */
        /* width: 500px;
    height: 200px; */
    }
`;

const GuestNameLabel = styled.label``;

const InputContainer = styled.div`
    text-align: left;
`;

const GuestNameInput = styled.input`
    display: block;
    margin: 10px 0;
    background: transparent;
    border: 2px solid var(--light-purple);
    border-radius: 5px;
    height: 30px;
    padding: 0 5px;
    color: var(--dark-purple);
    font-size: 1rem;
    width: 350px;
`;

const SubmitButton = styled.button`
    color: var(--white-purple);
    background: var(--light-purple);
    border: 1px solid var(--light-purple);
    border-radius: 40px;
    padding: 10px 30px;
    transition: 0.5s all ease;
    cursor: pointer;
    text-decoration: none;
    font-family: var(--Karla);
    margin: 10px 0;
    font-size: 1rem;
    text-align: center;

    &:hover {
        color: var(--light-purple);
        background: var(--white-purple);
    }
`;

const Error = styled.p`
    color: red;
    font-size: 0.8rem;
`;
export default function GuestNamePrompt({
    showGuestPrompt,
    setShowGuestPrompt,
}) {
    const [guestName, setGuestName] = useState(null);
    const [errorText, setErrorText] = useState(null);
    let { id } = useParams();
    const auth = useAuth();

    function handleInput(e) {
        let { value } = e.target;

        if (value === '') {
            setGuestName(null);
        }

        setGuestName(value);
    }

    async function handleSubmit() {
        if (!guestName) {
            return;
        }

        if (!validString(guestName)) {
            setErrorText('Name cannot contain special characters');
            return;
        }

        if (guestName.length < 4) {
            setErrorText('Name is too short');
            return;
        }

        if (guestName.length > 20) {
            setErrorText('Name is too long');
            return;
        }

        setErrorText(null);

        let { status, data } = await checkGuestName(guestName);

        if (status === 'failure') {
            setErrorText(data);
            return;
        }

        let user = {
            username: data,
            sessionCode: id,
        };

        auth.updateUser(user);

        localStorage.setItem('user', JSON.stringify(user));
        setShowGuestPrompt(false);
    }

    async function checkGuestName(name) {
        const url = `${process.env.REACT_APP_API_URL}/guest-user`;

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        const data = await response.json();

        return data;
    }

    return (
        <PromptContainer>
            <Prompt>
                <InputContainer>
                    <GuestNameLabel htmlFor="GuestName">
                        Guest Name:
                    </GuestNameLabel>
                    <Error>{errorText}</Error>
                    <GuestNameInput
                        onChange={handleInput}
                        name="GuestName"
                        type="text"
                        placeholder="E.g. Jeff Bexos"
                        placeholderTextColor="green"
                    />
                    <div className="text-center">
                        <SubmitButton onClick={handleSubmit}>
                            Submit
                        </SubmitButton>
                    </div>
                </InputContainer>
            </Prompt>
        </PromptContainer>
    );
}
