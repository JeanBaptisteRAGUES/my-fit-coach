import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session-update.css';

const SessionUpdate = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, sessionID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, sessionID: null};
    const [exercicesList, setExercicesList] = useState([]); //Tous les exercices de l'utilisateur
    const [selectedExercice, setSelectedExercice] = useState(null);
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        if(sessionID === null){navigate('/session-menu'); return};

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
        <div className='flex flex-col justify-center items-center'>
            <select className='input' name="exercices" id="exerciceSelect" onChange={(e) => setSelectedExercice(e.target.value)}>
                <option value="">--Sélectionnez un exercice--</option>
                {
                    exercicesList.map(exercice => {
                        return <option key={exercice.id} value={JSON.stringify([exercice.id, exercice.title])}>{exercice.title}</option>
                    })
                }
            </select>
            {
                selectedExercice !== null ?
                    <div className='btn-primary' onClick={() => addExercice()} >Ajouter</div>
                :
                    <div className='btn-primary opacity-50' disabled >Ajouter</div>
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
                <div key={exercice[0]} className='flex flex-row items-center justify-center'>
                    {exercice[1]}
                    <button onClick={() => deleteExercice(exercice[0])} className="btn-delete">X</button>
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
        <Link className='btn-primary' to="/session" state={location.state}>
            Retour
        </Link>
    )

    const saveBtn = exercicesSession.length > 0 && sessionTitle !== "" ? 
            <div className='btn-primary' onClick={() => updateSession()}>Enregistrer</div>
        :
            <div className='btn-primary'>Enregistrer</div>

    const sessionForm = (
        <div className="window-sport-start basicText">
            <span className='mb-2 underline' >Formulaire nouvelle session :</span>
            <label htmlFor='titre'>Titre :</label>
            <input className='input' type="text" placeholder="titre" onChange={(e) => setSessionTitle(e.target.value)} value={sessionTitle}></input>
            {exerciceSelect}
            <div className='flex flex-col justify-center items-start my-5'>
                <span className='underline'>Exercice(s) :</span>
                {exericesDisplay}
            </div>
            <div className='btn-container-row'>
                {saveBtn}
                {previousBtn}
            </div>
        </div>
    )

    return (
        <div className='container-sport' >
            {sessionForm}
        </div>
    )
}

export default SessionUpdate;
