import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PlayerCard from '../PlayerCard/PlayerCard';
import styles from './LobbyPage.module.css';

const LobbyPage = (props) => {
    const [numError, setNumError] = useState(false);

    let mafiaMembersLocal = 0;

    const creatorName = props.lobbyInfo.creatorName;
    const creatorId = props.lobbyInfo.creatorId;

    const leaveGame = () => {
        props.socket.emit('left-lobby', props.lobbyId, props.playerId);
        props.setCurrentPlayerLobbyId(null);
    };

    const startGame = () => {
        if (isNaN(mafiaMembersLocal) || (mafiaMembersLocal < 1 || mafiaMembersLocal > props.lobbyInfo.players)) {
            setNumError(true);
        } else {
            setNumError(false);
            props.socket.emit('started-game', props.lobbyId, mafiaMembersLocal);
        }
    };

    const endGame = () => { props.socket.emit('ended-game', props.lobbyId) };

    const handleTextChange = (event) => {
        mafiaMembersLocal = event.target.value;
        console.log(mafiaMembersLocal);
    };

    const TextFieldComponent = () => (
        !numError
        ? <TextField className={styles.textField}
            id='standard number'
            variant='outlined'
            type='number'
            onChange={handleTextChange}
        />
        : <TextField className={styles.textField}
            error
            id='outlined-error-helper-text'
            helperText={`Enter number 1 to ${props.lobbyInfo.players}`}
            variant='outlined'
            onChange={handleTextChange}
        />
    );

    const AllPlayers = () => {
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

    const ConditionalRender = () => {
        return props.lobbyInfo.inProgress
        ? (
            <>
                {props.isMafia
                    ? (
                        <div className={styles.mafiaBox}>
                            <Typography className={styles.mafiaDeclaration} variant='h4'>
                                 You are in the mafia
                            </Typography>
                            <img className={styles.assignmentImage} src={ require('../../images/mafia.jpg') } alt='mafia' />
                        </div>
                    ) : (
                        <div className={styles.mafiaBox}>
                            <Typography className={styles.mafiaDeclaration} variant='h4'>
                                You are part of the citizens
                            </Typography>
                            <img className={styles.assignmentImage} src={ require('../../images/citizens.jpg') } alt='citizens' />
                        </div>
                    )}
                {creatorId === props.playerId &&
                    <div className={styles.button}>
                        <Button
                            color='primary'
                            onClick={endGame}
                            variant='contained'
                        >
                            End Game
                        </Button>
                    </div>
                }
            </>
        ) : (
            <>
                <Typography className={styles.gameTitle} variant='h3'>{creatorName}'s Game</Typography>
                {creatorId === props.playerId &&
                <>
                    <label htmlFor='mafia-members' className={styles.mafiaMembersLabel}>Number of mafia members:</label>
                    <TextFieldComponent/>
                </>
                }
                <Box className={styles.playersBox}>
                    <Typography className={styles.playersLabel} variant='h5'>Players:</Typography>
                    <AllPlayers />
                </Box>
                <div className={styles.gameButtons}>
                    {creatorId === props.playerId &&
                    <div className={styles.button}>
                        <Button color='primary' onClick={startGame} variant='contained'>Start Game</Button>
                    </div>
                    }
                    <div className={styles.button}>
                        <Button color='primary' onClick={leaveGame} variant='contained'>Leave Game</Button>
                    </div>
                </div>
            </>
        )
    };

    return (
        <Box className={styles.container}>
            <ConditionalRender />
        </Box>
    );
};

export default LobbyPage;