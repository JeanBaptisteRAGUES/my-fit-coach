import React, { useContext, useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { useState } from 'react/cjs/react.development';
import { FirebaseContext } from '../Firebase';

const NutrtitionalStats = ({day, eventsArray, displayStats}) => {
    const firebase = useContext(FirebaseContext);
    const [dailyNutriments, setDailyNutriments] = useState(null);
    const [weeklyNutriments, setWeeklyNutriments] = useState(null);
    const [displayOption, setDisplayOption] = useState('day');
    //Ensuite utiliser date de naissance
    const profileLose = {
        age: 28,
        height: 180,
        weight: 85,
        gender: "male",
        objective: "lose",
        nap: "moderate"
    }
    const profileMaintaining = {
        age: 28,
        height: 180,
        weight: 85,
        gender: "male",
        objective: "maintain",
        nap: "moderate"
    }
    const profileGain = {
        age: 28,
        height: 180,
        weight: 85,
        gender: "male",
        objective: "gain",
        nap: "moderate"
    }
    //const [mb, setMB] = useState(2000);
    //const [napFactor, setNAPFactor] = useState(1);
    const [needs, setNeeds] = useState(null);
    const [bej, setBEJ] = useState(2000);
    /*
    const [energyNeeds, setEnergyNeeds] = useState(0);
    const [fatNeeds, setFatNeeds] = useState(0);
    const [carbohydratesNeeds, setCarbohydratesNeeds] = useState(0);
    const [sugarNeeds, setSugarNeeds] = useState(0);
    const [fiberNeeds, setFiberNeeds] = useState(0);
    const [proteinsNeeds, setProteinsNeeds] = useState(0);
    const [saltNeeds, setSaltNeeds] = useState(0);
    */

    const calculateMB = (profile) => {
        if(profile.gender === "male"){
            return Math.round(13.707*profile.weight + 492.3*(profile.height/100) - 6.673*profile.age + 77.607);
        }else{
            return Math.round(9.740*profile.weight + 172.9*(profile.height/100) - 4.7373*profile.age + 667.051);
        }
    }

    const calculateBEJ = (profile) => {
        let mb = calculateMB(profile);
        
        switch (profile.nap) {
            case "sedentary":
                return mb*1.375;
            case "leight":
                return mb*1.56;
            case "moderate":
                return mb*1.64;
            case "high":
                return mb*1.82;
            default:
                console.log("Erreur, valeur NAP inconnue : " + profile.nap);
                break;
        }
    }

    const getEnergyScore = (profile, energy) => {
        let energyScore = {
            color: ``,
            message: ``
        }
        let energyNeeds = bej;
        if(profile.objective === `lose`) energyNeeds *= 0.9;
        if(profile.objective === `gain`) energyNeeds *= 1.1;
        energyNeeds = Math.round(energyNeeds);

        if(energy < energyNeeds*0.8){
            energyScore.color = `red`;
            energyScore.message = `Attention, votre apport calorique est BEAUCOUP trop bas ! Apport conseillé : ${energyNeeds} kcal`;
        }

        if(energy >= energyNeeds*0.8 && energy < energyNeeds*0.9){
            energyScore.color = `orange`;
            energyScore.message = `Attention, votre apport calorique est trop bas`;
        }

        if(energy >= energyNeeds*0.9 && energy < energyNeeds*0.95){
            energyScore.color = `yellow`;
            energyScore.message = `Attention, votre apport calorique est un peu trop bas`;
        }

        if(energy >= energyNeeds*0.95 && energy <= energyNeeds*1.05){
            energyScore.color = `green`;
            energyScore.message = `C'est bon ! Votre apport calorique est correct`;
        }

        if(energy > energyNeeds*1.05 && energy <= energyNeeds*1.1){
            energyScore.color = `yellow`;
            energyScore.message = `Attention, votre apport calorique est un peu trop haut`;
        }

        if(energy > energyNeeds*1.1 && energy <= energyNeeds*1.2){
            energyScore.color = `orange`;
            energyScore.message = `Attention, votre apport calorique est trop haut`;
        }

        if(energy > energyNeeds*1.2){
            energyScore.color = `red`;
            energyScore.message = `Attention, votre apport calorique est BEAUCOUP trop haut`;
        }

        return energyScore;
    }

    const getFatScore = (fat) => {
        let fatScore = {
            color: ``,
            message: ``
        }
        let fatNeeds = Math.round((bej/9)*0.3);

        if(fat < fatNeeds*0.8){
            fatScore.color = `red`;
            fatScore.message = `Attention, votre apport en lipides est BEAUCOUP trop bas ! Apport conseillé : ${fatNeeds} g`;
        }

        if(fat >= fatNeeds*0.8 && fat < fatNeeds*0.9){
            fatScore.color = `orange`;
            fatScore.message = `Attention, votre apport en lipides est trop bas. Apport conseillé : ${fatNeeds} g`;
        }

        if(fat >= fatNeeds*0.9 && fat < fatNeeds*0.95){
            fatScore.color = `yellow`;
            fatScore.message = `Attention, votre apport en lipides est un peu trop bas. Apport conseillé : ${fatNeeds} g`;
        }

        if(fat >= fatNeeds*0.95 && fat <= fatNeeds*1.05){
            fatScore.color = `green`;
            fatScore.message = `C'est bon ! Votre apport en lipides est correct.  Apport conseillé : ${fatNeeds} g`;
        }

        if(fat > fatNeeds*1.05 && fat <= fatNeeds*1.1){
            fatScore.color = `yellow`;
            fatScore.message = `Attention, votre apport en lipides est un peu trop haut. Apport conseillé : ${fatNeeds} g`;
        }

        if(fat > fatNeeds*1.1 && fat <= fatNeeds*1.2){
            fatScore.color = `orange`;
            fatScore.message = `Attention, votre apport en lipides est trop haut.  Apport conseillé : ${fatNeeds} g`;
        }

        if(fat > fatNeeds*1.2){
            fatScore.color = `red`;
            fatScore.message = `Attention, votre apport en lipides est BEAUCOUP trop haut ! Apport conseillé : ${fatNeeds} g`;
        }

        return fatScore;
    }

    const getCarbohydratesScore = (profile, carbohydrates) => {
        let carbohydratesScore = {
            color: ``,
            message: ``
        }
        let carbohydratesNeeds = (bej/4)*0.5;
        if(profile.objective === `lose`) carbohydratesNeeds = (bej/4)*0.4;
        if(profile.objective === `gain`) carbohydratesNeeds = (bej/4)*0.6;
        carbohydratesNeeds = Math.round(carbohydratesNeeds);

        if(carbohydrates < carbohydratesNeeds*0.8){
            carbohydratesScore.color = `red`;
            carbohydratesScore.message = `Attention, votre apport en glucides est BEAUCOUP trop bas ! Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates >= carbohydratesNeeds*0.8 && carbohydrates < carbohydratesNeeds*0.9){
            carbohydratesScore.color = `orange`;
            carbohydratesScore.message = `Attention, votre apport en glucides est trop bas. Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates >= carbohydratesNeeds*0.9 && carbohydrates < carbohydratesNeeds*0.95){
            carbohydratesScore.color = `yellow`;
            carbohydratesScore.message = `Attention, votre apport en glucides est un peu trop bas. Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates >= carbohydratesNeeds*0.95 && carbohydrates <= carbohydratesNeeds*1.05){
            carbohydratesScore.color = `green`;
            carbohydratesScore.message = `C'est bon ! Votre apport en glucides est correct. Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates > carbohydratesNeeds*1.05 && carbohydrates <= carbohydratesNeeds*1.1){
            carbohydratesScore.color = `yellow`;
            carbohydratesScore.message = `Attention, votre apport en glucides est un peu trop haut. Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates > carbohydratesNeeds*1.1 && carbohydrates <= carbohydratesNeeds*1.2){
            carbohydratesScore.color = `orange`;
            carbohydratesScore.message = `Attention, votre apport en glucides est trop haut. Apport conseillé : ${carbohydratesNeeds} g`;
        }

        if(carbohydrates > carbohydratesNeeds*1.2){
            carbohydratesScore.color = `red`;
            carbohydratesScore.message = `Attention, votre apport en glucides est BEAUCOUP trop haut ! Apport conseillé : ${carbohydratesNeeds} g`;
        }

        return carbohydratesScore;
    }

    const getSugarScore = (sugar) => {
        let sugarScore = {
            color: ``,
            message: ``
        }
        let sugarNeeds = Math.round((bej/4)*0.05);

        if(sugar <= sugarNeeds*1.05){
            sugarScore.color = `green`;
            sugarScore.message = `C'est bon ! Votre apport en sucre est correct. Apport conseillé : ${sugarNeeds} g`;
        }

        if(sugar > sugarNeeds*1.05 && sugar <= sugarNeeds*1.1){
            sugarScore.color = `yellow`;
            sugarScore.message = `Attention, votre apport en sucre est un peu trop haut. Apport conseillé : ${sugarNeeds} g`;
        }

        if(sugar > sugarNeeds*1.1 && sugar <= sugarNeeds*1.2){
            sugarScore.color = `orange`;
            sugarScore.message = `Attention, votre apport en sucre est trop haut. Apport conseillé : ${sugarNeeds} g`;
        }

        if(sugar > sugarNeeds*1.2){
            sugarScore.color = `red`;
            sugarScore.message = `Attention, votre apport en sucre est BEAUCOUP trop haut ! Apport conseillé : ${sugarNeeds} g`;
        }

        return sugarScore;
    }

    const getFiberScore = (fiber) => {
        let fiberScore = {
            color: ``,
            message: ``
        }
        let fiberNeeds = 25;

        if(fiber > fiberNeeds*0.9){
            fiberScore.color = `green`;
            fiberScore.message = `C'est bon ! Votre apport en fibres est correct. Apport conseillé : ${fiberNeeds} g`;
        }

        if(fiber > fiberNeeds*0.8 && fiber <= fiberNeeds*0.9){
            fiberScore.color = `yellow`;
            fiberScore.message = `Attention, votre apport en fibres est un peu trop bas. Apport conseillé : ${fiberNeeds} g`;
        }

        if(fiber > fiberNeeds*0.6 && fiber <= fiberNeeds*0.8){
            fiberScore.color = `orange`;
            fiberScore.message = `Attention, votre apport en fibres est trop bas. Apport conseillé : ${fiberNeeds} g`;
        }

        if(fiber <= fiberNeeds*0.6){
            fiberScore.color = `red`;
            fiberScore.message = `Attention, votre apport en fibres est BEAUCOUP trop bas ! Apport conseillé : ${fiberNeeds} g`;
        }

        return fiberScore;
    }

    const getProteinsScore = (proteins) => {
        let proteinsScore = {
            color: ``,
            message: ``
        }
        let proteinsNeeds = Math.round((bej/4)*0.2);

        if(proteins < proteinsNeeds*0.8){
            proteinsScore.color = `red`;
            proteinsScore.message = `Attention, votre apport en protéines est BEAUCOUP trop bas ! Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins >= proteinsNeeds*0.8 && proteins < proteinsNeeds*0.9){
            proteinsScore.color = `orange`;
            proteinsScore.message = `Attention, votre apport en protéines est trop bas. Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins >= proteinsNeeds*0.9 && proteins < proteinsNeeds*0.95){
            proteinsScore.color = `yellow`;
            proteinsScore.message = `Attention, votre apport en protéines est un peu trop bas. Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins >= proteinsNeeds*0.95 && proteins <= proteinsNeeds*1.2){
            proteinsScore.color = `green`;
            proteinsScore.message = `C'est bon ! Votre apport en protéines est correct. Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins > proteinsNeeds*1.2 && proteins <= proteinsNeeds*1.3){
            proteinsScore.color = `yellow`;
            proteinsScore.message = `Attention, votre apport en protéines est un peu trop haut. Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins > proteinsNeeds*1.3 && proteins <= proteinsNeeds*1.4){
            proteinsScore.color = `orange`;
            proteinsScore.message = `Attention, votre apport en protéines est trop haut. Apport conseillé : ${proteinsNeeds} g`;
        }

        if(proteins > proteinsNeeds*1.4){
            proteinsScore.color = `red`;
            proteinsScore.message = `Attention, votre apport en protéines est BEAUCOUP trop haut ! Apport conseillé : ${proteinsNeeds} g`;
        }

        return proteinsScore;
    }

    const getSaltScore = (salt) => {
        let saltScore = {
            color: ``,
            message: ``
        }
        let saltNeeds = 5;

        if(salt <= saltNeeds*1.2){
            saltScore.color = `green`;
            saltScore.message = `C'est bon ! Votre apport en sel est correct. Apport conseillé : ${saltNeeds} g`;
        }

        if(salt > saltNeeds*1.2 && salt <= saltNeeds*1.5){
            saltScore.color = `yellow`;
            saltScore.message = `Attention, votre apport en sel est un peu trop haut. Apport conseillé : ${saltNeeds} g`;
        }

        if(salt > saltNeeds*1.5 && salt <= saltNeeds*1.8){
            saltScore.color = `orange`;
            saltScore.message = `Attention, votre apport en sel est trop haut. Apport conseillé : ${saltNeeds} g`;
        }

        if(salt > saltNeeds*1.8){
            saltScore.color = `red`;
            saltScore.message = `Attention, votre apport en sel est BEAUCOUP trop haut ! Apport conseillé : ${saltNeeds} g`;
        }

        return saltScore;
    }

    const getStats = () => {
        console.log(getEnergyScore(profileLose, dailyNutriments["energy"]));
        console.log(getFatScore(dailyNutriments["fat"]));
        console.log(getCarbohydratesScore(profileLose, dailyNutriments["carbohydrates"]));
        console.log(getSugarScore(dailyNutriments["sugars"]));
        console.log(getFiberScore(dailyNutriments["fiber"]));
        console.log(getProteinsScore(dailyNutriments["proteins"]));
        console.log(getSaltScore(dailyNutriments["salt"]));
    }

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
        setBEJ(calculateBEJ(profileLose));
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
            <div className='btn-primary' onClick={() => getStats()} >Avis du coach</div>
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
