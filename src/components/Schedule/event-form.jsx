import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { RiCloseLine } from 'react-icons/ri';
import './schedule.css';

const EventForm = ({ userID, eventsArray, setEventsArray, setDisplayEventForm}) => {
    const firebase = useContext(FirebaseContext);
    const [userMeals, setUserMeals] = useState([]);
    const [userSessions, setUserSessions] = useState([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDay, setNewEventDay] = useState('');
    const [newEventStart, setNewEventStart] = useState('');
    const [newEventEnd, setNewEventEnd] = useState('');
    const [newEventType, setNewEventType] = useState('');
    const [newEventRefID, setNewEventRefID] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const formAddEventBtn = newEventDay === '' || newEventStart === '' || newEventEnd === '' || newEventTitle === '' || newEventType === '' ? 
            <button className="btn-primary opacity-50">Ajouter</button> 
        : 
            <button className="btn-primary">Ajouter</button>

    const mealsOptions = (
        <optgroup label="Nutrition">
            {
                userMeals.map(meal => {
                    return <option key={meal[0]} value={JSON.stringify([meal[0], meal[1], 1])}>{meal[1]}</option>
                })
            }
        </optgroup>
    )

    const sessionsOptions = (
        <optgroup label="Sport">
            {
                userSessions.map(session => {
                    return <option key={session[0]} value={JSON.stringify([session[0], session[1], 0])}>{session[1]}</option>
                })
            }
        </optgroup>
    )

    useEffect(() => {
        console.log("Bonjour");
        firebase.userMeals(userID).get()
        .then(meals => {
            const newMeals = [];

            meals.forEach(meal => {
                newMeals.push([meal.id, meal.data()["title"]]);
            })

            setUserMeals(newMeals);
        })
        .catch((err) => {
            console.log("Erreur obtention repas utilisateur : " + err);
        })

        firebase.userSessions(userID).get()
        .then(sessions => {
            const newSessions = [];

            sessions.forEach(session => {
                newSessions.push([session.id, session.data()["title"]])
            })

            setUserSessions(newSessions);
        })
        .catch(err => {
            console.log("Erreur obtention sessions utilisateur : " + err);
        })

    }, []);

    const getTimeDiff = (t1, t2) => {
        let [h1, m1] = t1.split(':');
        let [h2, m2] = t2.split(':');

        return (h2-h1)*60 + (m2-m1);
    }

    const handleSubmit = (e, newEvent) => {
        e.preventDefault();
        console.log(newEvent);
        let eventDuration = getTimeDiff(newEvent.start, newEvent.end);
        if(eventDuration < 5){
            console.log("Ajout impossible, évènement trop court : " + eventDuration);
            setErrorMsg(`Impossible d'ajouter une plage horaire inférieure à 5 minutes !`);
        }else{
            console.log("Ajout de l'évènement possible : " + eventDuration);
            setErrorMsg('');
            addEvent(newEvent);
        }
    }

    const addEvent = (newEvent) => {
        firebase.db.collection('events').add(newEvent)
        .then(() => {
            setEventsArray([...eventsArray, newEvent]);
        })
    }  

    const errorMsgDisplay = errorMsg !== "" && (
        <span className=' flexCenter text-center basicText text-red-600 font-bold'>{errorMsg}</span>
    )

    const onChangeEventSelection = e => {
        const eventSelected = JSON.parse(e.currentTarget.value);
        console.log(eventSelected);
        setNewEventRefID(eventSelected[0]);
        setNewEventTitle(eventSelected[1]);
        setNewEventType(eventSelected[2]);
    }

    const daySelect = (
        <select className='input' name="days" id="daySelect" onChange={(e) => setNewEventDay(e.target.value)}>
            <option value="">--Sélectionnez un jour de la semaine</option>
            <option value="Lundi">Lundi</option>
            <option value="Mardi">Mardi</option>
            <option value="Mercredi">Mercredi</option>
            <option value="Jeudi">Jeudi</option>
            <option value="Vendredi">Vendredi</option>
            <option value="Samedi">Samedi</option>
            <option value="Dimanche">Dimanche</option>
        </select>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 basicText w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4 md:w-1/3">
                {errorMsgDisplay}
                <form onSubmit={(e) => handleSubmit(e, {userID, refID: newEventRefID, title: newEventTitle, day: newEventDay, start: newEventStart, end: newEventEnd, type: newEventType})} className="flexCenter">
                    <div className='flexStart'>
                        <div className="inputBox">
                            <label htmlFor="title">Titre :</label><br/>
                            <input className='input' onChange={(e) => setNewEventTitle(e.target.value)} value={newEventTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1" maxLength="7"/>
                        </div>
                        <div>
                            <label htmlFor="eventSelect">Choisissez un évènement :</label><br/>
                            <select className='input' name="events" id="eventSelect" onChange={(e) => onChangeEventSelection(e)}>
                                <option value="">--Sélectionnez un évènement--</option>
                                {mealsOptions}
                                {sessionsOptions}
                            </select>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="daySelect">Jour :</label><br/>
                            {daySelect}
                        </div>
                        <div className="inputBox">
                            <label htmlFor="start">Heure début :</label><br/>
                            <input className='input' onChange={(e) => setNewEventStart(e.target.value)} value={newEventStart} type="time" id="start" autoComplete="off" required placeholder="9"/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="end">Heure fin :</label><br/>
                            <input className='input' onChange={(e) => setNewEventEnd(e.target.value)} value={newEventEnd} type="time" id="end" autoComplete="off" required placeholder="11"/>
                        </div>
                    </div>
                    {formAddEventBtn}
                </form>
            </div>
            <div className='flexCenter fixed bottom-[10%] left-[45%] md:top-[10%] md:left-[10%] h-10 w-10 text-white rounded-full text-6xl cursor-pointer bg-slate-400'>
                <RiCloseLine onClick={() => setDisplayEventForm(false)}></RiCloseLine>
            </div>
        </div>
    )
};

export default EventForm;
