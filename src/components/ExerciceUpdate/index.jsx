import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './exercice-update.css';

const ExerciceUpdate = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, exerciceID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, exerciceID: null};
    const [newParam, setNewParam] = useState("");
    const [paramsList, setParamsList] = useState([["Commentaire", "textarea"]]); //[name, type]
    const [exerciceTitle, setExerciceTitle] = useState("Nouveau exercice");
    const [exerciceDescription, setExerciceDescription] = useState("");

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        if(exerciceID === null){navigate('exercice-menu'); return};
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

    const deleteParameter = (paramName) => {
        let newParamsList = paramsList.filter(param => param[0] !== paramName);
        console.log(newParamsList);
        setParamsList(newParamsList);
    }

    const updateExerciceBtn = paramsList.length === 0 ?
        <div className='btn-primary opacity-50' disabled>Enregistrer</div>
    :
        <div className='btn-primary' onClick={() => updateExercice()}>Enregistrer</div>

    const formAddParameterBtn = newParam === "" ?
        <div className='btn-primary opacity-50 m-2'>Ajouter</div>
    :
        <button className='btn-primary m-2'>Ajouter</button>

    const previousBtn = (
        <Link className='btn-primary' to="/exercice" state={location.state}>
            Annuler
        </Link>
    )

    return (
        <div className='container-sport'>
            <div className='window-sport-start text-gray-700'>
                <input className='font-bold w-max self-center text-center bg-transparent text-xl' onChange={(e) => setExerciceTitle(e.target.value)} value={exerciceTitle} type="text" id="exerciceTitle" autoComplete="off" required placeholder="Nom exercice"/>
                <form className='my-4' onSubmit={addParameter}>
                    <label htmlFor="newParameter">Nouveau paramètre :</label><br/>
                    <div className='flex flex-row justify-center items-center' >
                        <input className='input' onChange={(e) => setNewParam(e.target.value)} value={newParam} type="text" id="newParameter" autoComplete="off" required placeholder="Poids soulevé (en kg)"/>
                        {formAddParameterBtn}
                    </div>
                </form>
                <div className="flex flex-col justify-center items-start my-2">
                    Paramètres : <br/>
                    {
                        paramsList.map((param, i) => (
                            <div className='flex flex-row justify-center items-center'>
                                <div key={i}>-{param[0]}</div>
                                {
                                    param[0] !== "Commentaire" ?
                                        <div className='btn-delete' onClick={() => deleteParameter(param[0])}> X</div>
                                    :
                                        null
                                }
                            </div>
                        ))
                    }
                </div>
                <div className='my-4'>
                    <label htmlFor="description">Description : </label>
                    <textarea className='input' onChange={(e) => setExerciceDescription(e.target.value)} value={exerciceDescription} id="description" rows="4" cols="50">

                    </textarea>
                </div>
                <div className='btn-container-row'>
                    {updateExerciceBtn}
                    {previousBtn}
                </div>
            </div>
        </div>
    )
}

export default ExerciceUpdate;
