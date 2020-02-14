import React, { useState, useCallback } from 'react';
import uuid from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Main from "./components/Main/Main";
import { userContext } from './contexts';

const App = () => {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');

    const handleIdChange = useCallback((event) => {
        setId(event.target.value);
    }, []);

    const handleAuthChange = useCallback((event) => {
        setIsAuthenticated(event.target.value);
        setId(uuid.v1());
    }, []);

    return (
        <userContext.Provider value={ { isAuthenticated, handleAuthChange, setName, name } }>
            <Main/>
        </userContext.Provider>
    );
}

export default App;
