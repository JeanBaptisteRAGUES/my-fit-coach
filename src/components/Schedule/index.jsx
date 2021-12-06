import React, { useContext, useEffect } from 'react';
import { useState } from 'react/cjs/react.development';
import {FirebaseContext} from '../Firebase';
import './schedule.css';

const Schedule = () => {
    const firebase = useContext(FirebaseContext);

    const [daysArray, setDaysArray] = useState(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDay, setNewEventDay] = useState('');
    const [newEventStart, setNewEventStart] = useState('');
    const [newEventEnd, setNewEventEnd] = useState('');
    const [newEventType, setNewEventType] = useState('');
    const hoursArray = [];
    const caseSize = 20;
    const scheduleStart = 6;
    const scheduleEnd = 22;
    const [eventsArray, setEventsArray] = useState([]);
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                if(eventsArray.length === 0) initEvents();
            }else{
                console.log("Deconnexion");
                setEventsArray([]);
            }
        });
    }, []);

    const initHoursArray = () => {
        for(let h = 6; h < 23; h++){
            hoursArray.push(h + 'h');
        }
    }

    const getEventData = async evtID => {
        const testEvent = await firebase.event(evtID).get();
        const eventData = testEvent.data();
        return eventData;
    }

    const getCurrentUser = async userID => {
        const currentUser = await firebase.user(userID).get();
        return currentUser;
    }

    const initEvents = () => {
        firebase.user(firebase.auth.currentUser.uid).get()
        .then(async user => {
            console.log(user.data());
            const eventsIDs = JSON.parse(user.data()["eventsIDs"]);
            console.log("Events IDs : " + eventsIDs);
            /*
            console.log("Base : " + eventsIDs2);
            const testParseArray = JSON.parse(eventsIDs2);
            console.log("Parse : " + testParseArray);
            */
            const events = [];

            for(let evtID of eventsIDs){
                const event1 =  await getEventData(evtID);
                events.push(event1);
            }
            
            console.log("Events : " + JSON.stringify(events));
            setEventsArray(events);
            
        })
    }

    initHoursArray();
    //if(eventsArray.length === 0) initEvents();

    const getEventTop = (event) => {
        return caseSize*(event['start'] - scheduleStart) + caseSize - 1;
    }

    const getEventHeight = (event) => {
        return caseSize*(event['end'] - event['start']) - 2;
    }

    const getEventClassname = (event) => {
        if(event["type"] === "0"){
            return "S_sportEvent";
        }else{
            return "S_mealEvent";
        }
    }

    const addEvent = (e) => {
        e.preventDefault();
        firebase.db.collection('events').add({
            day: newEventDay,
            start: newEventStart,
            end: newEventEnd,
            title: newEventTitle,
            type: newEventType
        })
        .then(async (newEvent) => {
            console.log("New Event ID : " + newEvent.id);
            
            let currentUser = await getCurrentUser(firebase.auth.currentUser.uid);
            console.log("Current User Data : " + JSON.stringify(currentUser.data()));
            let newEventsIDs = [...JSON.parse(currentUser.data()["eventsIDs"]), newEvent.id];
            console.log("New Events IDs" + JSON.stringify(newEventsIDs));
            
            firebase.db.collection('users').doc(firebase.auth.currentUser.uid).update(
                {
                    eventsIDs: JSON.stringify(newEventsIDs)
                }
            );
        })
        .then(() => {
            setEventsArray([...eventsArray, {day: newEventDay, start: newEventStart, end: newEventEnd, title: newEventTitle, type: newEventType}]);
        })
    }

    const formAddEventBtn = newEventDay === '' || newEventStart === '' || newEventEnd === '' || newEventTitle === '' || newEventType === '' ? 
            <button disabled className="signupBtn">Ajouter</button> 
        : 
            <button className="signupBtn">Ajouter</button>

    const scheduleDisplay = daysArray.length > 0 && (
        <div className="S_scheduleContainer">
            <div className="S_hours">
                {
                    hoursArray.map(hour => {
                        return <span key={hour} className="S_hour">{hour}</span>
                    })
                }
            </div>
            {
            daysArray.map((dayName, d) => {
                return (
                    <div key={d} className="S_daySchedule">
                        <span key={dayName} className="S_hourSchedule">{dayName}</span>
                        {
                            eventsArray.filter(e => e.day === dayName).map(eJour => {
                                return <span 
                                    key={dayName+eJour.title} 
                                    className={getEventClassname(eJour)} 
                                    style={{top: getEventTop(eJour), height: getEventHeight(eJour)}}
                                    >
                                        {eJour.title}
                                    </span>
                            })
                        }
                    </div>
                )
            })
            }
            <div className="S_formContainer">
                <form onSubmit={addEvent} className="loginForm">
                    <div className="inputBox">
                        <label htmlFor="title">Titre :</label><br/>
                        <input onChange={(e) => setNewEventTitle(e.target.value)} value={newEventTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1"/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="day">Jour :</label><br/>
                        <input onChange={(e) => setNewEventDay(e.target.value)} value={newEventDay} type="text" id="day" autoComplete="off" required placeholder="Jeudi"/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="start">Heure début :</label><br/>
                        <input onChange={(e) => setNewEventStart(e.target.value)} value={newEventStart} type="text" id="start" autoComplete="off" required placeholder="9"/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="end">Heure fin :</label><br/>
                        <input onChange={(e) => setNewEventEnd(e.target.value)} value={newEventEnd} type="text" id="end" autoComplete="off" required placeholder="11"/>
                    </div>
                    <div className="inputBox">
                        <label htmlFor="type">Type d'évènement :</label><br/>
                        <input onChange={(e) => setNewEventType(e.target.value)} value={newEventType} type="text" id="type" autoComplete="off" required placeholder="0"/>
                    </div>
                    {formAddEventBtn}
                </form>
            </div>
        </div>
    )

    /*
    const scheduleDisplay = schedule.length > 0 && (
        <div className="S_scheduleContainer">
            {
            schedule.map((daySchedule, d) => {
                return (
                    <div key={d} className="S_daySchedule">
                        <span key={daysArray[d]} className="S_hourSchedule">{daysArray[d]}</span>
                        {daySchedule.map((hour, h) => {
                            return (
                                <span 
                                    key={(d+1)*(h+1)} 
                                    className="S_hourSchedule"
                                    style={{height: "30px"}}
                                >
                                    {hour}
                                </span>
                                )
                        })}
                    </div>
                )
            })
            }
        </div>
    )
    */

    return (
        <div>
            Emploi du temps :
            {scheduleDisplay}
        </div>
    )
}

export default Schedule;
