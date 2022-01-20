import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
const MealDisplay = ({meal, mealTitle, mealID, foodstuffs, VN, deleteFood, mealRegister, mealModify}) => {

    console.log(VN);

    const mealRegisterBtn = foodstuffs.length === 0 ?
            <button className="btn-primary opacity-50">Enregister</button> 
        : 
            <button className="btn-primary" onClick={() => mealRegister()}>Enregistrer</button>

    const mealModifyBtn = foodstuffs.length === 0 ?
            <button className="btn-primary opacity-50">Enregister</button> 
        : 
            <button className="btn-primary" onClick={() => mealModify()}>Enregistrer</button>

    const mealVN = (
        <div className="flexStart w-2/3 my-4 border border-black rounded p-1">
            <span>Valeurs nutritionnelles totales :</span> 
            <span className=" bg-energy px-1 w-full text-black uhd:py-2">Energie (kcal) : {VN["energy"]}</span>
            <span className=" bg-fat px-1 w-full text-black uhd:py-2">Matières grasses (g) : {VN["fat"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Glucides (g) : {VN["carbohydrates"]}</span>
            <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Dont sucres (g) : {VN["sugars"]}</span>
            <span className=" bg-fiber px-1 w-full text-black uhd:py-2">Fibres (g) : {VN["fiber"]}</span>
            <span className=" bg-protein px-1 w-full text-black uhd:py-2">Protéines (g) : {VN["proteins"]}</span>
            <span className=" bg-salt px-1 w-full text-black uhd:py-2">Sel (g) : {VN["salt"]}</span>
        </div>
    )

    const mealDisplay = meal[0] !== '' && (
        <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4">
            <span className='title mb-4'>{mealTitle}</span>
            <div className='flexStart mx-4'>
                <p className='underline'>Aliments :<br/></p>
                {
                    foodstuffs.map(food => {
                        return  (
                                    <p key={food[0]}>
                                        -{food[1]} ({food[2]}g)
                                        <span onClick={() => deleteFood(food[0])}  className="btn-delete2">X</span>
                                    </p>
                                )
                    })
                }
            </div>
            {mealVN}
            {mealID[1] === "" ? mealRegisterBtn : mealModifyBtn }
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {mealDisplay}
        </div>
    )
}

export default MealDisplay;