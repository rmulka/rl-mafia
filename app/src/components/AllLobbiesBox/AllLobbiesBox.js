import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import LobbyCard from '../LobbyCard/LobbyCard';
import styles from './AllLobbiesBox.module.css';

const AllLobbiesBox = (props) => {
    const [lobbies, setLobbies] = useState({});

    const lobbyIds = Object.keys(lobbies);

    useEffect(() => {
        props.socket.emit('state-request');

        props.socket.on('lobby-state', ({ lobbies, playerInfoMap }) => {
            setLobbies(lobbies)
        })
    }, [props.socket]);

    return lobbyIds.length === 0
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
                    setCurrentPlayerLobbyId={props.setCurrentPlayerLobbyId}
                    socket={props.socket}
                />
            ))}
        </div>
    )
};

export default AllLobbiesBox;