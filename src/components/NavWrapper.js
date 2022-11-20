import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../css/style.css';
import { useAuth } from './AuthProvider';
import useWindowDimensions from '../hooks/WindowDimensions';
import GenerateCodeModal from './GenerateCodeModal';
import JoinSessionModal from './JoinSessionModal';

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
    transition: 0.6s all ease-out;

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
    font-size: 1.2rem;
    grid-column: span 3;
    padding: 4px 0;
    list-style-type: none;

    & > p {
        display: inline;
    }

    & > p:hover {
        display: inline;
        color: var(--light-purple);
    }

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

function Menu({ ...props }) {
    return (
        <NavList>
            <NavItem>
                <p onClick={props.toggleCodeModal}>New Session</p>
            </NavItem>
            <NavItem>
                <p onClick={props.toggleJoinModal}>Join Session</p>
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
        const [showCodeModal, setShowCodeModal] = useState(false);
        const [showJoinSessionModal, setShowJoinSessionModal] = useState(false);
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

        function toggleCodeModal() {
            setShowJoinSessionModal(false);
            setShowCodeModal(!showCodeModal);
            toggleSideBar(false);
        }

        function toggleJoinModal() {
            setShowCodeModal(false);
            setShowJoinSessionModal(!showJoinSessionModal);
            toggleSideBar(false);
        }

        function toggleSideBar() {
            setSidebarVis(!sidebarVis);
        }

        return (
            <Home>
                {showCodeModal ? (
                    <GenerateCodeModal
                        toggleCodeModal={toggleCodeModal}
                        setShowCodeModal={setShowCodeModal}
                    />
                ) : (
                    ''
                )}

                {showJoinSessionModal ? (
                    <JoinSessionModal
                        showJoinSessionModal={showJoinSessionModal}
                        setShowJoinSessionModal={setShowJoinSessionModal}
                    ></JoinSessionModal>
                ) : (
                    ''
                )}
                {showHamburger && !sidebarVis ? (
                    <Hamburger onClick={toggleSideBar} />
                ) : (
                    ''
                )}
                <Sidebar className={sidebarVis ? 'nav-show' : 'nav-hidden'}>
                    {width < sideBarBreakpoint ? (
                        <FontAwesomeIcon
                            icon={faXmark}
                            onClick={toggleSideBar}
                        />
                    ) : (
                        ''
                    )}
                    <NavName>MirQueue</NavName>
                    <Menu
                        toggleCodeModal={toggleCodeModal}
                        toggleJoinModal={toggleJoinModal}
                    ></Menu>
                    <NavBottom>
                        {auth.user}
                        <span>Premium User</span>
                    </NavBottom>
                </Sidebar>

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
