import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './session.css';

const Session = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, sessionID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, sessionID: null};
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmInput, setConfirmInput] = useState("");
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        console.log("sessionID : " + sessionID);
        if(userID === null) {navigate('/login'); return};
        if(sessionID === null){navigate('/session-menu'); return};
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
                    <Link className='basicText cursor-pointer' to="/exercice" state={{userID: userID, exerciceID: exercice[0]}} >{exercice[1]}</Link>
                </div>
            )
        })
    )

    const deleteSession = () => {
        if(confirmInput === sessionTitle){
            firebase.session(sessionID).delete()
            .then(() => {
                console.log(`Session (${sessionID}) correctement supprimée !`);
                navigate('/session-menu', {state: {userID}});
            })
            .catch((err) => setErrMsg("Erreur lors de la suppression de la session : " + err));
        }else{
            setErrMsg("Vous n'avez pas correctement entré le titre de la session !");
        }
    }

    const confirmDeleteWindow = confirmDelete && (
        <div className="window-sport basicText md:w-1/2 w-2/3">
            <span className='title my-5'>Supprimer Session</span>
            <span className='basicText text-red-600'>{errMsg}</span>
            <label htmlFor='delete-session'>Entrez le titre de la session pour confirmer</label>
            <input className='input' id="delete-session" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder={sessionTitle} ></input>
            <div className='flex flex-row justify-around items-center'>
                <div className='btn-primary' onClick={() => deleteSession()} >Supprimer</div>
                <div className='btn-primary' onClick={() => setConfirmDelete(false)} >Annuler</div>
            </div>
        </div>
    )

    const deleteBtn = (
        <div className='btn-primary' onClick={() => setConfirmDelete(true)}>
            Supprimer
        </div>
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

    const sessionDisplay = !confirmDelete && (
        <div className="window-sport basicText">
            <span className='font-bold mb-4 title' >{sessionTitle}</span>
            <div className='flexStart' >
                <span className='underline'>Exercice(s) :</span>
                {exericesDisplay}
            </div>
            <div className='btn-container-row'>
                {deleteBtn}
                {updateBtn}
                {previousBtn}
            </div>
        </div>
    )

    return (
        <div className='container-sport'>
            {sessionDisplay}
            {confirmDeleteWindow}
        </div>
    )
}

export default Session;
