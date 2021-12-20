import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FirebaseContext} from '../Firebase';
import './workout.css';
import Exercice from './Exercice';
import ExerciceForm from './ExerciceForm';
import Training from './TrainingForm';

const Workout = () => {
    const firebase = useContext(FirebaseContext);

    return (
        <div className="W_workoutContainer">
            <h1>Workout</h1>
            <ExerciceForm/>
            <Training exerciceID="IulA60jCEk84WMVnwzNq" />
        </div>
    )
}

export default Workout;
