import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import '../css/style.css';

const Dash = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    grid-column: span 4;
    grid-row: span 3;
    flex-direction: column;
    font-family: var(--Karla);

    & > h1 {
        color: var(--white);
    }
    & > h3 {
        color: var(--light-purple);
    }
`;

export default function Dashboard({ ...props }) {
    return (
        <Dash>
            <h1>It's empty here...</h1>
            <h3>More coming soon!</h3>
        </Dash>
    );
}
