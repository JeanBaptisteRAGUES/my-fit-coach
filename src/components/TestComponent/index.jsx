import React, { Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
        <div className='bg-green-300'>
            <div className='flex flex-col justify-center items-center relative h-screen bg-blue-600 text-white font-bold'>
                Bleu
            </div>
            <div className='flex flex-col justify-center items-center relative h-screen bg-red-600 text-white font-bold'>
                Rouge
            </div>
        </div>
    )
}

export default TestComponent;
