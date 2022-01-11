import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './nutrition.css';
import axios from 'axios';
import {FirebaseContext} from '../Firebase';
import { Fragment } from 'react/cjs/react.production.min';

const Nutrition = () => {
    const firebase = useContext(FirebaseContext);
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
    })

    let mealID = useParams()["mealID"];

    const getMealData = async (mealID) => {
        const myMeal = await firebase.meal(mealID).get();
        const myMealData = myMeal.data();
        const myMealTitle = myMealData["title"];
        const myMealFoodstuffs = JSON.parse(myMealData["foodstuffs"]);

        setMealTitle(myMealTitle);
        setMeal([myMealTitle, mealID]);
        setFoodstuffs(myMealFoodstuffs);
    }
    
    if(mealID !== "new" && meal[1] === ""){
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
            <button disabled>Valider</button> 
        : 
            <button>Valider</button>

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
            <button disabled>Créer</button> 
        : 
            <button>Créer</button>

    const mealForm = meal[0] === '' && (
        <div className="N_mealDisplay">
            <form onSubmit={createMeal} className="loginForm">
                <div className="inputBox">
                    <label htmlFor="title">Titre :</label><br/>
                    <input onChange={(e) => setMealTitle(e.target.value)} value={mealTitle} type="text" id="title" autoComplete="off" required placeholder="Repas 1"/>
                </div>
                {formAddMealBtn}
            </form>
        </div>
    )

    const mealRegister = () => {
        firebase.db.collection('meals').add({
            title: meal[0],
            foodstuffs: JSON.stringify(foodstuffs),
            nutriments: JSON.stringify(VN)
        })
        .then(async (res) => {
            const resID = res.id;
            const currentUser = await firebase.user(firebase.auth.currentUser.uid).get();
            console.log(currentUser.data());
            let newMealsIDs = [...JSON.parse(currentUser.data()["mealsIDs"]), [resID, meal[0]]];
            console.log(newMealsIDs);
            firebase.db.collection('users').doc(firebase.auth.currentUser.uid).update(
                {
                    mealsIDs: JSON.stringify(newMealsIDs)
                }
            );
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
        <div className="N_nutrimentsArray">
            <span>Valeurs nutritionnelles totales :</span> 
            <span className="N_energy">Energie (kcal) : {VN["energy"]}</span>
            <span className="N_fat">Matières grasses (g) : {VN["fat"]}</span>
            <span className="N_carbohydrates">Glucides (g) : {VN["carbohydrates"]}</span>
            <span className="N_sugars">Dont sucres (g) : {VN["sugars"]}</span>
            <span className="N_fiber">Fibres (g) : {VN["fiber"]}</span>
            <span className="N_proteins">Protéines (g) : {VN["proteins"]}</span>
            <span className="N_salt">Sel (g) : {VN["salt"]}</span>
        </div>
    )

    const mealRegisterBtn = foodstuffs.length === 0 ?
            <button disabled>Enregister</button> 
        : 
            <button onClick={() => mealRegister()}>Enregistrer</button>

    const mealModifyBtn = foodstuffs.length === 0 ?
            <button disabled>Enregister</button> 
        : 
            <button onClick={() => mealModify()}>Enregistrer</button>

    const deleteFood = (id) => {
        const newFoodstuffs = foodstuffs.filter(food => food[0] !== id);
        setFoodstuffs(newFoodstuffs);
    }

    const mealDisplay = meal[0] !== '' && (
        <div className="N_mealDisplay">
            <h1>{mealTitle}</h1>
            {
                foodstuffs.map(food => {
                    return  (
                                <div key={food[0]} className="N_foodDisplay">
                                    <div className="N_mealFood">-{food[1]} ({food[2]}g)</div>
                                    <div onClick={() => deleteFood(food[0])}  className="N_foodDeleteBtn">X</div>
                                </div>
                            )
                })
            }
            {mealVN}
            {mealID[1] === "" ? mealRegisterBtn : mealModifyBtn }
        </div>
    )

    const displayProductJSON = (product) => {
        console.log(JSON.stringify(product["_id"]));
    }

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
            return <div key={product["_id"]} className="N_product">
                        <p className="N_productName">{getProductName(product)}</p>
                        <img className="N_productImg" src={product["image_url"]} />
                        <p className="N_nutrimentsArray">
                            <span>Valeurs nutritionnelles (pour 100g) :</span> 
                            <span className="N_energy">Energie (kcal) : {Math.round(getNutrimentValue(product, "energy") / 4.1868)}</span>
                            <span className="N_fat">Matières grasses (g) : {getNutrimentValue(product, "fat")}</span>
                            <span className="N_carbohydrates">Glucides (g) : {getNutrimentValue(product, "carbohydrates")}</span>
                            <span className="N_sugars">Dont sucres (g) : {getNutrimentValue(product, "sugars")}</span>
                            <span className="N_fiber">Fibres (g) : {getNutrimentValue(product, "fiber")}</span>
                            <span className="N_proteins">Protéines (g) : {getNutrimentValue(product, "proteins")}</span>
                            <span className="N_salt">Sel (g) : {getNutrimentValue(product, "salt")}</span>
                        </p>
                        {
                        meal[0] === '' ? 
                                <button disabled>Ajouter</button> 
                            : 
                                <button onClick={() => setNewFood([product["_id"], getProductName(product), 100])}>Ajouter</button>
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
        <button onClick={() => searchFood(currentFoodName, currentBrand, currentPage-1)}>Précédent</button>
        :
        <button className="N_dimmed">Précédent</button>

    const nextBtn = currentPage < maxPages ? 
        <button onClick={() => searchFood(currentFoodName, currentBrand, currentPage+1)}>Suivant</button>
        :
        <button className="N_dimmed">Suivant</button>

    const startBtn = currentPage > 1 ? 
        <button onClick={() => searchFood(currentFoodName, currentBrand, 1)}>Début</button>
        :
        <button className="N_dimmed">Début</button>

    const endBtn = currentPage < maxPages ? 
        <button onClick={() => searchFood(currentFoodName, currentBrand, maxPages)}>Fin</button>
        :
        <button className="N_dimmed">Fin</button>

    const pageDisplay = <p>{currentPage}/{maxPages}</p>

    const updateFoodName = (e) => {
        setCurrentFoodName(e.currentTarget.value);
    }

    const chercher = () => {
        console.log(currentFoodName);
    }

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center bg-nutrition overflow-x-hidden'>
            {mealForm}
            {mealDisplay}
            {selectQuantity}
            <div className="N_menu">
                <h1>Food</h1>
                <form>
                    <input type="text" placeholder="aliment" onChange={(e) => updateFoodName(e)}/>
                    <input type="text" placeholder="marque" onChange={(e) => setCurrentBrand(e.target.value)}/>
                </form>
                <button onClick={() => searchFood(currentFoodName, currentBrand, 1)}>Chercher</button>
                <div className="navBtns">
                    {startBtn}
                    {prevBtn}
                    {pageDisplay}
                    {nextBtn}
                    {endBtn}
                </div>
                {foodInfoDisplay}
            </div>
            <div className='w-1/3 h-64 bg-gradient-to-r from-yellow-50 to-orange-100 rounded shadow-md shadow-orange-100'>

            </div>
        </div>
    )
}

export default Nutrition;

