import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './exercice-form.css';

const ExerciceForm = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [newParam, setNewParam] = useState("");
    const [paramsList, setParamsList] = useState([["Commentaire", "textarea"]]); //[name, type]
    const [exerciceTitle, setExerciceTitle] = useState("Titre");
    const [exerciceDescription, setExerciceDescription] = useState("");

    useEffect(() => {
        if(userID === null) {navigate('/login'); return};
    }, [])

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

    const deleteParameter = (paramName) => {
        let newParamsList = paramsList.filter(param => param[0] !== paramName);
        console.log(newParamsList);
        setParamsList(newParamsList);
    }

    const registerExerciceBtn = paramsList.length === 0 ?
        <div className='btn-primary opacity-50'>Enregistrer</div>
    :
        <div className='btn-primary' onClick={() => registerExercice()}>Enregistrer</div>

    const formAddParameterBtn = newParam === "" ?
        <div className='btn-primary opacity-50 m-2'>Ajouter</div>
    :
        <button className='btn-primary m-2'>Ajouter</button>

    const previousBtn = (
        <Link className='btn-primary' to="/exercice-menu" state={location.state}>
            Annuler
        </Link>
    )

    return (
        <div className='container-sport-raw flex flex-col justify-start items-center py-5'>
            <div className='window-sport-start w-[90%] md:w-1/2 text-gray-700'>
                <input className='font-bold w-full self-center text-center bg-transparent text-xl' onChange={(e) => setExerciceTitle(e.target.value)} value={exerciceTitle} type="text" id="exerciceTitle" autoComplete="off" required placeholder="Nom exercice"/>
                <form className='my-4' onSubmit={addParameter}>
                    <label htmlFor="newParameter">Nouveau param??tre :</label><br/>
                    <div className='flex flex-row justify-center items-center' >
                        <input className='input' onChange={(e) => setNewParam(e.target.value)} value={newParam} type="text" id="newParameter" autoComplete="off" required placeholder="Poids soulev?? (en kg)"/>
                        {formAddParameterBtn}
                    </div>
                </form>
                <div className="flex flex-col justify-center items-start my-2">
                    Param??tres : <br/>
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
                <div className='my-4 w-full'>
                    <label htmlFor="description">Description : </label>
                    <textarea className='input' onChange={(e) => setExerciceDescription(e.target.value)} value={exerciceDescription} id="description" rows="4" cols="50">

                    </textarea>
                </div>
                <div className='btn-container-row'>
                    {registerExerciceBtn}
                    {previousBtn}
                </div>
            </div>
        </div>
    )
}

export default ExerciceForm;
