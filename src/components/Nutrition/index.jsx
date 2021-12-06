import React, { useContext, useState } from 'react';
import './nutrition.css';
import axios from 'axios';
import {FirebaseContext} from '../Firebase';

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
            foodstuffs: JSON.stringify(foodstuffs)
        })
    }

    const mealRegisterBtn = foodstuffs.length === 0 ?
            <button disabled>Enregister</button> 
        : 
            <button onClick={() => mealRegister()}>Enregistrer</button>

    const mealDisplay = meal[0] !== '' && (
        <div className="N_mealDisplay">
            <h1>{mealTitle}</h1>
            {
                foodstuffs.map(food => {
                    return <span key={food[0]} className="N_mealFood">-{food[1]} ({food[2]}g)</span>
                })
            }
            {mealRegisterBtn}
        </div>
    )

    const foodInfoDisplay = foodInfo.length > 0 &&
        foodInfo.map(product => {
            return <div key={product["id"]} className="N_product">
                        <p className="N_productName">{product["product_name"]}</p>
                        <img className="N_productImg" src={product["image_url"]} />
                        <p className="N_nutrimentsArray">
                            <span>Valeurs nutritionnelles (pour 100g) :</span> 
                            <span>Energie (kcal) : {Math.round(getNutrimentValue(product, "energy") / 4.1868)}</span>
                            <span>Matières grasses (g) : {getNutrimentValue(product, "fat")}</span>
                            <span>Glucides (g) : {getNutrimentValue(product, "carbohydrates")}</span>
                            <span>Dont sucres (g) : {getNutrimentValue(product, "sugars")}</span>
                            <span>Fibres (g) : {getNutrimentValue(product, "fiber")}</span>
                            <span>Protéines (g) : {getNutrimentValue(product, "proteins")}</span>
                            <span>Sel (g) : {getNutrimentValue(product, "salt")}</span>
                        </p>
                        {
                        meal[0] === '' ? 
                                <button disabled>Ajouter</button> 
                            : 
                                <button onClick={() => setNewFood([product["id"], product["product_name"], 100])}>Ajouter</button>
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
        <div className="N_pageContainer">
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
        </div>
    )
}

export default Nutrition;

