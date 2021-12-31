import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session-menu.css';

const SessionMenu = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const {userID} = location.state;
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        if(sessions.length > 0)return null;

        let newSessions = [];

        firebase.db.collection('sessions').where("userID", "==", userID).get()
        .then((results) => {
            if(results.size === 0) {
                console.log("Aucune session n'a encore été enregistrée")
                return null;
            }
            results.forEach(result => {
                let newSession = result.data();
                newSession.id = result.id;
                newSessions.push(newSession);
            })
        })
        .then(async () => {
            setSessions(newSessions);
        })

    }, [])

    useEffect(() => {
        console.log("Selected Session : " + selectedSession);
    }, [selectedSession])

    const loadSessionBtn = (
        selectedSession !== "" ?
            <Link to="/session" state={{userID: userID, sessionID: selectedSession}} >
                Charger
            </Link>
        :
            <span>Sélectionnez une session à charger</span>
    )

    const sessionsSelect = sessions.length > 0 ?
            <div className='SM_sessionSelect'>
                <select name="sessions" id="sessionSelect" onChange={(e) => setSelectedSession(e.target.value)}>
                    <option value="">--Sélectionnez une session--</option>
                    {
                        sessions.map(session => {
                            return <option key={session.id} value={session.id}>{session.title}</option>
                        })
                    }
                </select>
                {loadSessionBtn}
            </div>

        :

            <div className='SM_sessionSelect'>
                Vous n'avez encore enregistré aucune session !
            </div>

    const loadSessionFormBtn = (
        <Link to="/session-form" state={{userID: userID}}>
            Nouvelle Session
        </Link>
    )

    const menuBtn = (
        <Link to="/workout" state={{userID: userID}}>
            Retour
        </Link>
    )

    

    return (
        <div className='SM_container'>
            Bonjour utilisateur ({userID}) :<br/>
            {sessionsSelect}
            {loadSessionFormBtn}
            {menuBtn}
        </div>
    )
}

export default SessionMenu;
