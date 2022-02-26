import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FirebaseContext} from '../Firebase';
import './workout.css';
import Exercice from '../Exercice';
import ExerciceForm from '../ExerciceForm';
import TrainingForm from '../TrainingForm';
import SessionMenu from '../SessionMenu';
import SessionForm from '../SessionForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

const Workout = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    console.log(location.state);
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [selectedSession, setSelectedSession] = useState("");
    const [displayMode, setDisplayMode] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        console.log("userID : " + userID);
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                setUser(user);
            }else{
                console.log("Deconnexion");
                setUser(null);
            }
        });
    }, []);

    const exerciceForm = displayMode === "exerciceForm" && (
        <ExerciceForm/>
    )

    const trainingForm = displayMode === "trainingForm" && (
        <TrainingForm exerciceID="IulA60jCEk84WMVnwzNq" callback={setDisplayMode} />
    )

    const exercice = displayMode === "exercice" && (
        <Exercice exerciceID="IulA60jCEk84WMVnwzNq" callback={setDisplayMode} />
    )

    const sessionMenu = displayMode === "sessionMenu" && user !== "" && (
        <SessionMenu user={user} selectSession={setSelectedSession} callback={setDisplayMode} />
    )

    const sessionForm = displayMode === "sessionForm" && (
        <SessionForm user={user} callback={setDisplayMode} />
    )

    const choices = displayMode === "" && (
        <div className='W_choicesBtns'>
            <button onClick={() => setDisplayMode("exercice")} >Exercices</button>
            <button onClick={() => setDisplayMode("sessionMenu")} >Sessions</button>
        </div>
    )

    const exerciceDescription = (
        "Ici vous pourrez enregistrer vos exercices personnalisés en choisissant vous même les paramètres. Vous pourrez ensuite à la fin de vos séances enregistrer vos performances pour ensuite pouvoir accéder à l'historique de vos entrainements pour chaque exercice et voir vos progrès !"
    )

    const sessionDescription = (
        "Une session peut contenir un ou plusieurs exercices et peut être placée comme un évènement dans votre emploi du temps."
    )

    return (
        <div className="container-sport">
            <div className='window-sport-raw flex flex-col justify-start items-center w-[90%] md:w-1/3 gap-2'>
                <div className='group flexStart w-full'>
                    <Link data-tip={exerciceDescription} className='title text-center w-full underline' to="/exercice-menu" state={{userID: user.uid}}>Exercices</Link>
                    <span className=' group-hover:opacity-100 opacity-50 basicText'>{exerciceDescription}</span>
                </div>
                <div className='group flexStart w-full'>
                    <Link data-tip={sessionDescription} className='title text-center w-full underline' to="/session-menu" state={{userID: user.uid}}>Sessions</Link>
                    <span className=' group-hover:opacity-100 opacity-50 basicText'>{sessionDescription}</span>
                </div>
            </div>
        </div>
    )
}

export default Workout;
