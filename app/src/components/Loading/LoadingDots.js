import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';

const LoadingDots = () => {
    const [numDots, setNumDots] = useState(0);

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setNumDots((numDots + 1) % 4);
        }, 750);

        return () => {
            clearInterval(dotInterval);
        }
    }, [numDots]);

    return (
        <Typography variant='h5'>
            {'.'.repeat(numDots)}
        </Typography>
    )
};

export default LoadingDots;