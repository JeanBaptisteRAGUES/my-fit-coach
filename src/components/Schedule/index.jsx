import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import { Fragment } from 'react/cjs/react.production.min';
import {FirebaseContext} from '../Firebase';
import Day from './day';
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
    const [userMeals, setUserMeals] = useState([]);
    const [userSessions, setUserSessions] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState([]);
    const [selectedSession, setSelectedSession] = useState([]);
    const [selectedEventMeal, setSelectedEventMeal] = useState([]);

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
            const meals = JSON.parse(user.data()["mealsIDs"]);
            const sessions = JSON.parse(user.data()["sessionsIDs"]);
            console.log("Events IDs : " + eventsIDs);
            const events = [];

            for(let evtID of eventsIDs){
                const event1 =  await getEventData(evtID);
                events.push(event1);
            }
            
            console.log("Events : " + JSON.stringify(events));
            console.log("Meals : " + JSON.stringify(meals));
            console.log("Sessions : " + sessions);
            setEventsArray(events);
            setUserMeals(meals)
            setUserSessions(sessions);
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

    const additionNutriments = (nut1, nut2) => {
        let nutSum = {
            energy: 0,
            fat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            proteins: 0,
            salt: 0
        };
        nutSum["energy"] = nut1["energy"] + nut2["energy"];
        nutSum["fat"] = nut1["fat"] + nut2["fat"];
        nutSum["carbohydrates"] = nut1["carbohydrates"] + nut2["carbohydrates"];
        nutSum["sugars"] = nut1["sugars"] + nut2["sugars"];
        nutSum["fiber"] = nut1["fiber"] + nut2["fiber"];
        nutSum["proteins"] = nut1["proteins"] + nut2["proteins"];
        nutSum["salt"] = nut1["salt"] + nut2["salt"];
        return nutSum;
    }

    const getDailyNutriments = async (day) => {
        const dayEvents = eventsArray.filter(myEvent => { return myEvent["day"] === day});
        console.log(dayEvents);
        let dailyNutriments = {
            energy: 0,
            fat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            proteins: 0,
            salt: 0
        }

        for(let dayEvent of dayEvents){
            let dayMeal = await firebase.meal(dayEvent["refID"]).get();
            let dayMealData = dayMeal.data();
            console.log(dayMealData);
            dailyNutriments = additionNutriments(dailyNutriments, JSON.parse(dayMealData["nutriments"]));
        }

        console.log(dailyNutriments);
    }

    const addEvent = (e) => {
        e.preventDefault();
        const newEventRefID = newEventType === 0 ? selectedMeal[0] : selectedSession[0];
        firebase.db.collection('events').add({
            refID: newEventRefID,
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
            setEventsArray([...eventsArray, {refID: newEventRefID, day: newEventDay, start: newEventStart, end: newEventEnd, title: newEventTitle, type: newEventType}]);
        })
    }

    const formAddEventBtn = newEventDay === '' || newEventStart === '' || newEventEnd === '' || newEventTitle === '' || newEventType === '' ? 
            <button disabled className="signupBtn">Ajouter</button> 
        : 
            <button className="signupBtn">Ajouter</button>

    const mealsOptions = (
        <optgroup label="Nutrition">
            {
                userMeals.map(meal => {
                    return <option key={meal[0]} value={JSON.stringify([...meal, 0])}>{meal[1]}</option>
                })
            }
        </optgroup>
    )

    const sessionsOptions = (
        <optgroup label="Sport">
            {
                userSessions.map(session => {
                    return <option key={session[0]} value={[...session, 1]}>{session[1]}</option>
                })
            }
        </optgroup>
    )

    const onChangeEventSelection = e => {
        const eventSelected = JSON.parse(e.currentTarget.value);
        if(eventSelected[2] === 0){
            setSelectedMeal(eventSelected);
            setNewEventType(0);
        }else{
            setSelectedSession(eventSelected);
            setNewEventType(1);
        }
        setNewEventTitle(eventSelected[1]);
    }

    const shortTitle = (title, length) => {
        if(title.length > length){
            return (title.slice(0, length)).trim() + "..";
        }else{
            return title;
        }
    }

    const displayEvent = async (event) => {
        console.log(event);
        if(event["type"] === 0){
            let meal = await firebase.meal(event["refID"]).get();
            meal = meal.data();
            console.log(meal);
            setSelectedEventMeal([event, meal]);
        }
    }

    const displayEventMeal = selectedEventMeal.length > 0 && (
        <div className="S_displayEventMeal">
            <div className="S_titleBig">{selectedEventMeal[1].title}</div>
            <div className="S_titleMedium">{selectedEventMeal[0].day + " (" + selectedEventMeal[0].start + 'h - ' + selectedEventMeal[0].end + 'h)'}</div>
            {
                JSON.parse(selectedEventMeal[1]["foodstuffs"]).map(food => {
                    return  (
                                <div key={food[0]} className="N_foodDisplay">
                                    <div className="N_mealFood">-{food[1]} ({food[2]}g)</div>
                                </div>
                            )
                })
            }
            <div className="N_nutrimentsArray">
                <span>Valeurs nutritionnelles totales :</span> 
                <span className="N_energy">Energie (kcal) : {JSON.parse(selectedEventMeal[1]["nutriments"])["energy"]}</span>
                <span className="N_fat">Matières grasses (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["fat"]}</span>
                <span className="N_carbohydrates">Glucides (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["carbohydrates"]}</span>
                <span className="N_sugars">Dont sucres (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["sugars"]}</span>
                <span className="N_fiber">Fibres (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["fiber"]}</span>
                <span className="N_proteins">Protéines (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["proteins"]}</span>
                <span className="N_salt">Sel (g) : {JSON.parse(selectedEventMeal[1]["nutriments"])["salt"]}</span>
            </div>
            <Link to={"/nutrition/" + selectedEventMeal[0].refID}>Modifier</Link>
            <button onClick={() => setSelectedEventMeal([])}>Fermer</button>
        </div>
    )

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
                    //{dayName, eventsArray, getEventClassname, getEventTop, getEventHeight, displayEvent, shortTitle}
                    <Day 
                        dayName={dayName} 
                        eventsArray={eventsArray} 
                        getEventClassname={getEventClassname} 
                        getEventTop={getEventTop} 
                        getEventHeight={getEventHeight}
                        displayEvent={displayEvent}
                        shortTitle={shortTitle} 
                    />
                )
            })
            }
            <div className="S_formContainer">
                <form onSubmit={addEvent} className="loginForm">
                    <div className="inputBox">
                        <label htmlFor="title">Titre :</label><br/>
                        <input onChange={(e) => setNewEventTitle(e.target.value)} value={newEventTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1" maxLength="7"/>
                    </div>
                    <label htmlFor="eventSelect">Choisissez un évènement :</label><br/>
                    <select name="events" id="eventSelect" onChange={(e) => onChangeEventSelection(e)}>
                        <option value="">--Sélectionnez un évènement--</option>
                        {mealsOptions}
                        {sessionsOptions}
                    </select>
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
                    {formAddEventBtn}
                </form>
                <button onClick={() => getDailyNutriments(newEventDay)}>Test VN {newEventDay}</button>
            </div>
        </div>
    )

    /*
    return (
        <div className="S_mainContainer">
            Emploi du temps :
            {scheduleDisplay}
            {displayEventMeal}
        </div>
    )
    */
    return (
        <div className='flexCenter w-full h-screenMinusHeader bg-slate-300'>
            <Day 
                dayName={"Jeudi"} 
                eventsArray={eventsArray}
                scheduleStart={scheduleStart}
                scheduleEnd={scheduleEnd} 
                displayEvent={displayEvent}
            />
        </div>
    )
}

export default Schedule;
