import { createContext } from 'react';

const userContext = createContext({
    isAuthenticated: false,
    handleAuthChange: () => {},
    setName: () => {},
    name: '',
});

export { userContext };