import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import Main from './components/Main/Main';

const App = () => (
    <Router>
        <Main />
    </Router>
);

export default App;
