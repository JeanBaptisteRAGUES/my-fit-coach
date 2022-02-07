import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import Day from './day';
import NutritionalInfos from './nutritional-infos';
import EventForm from './event-form';
import NutrtitionalStats from './nutritional-stats';
import { RiAddCircleFill } from 'react-icons/ri';
import './schedule.css';

const Schedule = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID} = location.state !== null && location.state !== undefined ? location.state : {userID: null};
    const [daysArray, setDaysArray] = useState(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
    const hoursArray = [];
    const caseSize = 20;
    const scheduleStart = 6;
    const scheduleEnd = 22;
    const [eventsArray, setEventsArray] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [selectedEventMeal, setSelectedEventMeal] = useState([]);
    const [displayEventForm, setDisplayEventForm] = useState(false);
    const [displayStats, setDisplayStats] = useState('');

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
        if(eventsArray.length === 0) initEvents();
    }, []);

    const initHoursArray = () => {
        for(let h = scheduleStart; h <= scheduleEnd; h++){
            hoursArray.push(h);
        }
    }

    const getCurrentUser = async userID => {
        const currentUser = await firebase.user(userID).get();
        return currentUser;
    }

    const initEvents = () => {
        firebase.userEvents(userID).get()
        .then(myEvents => {
            const events = [];
            myEvents.forEach(myEvent => {
                const newEvent = myEvent.data();
                newEvent.id = myEvent.id;
                events.push(newEvent);
            })
            setEventsArray(events);
        })
        .catch(err => console.log("Erreur lors de la récupération des évènements de l'utilisateur : " + err));
    }

    initHoursArray();
    //if(eventsArray.length === 0) initEvents(); 

    const displayEvent = async (event) => {
        console.log(event);
        if(event["type"] === 1){
            let meal = await firebase.meal(event["refID"]).get();
            meal = meal.data();
            console.log(meal);
            setSelectedEventMeal([event, meal]);
        }
    }

    const displayStatsWindow = displayStats !== '' && (
        <NutrtitionalStats userID={userID} day={displayStats} eventsArray={eventsArray} displayStats={setDisplayStats} />
    )


    const displayEventMeal = selectedEventMeal.length > 0 && (
        <NutritionalInfos selectedEventMeal={selectedEventMeal} setSelectedEventMeal={setSelectedEventMeal} eventsArray={eventsArray} userID={userID} />
    )
    
    const eventFormBtnMobile = !displayEventForm && (
        <div className=' flexCenter w-full h-fit md:hidden'>
            <RiAddCircleFill className=' flexCenter cursor-pointer my-2 h-10 w-10 bg-white rounded-full font-extrabold text-sky-500' onClick={() => setDisplayEventForm(true)} />
        </div>
    )

    const eventFormBtnDesktop = (
        <div className='md:flexCenter w-full h-fit hidden'>
            <div className='btn-primary' onClick={() => setDisplayEventForm(true)}>Ajouter un évènement</div>
        </div>
    )

    //{ userID, eventsArray, setEventsArray, setDisplayEventForm}
    const scheduleForm = displayEventForm && (
        <EventForm userID={userID} eventsArray={eventsArray} setEventsArray={setEventsArray} setDisplayEventForm={setDisplayEventForm} />
    )

   

    const hoursDisplay = (
        <div className={`grid grid-cols-1 grid-rows-[repeat(${(hoursArray.length)*12},minmax(0,1fr))] h-[100%] w-[10%] md:w-[3%] box-border`}>
            {
                hoursArray.slice(0, hoursArray.length).map((h, i) => (
                    <div key={h} className={` relative flexCenter col-start-1 col-span-1 row-start-[${i*12 + 1}] row-[span_12_/_span_12]`}>
                        <div className=' flex flex-col justify-center items-end text-xs md:text-sm uhd:text-3xl absolute z-10 top-[45%] mr-[2px] w-full h-full'>{h}h</div>
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
        <div className='grid grid-cols-7 gap-0 h-[100%] w-[90%] md:w-[97%]'>
            {
                daysArray.map((myDay, i) => (
                    /*
                        <div className={` grid grid-cols-1 grid-rows-[repeat(288,minmax(0,1fr))] col-start-${i+1} col-span-1 border border-black`}>
                            <div className=' col-start-1 col-span-1 row-start-[131] row-[span_24_/_span_24] bg-green-500 w-full'></div>
                            <div className=' flexCenter col-start-1 col-span-1 row-start-[131] z-10 row-[span_24_/_span_24] text-ellipsis '>{myDay + ` (${i})`}</div>
                        </div>
                    */
                    myDay === dayDisplay ?
                        <Day 
                            dayName={myDay} 
                            dayIndex={i}
                            hoursArray={hoursArray} 
                            eventsArray={eventsArray}
                            scheduleStart={scheduleStart}
                            scheduleEnd={scheduleEnd} 
                            displayEvent={displayEvent}
                            displayStats={setDisplayStats}
                            hidden={false}
                        />
                    :
                        <Day 
                            dayName={myDay}
                            dayIndex={i}
                            hoursArray={hoursArray} 
                            eventsArray={eventsArray}
                            scheduleStart={scheduleStart}
                            scheduleEnd={scheduleEnd} 
                            displayEvent={displayEvent}
                            displayStats={setDisplayStats}
                            hidden={true}
                        />
                ))
            }
        </div>
    )

    const daysMenu = (
        <div className='flex flex-row justify-center items-end basicText h-[5%] w-full md:hidden'>
            {
                daysArray.map(myDay => (
                    myDay === dayDisplay ?
                        <div className=' flexCenter cursor-pointer h-[80%] w-[10%] border border-black bg-gray-200' onClick={() => setDayDisplay(myDay)} >{myDay.slice(0,1)}</div>
                    :
                        <div className=' flexCenter cursor-pointer h-[60%] w-[10%] border border-black bg-gray-200' onClick={() => setDayDisplay(myDay)}>{myDay.slice(0,1)}</div>
                ))
            }
        </div>
    )

    
    return (
        <div className='flexCenter relative w-full h-screenMinusHeader bg-slate-300'>
            <div className='flexCenter h-[90%] w-full px-2'>
                {daysMenu}
                <div className='flex flex-row justify-center items-center h-[95%] w-full'>
                    {hoursDisplay}
                    {daysDisplay}
                </div>
            </div>
            {displayEventMeal}
            {scheduleForm}
            {eventFormBtnMobile}
            {eventFormBtnDesktop}
            {displayStatsWindow}
        </div>
    )
}

export default Schedule;
