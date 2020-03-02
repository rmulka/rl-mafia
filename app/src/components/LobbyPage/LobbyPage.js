import React, { useState, useEffect, useRef } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LobbyPlayersList from '../LobbyPlayersList/LobbyPlayersList';
import NumMafiaInput from '../NumMafiaInput/NumMafiaInput';
import Loading from '../Loading/Loading';
import styles from './LobbyPage.module.css';

const LobbyPage = (props) => {
    const [isMafia, setIsMafia] = useState(null);
    const [lobbyInfo, setLobbyInfo] = useState({});
    const [inProgress, setInProgress] = useState(false);

    const numMafiaRef = useRef(1);
    const numPlayersRef = useRef(1);

    useEffect(() => {
        props.socket.emit('lobby-info-request', props.lobbyId);

        props.socket.on('lobby-info', lobbyInfo => {
            setLobbyInfo(lobbyInfo);
        });

        props.socket.on('game-assignments', randomMafia => {
            setIsMafia(randomMafia[props.userId]);
        });

        props.socket.on('lobby-status-update', ({ inProgress, lobbyId }) => {
            if (lobbyId === props.lobbyId) {
                setInProgress(inProgress);
            }
        });

        props.socket.on('lobby-playerNum-update', ({ numPlayers, lobbyId }) => {
            if (lobbyId === props.lobbyId) {
                numPlayersRef.current = numPlayers;
            }
        });

        return () => {
            props.socket.emit('left-lobby', props.lobbyId, props.userId);
        }
    }, [props.lobbyId, props.socket, props.userId]);

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
            {!(lobbyInfo.creatorId === props.userId) &&
            <Typography style={{ 'textAlign': 'center' }} variant='h5'>
                Waiting for {lobbyInfo.creatorName} to end game...
            </Typography>
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
                    numPlayers={numPlayersRef}
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
        : <Loading />
    );

    return (
        <Box className={styles.container}>
            { inProgress ? <GameInProgress /> : <GameNotInProgress /> }
        </Box>
    );
};

export default LobbyPage;