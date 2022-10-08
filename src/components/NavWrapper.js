import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../css/style.css';
import { useAuth } from './AuthProvider';
import useWindowDimensions from '../hooks/WindowDimensions';
const Home = styled.div`
    width: 100%;
    height: 100vh;
    background: radial-gradient(
        ellipse at left bottom,
        var(--dark-blue) -55%,
        var(--black) 40%
    );
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(5, 1fr);
`;

const Sidebar = styled.div`
    display: grid;
    grid-auto-rows: auto;
    height: 100%;
    grid-template-columns: repeat(5, 1fr);
    grid-column: 1;
    grid-row: span 3;
    border-right: 1px solid var(--light-purple);
    z-index: 1000;
    & > svg {
        grid-row: 1;
        color: white;
        font-size: 1.5rem;
        grid-column: 5;
        justify-self: end;
        padding: 15px;
    }

    @media (max-width: 1024px) {
        position: absolute;
        background: var(--black);
    }

    @media (max-width: 480px) {
        grid-column: 1 / 5;
        grid-row: span 4;
    }
`;

const NavName = styled.div`
    color: var(--light-purple);
    font-family: var(--Karla);
    font-weight: bold;
    grid-column: 2 / 4;
    font-size: 1.1rem;
    padding: 40px 0;
    height: auto;
`;

const NavList = styled.ul`
    padding: 0;
    grid-column: 2 / 5;
    display: flex;
    flex-direction: column;
`;

const NavItem = styled.li`
    font-weight: normal;
    color: var(--white);
    font-family: var(--Karla);
    font-size: 1rem;
    grid-column: span 3;
    padding: 4px 0;
    list-style-type: none;
    & > a {
        text-decoration: none;
        color: inherit;
    }
    & > a:visited {
        text-decoration: none;
        color: inherit;
    }
    & > a:hover {
        text-decoration: none;
        color: var(--light-purple);
    }
    & > a:active {
        text-decoration: none;
        color: inherit;
    }
    & > a:focus {
        text-decoration: none;
        color: inherit;
    }
`;

const NavDivider = styled.hr`
    margin-left: 0;
    margin: 10px 0;
    width: 45px;
    height: 1px;
    border: 0;
    background: var(--light-purple);
`;

const NavBottom = styled.div`
    grid-column: 2 / 5;
    justify-content: center;
    grid-row: 6;
    display: flex;
    flex-direction: column;
    color: var(--white);
    font-family: var(--Karla);
    & > span {
        color: var(--light-purple);
    }
`;

const HamburgerContainer = styled.div`
    position: absolute;
    cursor: pointer;
    padding: 15px;
    height: fit-content;
    width: fit-content;
`;

function Menu() {
    return (
        <NavList>
            <NavItem>
                <Link to="">New Session</Link>
            </NavItem>
            <NavItem>
                <Link to="">Join Session</Link>
            </NavItem>
            <NavDivider />
            <NavItem>
                <Link to="">My Sessions</Link>
            </NavItem>
            <NavItem>
                <Link to="">Session History</Link>
            </NavItem>
            <NavItem>
                <Link to="">Track History</Link>
            </NavItem>
            <NavDivider />
            <NavItem>
                <Link to="">Settings</Link>
            </NavItem>
        </NavList>
    );
}

function Hamburger(props) {
    return (
        <HamburgerContainer
            onClick={() => {
                props.onClick();
            }}
        >
            <FontAwesomeIcon
                icon={faBars}
                style={{ color: 'white', fontSize: '1.5rem' }}
            />
        </HamburgerContainer>
    );
}

export default function withNavWrapper(Component) {
    return function ({ ...props }) {
        const auth = useAuth();
        const { width, height } = useWindowDimensions();
        const [sidebarVis, setSidebarVis] = useState(true); // Off by default
        const [showHamburger, setShowHamburger] = useState(true); // shown by default
        const sideBarBreakpoint = 1024; // The height we configure sidebar to collapse on

        useEffect(() => {
            if (width < sideBarBreakpoint) {
                setShowHamburger(true);
                setSidebarVis(false);
            } else {
                setShowHamburger(false);
                setSidebarVis(true);
            }
        }, [width, height]);

        function toggleSideBar() {
            setSidebarVis(!sidebarVis);
        }

        return (
            <Home>
                {showHamburger && !sidebarVis ? (
                    <Hamburger onClick={toggleSideBar} />
                ) : (
                    ''
                )}
                {sidebarVis ? (
                    <Sidebar>
                        {width < sideBarBreakpoint ? (
                            <FontAwesomeIcon
                                icon={faXmark}
                                onClick={toggleSideBar}
                            />
                        ) : (
                            ''
                        )}
                        <NavName>MirQueue</NavName>
                        <Menu></Menu>
                        <NavBottom>
                            {auth.user}
                            <span>Premium User</span>
                        </NavBottom>
                    </Sidebar>
                ) : (
                    ''
                )}
                <Component
                    {...props}
                    hocClassName={
                        width < sideBarBreakpoint ? 'adjust-content' : ''
                    }
                />
            </Home>
        );
    };
}
