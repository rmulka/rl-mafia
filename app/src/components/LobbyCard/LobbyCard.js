import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import styles from './LobbyCard.module.css';

const LobbyCard = (props) => {
    const joinGame = () => {
        props.setCurrentPlayerLobbyId(props.lobbyId);

        const currLobby = props.lobbies[props.lobbyId];
        currLobby.players += 1;
        props.setLobbies({
            ...props.lobbies,
            [props.lobbyId]: currLobby,
        });

        props.socket.emit('joined-lobby', props.lobbyId, props.playerId);
    };

    const currentLobby = props.lobbies[props.lobbyId];
    const inProgress = props.lobbies[props.lobbyId].inProgress;

    const inProgressText = inProgress
        ? <Typography style={{ fontSize: '0.4em' }} className={styles.inProgressGameText}>In progress...</Typography>
        : <Typography style={{ fontSize: '0.4em' }} className={styles.openGameText}>Open</Typography>;

    const joinButton = inProgress
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' onClick={joinGame} variant='contained'>Join Game</Button>;

    return (
        <Card className={styles.card} variant="outlined">
            <div className={styles.cardContent}>
                <Typography style={{ fontSize: '1.5em' }} className={styles.cardTitle} variant="h5">{currentLobby.creatorName}'s Game</Typography>
                <div className={styles.cardBody}>
                    {inProgressText}
                </div>
                <Typography style={{ fontSize: '1.3em' }} className={styles.cardNumPlayers}>Players: {currentLobby.players}</Typography>
                <div className={styles.joinButton}>{joinButton}</div>
            </div>
        </Card>
    )
};

export default LobbyCard;