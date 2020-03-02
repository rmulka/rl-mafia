import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import SocketSetup from '../SocketSetup/SocketSetup';
import NameEntry from '../NameEntry/NameEntry';
import styles from './Main.module.css'

const Main = (props) => {
    return (
        <div className={styles.main}>
            <Route
                exact
                path='/name-entry'
                render = {() =>
                    <NameEntry
                        setName={props.setName}
                        authenticate={props.authenticate}
                    />
                }
            />
            <Route
                exact
                path='/lobbies'
                render={() =>
                    <SocketSetup
                        name={props.name}
                        userId={props.id}
                    />
                }
            />
            {!props.isAuthenticated &&
                <Redirect to='/name-entry' />
            }
            {props.isAuthenticated &&
                <Redirect to='/lobbies' />
            }
        </div>
    )
};

export default Main;