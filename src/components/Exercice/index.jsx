import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import './exercice.css';
import { FirebaseContext } from '../Firebase';
import { Link, useLocation } from 'react-router-dom';

const Exercice = () => {
    const location = useLocation();
    const {userID, exerciceID} = location.state;
    const firebase = useContext(FirebaseContext);
    const [exerciceData, setExerciceData] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [trainingsHistory, setTrainingsHistory] = useState([]);
    const [lastTraining, setLastTraining] = useState(null);

    console.log("userID : " + userID);
    console.log("exerciceID : " + exerciceID);


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
        .then(() => {
            //console.log(newTrainingsHistory);
            setTrainingsHistory(newTrainingsHistory);
        })

    }, [showHistory])

    useEffect(() => {
        //console.log(trainingsHistory);
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
            setLastTraining(last);
        })
    }

    if(exerciceData === null) getExerciceData();
    if(lastTraining === null) getLastTraining();

    const returnOrderedTraining = (training) => {
        const orderedTraining = Object.keys(training).sort().reduce(
            (obj, key) => { 
            obj[key] = training[key]; 
            return obj;
            }, 
            {}
        );

        return orderedTraining;
    }

    const trainingsHistoryDisplay = showHistory && (
        trainingsHistory.length > 0 ?
            <div className='window-sport text-gray-700'>
                Historique :
                {
                    trainingsHistory.map((training, i) => {
                        return (
                            <div className='flex flex-col justify-center items-start my-2 w-72' key={"training_" + i}>
                                Entrainement du {training.date} :<br/>
                                {
                                    Object.entries(returnOrderedTraining(training)).map(([key, value]) => {
                                        if(key === "exerciceID" || key === "date") return null;
                                        return <div key={key}>{key} : {value}</div>
                                    })
                                }
                            </div>
                        )
                    })
                }
                <div className='btn-primary' onClick={() => setShowHistory(false)}>Fermer</div>
            </div>
        :
            <div className='E_trainingsHistory'>
                Historique :<br/>
                Vous n'avez encore enregistré aucun entraînement
                <button onClick={() => setShowHistory(false)}>Fermer</button>
            </div>
    )

    const lastTrainingDisplay = lastTraining !== null && (
        <div className='my-4 basicText'>
            Dernier entrainement ({lastTraining.date}) :<br/>
            {
                Object.entries(lastTraining).map(([key, value]) => {
                    if(key === "exerciceID" || key === "date") return null;
                    return <div key={key}>{key} : {value}</div>
                })
            }
        </div>
    )

    const addTrainingBtn = (
        <Link className='btn-primary' to="/training-form" state={location.state}>
            Ajouter un entraînement
        </Link>
    )

    const updateBtn = (
        <Link className='btn-primary' to="/exercice-update" state={location.state}>
            Modifier
        </Link>
    )

    const previousBtn = (
        <Link className='btn-primary' to="/exercice-menu" state={location.state}>
            Retour
        </Link>
    )

    const exerciceDisplay = exerciceData !== null && !showHistory && (
        <div className='window-sport w-2/3 md:w-1/2'>
            <span className='font-bold title' >{exerciceData.title}</span>
            <div className='flex flex-col justify-center items-start w-full my-8 font-bold basicText' >
                Description :<br/>
                {exerciceData.description}
            </div>
            <div className='flex flex-col justify-center items-start w-full'>
                {lastTrainingDisplay}
            </div>
            <div className='btn-primary' onClick={() => setShowHistory(true)} >Historique</div>
            <div className='btn-container-row'>
                {addTrainingBtn}
                {updateBtn}
                {previousBtn}
            </div>
        </div> 
    )

    return (
        <div className='container-sport'>
            {exerciceDisplay}
            {trainingsHistoryDisplay}
        </div>
    )
}

export default Exercice;
