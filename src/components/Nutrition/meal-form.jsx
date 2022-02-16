import React from 'react';
import { RiCloseLine } from 'react-icons/ri';

const MealForm = ({userMeals, selectedMealID, mealTitle, setSelectedMealID, createMeal, setMealTitle, getMealData, setShowMenu2}) => {

    console.log("ok");

    const formAddMealBtn = mealTitle === '' ? 
            <button className='btn-primary opacity-50'>Créer</button> 
        : 
            <button className='btn-primary'>Créer</button>

    const mealsSelect = userMeals.length > 0 && (
        <select className='input' name="Sélection repas" id="mealsSelect" onChange={(e) => setSelectedMealID(e.target.value)} >
            <option value="">Sélectionnez un repas</option>
            {
                userMeals.map(userMeal => (
                    <option key={userMeal.id} value={userMeal.id} >{userMeal.title}</option>
                ))
            }
        </select>
    )

    const formDisplay = (
        <div className="window-nutrition flexCenter basicText gap-4 h-[100%] mx-2">
            <form onSubmit={(e) => createMeal(e)} className="flexCenter">
                <div className="inputBox">
                    <label className='' htmlFor="title">Titre :</label><br/>
                    <input className='input' onChange={(e) => setMealTitle(e.target.value)} value={mealTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1"/>
                </div>
                {formAddMealBtn}
            </form>
            <div className='flex flex-row justify-center items-center gap-2'>
                {mealsSelect}
                <div className='btn-primary' onClick={() => getMealData(selectedMealID)} >Charger</div>
            </div>
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {formDisplay}
            <div className='flexCenter fixed bottom-[10%] left-[45%] md:top-[7vh] md:left-[5vw] h-10 w-10 uhd:h-32 uhd:w-32 text-white rounded-full text-6xl uhd:text-8xl cursor-pointer bg-slate-400'>
                <RiCloseLine onClick={() => setShowMenu2(false)}></RiCloseLine>
            </div>
        </div>
    )
}

export default MealForm;