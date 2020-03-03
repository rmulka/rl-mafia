import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import LobbyCard from '../LobbyCard/LobbyCard';
import styles from './AllLobbiesBox.module.css';
import Loading from '../Loading/Loading';

const AllLobbiesBox = (props) => {
    const [lobbies, setLobbies] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const lobbyIds = Object.keys(lobbies);

    useEffect(() => {
        const handleLobbyStateUpdate = lobbies => {
            setLobbies(lobbies);
            setIsLoaded(true);
        };

        props.socket.emit('state-request');

        props.socket.on('lobby-state', handleLobbyStateUpdate);

        return () => {
            props.socket.off('lobby-state', handleLobbyStateUpdate);
        };
    }, [props.socket]);

    const LoadedLobbies = () => (
        lobbyIds.length === 0
        ? (
            <Typography className={styles.noGamesMessage} variant='h3'>No mafia games to display</Typography>
        ) : (
            <div className={styles.allLobbies}>
                {lobbyIds.map((lobbyId) => (
                    <LobbyCard
                        key={lobbyId}
                        lobbyId={lobbyId}
                        userId={props.userId}
                        creatorName={lobbies[lobbyId].creatorName}
                        players={lobbies[lobbyId].players}
                        inProgress={lobbies[lobbyId].inProgress}
                        setCurrentPlayerLobbyId={props.setCurrentPlayerLobbyId}
                        socket={props.socket}
                    />
                ))}
            </div>
        )
    );

    return isLoaded ? <LoadedLobbies /> : <Loading />
};

export default AllLobbiesBox;