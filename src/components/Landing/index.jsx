import React, { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';
import './landing.css';

const Landing = () => {
    const firebase = useContext(FirebaseContext);
    const [username, setUserName] = useState('');
    const [user, setUser] = useState({userID: null});
    
    const [refLanding, inViewLanding] = useInView({
        threshold:0.3,
        initialInView:true
    });

    const [refNutrition, inViewNutrition] = useInView({
        threshold:0.3
    });

    const [refSport, inViewSport] = useInView({
        threshold:0.3
    });

    useEffect(async () => {
        firebase.auth.onAuthStateChanged( async (user) => {
            if(user){
                let userDoc = await firebase.db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                userData.userID = userDoc.id;
                console.log("Username : " + JSON.stringify(user.displayName));
                setUserName(user.displayName); //Can't perform a react state update on an unmounted component -> useAsync Hook + async/await ?
                setUser(userData);
                console.log("userData : " + JSON.stringify(userData));
            }else{
                console.log("Deconnexion");
                setUserName('');
                setUser({userID: null});
            }
        });
    }, []);

    const landingAnimation = (
        inViewLanding ? 
                "motion-safe:animate-fadeIn"
            :
                "opacity-0"
    )
    
    const nutritionAnimation = (
        inViewNutrition ? 
                "motion-safe:animate-fadeIn"
            :
                "opacity-0"
    )  

    const sportAnimation = (
        inViewSport ? 
                "motion-safe:animate-fadeIn"
            :
                "opacity-0"
    )  

    const landingTextConnected = user.userID !== null && (
        <p>
            Bienvenue sur My Fit Coach, l'endroit où vous pourrez gérer vos entraînement ainsi que vos repas sur la semaine !<br/>
            Rendez vous dans l'onglet <Link to='/nutrition' state={{userID: user.userID, mealID: null}} className='text-orange-500'>Nutrition</Link> pour créer vos repas et calculer leurs
            valeurs nutritionnelles<br/>
            La page <Link to='/workout' state={{userID: user.id}} className='text-blue-500'>Sport</Link> vous permettra de paramétrer vos entraînements physiques et de les
            enregistrer pour traquer l'amélioration de vos progrès<br/>
            Rendez vous dans votre <Link to='/schedule' state={{userID: user.userID}} className='text-green-500'>Emploi du temps</Link> pour créer votre routine de la semaine grace à
            vos repas et séances sportives précédemment enregistrées<br/>
        </p>
    )

    const landingTextDisconnected = user.userID === null && (
        <div className='flex flex-col justify-around items-center flex-1 w-full rounded'>
            Bienvenue sur My Fit Coach, l'endroit où vous pourrez gérer vos entraînement ainsi que vos repas sur la semaine !<br/>
            Vous voulez perdre du poids ou au contraire gagner du muscle ?<br/>
            Quelque soit votre objectif, My-Fit-Coach sera là pour vous accompagner en vous fournissant tous les outils nécessaire
            pour y parvenir !<br/>
            Vous pourrez suivre vos entrainements sportifs, les valeurs nutritionnelles de vos repas, l'évolution de votre poids
            et bien d'autres fonctionnalités encore grace à cette application complète.
            N'hésitez plus, le coach n'attend plus que vous !
            <Link to='/signup' className='neon-btn'>Commencer</Link>
        </div>
    )

    const nutritionTextConnected = user.userID !== null && (
        <p className='flex flex-col justify-around items-center flex-1 w-full rounded'>
            C'est ici que vous pourrez créer vos repas personnalisés, My-Fit-Coach se chargera ensuite de calculer 
            les valeurs nutritionnelles pour vous !<br/>
            Vous pourrez ensuite recevoir des conseils nutrition afin de déterminer si vous manquez de certains nutriments
            ou si au contraire vous en consommez trop, et celà en fonction des vos objectifs personnels !
            <Link to='/nutrition' state={{userID: user.userID, mealID: null}} className='neon-btn'>Nutrition</Link>
        </p>
    )

    const nutritionTextDisconnected = user.userID === null && (
        <p className='flex flex-col justify-around items-center flex-1 w-full rounded'>
            Connectez-vous pour pouvoir créer vos repas personnalisés, My-Fit-Coach se chargera ensuite de calculer 
            les valeurs nutritionnelles pour vous !<br/>
            Vous pourrez ensuite recevoir des conseils nutrition afin de déterminer si vous manquez de certains nutriments
            ou si au contraire vous en consommez trop, et celà en fonction des vos objectifs personnels !
            <Link to='/login' className='neon-btn'>Se connecter</Link>
        </p>
    )

    const sportTextConnected = user.userID !== null && (
        <p className='flex flex-col justify-around items-center flex-1 w-full rounded'>
            C'est ici que vous pourrez enregistrer vos sessions de sport. Vous pourrez suivre votre évolution pour
            chaque exercice grace à l'historique qui contient tous les entrainements que vous avez enregistrés. 
            Créez ensuite votre propre programme personnalisé grace à l'emploi du temps pour ne jamais manquer une session !
            <Link to='/workout' state={{userID: user.userID}} className='neon-btn'>Sport</Link>
        </p>
    )

    const sportTextDisconnected = user.userID === null && (
        <p className='flex flex-col justify-around items-center flex-1 w-full rounded'>
            Connectez-vous pour pouvoir enregistrer vos sessions de sport. Vous pourrez suivre votre évolution pour
            chaque exercice grace à l'historique qui contient tous les entrainements que vous avez enregistrés. 
            Créez ensuite votre propre programme personnalisé grace à l'emploi du temps pour ne jamais manquer une session !
            <Link to='/login' className='neon-btn'>Se connecter</Link>
        </p>
    )

    return (
        <div className='flex flex-col justify-center items-center relative'>
            <div className='flex flex-col justify-center items-center h-screenMinusHeader bg-slate-300 bg-landing-main bg-cover w-full bg-[center_right_40rem] md:bg-left'>
                <div ref={refLanding} className={"flex flex-col justify-center items-center text-center h-2/3 w-2/3 bg-transparent font-bold basicText-dimmed leading-loose " + landingAnimation}>
                    {landingTextConnected}
                    {landingTextDisconnected}
                </div>
            </div>
            <div className='flex flex-col justify-center items-center h-screenMinusHeader bg-slate-300 bg-landing-nutrition bg-cover w-full'>
                <div ref={refNutrition} className={"flex flex-col justify-center items-center text-center h-2/3 w-2/3 bg-transparent font-bold basicText-dimmed leading-loose " + nutritionAnimation}>
                    {nutritionTextConnected}
                    {nutritionTextDisconnected}
                </div>
            </div>
            <div className='flex flex-col justify-center items-center h-screenMinusHeader bg-slate-300 bg-landing-sport bg-cover w-full'>
                <div ref={refSport} className={"flex flex-col justify-center items-center text-center h-2/3 w-2/3 bg-transparent font-bold basicText-dimmed leading-loose " + sportAnimation}>
                    {sportTextConnected}
                    {sportTextDisconnected}
                </div>
            </div>
        </div>
    )
}

export default Landing;
