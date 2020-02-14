import React from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import styles from './LobbyPage.module.css';

const LobbyPage = (props) => {
    const leaveGame = () => {
        props.setCurrentPlayerLobbyId(null);
    };

    const startGame = () => {

    };

    return (
        <>
            <Container maxWidth="md" className={styles.container}>
                {/*<Typography component="div" className={styles.container} />*/}
                {props.lobbyInfo.creatorId === props.playerId &&
                    <>
                        <label htmlFor="mafia-members">Number of mafia members:</label>
                        <TextField
                            required
                            id="outlined-required"
                            label="Required"
                            defaultValue="Hello World"
                            variant="outlined"
                        />
                        <Button color='primary' onClick={startGame} variant='contained'>Start Game</Button>
                    </>
                }
                <Button color='primary' onClick={leaveGame} variant='contained'>Leave Game</Button>
            </Container>
        </>
    );
};

export default LobbyPage;