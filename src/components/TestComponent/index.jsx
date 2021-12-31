import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let {user} = location.state;
    user = JSON.parse(user);

    const loadSessionMenu = () => {
        const myState = {userID: user.id};
        navigate('/session-menu', {state: myState});
    }


    return (
        <div>
            <h2>Bonjour {user.username}</h2>
            <button onClick={() => loadSessionMenu()}>Sessions</button>
        </div>
    )
}

export default TestComponent;
