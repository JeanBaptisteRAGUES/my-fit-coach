import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './exercice-update.css';

const ExerciceUpdate = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const {userID, exerciceID} = location.state;
    const navigate = useNavigate();
    const [newParam, setNewParam] = useState("");
    const [paramsList, setParamsList] = useState([["Commentaire", "textarea"]]); //[name, type]
    const [exerciceTitle, setExerciceTitle] = useState("Nouveau exercice");
    const [exerciceDescription, setExerciceDescription] = useState("");

    useEffect(() => {
        firebase.db.collection('exercices').doc(exerciceID).get()
        .then(myExercice => {
            let myExerciceData = myExercice.data();
            setExerciceTitle(myExerciceData.title);
            setExerciceDescription(myExerciceData.description);
            setParamsList(JSON.parse(myExerciceData.parameters));
        })
    }, []);

    const addParameter = (e) => {
        e.preventDefault();
        setParamsList([...paramsList, [newParam, "text"]]);
        setNewParam("");
    }

    const updateExercice = () => {
        firebase.db.collection('exercices').doc(exerciceID).update({
            title: exerciceTitle,
            description: exerciceDescription,
            parameters: JSON.stringify(paramsList)
        })
        .then(() => {
            navigate('/exercice', {state: location.state});
        });
    }

    const updateExerciceBtn = paramsList.length === 0 ?
        <button disabled>Enregistrer</button>
    :
        <button onClick={() => updateExercice()}>Enregistrer</button>

    const formAddParameterBtn = newParam === "" ?
        <button disabled>Ajouter</button>
    :
        <button>Ajouter</button>

    const previousBtn = (
        <Link to="/exercice" state={location.state}>
            Annuler
        </Link>
    )

    return (
        <div className='EU_newExerciceContainer'>
            <input onChange={(e) => setExerciceTitle(e.target.value)} value={exerciceTitle} type="text" id="exerciceTitle" autoComplete="off" required placeholder="Nom exercice"/>
            <div className="EU_paramsList">
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
            <label htmlFor="description">Description : </label>
            <textarea onChange={(e) => setExerciceDescription(e.target.value)} value={exerciceDescription} id="description" rows="4" cols="50">

            </textarea>
            {updateExerciceBtn}
            {previousBtn}
        </div>
    )
}

export default ExerciceUpdate;
