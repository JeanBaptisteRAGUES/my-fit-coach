import React, { useContext, useEffect } from 'react'
import { useState } from 'react/cjs/react.development';
import { FirebaseContext } from '../../Firebase';
import './session-form.css';

const SessionForm = ({user, callback}) => {
    const firebase = useContext(FirebaseContext);
    const [exercicesList, setExercicesList] = useState([]); //Tous les exercices de l'utilisateur
    const [selectedExercice, setSelectedExercice] = useState(null);
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(() => {

        let newExercicesList = [];

        firebase.db.collection('exercices').where("userID", "==", user.uid).get()
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

    }, [])

    useEffect(() => {
        console.log(JSON.stringify(exercicesSession));
    }, [exercicesSession])

    const addExercice = () => {
        let newExercicesSessionList = [...exercicesSession, JSON.parse(selectedExercice)];
        setExercicesSession(newExercicesSessionList);
    }

    const exerciceSelect = exercicesList.length > 0 && (
        <div className='SF_exerciceSelection'>
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
                    <button onClick={() => deleteExercice(exercice[0])} className="SF_deleteBtn">X</button>
                </div>
            )
        })
    )

    const saveSession = () => {
        firebase.db.collection('sessions').add({
            userID: user.uid,
            title: sessionTitle,
            exercices: JSON.stringify(exercicesSession)
        })
        .then((res) => {
            const resID = res.id;
            console.log(`Session (id: ${resID}) enregistrée avec succès !`);
            callback("sessionMenu");
        });
    }

    const saveBtn = exercicesSession.length > 0 && sessionTitle !== "" ? 
            <button onClick={() => saveSession()}>Enregistrer</button>
        :
            <button disabled>Enregistrer</button>

    const sessionForm = (
        <div className="SF_sessionForm">
            <label htmlFor='titre'>Titre :</label>
            <input type="text" placeholder="titre" onChange={(e) => setSessionTitle(e.target.value)} value={sessionTitle}></input>
            {exerciceSelect}
            {exericesDisplay}
            {saveBtn}
        </div>
    )

    return (
        <div>
            {user.displayName} ({user.uid})
            <br/>
            Formulaire nouvelle session :
            {sessionForm}
        </div>
    )
}

export default SessionForm;
