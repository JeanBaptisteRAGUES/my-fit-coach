import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NutritionalInfos = ({selectedEventMeal, setSelectedEventMeal, deleteEvent, userID}) => {
    const [VN, setVN] = useState(JSON.parse(selectedEventMeal[1]["nutriments"]));
    const foodstuffs = JSON.parse(selectedEventMeal[1]["foodstuffs"]);
    const mealTitle = selectedEventMeal[1]["title"];

    console.log(selectedEventMeal);

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

    const mealDisplay = (
        <div className="window-nutrition basicText flexCenter sticky top-5 left-5 p-2 w-3/4">
            <span className='title mb-4'>{mealTitle}</span>
            <div className=" basicText flexCenter">{selectedEventMeal[0].day + " (" + selectedEventMeal[0].start + 'h - ' + selectedEventMeal[0].end + 'h)'}</div>
            <div className='flexStart my-4 w-2/3'>
                <p className='underline'>Aliments :<br/></p>
                {
                    foodstuffs.map(food => {
                        return  (
                                    <p key={food[0]}>
                                        -{food[1]} ({food[2]}g)
                                    </p>
                                )
                    })
                }
            </div>
            {mealVN}
            <div className='flex flex-row justify-around items-center w-full h-1/10'>
                <div className='btn-primary' onClick={() => deleteEvent(selectedEventMeal[0].id)}>Supprimer</div>
                <Link className='btn-primary' to="/nutrition" state={{userID: userID, mealID: selectedEventMeal[0].refID}}>Modifier</Link>
                <div className='btn-primary' onClick={() => setSelectedEventMeal([])}>Fermer</div>
            </div>
        </div>
    )

    return (
        <div className='flex flex-row justify-center font-bold text-2xl items-center fixed top-0 z-10 text-white w-full min-h-screen backdrop-blur-md bg-slate-900/50 motion-safe:animate-fall'>
            {mealDisplay}
        </div>
    )
};

export default NutritionalInfos;
