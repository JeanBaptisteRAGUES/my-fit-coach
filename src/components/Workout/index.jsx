import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FirebaseContext} from '../Firebase';
import './workout.css';
import Exercice from './Exercice';
import ExerciceForm from './ExerciceForm';
import TrainingForm from './TrainingForm';
import { Fragment } from 'react/cjs/react.production.min';

const Workout = () => {
    const firebase = useContext(FirebaseContext);
    const [displayTrainingForm, setDisplayTrainingForm] = useState(false);
    const [displayExercice, setDisplayExercice] = useState(true);

    return (
        <div className="W_workoutContainer">
            <h1>Workout</h1>
            <ExerciceForm/>
            {
                displayTrainingForm ?
                    <TrainingForm exerciceID="IulA60jCEk84WMVnwzNq" callback={setDisplayTrainingForm} />
                :
                    null
            }
            {
                displayExercice ?
                    <Exercice exerciceID="IulA60jCEk84WMVnwzNq" callback={setDisplayExercice} />
                :
                    null
            }
        </div>
    )
}

export default Workout;
