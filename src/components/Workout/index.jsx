import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FirebaseContext} from '../Firebase';
import './workout.css';
import Exercice from './Exercice';
import ExerciceForm from './ExerciceForm';
import TrainingForm from './TrainingForm';
import SessionMenu from './SessionMenu';
import SessionForm from './SessionForm';
import { Fragment } from 'react/cjs/react.production.min';

const Workout = () => {
    const firebase = useContext(FirebaseContext);
    const [selectedSession, setSelectedSession] = useState("");
    const [displayMode, setDisplayMode] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
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
            <button onClick={() => setDisplayMode("exerciceForm")} >Exercices</button>
            <button onClick={() => setDisplayMode("sessionMenu")} >Sessions</button>
        </div>
    )

    return (
        <div className="W_workoutContainer">
            <h1>Workout</h1>
            {exerciceForm}
            {trainingForm}
            {exercice}
            {sessionMenu}
            {sessionForm}
            {choices}
        </div>
    )
}

export default Workout;
