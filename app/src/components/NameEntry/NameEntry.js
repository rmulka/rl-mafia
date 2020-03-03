import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import styles from './NameEntry.module.css';

const NameEntry = (props) => {
    const { authenticate } = props;

    const [validName, setValidName] = useState(false);

    const handleChange = event => {
        const value = event.target.value;
        if (value && value.length > 0) {
            if (!validName) setValidName(true);
            props.setName(value);
        } else {
            setValidName(false);
        }
    };

    return (
        <Box className={styles.container}>
            <form onSubmit={authenticate}>
                <Typography className={styles.greeting} variant='h2'>Welcome to RL Mafia!</Typography>
                <div className={styles.nameInput}>
                    <label className={styles.nameLabel} htmlFor="name">Name:</label>
                    <input
                        className={styles.nameTextBox}
                        onChange={handleChange}
                        placeholder="Enter Name"
                        type="text"
                    />
                </div>
                <div className={styles.submitButton}>
                    {validName
                        ? <Button color='primary' type='submit' variant='contained'>Submit</Button>
                        : <Button color='primary' type='submit' variant='contained' disabled>Submit</Button>
                    }
                </div>
            </form>
        </Box>
    );
};

export default NameEntry;