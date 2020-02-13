import React from 'react';

import { userContext } from '../../contexts';

import Button from 'react-bootstrap/Button';

const NameEntry = (props) => {
    return (
        <>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    className="form-control form-control-lg"
                    onChange={(e) => props.setName(e.target.value)}
                    placeholder="Enter Name"
                    type="text"
                />
            </div>
            <userContext.Consumer>
                {({ handleAuthChange }) => (
                    <Button value={true} onClick={handleAuthChange}>Click</Button>
                )}
            </userContext.Consumer>
        </>
    );
};

export default NameEntry;