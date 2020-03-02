import React, { useEffect, useState } from 'react';
import PlayerCard from '../PlayerCard/PlayerCard';
import Loading from '../Loading/Loading';
import styles from './LobbyPlayersList.module.css';

const LobbyPlayersList = (props) => {
    const [lobbyState, setLobbyState] = useState(null);
    
    useEffect(() => {
        props.socket.emit('playerId-request', props.lobbyId);

        props.socket.on('lobby-playerId-update', ({ lobbyPlayerIds, playerInfoMap }) => {
            setLobbyState({ playerInfoMap, lobbyPlayerIds });
        })
    }, [props.lobbyId, props.socket]);
    
    return (
        lobbyState
        ? ( <div className={styles.allPlayerCards}>
                {lobbyState.lobbyPlayerIds.map((id, idx) => (
                    <PlayerCard key={idx} name={lobbyState.playerInfoMap[id].name} />
                ))}
            </div>
        ) : (
            <Loading />
        )
    )
};

export default LobbyPlayersList;