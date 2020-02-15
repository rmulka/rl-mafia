import React, { useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PlayerCard from '../PlayerCard/PlayerCard';
import styles from './LobbyPage.module.css';

const LobbyPage = (props) => {
    const [numMafia, setNumMafia] = useState('2');
    const [numError, setNumError] = useState(false);

    const leaveGame = () => {
        props.socket.emit('left-lobby', props.lobbyId, props.playerId);
        props.setCurrentPlayerLobbyId(null);
    };

    const startGame = () => {
        const num = parseInt(numMafia);
        if (isNaN(num) || (num < 1 || num > props.lobbyInfo.players)) {
            setNumError(true);
        } else {
            setNumError(false);
            setNumMafia(num);
            props.socket.emit('started-game', props.lobbyId, numMafia);
        }
    };

    const handleTextChange = (event) => {
        setNumMafia(event.target.value);
    };

    const TextFieldComponent = () => (
        !numError
        ? <TextField className={styles.textField}
            required
            id='outlined-required'
            // defaultValue='2'
            variant='outlined'
            onChange={handleTextChange}
        />
        : <TextField className={styles.textField}
            error
            id='outlined-error-helper-text'
            helperText={`Enter a number between 1 and ${props.lobbyInfo.players}`}
            variant='outlined'
            onChange={handleTextChange}
        />
    );

    const AllPlayers = () => {
        console.log(props.lobbyPlayerIds);
        console.log(props.playerInfoMap);
        return props.lobbyPlayerIds[props.lobbyId]
        ? (
            <div className={styles.allPlayerCards}>
                {props.lobbyPlayerIds[props.lobbyId].map((id, idx) => (
                    <PlayerCard key={idx} name={props.playerInfoMap[id].name}/>
                ))}
            </div>
        ) : (
            <></>
        )
    };

    return (
        <Box className={styles.container}>
            <Typography className={styles.gameTitle} variant='h3'>{props.lobbyInfo.creatorName}'s Game</Typography>
            {props.lobbyInfo.creatorId === props.playerId &&
                <>
                    <label htmlFor='mafia-members'>Number of mafia members:</label>
                    <TextFieldComponent/>
                </>
            }
            <Box className={styles.playersBox}>
                <Typography className={styles.playersLabel} variant='h5'>Players:</Typography>
                <AllPlayers />
            </Box>
            {props.lobbyInfo.creatorId === props.playerId &&
                <div className={styles.button}>
                    <Button color='primary' className={styles.button} onClick={startGame} variant='contained'>Start Game</Button>
                </div>
            }
            <div className={styles.button}>
                <Button color='primary' className={styles.button} onClick={leaveGame} variant='contained'>Leave Game</Button>
            </div>
        </Box>
    );
};

export default LobbyPage;