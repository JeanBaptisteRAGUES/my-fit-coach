import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session.css';

const Session = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const {userID, sessionID} = location.state;
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(() => {
        console.log("sessionID : " + sessionID);
        firebase.db.collection('sessions').doc(sessionID).get()
        .then(mySession => {
            let mySessionData = mySession.data();
            setSessionTitle(mySessionData.title);
            setExercicesSession(JSON.parse(mySessionData.exercices));
        })

    }, [])

    const exericesDisplay = exercicesSession.length > 0 && (
        exercicesSession.map(exercice => {
            return (
                <div key={exercice[0]}>
                    {exercice[1]}
                </div>
            )
        })
    )

    const previousBtn = (
        <Link className='btn-primary' to="/session-menu" state={location.state}>
            Retour
        </Link>
    )

    const updateBtn = (
        <Link className='btn-primary' to="/session-update" state={location.state}>
            Modifier
        </Link>
    )

    const sessionDisplay = (
        <div className="window-sport">
            <span className='font-bold mb-4 text-xl text-gray-700' >{sessionTitle}</span>
            <div className='flex flex-col items-start justify-center text-gray-700' >
                <span className='underline'>Exercice(s) :</span>
                {exericesDisplay}
            </div>
            <div className='btn-container-row'>
                {updateBtn}
                {previousBtn}
            </div>
        </div>
    )

    return (
        <div className='container-sport'>
            {sessionDisplay}
        </div>
    )
}

export default Session;
