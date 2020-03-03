import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import uuid from 'uuid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AllLobbiesBox from '../AllLobbiesBox/AllLobbiesBox';
import LobbyPage from '../LobbyPage/LobbyPage';
import styles from './Home.module.css'

const Home = (props) => {
    const [currentPlayerLobbyId, setCurrentPlayerLobbyId] = useState(null);

    useEffect(() => {
        props.socket.emit('current-player', props.userId, {name: props.name});
    }, [props.name, props.socket, props.userId]);

    useEffect(() => {
        window.addEventListener('beforeunload',  event => {
            props.socket.emit('player-disconnect', props.userId);
            if (currentPlayerLobbyId) {
                props.socket.emit('left-lobby', currentPlayerLobbyId, props.userId);
            }
        });
        
        return () => {
            if (currentPlayerLobbyId) {
                props.socket.emit('left-lobby', currentPlayerLobbyId, props.userId);
            }
        }
    }, [currentPlayerLobbyId, props.name, props.socket, props.userId]);

    useEffect(() => {
        const handleLobbyDestroyed = lobbyId => {
            if (lobbyId === currentPlayerLobbyId) {
                setCurrentPlayerLobbyId(null);
            }
        };

        props.socket.on('lobby-destroyed', handleLobbyDestroyed);

        return () => {
            props.socket.off('lobby-destroyed', handleLobbyDestroyed);
        }
    }, [currentPlayerLobbyId, props.socket]);

    const createLobby = () => {
        const lobbyId = uuid.v1();

        props.socket.emit('new-lobby', lobbyId, props.userId);

        setCurrentPlayerLobbyId(lobbyId);
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
                <AllLobbiesBox
                    userId={props.userId}
                    socket={props.socket}
                    setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                />
                <div className={styles.createLobbyButton}>
                    <Button onClick={createLobby} color='primary' variant='contained'>New Lobby</Button>
                </div>
            </div>
        ) : (
            <LobbyPage
                lobbyId={currentPlayerLobbyId}
                userId={props.userId}
                setCurrentPlayerLobbyId={setCurrentPlayerLobbyId}
                socket={props.socket}
            />
        )
    );
};

export default Home;