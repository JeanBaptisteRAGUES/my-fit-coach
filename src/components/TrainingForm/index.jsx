import moment from 'moment';
import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
import { FirebaseContext } from '../Firebase';
import './training.css';


//callback function en props pour indiquer quand le formulaire doit se fermer

const TrainingForm = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, exerciceID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, exerciceID: null};
    const [title, setTitle] = useState("");
    const [parameters, setParameters] = useState([]);

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        if(exerciceID === null){navigate('/exercice-menu'); return};
    }, []);

    const setFormParameters = async (exid) => {
        console.log("Exercice ID : " + exerciceID);
        let exercice = await firebase.exercice(exid).get();
        let exerciceData = exercice.data();
        let exerciceParams = exerciceData.parameters;
        setTitle(exerciceData.title);
        setParameters(JSON.parse(exerciceParams));
    }

    const modifyParameterValue = (param, value) => {
        let mParam = parameters.find(testParam => testParam[0] === param);
        mParam[2] = value;
        let newParameters = JSON.parse(JSON.stringify(parameters));
        setParameters(newParameters);
    }

    const saveTraining = (e) => {
        e.preventDefault();
        const formatedDate = moment(Date.now()).format('MMMM Do YYYY hh:mm a');

        let trainingParams = {
            exerciceID: exerciceID,
            date:  formatedDate
        }

        for(let param of parameters){
            trainingParams[param[0]] = param[2];
        }

        firebase.db.collection('trainings').add(trainingParams)
        .then(async (res) => {
            const resID = res.id;
            console.log(`Entrainement (id: ${resID}) enregistré avec succès !`);
            navigate('/exercice', {state: {userID: userID, exerciceID: exerciceID}});
        });
    }

    const displayTrainingForm = parameters.length > 0 && (
        <form className='flex flex-col justify-center items-start my-4' onSubmit={(e) => saveTraining(e)}>
            {
                parameters.map(param => {
                    return (
                        <div key={param[0]}>
                            <label htmlFor={param[0]}>{param[0]} :</label><br/>
                            {
                                param[1] === "text" ?
                                    <input className='input' id={param[0]} value={param[2]} onChange={(e) => modifyParameterValue(param[0], e.target.value)}></input>
                                :
                                    <textarea className='input' id={param[0]} value={param[2]} onChange={(e) => modifyParameterValue(param[0], e.target.value)}></textarea>
        
                            }
                        </div>
                    )
                })
            }
            <button className='btn-primary self-center mt-2' >Enregistrer</button>
        </form>
    )

    if(parameters.length === 0) setFormParameters(exerciceID);

    return (
        <div className='container-sport-raw flex flex-col justify-start items-center py-5'>
            <div className='window-sport w-[90%] md:w-1/2 text-gray-700' >
                <span className='font-bold text-xl' >{title}</span>
                {displayTrainingForm}
                <Link className='btn-primary' to="/exercice" state={{userID, exerciceID}} >Retour</Link>
            </div>
        </div>
    )
}

export default TrainingForm;
