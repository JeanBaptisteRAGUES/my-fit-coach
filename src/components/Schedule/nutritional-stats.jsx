import React, { Fragment, useContext, useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FirebaseContext } from '../Firebase';
import moment from 'moment';

const NutrtitionalStats = ({userID, day, eventsArray, displayStats}) => {
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
    const [goal, setGoal] = useState("");
    const [energyScore, setEnergyScore] = useState(null);
    const [fatScore, setFatScore] = useState(null);
    const [carbohydratesScore, setCarbohydratesScore] = useState(null);
    const [sugarScore, setSugarScore] = useState(null);
    const [fiberScore, setFiberScore] = useState(null);
    const [proteinsScore, setProteinsScore] = useState(null);
    const [saltScore, setSaltScore] = useState(null);
    const [displayMode, setDisplayMode] = useState("nutriments"); //nutriments / goal / coach
    const [userProfile, setUserProfile] = useState(null);

    const calculateMB = (profile) => {
        let age = moment().diff(profile.birth, 'years', false);
        if(profile.gender === "male"){
            return Math.round(13.707*profile.weight + 492.3*(profile.height/100) - 6.673*age + 77.607);
        }else{
            return Math.round(9.740*profile.weight + 172.9*(profile.height/100) - 4.7373*age + 667.051);
        }
    }

    const calculateBEJ = (profile) => {
        let mb = calculateMB(profile);
        console.log("mb : " + mb);
        switch (profile.nap) {
            case "sedentary":
                return Math.round(mb*1.375);
            case "light":
                return Math.round(mb*1.56);
            case "moderate":
                return Math.round(mb*1.64);
            case "high":
                return Math.round(mb*1.82);
            default:
                console.log("Erreur, valeur NAP inconnue : " + profile.nap);
                break;
        }
    }

    const getPercentage = (value, valueNeeds) => {
        let percentage = Math.round(100*(value/valueNeeds) - 100);
        if(percentage < 0) return `${percentage}%`;
        return `+${percentage}%`;
    }

    const getEnergyScore = (energy) => {
        let newEnergyScore = {
            color: ``,
            message: ``,
            needs: bej,
            percentage: ``
        }
        if(goal === `lose`) newEnergyScore.needs *= 0.9;
        if(goal === `gain`) newEnergyScore.needs *= 1.1;
        newEnergyScore.needs = Math.round(newEnergyScore.needs);
        newEnergyScore.percentage = getPercentage(energy, newEnergyScore.needs);

        if(energy < newEnergyScore.needs*0.8){
            newEnergyScore.color = `text-red-500`;
            newEnergyScore.message = `Attention, votre apport calorique est BEAUCOUP trop bas ! Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy >= newEnergyScore.needs*0.8 && energy < newEnergyScore.needs*0.9){
            newEnergyScore.color = `text-orange-500`;
            newEnergyScore.message = `Attention, votre apport calorique est trop bas. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy >= newEnergyScore.needs*0.9 && energy < newEnergyScore.needs*0.95){
            newEnergyScore.color = `text-yellow-500`;
            newEnergyScore.message = `Attention, votre apport calorique est un peu trop bas. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy >= newEnergyScore.needs*0.95 && energy <= newEnergyScore.needs*1.05){
            newEnergyScore.color = `text-green-500`;
            newEnergyScore.message = `C'est bon ! Votre apport calorique est correct. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy > newEnergyScore.needs*1.05 && energy <= newEnergyScore.needs*1.1){
            newEnergyScore.color = `text-yellow-500`;
            newEnergyScore.message = `Attention, votre apport calorique est un peu trop haut. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy > newEnergyScore.needs*1.1 && energy <= newEnergyScore.needs*1.2){
            newEnergyScore.color = `text-orange-500`;
            newEnergyScore.message = `Attention, votre apport calorique est trop haut. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        if(energy > newEnergyScore.needs*1.2){
            newEnergyScore.color = `text-red-500`;
            newEnergyScore.message = `Attention, votre apport calorique est BEAUCOUP trop haut. Apport conseillé : ${newEnergyScore.needs} kcal`;
        }

        setEnergyScore(newEnergyScore);
    }

    const getFatScore = (fat) => {
        let newFatScore = {
            color: ``,
            message: ``,
            needs: Math.round((bej/9)*0.3),
            percentage: ``
        }
        newFatScore.percentage = getPercentage(fat, newFatScore.needs);

        if(fat < newFatScore.needs*0.8){
            newFatScore.color = `text-red-500`;
            newFatScore.message = `Attention, votre apport en lipides est BEAUCOUP trop bas ! Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat >= newFatScore.needs*0.8 && fat < newFatScore.needs*0.9){
            newFatScore.color = `text-orange-500`;
            newFatScore.message = `Attention, votre apport en lipides est trop bas. Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat >= newFatScore.needs*0.9 && fat < newFatScore.needs*0.95){
            newFatScore.color = `text-yellow-500`;
            newFatScore.message = `Attention, votre apport en lipides est un peu trop bas. Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat >= newFatScore.needs*0.95 && fat <= newFatScore.needs*1.05){
            newFatScore.color = `text-green-500`;
            newFatScore.message = `C'est bon ! Votre apport en lipides est correct.  Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat > newFatScore.needs*1.05 && fat <= newFatScore.needs*1.1){
            newFatScore.color = `text-yellow-500`;
            newFatScore.message = `Attention, votre apport en lipides est un peu trop haut. Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat > newFatScore.needs*1.1 && fat <= newFatScore.needs*1.2){
            newFatScore.color = `text-orange-500`;
            newFatScore.message = `Attention, votre apport en lipides est trop haut.  Apport conseillé : ${newFatScore.needs} g`;
        }

        if(fat > newFatScore.needs*1.2){
            newFatScore.color = `text-red-500`;
            newFatScore.message = `Attention, votre apport en lipides est BEAUCOUP trop haut ! Apport conseillé : ${newFatScore.needs} g`;
        }

        setFatScore(newFatScore);
    }

    const getCarbohydratesScore = (carbohydrates) => {
        let newCarbohydratesScore = {
            color: ``,
            message: ``,
            needs: (bej/4)*0.5,
            percentage: ``
        }
        if(goal === `lose`) newCarbohydratesScore.needs = (bej/4)*0.4;
        if(goal === `gain`) newCarbohydratesScore.needs = (bej/4)*0.6;
        newCarbohydratesScore.needs = Math.round(newCarbohydratesScore.needs);
        newCarbohydratesScore.percentage = getPercentage(carbohydrates, newCarbohydratesScore.needs);

        if(carbohydrates < newCarbohydratesScore.needs*0.8){
            newCarbohydratesScore.color = `text-red-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est BEAUCOUP trop bas ! Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates >= newCarbohydratesScore.needs*0.8 && carbohydrates < newCarbohydratesScore.needs*0.9){
            newCarbohydratesScore.color = `text-orange-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est trop bas. Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates >= newCarbohydratesScore.needs*0.9 && carbohydrates < newCarbohydratesScore.needs*0.95){
            newCarbohydratesScore.color = `text-yellow-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est un peu trop bas. Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates >= newCarbohydratesScore.needs*0.95 && carbohydrates <= newCarbohydratesScore.needs*1.05){
            newCarbohydratesScore.color = `text-green-500`;
            newCarbohydratesScore.message = `C'est bon ! Votre apport en glucides est correct. Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates > newCarbohydratesScore.needs*1.05 && carbohydrates <= newCarbohydratesScore.needs*1.1){
            newCarbohydratesScore.color = `text-yellow-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est un peu trop haut. Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates > newCarbohydratesScore.needs*1.1 && carbohydrates <= newCarbohydratesScore.needs*1.2){
            newCarbohydratesScore.color = `text-orange-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est trop haut. Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        if(carbohydrates > newCarbohydratesScore.needs*1.2){
            newCarbohydratesScore.color = `text-red-500`;
            newCarbohydratesScore.message = `Attention, votre apport en glucides est BEAUCOUP trop haut ! Apport conseillé : ${newCarbohydratesScore.needs} g`;
        }

        setCarbohydratesScore(newCarbohydratesScore);
    }

    const getSugarScore = (sugar) => {
        let newSugarScore = {
            color: ``,
            message: ``,
            needs: Math.round((bej/4)*0.05),
            percentage: ``
        }
        newSugarScore.percentage = `${Math.round(100*(sugar/newSugarScore.needs) - 100)}%`;
        newSugarScore.percentage = getPercentage(sugar, newSugarScore.needs);

        if(sugar <= newSugarScore.needs*1.05){
            newSugarScore.color = `text-green-500`;
            newSugarScore.message = `C'est bon ! Votre apport en sucre est correct. Apport conseillé : ${newSugarScore.needs} g`;
        }

        if(sugar > newSugarScore.needs*1.05 && sugar <= newSugarScore.needs*1.1){
            newSugarScore.color = `text-yellow-500`;
            newSugarScore.message = `Attention, votre apport en sucre est un peu trop haut. Apport conseillé : ${newSugarScore.needs} g`;
        }

        if(sugar > newSugarScore.needs*1.1 && sugar <= newSugarScore.needs*1.2){
            newSugarScore.color = `text-orange-500`;
            newSugarScore.message = `Attention, votre apport en sucre est trop haut. Apport conseillé : ${newSugarScore.needs} g`;
        }

        if(sugar > newSugarScore.needs*1.2){
            newSugarScore.color = `text-red-500`;
            newSugarScore.message = `Attention, votre apport en sucre est BEAUCOUP trop haut ! Apport conseillé : ${newSugarScore.needs} g`;
        }

        setSugarScore(newSugarScore);
    }

    const getFiberScore = (fiber) => {
        let newFiberScore = {
            color: ``,
            message: ``,
            needs: 25,
            percentage: ``
        }
        newFiberScore.percentage = `${Math.round(100*(fiber/newFiberScore.needs) - 100)}%`;
        newFiberScore.percentage = getPercentage(fiber, newFiberScore.needs);

        if(fiber > newFiberScore.needs*0.9){
            newFiberScore.color = `text-green-500`;
            newFiberScore.message = `C'est bon ! Votre apport en fibres est correct. Apport conseillé : ${newFiberScore.needs} g`;
        }

        if(fiber > newFiberScore.needs*0.8 && fiber <= newFiberScore.needs*0.9){
            newFiberScore.color = `text-yellow-500`;
            newFiberScore.message = `Attention, votre apport en fibres est un peu trop bas. Apport conseillé : ${newFiberScore.needs} g`;
        }

        if(fiber > newFiberScore.needs*0.6 && fiber <= newFiberScore.needs*0.8){
            newFiberScore.color = `text-orange-500`;
            newFiberScore.message = `Attention, votre apport en fibres est trop bas. Apport conseillé : ${newFiberScore.needs} g`;
        }

        if(fiber <= newFiberScore.needs*0.6){
            newFiberScore.color = `text-red-500`;
            newFiberScore.message = `Attention, votre apport en fibres est BEAUCOUP trop bas ! Apport conseillé : ${newFiberScore.needs} g`;
        }

        setFiberScore(newFiberScore);
    }

    const getProteinsScore = (proteins) => {
        let newProteinsScore = {
            color: ``,
            message: ``,
            needs: Math.round((bej/4)*0.2),
            percentage: ``
        }
        newProteinsScore.percentage = `${Math.round(100*(proteins/newProteinsScore.needs) - 100)}%`;
        newProteinsScore.percentage = getPercentage(proteins, newProteinsScore.needs);

        if(proteins < newProteinsScore.needs*0.8){
            newProteinsScore.color = `text-red-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est BEAUCOUP trop bas ! Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins >= newProteinsScore.needs*0.8 && proteins < newProteinsScore.needs*0.9){
            newProteinsScore.color = `text-orange-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est trop bas. Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins >= newProteinsScore.needs*0.9 && proteins < newProteinsScore.needs*0.95){
            newProteinsScore.color = `text-yellow-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est un peu trop bas. Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins >= newProteinsScore.needs*0.95 && proteins <= newProteinsScore.needs*1.2){
            newProteinsScore.color = `text-green-500`;
            newProteinsScore.message = `C'est bon ! Votre apport en protéines est correct. Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins > newProteinsScore.needs*1.2 && proteins <= newProteinsScore.needs*1.3){
            newProteinsScore.color = `text-yellow-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est un peu trop haut. Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins > newProteinsScore.needs*1.3 && proteins <= newProteinsScore.needs*1.4){
            newProteinsScore.color = `text-orange-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est trop haut. Apport conseillé : ${newProteinsScore.needs} g`;
        }

        if(proteins > newProteinsScore.needs*1.4){
            newProteinsScore.color = `text-red-500`;
            newProteinsScore.message = `Attention, votre apport en protéines est BEAUCOUP trop haut ! Apport conseillé : ${newProteinsScore.needs} g`;
        }

        setProteinsScore(newProteinsScore);
    }

    const getSaltScore = (salt) => {
        let newSaltScore = {
            color: ``,
            message: ``,
            needs: 5,
            percentage: ``
        }
        newSaltScore.percentage = `${Math.round(100*(salt/newSaltScore.needs) - 100)}%`;
        newSaltScore.percentage = getPercentage(salt, newSaltScore.needs);

        if(salt <= newSaltScore.needs*1.2){
            newSaltScore.color = `text-green-500`;
            newSaltScore.message = `C'est bon ! Votre apport en sel est correct. Apport conseillé : ${newSaltScore.needs} g`;
        }

        if(salt > newSaltScore.needs*1.2 && salt <= newSaltScore.needs*1.5){
            newSaltScore.color = `text-yellow-500`;
            newSaltScore.message = `Attention, votre apport en sel est un peu trop haut. Apport conseillé : ${newSaltScore.needs} g`;
        }

        if(salt > newSaltScore.needs*1.5 && salt <= newSaltScore.needs*1.8){
            newSaltScore.color = `text-orange-500`;
            newSaltScore.message = `Attention, votre apport en sel est trop haut. Apport conseillé : ${newSaltScore.needs} g`;
        }

        if(salt > newSaltScore.needs*1.8){
            newSaltScore.color = `text-red-500`;
            newSaltScore.message = `Attention, votre apport en sel est BEAUCOUP trop haut ! Apport conseillé : ${newSaltScore.needs} g`;
        }

        setSaltScore(newSaltScore);
    }

    const getStats = (newDisplayMode) => {
        console.log("BEJ : " + bej);
        getEnergyScore(dailyNutriments["energy"])
        getFatScore(dailyNutriments["fat"]);
        getCarbohydratesScore(dailyNutriments["carbohydrates"]);
        getSugarScore(dailyNutriments["sugars"]);
        getFiberScore(dailyNutriments["fiber"]);
        getProteinsScore(dailyNutriments["proteins"]);
        getSaltScore(dailyNutriments["salt"]);
        setDisplayMode(newDisplayMode);
    }

    useEffect(async () => {
        console.log("ok");
        let newDailyNutriments = await getDailyNutriments(day);
        let newUserProfile = await firebase.user(userID).get();
        newUserProfile = newUserProfile.data();
        let newBEJ = calculateBEJ(newUserProfile);
        roundNutriments(newDailyNutriments);

        console.log(newBEJ);

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
        setBEJ(newBEJ);
        setGoal(newUserProfile.goal);
        setUserProfile(newUserProfile)
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
        roundNutriments(nutRes)

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

    const goalForm = displayMode === "goal" && (
        <div className="window-nutrition basicText flex flex-col justify-start items-center sticky top-5 left-5 p-2 w-fit max-h-[90%] overflow-auto">
            <form className='flex flex-col justify-start items-center gap-5' onSubmit={() => getStats("coach")}>
                <div className='w-full'>
                    <label htmlFor="bej">Objectif calorique :</label><br/>
                    <input 
                        className='input'
                        onChange={(e) => setBEJ(e.target.value)} 
                        value={bej} 
                        type="text" 
                        id="bej" 
                        autoComplete="off" 
                        required
                        placeholder="objectif journalier calorique" 
                    />
                </div>
                <div className='w-full'>
                    <label htmlFor="goal">Objectif :</label><br/>
                    <select id='goal' onChange={(e) => setGoal(e.target.value)}>
                        <option value="">--Choisissez une option--</option>
                        {goal === "maintain" ? <option value="maintain" selected>Maintenir son poids</option> : <option value="maintain">Maintenir son poids</option>}
                        {goal === "lose" ? <option value="lose" selected>Perdre du gras</option> : <option value="lose">Perdre du gras</option>}
                        {goal === "gain" ? <option value="gain" selected>Gagner du muscle</option> : <option value="gain">Gagner du muscle</option>}
                    </select>
                </div>
                <button className='btn-primary'>Confirmer</button>
            </form>
        </div>
    )

    const coachAdviceDisplay = energyScore !== null && fatScore !== null && carbohydratesScore !== null && sugarScore !== null && fiberScore !== null && proteinsScore !== null && saltScore !== null && displayMode === "coach" && (
        <div className="window-nutrition text-micro md:text-base flex flex-col justify-start items-center sticky top-5 left-5 p-2 w-3/4 max-h-[90%] overflow-auto">
            <div className=" grid grid-rows-[8] w-[100%] my-4 border border-black rounded p-1">
                <div className=' grid grid-cols-6 row-start-1 row-span-1'>
                    <span className=' col-start-1 col-span-4 border-r border-black '>Valeurs nutritionnelles ({day})</span>
                    <span className=' flexCenter col-start-5 col-span-1 border-r border-black'>Besoins</span>
                    <span className={` md:flexCenter col-start-6 col-span-1 hidden`}>Pourcentage</span>
                    <span className={` md:hidden col-start-6 col-span-1 flexCenter`}>%</span>
                </div>
                <div className=' grid grid-cols-6 row-start-2 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Energie (kcal) : {dailyNutriments[`energy`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{energyScore.needs}</span>
                    <span className={` ${energyScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{energyScore.percentage}</span>
                </div> 
                <div className=' grid grid-cols-6 row-start-3 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Matières grasses (g) : {dailyNutriments[`fat`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{fatScore.needs}</span>
                    <span className={` ${fatScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{fatScore.percentage}</span>
                </div>
                <div className=' grid grid-cols-6 row-start-4 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Glucides (g) : {dailyNutriments[`carbohydrates`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{carbohydratesScore.needs}</span>
                    <span className={` ${carbohydratesScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{carbohydratesScore.percentage}</span>
                </div>
                <div className=' grid grid-cols-6 row-start-5 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Dont sucres (g) : {dailyNutriments[`sugars`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{sugarScore.needs}</span>
                    <span className={` ${sugarScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{sugarScore.percentage}</span>
                </div>
                <div className=' grid grid-cols-6 row-start-6 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Fibres (g) : {dailyNutriments[`fiber`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{fiberScore.needs}</span>
                    <span className={` ${fiberScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{fiberScore.percentage}</span>
                </div>
                <div className=' grid grid-cols-6 row-start-7 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Protéines (g) : {dailyNutriments[`proteins`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{proteinsScore.needs}</span>
                    <span className={` ${proteinsScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{proteinsScore.percentage}</span>
                </div>
                <div className=' grid grid-cols-6 row-start-8 row-span-1'>
                    <span className={` col-start-1 col-span-4 px-1 w-full text-black uhd:py-2 border-r border-black`}>Sel (g) : {dailyNutriments[`salt`]}</span>
                    <span className=' flex flex-row justify-end items-center col-start-5 col-span-1 border-r border-black px-1'>{saltScore.needs}</span>
                    <span className={` ${saltScore.color} flex flex-row justify-end items-center col-start-6 col-span-1 `}>{saltScore.percentage}</span>
                </div>
            </div>
            <div className=' flexStart w-[100%]'>
                <div className=' flexStart'>
                    <span>Energie :</span>
                    <span className={`${energyScore.color}`}>{energyScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Lipides :</span>
                    <span className={`${fatScore.color}`}>{fatScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Glucides :</span>
                    <span className={`${carbohydratesScore.color}`}>{carbohydratesScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Sucre :</span>
                    <span className={`${sugarScore.color}`}>{sugarScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Fibres :</span>
                    <span className={`${fiberScore.color}`}>{fiberScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Protéines :</span>
                    <span className={`${proteinsScore.color}`}>{proteinsScore.message}</span>
                </div>
                <div className=' flexStart'>
                    <span>Sel :</span>
                    <span className={`${saltScore.color}`}>{saltScore.message}</span>
                </div>
            </div>
            <div className='btn-primary' onClick={() => setDisplayMode("nutriments")} >Retour</div>
        </div>
    )
    
    const dailyNutrimentsDisplay = dailyNutriments !== null && displayOption === 'day' && displayMode === "nutriments" && (
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

    const weeklyNutrimentsDisplay = weeklyNutriments !== null && displayOption === 'week' && displayMode === "nutriments" && (
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

    const statsWindow = displayMode === "nutriments" && (
        <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4 h-[50vh] border border-black">
            <span className='title'>{day}</span>
            {statsMenu}
            {dailyNutrimentsDisplay}
            {weeklyNutrimentsDisplay}
            {loadingDisplay}
            <div className='btn-primary' onClick={() => getStats("goal")} >Avis du coach</div>
        </div>
    )

    return (
        <div className='flex flex-row justify-center overscroll-contain font-bold text-2xl items-center fixed top-[5vh] z-10 w-full h-screenMinusHeader backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {statsWindow}
            {coachAdviceDisplay}
            {goalForm}
            <div className='flexCenter fixed bottom-[10%] left-[45%] md:top-[5vh] md:left-[5vw] h-10 w-10 text-white rounded-full text-6xl cursor-pointer bg-slate-400'>
                <RiCloseLine onClick={() => displayStats('')}></RiCloseLine>
            </div>
        </div>
    )
};

export default NutrtitionalStats;
