import React, {useRef, useEffect, useState} from 'react';
import io from 'socket.io-client';
import Home from '../Home/Home';
import Loading from '../Loading/Loading';

const SocketSetup = (props) =>  {
    const [socketActive, setSocketActive] = useState(false);

    const socketRef = useRef(null);

    useEffect(() => {
        const endpoint = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4001';
        socketRef.current = io(endpoint, {
            reconnectionDelay: 500,
        });

        socketRef.current.on('connect', () => {
            if (socketRef.current.connected) {
                setSocketActive(true);
            }
        });

        socketRef.current.on('disconnect', () => {
            socketRef.current.emit('player-disconnect', props.userId);
        });

        socketRef.current.on('reconnect', () => {
            socketRef.current.emit('player-reconnect', props.userId);
        });

        socketRef.current.on('connect_error', (error) => {
            console.log('connect_error', error);
        });

        socketRef.current.on('connect_timeout', () => {
            console.log('connect_timeout');
        });

        socketRef.current.on('reconnect_error', (error) => {
            console.log('reconnect_error', error);
        });

        return () => {
            socketRef.current.emit('player-disconnect', props.userId);
        }
    }, [props.name, props.userId]);

    return (
        socketActive
        ? (
            <Home
                {...props}
                socket={socketRef.current}
            />
        ) : (
            <Loading />
        )
    )
};

export default SocketSetup;