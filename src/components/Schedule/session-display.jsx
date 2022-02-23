import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const SessionDisplay = ({selectedEventSession, setSelectedEventSession, deleteEvent, userID}) => {
    const firebase = useContext(FirebaseContext);
    const [exercicesSession, setExercicesSession] = useState([]); //Seulement les exercices pour cet session en particulier
    const [sessionTitle, setSessionTitle] = useState("");

    useEffect(async () => {
        const sessionID = selectedEventSession[0].refID;
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


    const sessionDisplay = (
        <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4">
            <span className='title mb-1'>{sessionTitle}</span>
            <div className=" basicText flexCenter">{selectedEventSession[0].day + " (" + selectedEventSession[0].start + 'h - ' + selectedEventSession[0].end + 'h)'}</div>
            <div className='flexStart my-5' >
                <span className='underline'>Exercice(s) :</span>
                {exericesDisplay}
            </div>
            <div className='flex flex-row justify-around items-center w-full h-1/10'>
                <div className='btn-primary' onClick={() => deleteEvent(selectedEventSession[0].id)} >Supprimer</div>
                <Link className='btn-primary' to="/session-update" state={{userID: userID, sessionID: selectedEventSession[0].refID}}>Modifier</Link>
                <div className='btn-primary' onClick={() => setSelectedEventSession([])}>Fermer</div>
            </div>
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {sessionDisplay}
        </div>
    )
};

export default SessionDisplay;