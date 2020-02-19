import React from 'react';
import Home from '../Home/Home';
import NameEntry from '../NameEntry/NameEntry';
import { userContext } from '../../contexts';
import styles from './Main.module.css'

const Main = () => {
    return (
        <div className={styles.main}>
            <userContext.Consumer>
                {({ isAuthenticated, name, setName, id }) => !isAuthenticated
                    ? <NameEntry setName={setName} />
                    : <Home name={name} userId={id} />
                }
            </userContext.Consumer>
        </div>
    )
};

export default Main;