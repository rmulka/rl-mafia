import React, { useEffect, useState } from 'react';
import PlayerCard from '../PlayerCard/PlayerCard';
import styles from './LobbyPlayersList.module.css';

const LobbyPlayersList = (props) => {
    const initialState = {
        playerInfoMap: {
            [props.creatorId]: { name: props.creatorName },
        },
        lobbyPlayerIds: [props.creatorId],    
    };

    const [lobbyState, setLobbyState] = useState(initialState);
    
    useEffect(() => {
        props.socket.on(`lobby-playerId-update_${props.lobbyId}`, ({ lobbyPlayerIds, playerInfoMap }) => {
            setLobbyState({ playerInfoMap, lobbyPlayerIds });
        })
    }, [props.lobbyId, props.socket]);
    
    return (
        <div className={styles.allPlayerCards}>
            {lobbyState.lobbyPlayerIds.map((id, idx) => (
                <PlayerCard key={idx} name={lobbyState.playerInfoMap[id].name} />
            ))}
        </div>
    )
};

export default LobbyPlayersList;