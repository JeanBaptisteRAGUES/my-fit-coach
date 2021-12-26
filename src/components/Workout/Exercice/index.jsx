import moment from 'moment';
import React, { useContext, useEffect } from 'react';
import './exercice.css';
import { FirebaseContext } from '../../Firebase';
import { useState } from 'react/cjs/react.development';
import { Fragment } from 'react/cjs/react.production.min';

const Exercice = ({exerciceID, callback}) => {
    const firebase = useContext(FirebaseContext);
    const [exerciceData, setExerciceData] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [trainingsHistory, setTrainingsHistory] = useState([]);
    const [lastTraining, setLastTraining] = useState(null);

    useEffect(() => {
        if(!showHistory){
            setTrainingsHistory([]);
            return null;
        }

        let newTrainingsHistory = [];

        firebase.db.collection('trainings').where("exerciceID", "==", exerciceID).get()
        .then((results) => {
            results.forEach(result => {
                newTrainingsHistory.push(result.data());
            })
        })
        .then(async () => {
            //console.log(newTrainingsHistory);
            setTrainingsHistory(newTrainingsHistory);
        })

    }, [showHistory])

    useEffect(() => {
        console.log(trainingsHistory);
    }, [trainingsHistory])

    const getExerciceData = async () => {
        let exerciceQuery = await firebase.exercice(exerciceID).get();
        setExerciceData(exerciceQuery.data());
    }

    const getLastTraining = () => {
        let last = null;

        firebase.db.collection('trainings')
        .where("exerciceID", "==", exerciceID)
        .get()
        .then((results) => {
            //Parmis les résultats, on récupère le plus récent
            //Utiliser orderBy("date") et limit(1) dans la requête demanderait de créer des index sur le firestore
            //Or ici, les 'key' d'un entrainement sont variables -> impossible ou très compliqué
            results.forEach(result => {
                if(last === null || last.date < result.data().date){
                    last = result.data();
                }
            })
        })
        .then(() => {
            console.log(last);
            setLastTraining(last);
        })
    }

    if(exerciceData === null) getExerciceData();
    if(lastTraining === null) getLastTraining();

    const trainingsHistoryDisplay = trainingsHistory.length > 0 && (
        <div className='E_trainingsHistory'>
            Historique :
            {
                trainingsHistory.map((training, i) => {
                    return (
                        <div className='E_training' key={"training_" + i}>
                            Entrainement du {training.date} :<br/>
                            {
                                Object.entries(training).map(([key, value]) => {
                                    if(key === "exerciceID" || key === "date") return null;
                                    return <div key={key}>{key} : {value}</div>
                                })
                            }
                        </div>
                    )
                })
            }
            <button onClick={() => setShowHistory(false)}>Fermer</button>
        </div>
    )

    const lastTrainingDisplay = lastTraining !== null && (
        <div className='E_lastTrainingData'>
            {
                Object.entries(lastTraining).map(([key, value]) => {
                    if(key === "exerciceID" || key === "date") return null;
                    return <div key={key}>{key} : {value}</div>
                })
            }
        </div>
    )

    const exerciceDisplay = exerciceData !== null && lastTraining !== null && !showHistory && (
        <div className='E_exerciceDisplay'>
            <h1>{exerciceData.title}</h1>
            Description :<br/>
            {exerciceData.description}
            <br/>
            Dernier entrainement ({lastTraining.date}) :<br/>
            {lastTrainingDisplay}
            <button onClick={() => setShowHistory(true)} >Historique</button>
            <button onClick={() => callback(2)} >Fermer</button>
        </div> 
    )

    return (
        <div className='E_container'>
            {exerciceDisplay}
            {trainingsHistoryDisplay}
        </div>
    )
}

export default Exercice;
