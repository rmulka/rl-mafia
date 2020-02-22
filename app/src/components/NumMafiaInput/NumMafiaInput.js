import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import styles from './NumMafiaInput.module.css';

const NumMafiaInput = (props) => {
    const [numError, setNumError] = useState(false);
    const [numPlayers, setNumPlayers] = useState(1);

    useEffect(() => {
        props.socket.on(`lobby-playerNum-update_${props.lobbyId}`, numPlayers => {
            setNumPlayers(numPlayers);
        });
    });

    const handleTextChange = (event) => {
        const numMaf = event.target.value;
        if (isNaN(numMaf) || (numMaf < 1 || numMaf > numPlayers)) {
            setNumError(true);
        } else {
            setNumError(false);
            props.numMafia.current = numMaf;
        }
    };

    return (
        !numError
        ? <TextField className={styles.textField}
                     id='standard number'
                     variant='outlined'
                     type='number'
                     defaultValue={0}
                     onChange={handleTextChange}
        />
        : <TextField className={styles.textField}
                     error
                     id='outlined-error-helper-text'
                     helperText={`Enter number 1 to ${numPlayers}`}
                     variant='outlined'
                     onChange={handleTextChange}
        />
    );
};

export default NumMafiaInput;