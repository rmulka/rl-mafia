import React, { useEffect, useState, useRef } from 'react';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import LobbyCard from '../LobbyCard/LobbyCard';
import LobbyPage from '../LobbyPage/LobbyPage';
import styles from './Home.module.css'
import socketIOClient from "socket.io-client";

const endpoint = 'http://127.0.0.1:4001';

const Home = (props) => {
    const [lobbies, setLobbies] = useState({});
    const [lobbyPlayerIds, setLobbyPlayerIds] = useState({});
    const [playerInfoMap, setPlayerInfoMap] = useState({});
    const [currentPlayerLobbyId, setCurrentPlayerLobbyId] = useState(null);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketIOClient(endpoint);
        socketRef.current.emit('current-player', props.id, { name: props.name });
        socketRef.current.emit('state-request');
    }, [props.id, props.name]);

    useEffect(() => {
        socketRef.current.on('lobby-state', ({ lobbies, lobbyPlayerIds, playerInfoMap }) => {
            setLobbies(lobbies);
            setLobbyPlayerIds(lobbyPlayerIds);
            setPlayerInfoMap(playerInfoMap);
        });
    }, [lobbies, props.id]);

    useEffect(() => {
        socketRef.current.on('lobby-destroyed', lobbyId => {
            if (lobbyId === currentPlayerLobbyId) {
                setCurrentPlayerLobbyId(null);
            }
        });
    }, [currentPlayerLobbyId]);

    const createLobby = () => {
        const lobbyId = uuid.v1();

        setCurrentPlayerLobbyId(lobbyId);

        const newLobby = {
            creatorId: props.id,
            creatorName: props.name,
            players: 1,
            inProgress: false,
        };

        setLobbies({...lobbies, [lobbyId]: newLobby});

        socketRef.current.emit('new-lobby', lobbyId, newLobby);
    };

    const AllLobbies = () => {
        return (
            <div className={styles.allLobbies}>
                {Object.keys(lobbies).map((lobbyId) => {
                    return <LobbyCard
                        lobbyId={lobbyId}
                        playerId={props.id}
                        key={lobbyId}
                        lobbies={lobbies}
                        setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                        setLobbies={setLobbies}
                        socket={socketRef.current}
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
            <LobbyPage
                lobbyId={currentPlayerLobbyId}
                playerId={props.id}
                lobbyInfo={lobbies[currentPlayerLobbyId]}
                setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                lobbyPlayerIds={lobbyPlayerIds}
                playerInfoMap={playerInfoMap}
                socket={socketRef.current}
            />
        )
    };

    return (
        <ConditionalRender />
    );
};

export default Home;