import moment from 'moment';
import React, { useContext, useState } from 'react';
import './training.css';
import { FirebaseContext } from '../../Firebase';

//callback function en props pour indiquer quand le formulaire doit se fermer

const Training = (props) => {
    const firebase = useContext(FirebaseContext);
    const [title, setTitle] = useState("");
    const [parameters, setParameters] = useState([]);

    const setFormParameters = async (exid) => {
        console.log("Props : " + JSON.stringify(props));
        console.log("Exercice ID : " + props.exerciceID);
        let exercice = await firebase.exercice(exid).get();
        let exerciceData = exercice.data();
        let exerciceParams = exerciceData.parameters;
        setTitle(exerciceData.title);
        setParameters(JSON.parse(exerciceParams));
    }

    const modifyParameterValue = (param, value) => {
        console.log("Parameter : " + param);
        console.log("Value : " + value);
        let mParam = parameters.find(testParam => testParam[0] === param);
        mParam[2] = value;
        console.log(mParam);
        console.log(parameters);
        let newParameters = JSON.parse(JSON.stringify(parameters));
        setParameters(newParameters);
    }

    const saveTraining = (e) => {
        e.preventDefault();
        const formatedDate = moment(Date.now()).format('DD MMM hh:mm a');

        let trainingParams = {
            exerciceID: props.exerciceID,
            date:  formatedDate
        }

        for(let param of parameters){
            trainingParams[param[0]] = param[2];
        }

        firebase.db.collection('trainings').add(trainingParams)
        .then(async (res) => {
            const resID = res.id;
            console.log(`Entrainement (id: ${resID}) enregistré avec succès !`);
        });
    }

    const displayTrainingForm = parameters.length > 0 && (
        <form onSubmit={(e) => saveTraining(e)}>
            {
                parameters.map(param => {
                    return (
                        <div key={param[0]}>
                            <label htmlFor={param[0]}>{param[0]}</label><br/>
                            {
                                param[1] === "text" ?
                                    <input id={param[0]} value={param[2]} onChange={(e) => modifyParameterValue(param[0], e.target.value)}></input>
                                :
                                    <textarea id={param[0]} value={param[2]} onChange={(e) => modifyParameterValue(param[0], e.target.value)}></textarea>
        
                            }
                        </div>
                    )
                })
            }
            <button>Enregistrer</button>
        </form>
    )

    if(parameters.length === 0) setFormParameters(props.exerciceID);

    return (
        <div className='T_container'>
            {title}
            {displayTrainingForm}
        </div>
    )
}

export default Training;
