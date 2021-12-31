import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './exercice-form.css';

const ExerciceForm = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    const {userID} = location.state;
    const navigate = useNavigate();
    const [newParam, setNewParam] = useState("");
    const [paramsList, setParamsList] = useState([["Commentaire", "textarea"]]); //[name, type]
    const [exerciceTitle, setExerciceTitle] = useState("Nouveau exercice");
    const [exerciceDescription, setExerciceDescription] = useState("");

    const addParameter = (e) => {
        e.preventDefault();
        setParamsList([...paramsList, [newParam, "text"]]);
        setNewParam("");
    }

    const registerExercice = () => {
        let exerciceObject = {
            title: exerciceTitle,
            parameters: JSON.stringify(paramsList),
            description: exerciceDescription,
            userID: userID 
        }

        firebase.db.collection('exercices').add(exerciceObject)
        .then((res) => {
            const resID = res.id;

            navigate('/exercice', {state: {userID: userID, exerciceID: resID}});
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

    const previousBtn = (
        <Link to="/exercice-menu" state={location.state}>
            Retour
        </Link>
    )

    return (
        <div className='EF_newExerciceContainer'>
            <input onChange={(e) => setExerciceTitle(e.target.value)} value={exerciceTitle} type="text" id="exerciceTitle" autoComplete="off" required placeholder="Nom exercice"/>
            <div className="EF_paramsList">
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
            {registerExerciceBtn}
            {previousBtn}
        </div>
    )
}

export default ExerciceForm;
