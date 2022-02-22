import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import './exercice-menu.css';

const ExerciceMenu = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [exercices, setExercices] = useState([]);
    const [selectedExercice, setSelectedExercice] = useState('');

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        if(exercices.length > 0)return null;

        let newExercices = [];

        //firebase.db.collection('exercices').where("userID", "==", userID).get()
        firebase.userExercices(userID).get()
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
            <Link className='btn-primary' to="/exercice" state={{userID: userID, exerciceID: selectedExercice}} >
                Charger
            </Link>
        :
            <span>Sélectionnez un exercice à charger</span>
    )

    const exercicesSelect = exercices.length > 0 ?
            <div className='flex flex-col justify-center items-center mb-8 text-gray-700'>
                <select className='input' name="exercices" id="exerciceSelect" onChange={(e) => setSelectedExercice(e.target.value)}>
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
        <Link className='btn-primary' to="/exercice-form" state={{userID: userID}}>
            Nouvel exercice
        </Link>
    )

    const menuBtn = (
        <Link className='btn-primary' to="/workout" state={{userID: userID}}>
            Retour
        </Link>
    )

    

    return (
        <div className='container-sport'>
            <div className='window-sport md:w-1/3 w-[90%]'>
                {exercicesSelect}
                <div className='btn-container-row'>
                    {loadExerciceFormBtn}
                    {menuBtn}
                </div>
            </div>
        </div>
    )
}

export default ExerciceMenu;
