import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import './nutrition.css';
import axios from 'axios';
import {FirebaseContext} from '../Firebase';
import {HiShoppingCart} from 'react-icons/hi';
import { RiCloseLine } from 'react-icons/ri';
import MealDisplay from './meal-display';
import { Fragment } from 'react/cjs/react.development';

const Nutrition = () => {
    const firebase = useContext(FirebaseContext);
    const location = useLocation();
    let navigate = useNavigate();
    const {userID, mealID} = location.state !== null && location.state !== undefined ? location.state : {userID: null, mealID: null};
    const [foodInfo, setFoodInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPages, setMaxPages] = useState(1);
    const [currentFoodName, setCurrentFoodName] = useState('');
    const [currentBrand, setCurrentBrand] = useState('');
    const [meal, setMeal] = useState(["", ""]); //[mealTitle, mealID]
    const [mealTitle, setMealTitle] = useState('');
    const [foodstuffs, setFoodstuffs] = useState([]);
    const [newFood, setNewFood] = useState(['', '', '']);
    const [VN, setVN] = useState({
        energy: 0,
        fat: 0,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        proteins: 0,
        salt: 0
    });
    //let mealID = useParams()["mealID"];
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if(userID === null){navigate('/login'); return};
    }, []);

    const getMealData = async (mealID) => {
        const myMeal = await firebase.meal(mealID).get();
        const myMealData = myMeal.data();
        const myMealTitle = myMealData["title"];
        const myMealFoodstuffs = JSON.parse(myMealData["foodstuffs"]);

        setMealTitle(myMealTitle);
        setMeal([myMealTitle, mealID]);
        setFoodstuffs(myMealFoodstuffs);
    }
    
    if(mealID !== null && mealID !== undefined){
        console.log("Meal ID : " + mealID);
        getMealData(mealID);
    }

    useEffect(async () => {
        let newVN = {
            energy: 0,
            fat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            proteins: 0,
            salt: 0
        };
        for(let food of foodstuffs){
            const request = `https://world.openfoodfacts.org/api/v0/product/${food[0]}`;
            let foodRes = await axios.get(request);
            console.log(foodRes);
            let foodNutriments = foodRes["data"]["product"]["nutriments"];
            if(foodNutriments["energy"] != undefined) newVN["energy"] += Math.round(foodNutriments["energy"] / 4.1868) * (food[2]/100);
            if(foodNutriments["fat"] != undefined) newVN["fat"] += foodNutriments["fat"] * (food[2]/100);
            if(foodNutriments["carbohydrates"] != undefined) newVN["carbohydrates"] += foodNutriments["carbohydrates"] * (food[2]/100);
            if(foodNutriments["sugars"] != undefined) newVN["sugars"] += foodNutriments["sugars"] * (food[2]/100);
            if(foodNutriments["fiber"] != undefined) newVN["fiber"] += foodNutriments["fiber"] * (food[2]/100);
            if(foodNutriments["proteins"] != undefined) newVN["proteins"] += foodNutriments["proteins"] * (food[2]/100);
            if(foodNutriments["salt"] != undefined) newVN["salt"] += foodNutriments["salt"] * (food[2]/100);
        }

        newVN["energy"] = Math.round(newVN["energy"]);
        newVN["fat"] = Math.round(newVN["fat"]);
        newVN["carbohydrates"] = Math.round(newVN["carbohydrates"]);
        newVN["sugars"] = Math.round(newVN["sugars"]);
        newVN["fiber"] = Math.round(newVN["fiber"]);
        newVN["proteins"] = Math.round(newVN["proteins"]);
        newVN["salt"] = Math.round(newVN["salt"] * 1e2) / 1e2;

        console.log(JSON.stringify(newVN));

        setVN(newVN);

    }, [foodstuffs])

    const getNutrimentValue = (product, nutriment) => {
        if(product["nutriments"][nutriment] !== '' && product["nutriments"][nutriment] !== undefined){
            return product["nutriments"][nutriment].toFixed(2)
        }else{
            return "NaN";
        }
    }

    const createMeal = () => {
        setMeal([mealTitle, ""]);
    }

    const addFood = () => {

        if(!foodstuffs.some(food => food[0] === newFood[0])){
            console.log(`Add : [${newFood[0]}, ${newFood[1]}, ${newFood[2]}]`);
            setFoodstuffs([...foodstuffs, [newFood[0], newFood[1], newFood[2]]]);
            setNewFood(['', '', '']);
        }else{
            console.log("Le produit a déjà été ajouté !");
            setNewFood(['', '', '']);
        }
    }

    const formSelectQuantityBtn = newFood[2] === '' ? 
            <button className="btn-primary opacity-50">Valider</button> 
        : 
            <button className="btn-primary">Valider</button>

    const selectQuantity = newFood[0] !== '' && (
        <div className="N_quantiy">
            <form onSubmit={addFood} className="loginForm">
                <div className="inputBox">
                    <label htmlFor="quantity">Quantité (en g) :</label><br/>
                    <input onChange={(e) => setNewFood([newFood[0], newFood[1], e.target.value])} value={newFood[2]} type="text" id="quantity" autoComplete="off" required placeholder="100"/>
                </div>
                {formSelectQuantityBtn}
            </form>
        </div>
    )

    const formAddMealBtn = mealTitle === '' ? 
            <button className='btn-primary opacity-50'>Créer</button> 
        : 
            <button className='btn-primary'>Créer</button>

    const mealForm = meal[0] === '' && (
        <div className="window-nutrition md:flexCenter basicText gap-4 md:col-start-1 md:col-span-2 md:row-start-2 md:row-span-1 h-full mx-2 hidden">
            <form onSubmit={createMeal} className="flexCenter">
                <div className="inputBox">
                    <label className='' htmlFor="title">Titre :</label><br/>
                    <input className='input' onChange={(e) => setMealTitle(e.target.value)} value={mealTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1"/>
                </div>
                {formAddMealBtn}
            </form>
        </div>
    )

    const mealRegister = () => {
        console.log(userID);
        firebase.db.collection('meals').add({
            title: meal[0],
            foodstuffs: JSON.stringify(foodstuffs),
            nutriments: JSON.stringify(VN),
            userID: userID
        })
        .then(() => {
            setMeal(["", ""]);
            setMealTitle('');
            setFoodstuffs([]);
            setVN({energy: 0, fat: 0, carbohydrates: 0, sugars: 0, fiber: 0, proteins: 0, salt: 0});
        })
    }

    const mealModify = () => {
        firebase.meal(meal[1]).update(
            {
                title: meal[0],
                foodstuffs: JSON.stringify(foodstuffs),
                nutriments: JSON.stringify(VN)
            }
        )
        .then(() => {
            setMeal(["", ""]);
            setMealTitle('');
            setFoodstuffs([]);
            setVN({energy: 0, fat: 0, carbohydrates: 0, sugars: 0, fiber: 0, proteins: 0, salt: 0});
        })
    }

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

    const mealRegisterBtn = foodstuffs.length === 0 ?
            <button className="btn-primary opacity-50">Enregister</button> 
        : 
            <button className="btn-primary" onClick={() => mealRegister()}>Enregistrer</button>

    const mealModifyBtn = foodstuffs.length === 0 ?
            <button className="btn-primary opacity-50">Modifier</button> 
        : 
            <button className="btn-primary" onClick={() => mealModify()}>Modifier</button>

    const deleteFood = (id) => {
        const newFoodstuffs = foodstuffs.filter(food => food[0] !== id);
        setFoodstuffs(newFoodstuffs);
    }

    const mealDisplay = meal[0] !== '' && (
        <div className="window-nutrition basicText md:flexCenter sticky top-5 left-5 w-3/4 col-start-1 col-span-2 py-2 hidden">
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
            {mealID === null || mealID === undefined ? mealRegisterBtn : mealModifyBtn }
        </div>
    )

    const burgerMenu = (
        <div className='flexStart fixed top-header z-50 m-1 w-full text-white col-start-1 col-span-6 md:hidden'>
            {
                showMenu ? 
                        <RiCloseLine className='flexCenter rounded p-1 cursor-pointer h-1/3 w-1/6 bg-slate-600' onClick={() => setShowMenu(!showMenu)}></RiCloseLine>
                    :
                        <HiShoppingCart className='flexCenter rounded p-1 cursor-pointer h-1/3 w-1/6 bg-slate-600' onClick={() => setShowMenu(!showMenu)} >

                        </HiShoppingCart>
            }
        </div>
    )

    //{meal, mealID, foodstuffs, VN, deleteFood, mealRegister, mealModify}

    const mealDisplayMobile = showMenu && (
        <MealDisplay meal={meal} mealTitle={mealTitle} mealID={mealID} foodstuffs={foodstuffs} VN={VN} deleteFood={deleteFood} mealRegister={mealRegister} mealModify={mealModify} ></MealDisplay>
    )

    /*
    const profileLinks = showMenu && (
        <MenuLinks user={user} disconnect={disconnect}/>
    )
    */

    const getProductName = (product) => {
        let productName = product["product_name_fr"];
        if(productName == undefined || productName == "") productName = product["product_name"];
        if(productName == undefined || productName == "") productName = product["generic_name_fr"];
        if(productName == undefined || productName == "") productName = product["generic_name"];
        if(productName == undefined || productName == "") productName = currentFoodName;
        return productName;
    }

    const foodInfoDisplay = foodInfo.length > 0 &&
        foodInfo.map(product => {
            return <div key={product["_id"]} className="flexCenter rounded basicText bg-white py-2 shadow w-3/4">
                        <p className="N_productName">{getProductName(product)}</p>
                        <img className="h-2/3 w-2/3" src={product["image_url"]} alt={getProductName(product)} title={getProductName(product)} />
                        <div className='flexCenter'>
                            <p className="flexStart w-full my-2 border border-black rounded p-1">
                                <span>Valeurs nutritionnelles (pour 100g) :</span> 
                                <span className=" bg-energy px-1 w-full text-black uhd:py-2">Energie (kcal) : {Math.round(getNutrimentValue(product, "energy") / 4.1868)}</span>
                                <span className=" bg-fat px-1 w-full text-black uhd:py-2">Matières grasses (g) : {getNutrimentValue(product, "fat")}</span>
                                <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Glucides (g) : {getNutrimentValue(product, "carbohydrates")}</span>
                                <span className=" bg-carbohydrates px-1 w-full text-black uhd:py-2">Dont sucres (g) : {getNutrimentValue(product, "sugars")}</span>
                                <span className=" bg-fiber px-1 w-full text-black uhd:py-2">Fibres (g) : {getNutrimentValue(product, "fiber")}</span>
                                <span className=" bg-protein px-1 w-full text-black uhd:py-2">Protéines (g) : {getNutrimentValue(product, "proteins")}</span>
                                <span className=" bg-salt px-1 w-full text-black uhd:py-2">Sel (g) : {getNutrimentValue(product, "salt")}</span>
                            </p>
                        </div>
                        {
                        meal[0] === '' ? 
                                <button className=' btn-primary opacity-50'>Ajouter</button> 
                            : 
                                <button className=' btn-primary' onClick={() => setNewFood([product["_id"], getProductName(product), 100])}>Ajouter</button>
                        }
                   </div>
        })

    const searchFood = (foodName, brand, page) => {
        //`https://fr-en.openfoodfacts.org/category/${foodName}.json`
        //`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${foodName}&search_simple=1&action=process&json=1`
        let request = `https://fr.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${foodName}&json=1&page=${page}`;
        if(brand.length > 0) request = `https://fr.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${foodName}&tagtype_0=brands&tag_contains_0=contains&tag_0=${brand}&json=1&page=${page}`;
        axios.get(request)
            .then(res => {
                let products = res["data"]["products"];
                console.log(res);
                setCurrentFoodName(foodName);
                setFoodInfo(products);
                setCurrentPage(page);
                setMaxPages(res["data"]["page_count"]);
            })
            .catch(err => console.log(err));
    }

    const prevBtn = currentPage > 1 ? 
        <button className="btn-primary" onClick={() => searchFood(currentFoodName, currentBrand, currentPage-1)}>{'<'}</button>
        :
        <button className="btn-primary opacity-50">{'<'}</button>

    const nextBtn = currentPage < maxPages ? 
        <button className="btn-primary" onClick={() => searchFood(currentFoodName, currentBrand, currentPage+1)}>{'>'}</button>
        :
        <button className="btn-primary opacity-50">{'>'}</button>

    const startBtn = currentPage > 1 ? 
        <button className="btn-primary" onClick={() => searchFood(currentFoodName, currentBrand, 1)}>{'<<'}</button>
        :
        <button className="btn-primary opacity-50">{'<<'}</button>

    const endBtn = currentPage < maxPages ? 
        <button className="btn-primary" onClick={() => searchFood(currentFoodName, currentBrand, maxPages)}>{'>>'}</button>
        :
        <button className="btn-primary opacity-50">{'>>'}</button>

    const pageDisplay = <p>{currentPage}/{maxPages}</p>

    const updateFoodName = (e) => {
        setCurrentFoodName(e.currentTarget.value);
    }

    const chercher = () => {
        console.log(currentFoodName);
    }

    return (
        <Fragment>
            <div className='w-full h-screenMinusHeader grid grid-cols-6 grid-rows-6 bg-nutrition overflow-x-hidden'>
                {mealForm}
                {mealDisplay}
                {selectQuantity}
                {burgerMenu}
                <div className="window-nutrition flexCenter basicText gap-4 col-start-2 col-span-4 md:col-start-3 md:col-span-2 row-start-2">
                    <h1>Food</h1>
                    <form className='flex flex-row justify-evenly items-center w-full'>
                        <input className='input w-1/3' type="text" placeholder="aliment" onChange={(e) => updateFoodName(e)}/>
                        <input className='input w-1/3' type="text" placeholder="marque" onChange={(e) => setCurrentBrand(e.target.value)}/>
                    </form>
                    <button className='btn-primary' onClick={() => searchFood(currentFoodName, currentBrand, 1)}>Chercher</button>
                    <div className="flex flex-row justify-around items-center w-full">
                        {startBtn}
                        {prevBtn}
                        {pageDisplay}
                        {nextBtn}
                        {endBtn}
                    </div>
                    <div className='flexCenter gap-8 w-full'>
                        {foodInfoDisplay}
                    </div>
                </div>
            </div>
            {mealDisplayMobile}
        </Fragment>
    )
}

export default Nutrition;

