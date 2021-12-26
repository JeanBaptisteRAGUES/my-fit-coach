import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../../Firebase';

const SessionMenu = ({user, selectSession, callback}) => {
    const firebase = useContext(FirebaseContext);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        if(sessions.length > 0)return null;

        let newSessions = [];

        firebase.db.collection('sessions').where("userID", "==", user.uid).get()
        .then((results) => {
            if(results.size === 0) {
                console.log("Aucune session n'a encore été enregistrée")
                return null;
            }
            results.forEach(result => {
                newSessions.push(result.data());
            })
        })
        .then(async () => {
            setSessions(newSessions);
        })

    }, [])

    const loadSession = () => {
        selectSession(selectedSession);
        callback("sessionDisplay");
    }

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
                {
                    selectedSession !== "" ?
                        <button onClick={() => loadSession()} >Charger</button>
                    :
                        <button disabled>Charger</button>
                }
            </div>

        :

            <div className='SM_sessionSelect'>
                Vous n'avez encore enregistré aucune session !
            </div>

    const loadSessionForm = () => {
        selectSession("");
        callback("sessionForm");
    }

    

    return (
        <div className='SM_container'>
            {user.displayName} ({user.uid})
            {sessionsSelect}
            <button onClick={() => loadSessionForm()} >Nouvelle Session</button>
        </div>
    )
}

export default SessionMenu;
