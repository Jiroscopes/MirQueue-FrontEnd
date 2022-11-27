import styled from 'styled-components';

const Home = styled.div`
    width: 100%;
    height: 100vh;
    background: radial-gradient(
        ellipse at left bottom,
        var(--dark-blue) -55%,
        var(--black) 40%
    );
    display: grid;
    grid-auto-rows: minmax(min-content, max-content);
    grid-template-columns: repeat(5, 1fr);
    padding: 25px;
    font-family: var(--Karla);
    box-sizing: border-box;
`;

const Heading = styled.h1`
    color: var(--white-purple);
    font-size: 3rem;
    margin: 30px 0;
`;

const Section = styled.div`
    grid-column: span 5;
    min-height: 150px;
`;

const Question = styled.h2`
    color: var(--light-purple);
    font-size: 2rem;
`;

const Answer = styled.p`
    color: var(--white);
    font-size: 1.1rem;
`;

export default function Faq() {
    return (
        <Home>
            <Heading>FAQ</Heading>
            <Section>
                <Question>What is MirQueue?</Question>
                <Answer>
                    MirQueue allows users to host a Spotify music sharing
                    session that other users can join and add music to the hosts
                    Spotify play queue.
                </Answer>
            </Section>
            <Section>
                <Question>What is the point?</Question>
                <Answer>
                    Often when around friends or loved ones we enjoy playing
                    music. But there is often only one speaker, tv, or some
                    other device to play the music through, making it one
                    persons job to search the music and queue it up. In comes
                    MirQueue, now you can just start a session and everyone
                    around can join it and add the songs they wish to share!
                </Answer>
            </Section>
            <Section>
                <Question>Feedback or ideas?</Question>
                <Answer>
                    Join MirQueue's Discord!&nbsp;
                    <a href="https://discord.gg/eFs3EJQp5r" target="_blank">
                        https://discord.gg/eFs3EJQp5r
                    </a>
                </Answer>
            </Section>
        </Home>
    );
}
