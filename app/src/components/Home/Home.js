import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Button from '@material-ui/core/Button';
import LobbyCard from '../LobbyCard/LobbyCard';
import styles from './Home.module.css'

const dummyInitialState = [
    {
        creator: 'Cian',
        players: 1,
    },
    {
        creator: 'Kyle',
        players: 3,
    },
    {
        creator: 'Cian',
        players: 1,
    },
    {
        creator: 'Kyle',
        players: 3,
    },
];

const Home = (props) => {
    const [lobbies, setLobbies] = useState(dummyInitialState);
    const [inLobby, setInLobby] = useState(false);

    const createLobby = () => {
        setInLobby(true);

        setLobbies([...lobbies, {
            creator: props.name,
            players: 1,
        }])
    };

    const AllLobbies = () => {
        return (
            <div className={styles.allLobbies}>
                {lobbies.map((lobby, index) => (
                    <LobbyCard name={lobby.creator} players={lobby.players} />
                ))}
            </div>
        )
    };

    const ConditionalRender = () => {
        return !inLobby ? (
            <>
                <AllLobbies />
                <div className={styles.createLobbyButton}>
                    <Button onClick={createLobby} color='primary' variant='contained'>New Lobby</Button>
                </div>
            </>
        ) : (
            <p>hi</p>
        )

    };

    return (
        <ConditionalRender />
    );
};

export default Home;