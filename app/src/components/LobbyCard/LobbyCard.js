import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styles from './LobbyCard.module.css';

const LobbyCard = (props) => {
    const [numPlayers, setNumPlayers] = useState(1);
    const [inProgress, setInProgress] = useState(false);

    const inProgressText = inProgress
        ? <Typography className={styles.inProgressGameText}>Game in progress...</Typography>
        : <Typography className={styles.openGameText}>Open</Typography>;

    const joinButton = inProgress
        ? <Button color='primary' variant='contained' disabled>Join Game</Button>
        : <Button color='primary' variant='contained'>Join Game</Button>;

    return (
        <Card className={styles.card} variant="outlined">
            <CardContent>
                {/*<Card.Img variant="top" src="" />*/}
                <Typography className={styles.cardTitle} variant="h5">{props.name}'s Game</Typography>
                {inProgressText}
                <Typography className={styles.cardNumPlayers}>Players: {props.players}</Typography>
                <div className={styles.joinButton}>{joinButton}</div>
            </CardContent>
        </Card>
    )
};

export default LobbyCard;