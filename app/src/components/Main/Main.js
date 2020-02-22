import React, {useCallback, useState } from 'react';
import { Route, useHistory, Redirect } from 'react-router-dom';
import uuid from 'uuid';
import Home from '../Home/Home';
import NameEntry from '../NameEntry/NameEntry';
import styles from './Main.module.css'


const Main = () => {
    const [name, setName] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [id, setId] = useState('');

    const history = useHistory();

    const authenticate = useCallback((e) => {
        e.preventDefault();
        setIsAuthenticated(true);
        setId(uuid.v1());
        history.push('/lobbies')
    }, [history]);

    return (
        <div className={styles.main}>
            <Route
                exact
                path='/name-entry'
                render = {() =>
                    <NameEntry setName={setName} authenticate={authenticate} />
                }
            />
            {!isAuthenticated &&
                <Redirect to='/name-entry' />
            }
            <Route
                exact
                path='/lobbies'
                render = {() =>
                    <Home name={name} userId={id} />
                }
            />
        </div>
    )
};

export default Main;