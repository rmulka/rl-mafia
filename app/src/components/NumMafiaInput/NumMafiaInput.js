import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import styles from './NumMafiaInput.module.css';

const NumMafiaInput = (props) => {
    const [numError, setNumError] = useState(false);
    const [numPlayers, setNumPlayers] = useState(props.numPlayers.current);

    useEffect(() => {
        const handlePlayerNumUpdate = ({ numPlayers, lobbyId }) => {
            if (lobbyId === props.lobbyId) {
                setNumPlayers(numPlayers);
            }
        };

        props.socket.on('lobby-playerNum-update', handlePlayerNumUpdate);

        return () => {
            props.socket.off('lobby-playerNum-update', handlePlayerNumUpdate);
        };
    }, [props.lobbyId, props.numPlayers, props.socket]);

    const handleTextChange = (event) => {
        const numMaf = event.target.value;
        if (isNaN(numMaf) || (numMaf < 1 || numMaf > numPlayers)) {
            setNumError(true);
        } else {
            props.numMafia.current = numMaf;
            setNumError(false);
        }
    };

    return (
        !numError
        ? <TextField
                className={styles.textField}
                id='standard number'
                variant='outlined'
                type='number'
                defaultValue={props.numMafia.current}
                onChange={handleTextChange}
        />
        : <TextField
                className={styles.textField}
                error
                id='outlined-error-helper-text'
                helperText={`Enter number 1 to ${numPlayers}`}
                variant='outlined'
                onChange={handleTextChange}
        />
    );
};

export default NumMafiaInput;