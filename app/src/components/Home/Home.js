import React, { useState } from 'react';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import LobbyCard from '../LobbyCard/LobbyCard';
import LobbyPage from '../LobbyPage/LobbyPage';
import styles from './Home.module.css'

const dummyInitialState = {
    [uuid.v1()]: {
        creatorId: uuid.v1(),
        creatorName: 'Cian',
        players: 1,
        inProgress: false,
    },
    [uuid.v1()]: {
        creatorId: uuid.v1(),
        creatorName: 'Kyle',
        players: 3,
        inProgress: false,
    },
    [uuid.v1()]: {
        creatorId: uuid.v1(),
        creatorName: 'Cian',
        players: 1,
        inProgress: true,
    },
    [uuid.v1()]: {
        creatorId: uuid.v1(),
        creatorName: 'Kyle',
        players: 3,
        inProgress: false,
    },
};

const Home = (props) => {
    const [lobbies, setLobbies] = useState(dummyInitialState);
    const [currentPlayerLobbyId, setCurrentPlayerLobbyId] = useState(null);

    const createLobby = () => {
        const lobbyId = uuid.v1();

        setCurrentPlayerLobbyId(lobbyId);

        setLobbies({...lobbies,  [lobbyId]: {
            creatorId: props.id,
            creatorName: props.name,
            players: 1,
            inProgress: false,
        }})
    };

    const AllLobbies = () => {
        return (
            <div className={styles.allLobbies}>
                {Object.keys(lobbies).map((lobbyId) => {
                    return <LobbyCard
                        lobbyId={lobbyId}
                        key={lobbyId}
                        lobbies={lobbies}
                        setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                        setLobbies={setLobbies}
                    />
                })}
            </div>
        )
    };

    const ConditionalRender = () => {
        return currentPlayerLobbyId === null ? (
            <>
                <AllLobbies />
                <div className={styles.createLobbyButton}>
                    <Button onClick={createLobby} color='primary' variant='contained'>New Lobby</Button>
                </div>
            </>
        ) : (
            <LobbyPage lobbyId={currentPlayerLobbyId} playerId={props.id} lobbyInfo={lobbies[currentPlayerLobbyId]} setCurrentPlayerLobbyId={setCurrentPlayerLobbyId} />
        )

    };

    return (
        <ConditionalRender />
    );
};

export default Home;