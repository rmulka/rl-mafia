import React, { useCallback, useState } from 'react';
import { useHistory } from "react-router-dom";
import uuid from 'uuid';
import Main from './components/Main/Main';
import './App.css';


const App = () => {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');

    const history = useHistory();

    const authenticate = useCallback((event) => {
        event.preventDefault();
        setId(uuid.v1());
        setIsAuthenticated(true);
        history.push('/lobbies');
    }, [history]);

    return (
        <Main
            name={name}
            setName={setName}
            isAuthenticated={isAuthenticated}
            id={id}
            authenticate={authenticate}
        />
    )
};

export default App;
