import React, { useEffect, useState, useRef } from 'react';
import uuid from 'uuid';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import LobbyCard from '../LobbyCard/LobbyCard';
import LobbyPage from '../LobbyPage/LobbyPage';
import styles from './Home.module.css'

const endpoint = 'http://127.0.0.1:4001';

const Home = (props) => {
    const [lobbies, setLobbies] = useState({});
    const [lobbyPlayerIds, setLobbyPlayerIds] = useState({});
    const [playerInfoMap, setPlayerInfoMap] = useState({});
    const [currentPlayerLobbyId, setCurrentPlayerLobbyId] = useState(null);
    const [isMafia, setIsMafia] = useState(null);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(endpoint, {
            timeout: 99999999999,
            pingInterval: 500,
            pingTimeout: 1000,
            transports: ['websocket'],
            upgrade: false,
        });
        socketRef.current.emit('current-player', props.userId, { name: props.name });
        socketRef.current.emit('state-request');

        return () => socketRef.current.emit('player-disconnect', props.userId);
    }, [props.userId, props.name]);

    useEffect(() => {
        window.addEventListener("beforeunload",  event => {
            socketRef.current.emit('player-disconnect', props.userId);
        })
    }, [props.userId]);

    useEffect(() => {
        socketRef.current.on('disconnect', () => {
            socketRef.current.emit('player-disconnect', props.userId);
        });
    }, [props.userId]);

    useEffect(() => {
        socketRef.current.on('reconnecting', () => {
            socketRef.current.emit('player-reconnect', props.userId);
        })
    }, [props.userId]);

    useEffect(() => {
        socketRef.current.on('lobby-state', ({ lobbies, lobbyPlayerIds, playerInfoMap }) => {
            setLobbies(lobbies);
            setLobbyPlayerIds(lobbyPlayerIds);
            setPlayerInfoMap(playerInfoMap);
        });
    }, []);

    useEffect(() => {
        socketRef.current.on('lobby-destroyed', lobbyId => {
            if (lobbyId === currentPlayerLobbyId) {
                setCurrentPlayerLobbyId(null);
            }
        });
    }, [currentPlayerLobbyId]);

    useEffect(() => {
        socketRef.current.on('game-assignments', ({ lobbyId, randomMafia }) => {
            if (lobbyId === currentPlayerLobbyId) {
                setIsMafia(randomMafia[props.userId]);
            }
        })
    }, [currentPlayerLobbyId, props.userId]);

    const createLobby = () => {
        const lobbyId = uuid.v1();

        setCurrentPlayerLobbyId(lobbyId);

        const newLobby = {
            creatorId: props.userId,
            creatorName: props.name,
            players: 1,
            inProgress: false,
        };

        setLobbies({...lobbies, [lobbyId]: newLobby});

        socketRef.current.emit('new-lobby', lobbyId, props.userId, newLobby);
    };

    const AllLobbies = () => {
        const lobbyIds = Object.keys(lobbies);
        return lobbyIds.length === 0
        ? (
            <Typography className={styles.noGamesMessage} variant='h3'>No mafia games to display</Typography>
        ) : (
            <div className={styles.allLobbies}>
                {lobbyIds.map((lobbyId) => {
                    return <LobbyCard
                        lobbyId={lobbyId}
                        playerId={props.userId}
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
            <div className={styles.homeContent}>
                <AllLobbies />
                <div className={styles.createLobbyButton}>
                    <Button onClick={createLobby} color='primary' variant='contained'>New Lobby</Button>
                </div>
            </div>
        ) : (
            <LobbyPage
                lobbyId={currentPlayerLobbyId}
                playerId={props.userId}
                lobbyInfo={lobbies[currentPlayerLobbyId]}
                setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                lobbyPlayerIds={lobbyPlayerIds}
                playerInfoMap={playerInfoMap}
                isMafia={isMafia}
                socket={socketRef.current}
            />
        )
    };

    return (
        <ConditionalRender />
    );
};

export default Home;