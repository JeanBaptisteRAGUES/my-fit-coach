import React, { useContext, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useState } from 'react/cjs/react.development';
import { FirebaseContext } from '../Firebase';

const NutrtitionalStats = ({day, eventsArray, displayStats}) => {
    const firebase = useContext(FirebaseContext);
    const [dailyNutriments, setDailyNutriments] = useState(null);
    const [weeklyNutriments, setWeeklyNutriments] = useState(null);
    const [displayOption, setDisplayOption] = useState('day');

    useEffect(async () => {
        console.log("ok");
        const newDailyNutriments = await getDailyNutriments(day);
        let newWeeklyNutriments = {
            energy: 0,
            fat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            proteins: 0,
            salt: 0
        };
        const weekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

        for(let weekDay of weekDays){
            let newDayNutriments = await getDailyNutriments(weekDay);
            newWeeklyNutriments = additionNutriments(newWeeklyNutriments, newDayNutriments);
        }

        newWeeklyNutriments = divideNutriments(newWeeklyNutriments, 7);

        console.log(newDailyNutriments);
        console.log(newWeeklyNutriments);
        setDailyNutriments(newDailyNutriments);
        setWeeklyNutriments(newWeeklyNutriments);

    }, [])

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

    const roundNutriments = (nut) => {
        nut["energy"] = Math.round(nut["energy"]);
        nut["fat"] = Math.round(nut["fat"]);
        nut["carbohydrates"] = Math.round(nut["carbohydrates"]);
        nut["sugars"] = Math.round(nut["sugars"]);
        nut["fiber"] = Math.round(nut["fiber"]);
        nut["proteins"] = Math.round(nut["proteins"]);
        nut["salt"] = Math.round(nut["salt"] * 1e2) / 1e2;
        return nut;
    }

    const divideNutriments = (nut, div) => {
        if(div === 0) div = 1;

        let nutRes = {
            energy: 0,
            fat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            proteins: 0,
            salt: 0
        };

        nutRes["energy"] = nut["energy"]/div;
        nutRes["fat"] = nut["fat"]/div;
        nutRes["carbohydrates"] = nut["carbohydrates"]/div;
        nutRes["sugars"] = nut["sugars"]/div;
        nutRes["fiber"] = nut["fiber"]/div;
        nutRes["proteins"] = nut["proteins"]/div;
        nutRes["salt"] = nut["salt"]/div;
        nutRes = roundNutriments(nutRes)

        return nutRes;
    }

    const getDailyNutriments = async (day) => {
        const dayEvents = eventsArray.filter(myEvent => { return (myEvent.day === day && myEvent.type === 1)});
        //console.log(dayEvents);
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
            //console.log(dayMealData);
            dailyNutriments = additionNutriments(dailyNutriments, JSON.parse(dayMealData["nutriments"]));
        }

        return dailyNutriments;
    }

    const loadingDisplay = (dailyNutriments === null || weeklyNutriments === null) && (
        <div className="flexStart w-2/3 my-4 p-1">
            <span className='title'>Loading..</span>
        </div>
    )

    const dayBtn = (
        displayOption === 'day' ?
            <div className=' flexCenter basicText cursor-pointer h-[80%] w-fit px-1 border border-slate-500 bg-gray-200' onClick={() => setDisplayOption('day')} >{day}</div>
        :
            <div className=' flexCenter basicText cursor-pointer h-[60%] w-fit px-1 border border-slate-500 bg-gray-200' onClick={() => setDisplayOption('day')}>{day}</div>
    )

    const weekBtn = (
        displayOption === 'week' ?
            <div className=' flexCenter basicText cursor-pointer h-[80%] w-fit px-1 border border-slate-500 bg-gray-200' onClick={() => setDisplayOption('week')} >Semaine</div>
        :
            <div className=' flexCenter basicText cursor-pointer h-[60%] w-fit px-1 border border-slate-500 bg-gray-200' onClick={() => setDisplayOption('week')}>Semaine</div>
    )

    const statsMenu = (
        <div className='flex flex-row justify-center items-end basicText h-[10%] w-full'>
            {dayBtn}
            {weekBtn}
        </div>
    )
    
    const dailyNutrimentsDisplay = dailyNutriments !== null && displayOption === 'day' && (
        <div className="flexStart w-2/3 my-4 border border-black rounded p-1">
            <span>Valeurs nutritionnelles ({day}) :</span> 
            <span className=" bg-energy px-1 w-full text-black uhd:py-2">Energie (kcal) : {dailyNutriments["energy"]}</span>
            <span className=" bg-fat px-1 w-full text-black uhd:py-2">Matières grasses (g) : {dailyNutriments["fat"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Glucides (g) : {dailyNutriments["carbohydrates"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Dont sucres (g) : {dailyNutriments["sugars"]}</span>
            <span className=" bg-fiber px-1 w-full text-black uhd:py-2">Fibres (g) : {dailyNutriments["fiber"]}</span>
            <span className=" bg-protein px-1 w-full text-black uhd:py-2">Protéines (g) : {dailyNutriments["proteins"]}</span>
            <span className=" bg-salt px-1 w-full text-black uhd:py-2">Sel (g) : {dailyNutriments["salt"]}</span>
        </div>
    )

    const weeklyNutrimentsDisplay = weeklyNutriments !== null && displayOption === 'week' && (
        <div className="flexStart w-2/3 my-4 border border-black rounded p-1">
            <span>Valeurs nutritionnelles semaine :</span> 
            <span className=" bg-energy px-1 w-full text-black uhd:py-2">Energie (kcal) : {weeklyNutriments["energy"]}</span>
            <span className=" bg-fat px-1 w-full text-black uhd:py-2">Matières grasses (g) : {weeklyNutriments["fat"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Glucides (g) : {weeklyNutriments["carbohydrates"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Dont sucres (g) : {weeklyNutriments["sugars"]}</span>
            <span className=" bg-fiber px-1 w-full text-black uhd:py-2">Fibres (g) : {weeklyNutriments["fiber"]}</span>
            <span className=" bg-protein px-1 w-full text-black uhd:py-2">Protéines (g) : {weeklyNutriments["proteins"]}</span>
            <span className=" bg-salt px-1 w-full text-black uhd:py-2">Sel (g) : {weeklyNutriments["salt"]}</span>
        </div>
    )

    const statsWindow = (
        <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4 h-[50vh] border border-black">
            <span className='title'>{day}</span>
            {statsMenu}
            {dailyNutrimentsDisplay}
            {weeklyNutrimentsDisplay}
            {loadingDisplay}
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {statsWindow}
            <div className='flexCenter fixed bottom-[10%] left-[45%] md:top-[10%] md:left-[10%] h-10 w-10 text-white rounded-full text-6xl cursor-pointer bg-slate-400'>
                <RiCloseLine onClick={() => displayStats('')}></RiCloseLine>
            </div>
        </div>
    )
};

export default NutrtitionalStats;
