import React from 'react';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './Loading.module.css';

const Loading = () => {
    return (
        <Typography className={styles.loadingTop} variant='h3'>
            Loading{'\t'}
            <CircularProgress />
        </Typography>
    )
};

export default Loading;