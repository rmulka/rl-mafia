import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
        ? <Typography className={styles.inProgressGameText}>In progress...</Typography>
        : <Typography className={styles.openGameText}>Open</Typography>;

    const joinButton = inProgress
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' onClick={joinGame} variant='contained'>Join Game</Button>;

    return (
        <Card className={styles.card} variant="outlined">
            <CardContent className={styles.cardContent}>
                {/*<Card.Img variant="top" src="" />*/}
                <Typography className={styles.cardTitle} variant="h5">{currentLobby.creatorName}'s Game</Typography>
                {inProgressText}
                <Typography className={styles.cardNumPlayers}>Players: {currentLobby.players}</Typography>
                <div className={styles.joinButton}>{joinButton}</div>
            </CardContent>
        </Card>
    )
};

export default LobbyCard;