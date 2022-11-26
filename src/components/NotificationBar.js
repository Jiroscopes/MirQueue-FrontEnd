import React from 'react';
import styled from 'styled-components';
import '../css/style.css';

const BarContainer = styled.div`
    background: var(--light-purple);
    position: absolute;
    width: 100vw;
`;

const BarMessage = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5px 0;
    font-family: var(--Karla);
    text-align: center;

    p {
        margin: 0;
    }

    @media (max-width: 700px) {
        flex-direction: column;
    }

    @media (max-width: 700px) {
        font-size: 0.8rem;
    }
`;

export default function NotificationBar(Component) {
    return function ({ ...props }) {
        return (
            <BarContainer>
                <BarMessage>
                    <p>
                        This is a beta version. Please report any bugs on
                        Discord:
                    </p>
                    <a href="https://discord.gg/eFs3EJQp5r" target="_blank">
                        https://discord.gg/eFs3EJQp5r
                    </a>
                </BarMessage>
                <Component />
            </BarContainer>
        );
    };
}
