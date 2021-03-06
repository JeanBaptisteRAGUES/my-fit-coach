import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session-menu.css';

const SessionMenu = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
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
            <Link className='btn-primary' to="/session" state={{userID: userID, sessionID: selectedSession}} >
                Charger
            </Link>
        :
            <span>Sélectionnez une session à charger</span>
    )

    const sessionsSelect = sessions.length > 0 ?
            <div className='flex flex-col justify-center items-center'>
                <select className='input' name="sessions" id="sessionSelect" onChange={(e) => setSelectedSession(e.target.value)}>
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
        <Link className='btn-primary' to="/session-form" state={{userID: userID}}>
            Nouvelle Session
        </Link>
    )

    const menuBtn = (
        <Link className='btn-primary' to="/workout" state={{userID: userID}}>
            Retour
        </Link>
    )

    

    return (
        <div className='container-sport'>
            <div className='window-sport basicText'>
                {sessionsSelect}
                <div className='btn-container-row'>
                    {loadSessionFormBtn}
                    {menuBtn}
                </div>
            </div>
        </div>
    )
}

export default SessionMenu;
