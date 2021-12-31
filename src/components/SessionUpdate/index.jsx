import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session-update.css';

const SessionUpdate = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const navigate = useNavigate();
    const {userID, sessionID} = location.state;
    const [exercicesList, setExercicesList] = useState([]); //Tous les exercices de l'utilisateur
    const [selectedExercice, setSelectedExercice] = useState(null);
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(() => {

        let newExercicesList = [];

        firebase.db.collection('exercices').where("userID", "==", userID).get()
        .then((results) => {
            results.forEach(result => {
                let exerciceData = result.data();
                exerciceData["id"] = result.id;
                newExercicesList.push(exerciceData);
            })
        })
        .then(() => {
            setExercicesList(newExercicesList);
        })

        firebase.db.collection('sessions').doc(sessionID).get()
        .then(mySession => {
            let mySessionData = mySession.data();
            setSessionTitle(mySessionData.title);
            setExercicesSession(JSON.parse(mySessionData.exercices));
        })

    }, [])

    useEffect(() => {
        console.log(JSON.stringify(exercicesSession));
    }, [exercicesSession])

    const addExercice = () => {
        let newExercicesSessionList = [...exercicesSession, JSON.parse(selectedExercice)];
        setExercicesSession(newExercicesSessionList);
    }

    const exerciceSelect = exercicesList.length > 0 && (
        <div className='SU_exerciceSelection'>
            <select name="exercices" id="exerciceSelect" onChange={(e) => setSelectedExercice(e.target.value)}>
                <option value="">--Sélectionnez un exercice--</option>
                {
                    exercicesList.map(exercice => {
                        return <option key={exercice.id} value={JSON.stringify([exercice.id, exercice.title])}>{exercice.title}</option>
                    })
                }
            </select>
            {
                selectedExercice !== null ?
                    <button onClick={() => addExercice()} >Ajouter</button>
                :
                    <button disabled >Ajouter</button>
            }
        </div>
    )

    const deleteExercice = (idExercice) => {
        let newExercicesSessionList = exercicesSession.filter(exSession => exSession[0] !== idExercice);
        console.log(newExercicesSessionList);
        setExercicesSession(newExercicesSessionList);
    }

    const exericesDisplay = exercicesSession.length > 0 && (
        exercicesSession.map(exercice => {
            return (
                <div key={exercice[0]}>
                    {exercice[1]}
                    <button onClick={() => deleteExercice(exercice[0])} className="SU_deleteBtn">X</button>
                </div>
            )
        })
    )

    const updateSession = () => {
        firebase.db.collection('sessions').doc(sessionID).update({
            title: sessionTitle,
            exercices: JSON.stringify(exercicesSession)
        })
        .then(() => {
            navigate('/session', {state: location.state});
        });
    }

    
    const previousBtn = (
        <Link to="/session" state={location.state}>
            Retour
        </Link>
    )

    const saveBtn = exercicesSession.length > 0 && sessionTitle !== "" ? 
            <button onClick={() => updateSession()}>Enregistrer</button>
        :
            <button disabled>Enregistrer</button>

    const sessionForm = (
        <div className="SU_sessionForm">
            <label htmlFor='titre'>Titre :</label>
            <input type="text" placeholder="titre" onChange={(e) => setSessionTitle(e.target.value)} value={sessionTitle}></input>
            {exerciceSelect}
            {exericesDisplay}
            {saveBtn}
            {previousBtn}
        </div>
    )

    return (
        <div>
            <br/>
            Formulaire nouvelle session :
            {sessionForm}
        </div>
    )
}

export default SessionUpdate;
