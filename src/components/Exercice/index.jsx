import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import './exercice.css';
import { FirebaseContext } from '../Firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Exercice = () => {
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, exerciceID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, exerciceID: null};
    const firebase = useContext(FirebaseContext);
    const [exerciceData, setExerciceData] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [trainingsHistory, setTrainingsHistory] = useState([]);
    const [lastTraining, setLastTraining] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmInput, setConfirmInput] = useState("");
    const [errMsg, setErrMsg] = useState("");


    useEffect(() => {
        if(userID === null) {navigate('/login'); return};
        if(exerciceID === null){navigate('/exercice-menu'); return};

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
            console.log(newTrainingsHistory);
            newTrainingsHistory.sort(compareTrainings);
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

    const format = (date) => {
        return moment(date, 'MMMM Do YYYY hh:mm a').format('YYYY-MM-DD');
    }

    const compareTrainings = (training1, training2) => {
        if(moment(format(training1.date)).isBefore(format(training2.date))) return 1;
        if(moment(format(training1.date)).isAfter(format(training2.date))) return -1;
        return 0;
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
            //console.log(moment((results[0].data().date)).isBefore(results[1].data().date));
            results.forEach(result => {
                if(last === null || moment(format(last.date)).isBefore(format(result.data().date))){
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

    const trainingsHistoryDisplay = !confirmDelete && showHistory && (
        trainingsHistory.length > 0 ?
            <div className='window-sport basicText md:w-1/2 w-[90%]'>
                <span className='title'>Historique</span>
                {
                    trainingsHistory.map((training, i) => {
                        console.log(trainingsHistory);
                        return (
                            <div className='flex flex-col justify-center items-start my-2 w-[95%]' key={"training_" + i}>
                                Entrainement du {training.date} :<br/>
                                {
                                    Object.entries(returnOrderedTraining(training)).map(([key, value]) => {
                                        if(key === "exerciceID" || key === "date" || key === "Commentaire") return null;
                                        return <div key={key}>{key} : {value}</div>
                                    })
                                }
                                <div key="Commentaire">Commentaire : {training.Commentaire}</div>
                            </div>
                        )
                    })
                }
                <div className='btn-primary' onClick={() => setShowHistory(false)}>Fermer</div>
            </div>
        :
            <div className='window-sport basicText w-1/3'>
                <span className='title'>Historique</span>
                <span className='my-5'>Vous n'avez encore enregistré aucun entraînement</span>
                <button className='btn-primary' onClick={() => setShowHistory(false)}>Fermer</button>
            </div>
    )

    const lastTrainingDisplay = lastTraining !== null && (
        <div className='my-4 basicText'>
            Dernier entrainement ({lastTraining.date}) :<br/>
            {
                Object.entries(lastTraining).map(([key, value]) => {
                    if(key === "exerciceID" || key === "date" || key === "Commentaire") return null;
                    return <div key={key}>{key} : {value}</div>
                })
            }
            <div key="Commentaire">Commentaire : {lastTraining["Commentaire"]}</div>
        </div>
    )

    const deleteExercice = () => {
        console.log("Exercice ID : " + exerciceID);
        
        if(confirmInput === exerciceData.title){
            firebase.exercice(exerciceID).delete()
            .then(async () => {
                console.log(`Exercice (${exerciceID}) correctement supprimé !`);

                firebase.exerciceTrainings(exerciceID).get()
                .then(trainings => {
                    trainings.forEach(training => {
                        firebase.training(training.id).delete()
                        .then(() => console.log(`Entrainement (${training.id}) de l'exercice (${exerciceID}) supprimé !`))
                        .catch((err) => setErrMsg("Erreur lors de la suppression de l'entrainement : " + err));
                    })
                })
                .catch(err => setErrMsg("Erreur lors de la récupération des exercices : " + err));

                navigate('/exercice-menu', {state: {userID}});
            })
            .catch((err) => setErrMsg("Erreur lors de la suppression de l'exercice : " + err));
        }else{
            setErrMsg("Vous n'avez pas correctement entré le titre de l'exercice !");
        }
    }

    const confirmDeleteWindow = confirmDelete && (
        <div className="window-sport basicText md:w-1/2 w-[90%]">
            <span className='title my-5'>Supprimer Exercice</span>
            <span className='basicText text-red-600'>{errMsg}</span>
            <div className='flex flex-col justify-center items-start w-full'>
                <label htmlFor='delete-exercice'>Entrez le titre de l'exercice pour confirmer :</label>
                <input className='input' id="delete-exercice" value={confirmInput} onChange={(e) => setConfirmInput(e.target.value)} placeholder={exerciceData.title} ></input>
            </div>
            <div className='flex flex-row justify-around items-center w-full'>
                <div className='btn-primary' onClick={() => deleteExercice()} >Supprimer</div>
                <div className='btn-primary' onClick={() => setConfirmDelete(false)} >Annuler</div>
            </div>
        </div>
    )

    const deleteBtn = (
        <div className='btn-primary' onClick={() => setConfirmDelete(true)}>
            Supprimer
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

    const exerciceDisplay = exerciceData !== null && !showHistory && !confirmDelete && (
        <div className='window-sport w-3/4 md:w-1/2 basicText'>
            <span className='font-bold title' >{exerciceData.title}</span>
            <div className='flex flex-col justify-center items-start w-full my-8 font-bold basicText' >
                Description :<br/>
                {exerciceData.description}
            </div>
            <div className='flex flex-col justify-center items-start w-full'>
                {lastTrainingDisplay}
            </div>
            <div className='btn-primary' onClick={() => setShowHistory(true)} >Historique</div>
            <div className=' btn-container-col md:btn-container-row'>
                {deleteBtn}
                {addTrainingBtn}
                {updateBtn}
                {previousBtn}
            </div>
        </div> 
    )

    return (
        <div className='container-sport-raw h-screenMinusHeader flex flex-col justify-start items-center p-2'>
            {exerciceDisplay}
            {trainingsHistoryDisplay}
            {confirmDeleteWindow}
        </div>
    )
}

export default Exercice;
