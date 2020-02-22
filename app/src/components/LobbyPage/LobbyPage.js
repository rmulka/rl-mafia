import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LobbyPlayersList from '../LobbyPlayersList/LobbyPlayersList';
import NumMafiaInput from '../NumMafiaInput/NumMafiaInput';
import styles from './LobbyPage.module.css';

const LobbyPage = (props) => {
    const [isMafia, setIsMafia] = useState(null);
    const [lobbyInfo, setLobbyInfo] = useState({});
    const [inProgress, setInProgress] = useState(false);

    const numMafiaRef = useRef(0);
    const numPlayersRef = useRef(1);

    useEffect(() => {
        props.socket.on('lobby-info', lobbyInfo => {
            setLobbyInfo(lobbyInfo);
        });
    }, [props.socket]);

    useEffect(() => {
        props.socket.on(`game-assignments_${props.lobbyId}`, randomMafia => {
            setIsMafia(randomMafia[props.userId]);
        });

        props.socket.on(`lobby-status-update_${props.lobbyId}`, inProgress => {
            setInProgress(inProgress);
        });

    }, [props.lobbyId, props.socket, props.userId]);

    useEffect(() => {
        props.socket.on(`lobby-playerNum-update_${props.lobbyId}`, numPlayers => {
            numPlayersRef.current = numPlayers;
        });
    });

    const leaveGame = () => {
        props.socket.emit('left-lobby', props.lobbyId, props.userId);
        props.setCurrentPlayerLobbyId(null);
    };

    const startGame = () => {
        const numMaf = numMafiaRef.current;
        if (!isNaN(numMaf) && numMaf > 0 && numMaf <= numPlayersRef.current) {
            props.socket.emit('started-game', props.lobbyId, numMafiaRef.current);
        }
    };

    const endGame = () => { props.socket.emit('ended-game', props.lobbyId) };

    const GameInProgress = () => (
        <>
            <div className={styles.mafiaBox}>
                <Typography className={styles.mafiaDeclaration} variant='h4'>
                    {isMafia ? 'You are in the mafia' : 'You are part of the citizens'}
                </Typography>
                {isMafia
                ? <img className={styles.assignmentImage} src={ require('../../images/mafia.jpg') } alt='mafia' />
                : <img className={styles.assignmentImage} src={ require('../../images/citizens.jpg') } alt='citizens' />}
            </div>
            {lobbyInfo.creatorId === props.userId &&
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
    );

    const GameNotInProgress = () => (
        Object.keys(lobbyInfo).length > 0
        ? <>
            <Typography className={styles.gameTitle} variant='h3'>{lobbyInfo.creatorName}'s Game</Typography>
            {lobbyInfo.creatorId === props.userId &&
            <>
                <label htmlFor='mafia-members' className={styles.mafiaMembersLabel}>Number of mafia members:</label>
                <NumMafiaInput
                    numMafia={numMafiaRef}
                    socket={props.socket}
                    lobbyId={props.lobbyId}
                />
            </>
            }
            <Box className={styles.playersBox}>
                <Typography variant='h5'>Players:</Typography>
                <LobbyPlayersList
                    creatorId={lobbyInfo.creatorId}
                    creatorName={lobbyInfo.creatorName}
                    socket={props.socket}
                    lobbyId={props.lobbyId}
                />
            </Box>
            <div className={styles.gameButtons}>
                {lobbyInfo.creatorId === props.userId &&
                <div className={styles.button}>
                    <Button color='primary' onClick={startGame} variant='contained'>Start Game</Button>
                </div>
                }
                <div className={styles.button}>
                    <Button color='primary' onClick={leaveGame} variant='contained'>Leave Game</Button>
                </div>
            </div>
        </>
        : <></>
    );

    return (
        <Box className={styles.container}>
            { inProgress ? <GameInProgress /> : <GameNotInProgress /> }
        </Box>
    );
};

export default LobbyPage;