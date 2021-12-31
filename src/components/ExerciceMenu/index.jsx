import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './exercice-menu.css';

const ExerciceMenu = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const {userID} = location.state;
    const [exercices, setExercices] = useState([]);
    const [selectedExercice, setSelectedExercice] = useState('');

    useEffect(() => {
        if(exercices.length > 0)return null;

        let newExercices = [];

        firebase.db.collection('exercices').where("userID", "==", userID).get()
        .then((results) => {
            if(results.size === 0) {
                console.log("Aucun exercice n'a encore été enregistré")
                return null;
            }
            results.forEach(result => {
                let newExercice = result.data();
                newExercice.id = result.id;
                newExercices.push(newExercice);
            })
        })
        .then(() => {
            setExercices(newExercices);
        })

    }, [])

    useEffect(() => {
        console.log("Selected Exercice : " + selectedExercice);
    }, [selectedExercice])

    const loadExerciceBtn = (
        selectedExercice !== "" ?
            <Link to="/exercice" state={{userID: userID, exerciceID: selectedExercice}} >
                Charger
            </Link>
        :
            <span>Sélectionnez un exercice à charger</span>
    )

    const exercicesSelect = exercices.length > 0 ?
            <div className='EM_exerciceSelect'>
                <select name="exercices" id="exerciceSelect" onChange={(e) => setSelectedExercice(e.target.value)}>
                    <option value="">--Sélectionnez un exercice--</option>
                    {
                        exercices.map(exercice => (
                            <option key={exercice.id} value={exercice.id}>{exercice.title}</option>
                        ))
                    }
                </select>
                {loadExerciceBtn}
            </div>

        :

            <div className='EM_exerciceSelect'>
                Vous n'avez encore enregistré aucun exercice !
            </div>

    const loadExerciceFormBtn = (
        <Link to="/exercice-form" state={{userID: userID}}>
            Nouvel exercice
        </Link>
    )

    const menuBtn = (
        <Link to="/workout" state={{userID: userID}}>
            Retour
        </Link>
    )

    

    return (
        <div className='EM_container'>
            Bonjour utilisateur ({userID}) :<br/>
            {exercicesSelect}
            {loadExerciceFormBtn}
            {menuBtn}
        </div>
    )
}

export default ExerciceMenu;
