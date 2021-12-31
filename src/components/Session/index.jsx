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
        <Link to="/session-menu" state={location.state}>
            Retour
        </Link>
    )

    const updateBtn = (
        <Link to="/session-update" state={location.state}>
            Modifier
        </Link>
    )

    const sessionDisplay = (
        <div className="S_sessionDisplay">
            <h2>{sessionTitle}</h2>
            {exericesDisplay}
            {updateBtn}
            {previousBtn}
        </div>
    )

    return (
        <div>
            {sessionDisplay}
        </div>
    )
}

export default Session;
