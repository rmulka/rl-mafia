import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { userContext } from '../../contexts';
import styles from './NameEntry.module.css';

const NameEntry = (props) => {
    return (
        <Box className={styles.container}>
            <div className={styles.nameInput}>
                <label htmlFor="name">Name:</label>
                <input
                    className="form-control form-control-lg"
                    onChange={(e) => props.setName(e.target.value)}
                    placeholder="Enter Name"
                    type="text"
                />
            </div>
            <div>
                <userContext.Consumer>
                    {({ authenticate }) => (
                        <Button color='primary' onClick={authenticate} variant='contained'>Submit</Button>
                    )}
                </userContext.Consumer>
            </div>
        </Box>
    );
};

export default NameEntry;