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

    useEffect(async () => {
        if(userID === null) {navigate('/login'); return};
        if(sessionID === null){navigate('/session-menu'); return};
        let newExerciceList = [];
        firebase.session(sessionID).get()
        .then(async (mySession) => {
            let mySessionData = mySession.data();
            let exercicesSession = JSON.parse(mySessionData.exercices);
            let newExercicesSession = [];

            for await (let exercice of exercicesSession) {
                let exRaw = await firebase.exercice(exercice).get();
                if(exRaw.data() === undefined){
                    console.log(`L'exercice (${exercice}) n'existe plus`);
                }else{
                    newExerciceList.push(exercice);
                    newExercicesSession.push({id: exercice, title: exRaw.data().title});
                }
            }
            setSessionTitle(mySessionData.title);
            setExercicesSession(newExercicesSession);
        })
        .then(() => {
            firebase.session(sessionID).update({
                exercices: JSON.stringify(newExerciceList)
            })
            .catch(err => console.log("Erreur mise à jour de la liste des exercices de la session : " + err));
        })
        .catch(err => console.log("Erreur de la récupération de la session : " + err));

    }, [])

    const exericesDisplay = exercicesSession.length > 0 && (
        exercicesSession.map(exercice => {
            return (
                <div key={exercice.id}>
                    <Link className='basicText cursor-pointer' to="/exercice" state={{userID: userID, exerciceID: exercice.id}} >{exercice.title}</Link>
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
        <div className="window-sport basicText md:w-1/2 w-[90%]">
            <span className='title my-5'>Supprimer Session</span>
            <span className='basicText text-red-600'>{errMsg}</span>
            <label htmlFor='delete-session'>Entrez le titre de la session pour confirmer</label>
            <input className='input' id="delete-session" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder={sessionTitle} ></input>
            <div className='btn-container-row'>
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
        <div className="window-sport basicText w-[90%] md:w-1/2">
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
        <div className='container-sport-raw flex flex-col justify-start items-center py-5 h-screenMinusHeader'>
            {sessionDisplay}
            {confirmDeleteWindow}
        </div>
    )
}

export default Session;
