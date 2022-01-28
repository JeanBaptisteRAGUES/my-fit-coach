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

    const addEvent = (e, newEvent) => {
        e.preventDefault();
        console.log(newEvent);
        firebase.db.collection('events').add(newEvent)
        .then(() => {
            setEventsArray([...eventsArray, newEvent]);
        })
    }  

    const onChangeEventSelection = e => {
        const eventSelected = JSON.parse(e.currentTarget.value);
        console.log(eventSelected);
        setNewEventRefID(eventSelected[0]);
        setNewEventTitle(eventSelected[1]);
        setNewEventType(eventSelected[2]);
    }

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 basicText w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4 md:w-1/3">
                <form onSubmit={(e) => addEvent(e, {userID, refID: newEventRefID, title: newEventTitle, day: newEventDay, start: newEventStart, end: newEventEnd, type: newEventType})} className="flexCenter">
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
                            <label htmlFor="day">Jour :</label><br/>
                            <input className='input' onChange={(e) => setNewEventDay(e.target.value)} value={newEventDay} type="text" id="day" autoComplete="off" required placeholder="Jeudi"/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="start">Heure début :</label><br/>
                            <input className='input' onChange={(e) => setNewEventStart(e.target.value)} value={newEventStart} type="text" id="start" autoComplete="off" required placeholder="9"/>
                        </div>
                        <div className="inputBox">
                            <label htmlFor="end">Heure fin :</label><br/>
                            <input className='input' onChange={(e) => setNewEventEnd(e.target.value)} value={newEventEnd} type="text" id="end" autoComplete="off" required placeholder="11"/>
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
