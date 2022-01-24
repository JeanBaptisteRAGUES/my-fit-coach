import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import Day from './day';
import NutritionalInfos from './nutritional-infos';
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
    const scheduleStart = 0;
    const scheduleEnd = 24;
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
        for(let h = scheduleStart; h <= scheduleEnd; h++){
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
            const events = [];

            for(let evtID of eventsIDs){
                const event1 =  await getEventData(evtID);
                events.push(event1);
            }
            
            setEventsArray(events);
            setUserMeals(meals)
            setUserSessions(sessions);
        })
    }

    initHoursArray();
    //if(eventsArray.length === 0) initEvents();

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
        <NutritionalInfos selectedEventMeal={selectedEventMeal} setSelectedEventMeal={setSelectedEventMeal} eventsArray={eventsArray} />
    )
    

    const scheduleForm = (
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
    )


    const calcHeight = () => {
        return Math.round(100/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const calcTop = (start) => {
        return Math.round(100*(start-(scheduleStart-1))/(scheduleEnd-(scheduleStart-1))) + "%";
    }

    const hoursDisplay = (
        <div className='flex flex-col justify-center items-center h-[90%] w-[10%] box-border'>
            {
                hoursArray.map(hour => (
                    <div key={hour} className=' basicText relative w-full box-border' style={{height: calcHeight()}}>
                        <div className=' flex flex-col justify-center items-end absolute h-full md:top-[50%] top-[65%] right-[0%] border border-slate-500 box-border w-full'>
                            {hour}
                        </div>
                    </div>
                ))
            }
        </div>
    )

    const test = (
        <div className='flexCenter h-[90%] w-[10%]'>
            <div className=' w-full h-[50%] bg-red-600 border-8 border-blue-500 box-border'></div>
            <div className=' w-full h-[50%] bg-green-600 border border-black box-border'></div>
        </div>
    )

    const [dayDisplay, setDayDisplay] = useState("Lundi");

    const daysDisplay = (
        <div className='flex flex-col md:flex-row justify-center items-center h-[90%] w-[90%] bg-green-200'>
            {
                daysArray.map(myDay => (
                    myDay === dayDisplay ?
                        <Day 
                            dayName={myDay} 
                            eventsArray={eventsArray}
                            scheduleStart={scheduleStart}
                            scheduleEnd={scheduleEnd} 
                            displayEvent={displayEvent}
                            hidden={false}
                        />
                    :
                        <Day 
                            dayName={myDay} 
                            eventsArray={eventsArray}
                            scheduleStart={scheduleStart}
                            scheduleEnd={scheduleEnd} 
                            displayEvent={displayEvent}
                            hidden={true}
                        />
                ))
            }
        </div>
    )

    const daysMenu = (
        <div className='flex flex-row justify-center items-end basicText h-[10%] w-full md:hidden bg-slate-500'>
            {
                daysArray.map(myDay => (
                    myDay === dayDisplay ?
                        <div className=' flexCenter cursor-pointer h-[40%] w-[10%] border border-black bg-gray-200' onClick={() => setDayDisplay(myDay)} >{myDay.slice(0,1)}</div>
                    :
                        <div className=' flexCenter cursor-pointer h-[30%] w-[10%] border border-black bg-gray-200' onClick={() => setDayDisplay(myDay)}>{myDay.slice(0,1)}</div>
                ))
            }
        </div>
    )

    /*
    return (
        <div className='flexCenter w-full h-screenMinusHeader bg-slate-300'>
            <div className='flexCenter h-[90%] w-full bg-white px-2'>
                {daysMenu}
                <div className='flex flex-row justify-center items-center h-[90%] w-full'>
                    {hoursDisplay}
                    {daysDisplay}
                </div>
            </div>
            {displayEventMeal}
        </div>
    )
    */

    return (
        <div className='flexCenter w-full h-screenMinusHeader bg-slate-300'>
            <div className=' grid grid-cols-7 gap-0 h-[90%] w-full bg-white px-2'>
                <div className=' col-start-1 col-span-1 border border-black'></div>
                <div className=' col-start-2 col-span-1 border border-black'></div>
                <div className={' grid grid-col-1 col-start-3 col-span-1 border border-black ' + `grid-rows-[repeat(${(scheduleEnd-scheduleStart)*60},minmax(0,1fr))]`}>
                    <div className={' col-start-1 col-span-1 bg-red-500 w-full ' + `row-start-[${11*60}] row-[span_${1*60}_/_span_${1*60}]`}></div>
                    <div className={' flexCenter col-start-1 col-span-1 z-10 text-ellipsis ' + `row-start-[${11*60}] row-[span_${1*60}_/_span_${1*60}]`}>Burgers</div>
                </div>
                <div className=' grid grid-col-1 grid-rows-[repeat(1440,minmax(0,1fr))] col-start-4 col-span-1 border border-black'>
                    <div className=' col-start-1 col-span-1 row-start-[660] row-[span_60_/_span_60] bg-green-500 w-full'></div>
                    <div className=' flexCenter col-start-1 col-span-1 row-start-[660] z-10 row-[span_60_/_span_60] text-ellipsis '>Frites</div>
                </div>
                <div className=' col-start-5 col-span-1 border border-black'></div>
                <div className=' col-start-6 col-span-1 border border-black'></div>
                <div className=' col-start-7 col-span-1 border border-black'></div>
            </div>
            {displayEventMeal}
        </div>
    )
}

export default Schedule;
