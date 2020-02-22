import React, {useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AllLobbiesBox from '../AllLobbiesBox/AllLobbiesBox';
import LobbyPage from '../LobbyPage/LobbyPage';
import styles from './Home.module.css'

const endpoint = 'http://127.0.0.1:4001';

const Home = (props) => {
    const [currentPlayerLobbyId, setCurrentPlayerLobbyId] = useState(null);
    const [socketActive, setSocketActive] = useState(false);

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(endpoint, {
            transports: ['websocket'],
            upgrade: false,
        });
        setSocketActive(true);
    }, []);

    useEffect(() => {
        socketRef.current.emit('current-player', props.userId, { name: props.name });

        return () => socketRef.current.emit('player-disconnect', props.userId);
    }, [props.userId, props.name]);

    useEffect(() => {
        window.addEventListener('beforeunload',  event => {
            socketRef.current.emit('player-disconnect', props.userId);
        });

        socketRef.current.on('disconnect', () => {
            socketRef.current.emit('player-disconnect', props.userId);
        });

        socketRef.current.on('reconnecting', () => {
            socketRef.current.emit('player-reconnect', props.userId);
        });
    }, [props.userId]);

    useEffect(() => {
        socketRef.current.on('lobby-destroyed', lobbyId => {
            if (lobbyId === currentPlayerLobbyId) {
                setCurrentPlayerLobbyId(null);
            }
        });
    }, [currentPlayerLobbyId]);

    const createLobby = () => {
        const lobbyId = uuid.v1();

        socketRef.current.emit('new-lobby', lobbyId, props.userId);

        setCurrentPlayerLobbyId(lobbyId);

        socketRef.current.emit('lobby-info-request', lobbyId);
    };

    return (
        currentPlayerLobbyId === null
        ? (
            <div className={styles.homeContent}>
                <div className={styles.nameRow}>
                    <div className={styles.backToNameChange}>
                        <Link className={styles.navLink} to='/name-entry'>
                            <Button type='button' color='primary' size='small' variant='outlined' startIcon={<ArrowBackIcon />}>
                                Change Name
                            </Button>
                        </Link>
                    </div>
                    <div className={styles.signedInAsText}>
                        <Typography>Signed in as: {props.name}</Typography>
                    </div>
                </div>
                {socketActive &&
                <AllLobbiesBox
                    userId={props.userId}
                    socket={socketRef.current}
                    setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                />}
                <div className={styles.createLobbyButton}>
                    <Button onClick={createLobby} color='primary' variant='contained'>New Lobby</Button>
                </div>
            </div>
        ) : (
            <LobbyPage
                lobbyId={currentPlayerLobbyId}
                userId={props.userId}
                setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                socket={socketRef.current}
            />
        )
    );
};

export default Home;