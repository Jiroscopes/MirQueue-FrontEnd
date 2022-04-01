import React from 'react';
import styled from 'styled-components';
import { useAuth } from './AuthProvider';

const NavContainer = styled.div`
  font-family: var(--Karla);
  color: var(--light-purple);
  justify-self: end;
  margin: 10px 30px;
  font-size: 1rem;

  grid-column-start: 1;

  @media (min-width: 768px) {
    grid-column-start: 3;
  }

  p {
    margin: 0;
  }

  span {
    color: var(--white-purple);
    font-size: 0.8rem;
  }
`;

export default function Nav() {
  const auth = useAuth();
  let username = 'Guest';
  let product = 'Spotify Free User';

  if (auth && auth.user) {
    username = auth.user.username;
    product = 'premium';
  }
  // const username = auth ? auth.user.username : 'Guest';
  return (
    <NavContainer>
      <p>{username}</p>
      <span>{product}</span>
    </NavContainer>
  );
}
