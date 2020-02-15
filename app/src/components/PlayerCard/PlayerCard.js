import React from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import styles from './PlayerCard.module.css';

const PlayerCard = (props) => {
    return (
        <Card className={styles.playerCard} variant="outlined">
            <Typography className={styles.playerName} variant='h5'>{props.name}</Typography>
        </Card>
    )
};

export default PlayerCard;