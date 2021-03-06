import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session-form.css';

const SessionForm = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [exercicesList, setExercicesList] = useState([]); //Tous les exercices de l'utilisateur
    const [selectedExercice, setSelectedExercice] = useState("");
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(() => {
        if(userID === null){navigate('/login'); return};

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

    }, [])

    useEffect(() => {
        console.log(JSON.stringify(exercicesSession));
    }, [exercicesSession])

    const addExercice = () => {
        console.log(exercicesSession);
        console.log(JSON.parse(selectedExercice));
        const newExerciceArray = JSON.parse(selectedExercice);
        let newExercicesSessionList = [...exercicesSession, { id: newExerciceArray[0], title: newExerciceArray[1] }];
        setExercicesSession(newExercicesSessionList);
    }

    const exerciceSelect = exercicesList.length > 0 && (
        <div className='flex flex-col justify-center items-center'>
            <select className='input' name="exercices" id="exerciceSelect" onChange={(e) => setSelectedExercice(e.target.value)}>
                <option value="">--S??lectionnez un exercice--</option>
                {
                    exercicesList.map(exercice => {
                        return <option key={exercice.id} value={JSON.stringify([exercice.id, exercice.title])}>{exercice.title}</option>
                    })
                }
            </select>
            {
                selectedExercice !== "" ?
                    <div className='btn-primary' onClick={() => addExercice()} >Ajouter</div>
                :
                    <div className='btn-primary opacity-50' disabled >Ajouter</div>
            }
        </div>
    )

    const deleteExercice = (idExercice) => {
        let newExercicesSessionList = exercicesSession.filter(exSession => exSession.id !== idExercice);
        console.log(newExercicesSessionList);
        setExercicesSession(newExercicesSessionList);
    }

    const exericesDisplay = exercicesSession.length > 0 && (
        exercicesSession.map(exercice => {
            return (
                <div key={exercice.id} className='flex flex-row items-center justify-center'>
                    {exercice.title}
                    <div onClick={() => deleteExercice(exercice.id)} className="btn-delete">X</div>
                </div>
            )
        })
    )

    const saveSession = () => {
        let newExercicesSession = exercicesSession.map(exercice => exercice.id);
        firebase.db.collection('sessions').add({
            userID: userID,
            title: sessionTitle,
            exercices: JSON.stringify(newExercicesSession)
        })
        .then((res) => {
            const resID = res.id;
            console.log(`Session (id: ${resID}) enregistr??e avec succ??s !`);
            navigate('/session', {state: {userID: userID, sessionID: resID}});
        });
    }

    const previousBtn = (
        <Link className='btn-primary' to="/session-menu" state={location.state}>
            Annuler
        </Link>
    )

    const saveBtn = exercicesSession.length > 0 && sessionTitle !== "" ? 
            <div className='btn-primary' onClick={() => saveSession()}>Enregistrer</div>
        :
            <div className='btn-primary opacity-50' disabled>Enregistrer</div>

    const sessionForm = (
        <div className="window-sport-start basicText w-[90%] md:w-1/3">
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
        <div className='container-sport-raw flex flex-col justify-start items-center py-5'>
            {sessionForm}
        </div>
    )
}

export default SessionForm;
