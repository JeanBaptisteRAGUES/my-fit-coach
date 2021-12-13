import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {FirebaseContext} from '../Firebase';
import './workout.css';

const Workout = () => {
    const firebase = useContext(FirebaseContext);
    const [newParam, setNewParam] = useState("");
    const [paramsList, setParamsList] = useState([["Commentaire", "textarea"]]); //[name, type]
    const [exerciceTitle, setExerciceTitle] = useState("Nouveau exercice");

    const addParameter = (e) => {
        e.preventDefault();
        setParamsList([...paramsList, [newParam, "text"]]);
        setNewParam("");
    }

    const registerExercice = () => {
        let exerciceParams = {
            title: exerciceTitle,
            parameters: JSON.stringify(paramsList) 
        }

        for(let param of paramsList){
            exerciceParams[param[0]] = 0;
        }

        firebase.db.collection('exercices').add(exerciceParams)
        .then(async (res) => {
            const resID = res.id;
            /*
            const currentUser = await firebase.user(firebase.auth.currentUser.uid).get();
            console.log(currentUser.data());
            let newMealsIDs = [...JSON.parse(currentUser.data()["mealsIDs"]), [resID, meal[0]]];
            console.log(newMealsIDs);
            firebase.db.collection('users').doc(firebase.auth.currentUser.uid).update(
                {
                    mealsIDs: JSON.stringify(newMealsIDs)
                }
            );
            */
        })
        .then(() => {
            setParamsList([]);
            setExerciceTitle('Nouveau Exercice');
            setNewParam("");
        })
    }

    const registerExerciceBtn = paramsList.length === 0 ?
        <button disabled>Enregistrer</button>
    :
        <button onClick={() => registerExercice()}>Enregistrer</button>

    const formAddParameterBtn = newParam === "" ?
        <button disabled>Ajouter</button>
    :
        <button>Ajouter</button>

    return (
        <div className="W_workoutContainer">
            <h1>Workout</h1>
            <div className='W_newExerciceContainer'>
                <input onChange={(e) => setExerciceTitle(e.target.value)} value={exerciceTitle} type="text" id="exerciceTitle" autoComplete="off" required placeholder="Nom exercice"/>
                <div className="W_paramsList">
                    {
                        paramsList.map((param, i) => {
                            return <div key={i}>-{param[0]}</div>
                        })
                    }
                </div>
                <form onSubmit={addParameter}>
                    <div>
                        <label htmlFor="newParameter">Nouveau paramètre :</label><br/>
                        <input onChange={(e) => setNewParam(e.target.value)} value={newParam} type="text" id="newParameter" autoComplete="off" required placeholder="Poids soulevé (en kg)"/>
                    </div>
                    {formAddParameterBtn}
                </form>
                {registerExerciceBtn}
            </div>
        </div>
    )
}

export default Workout;
