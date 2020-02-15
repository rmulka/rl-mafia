import React, { useState, useCallback } from 'react';
import uuid from 'uuid';

import './App.css';
import Main from "./components/Main/Main";
import { userContext } from './contexts';

const App = () => {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');

    const authenticate = useCallback(() => {
        setIsAuthenticated(true);
        setId(uuid.v1());
    }, []);

    return (
        <userContext.Provider value={ { isAuthenticated, authenticate, setName, name, id } }>
            <Main/>
        </userContext.Provider>
    );
};

export default App;
