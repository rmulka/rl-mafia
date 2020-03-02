import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import styles from './LobbyCard.module.css';

const LobbyCard = (props) => {
    const [numPlayers, setNumPlayers] = useState(props.players);
    const [inProgress, setInProgress] = useState(props.inProgress);

    useEffect(() => {
        props.socket.on('lobby-playerNum-update', ({ numPlayers, lobbyId }) => {
            if (lobbyId === props.lobbyId) {
                setNumPlayers(numPlayers);
            }
        }, []);

        props.socket.on('lobby-status-update', ({ inProgress, lobbyId }) => {
            if (lobbyId === props.lobbyId) {
                setInProgress(inProgress);
            }
        });
    }, [props.lobbyId, props.socket]);

    const joinGame = () => {
        props.socket.emit('joined-lobby', props.lobbyId, props.userId);
        props.setCurrentPlayerLobbyId(props.lobbyId);
    };

    const inProgressText = inProgress
        ? <Typography style={{ fontSize: '0.4em' }} className={styles.inProgressGameText}>In progress...</Typography>
        : <Typography style={{ fontSize: '0.4em' }} className={styles.openGameText}>Open</Typography>;

    const joinButton = inProgress
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' onClick={joinGame} variant='contained'>Join Game</Button>;

    return (
        <Card className={styles.card} variant="outlined">
            <div className={styles.cardContent}>
                <Typography style={{ fontSize: '1.5em' }} className={styles.cardTitle} variant="h5">{props.creatorName}'s Game</Typography>
                <div className={styles.cardBody}>
                    {inProgressText}
                </div>
                <Typography style={{ fontSize: '1.3em' }} className={styles.cardNumPlayers}>Players: {numPlayers}</Typography>
                <div className={styles.joinButton}>{joinButton}</div>
            </div>
        </Card>
    )
};

export default LobbyCard;