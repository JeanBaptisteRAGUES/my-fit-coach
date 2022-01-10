import React, { useContext, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';

const Landing = () => {
    const firebase = useContext(FirebaseContext);
    const [username, setUserName] = useState('');
    const [user, setUser] = useState(null);
    
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

    const disconnect = () => {
        console.log("Déconnexion");
        firebase.signoutUser();
    }
    

    useEffect(async () => {
        firebase.auth.onAuthStateChanged( async (user) => {
            if(user){
                let userDoc = await firebase.db.collection('users').doc(user.uid).get();
                let userData = userDoc.data();
                console.log("Username : " + JSON.stringify(user.displayName));
                setUserName(user.displayName); //Can't perform a react state update on an unmounted component -> useAsync Hook + async/await ?
                setUser(userData);
            }else{
                console.log("Deconnexion");
                setUserName('');
            }
        });
    }, []);

    const disconnectedDisplay = username === '' && (
        <div>
            <Link to='/signup'>S'inscrire</Link><br/>
            <Link to='/login'>Se connecter</Link>
        </div>
    )

    const connectedDisplay = username !== '' && (
        <div>
            <span>Bonjour {username}</span><br/>
            <Link to='/schedule'>Emploi du temps</Link><br/>
            <Link to='/workout'>Sport</Link><br/>
            <Link to='/nutrition/new'>Nutrition</Link><br/>
            <Link to='/test' state={{user: JSON.stringify(user)}} >Test</Link><br/>
            <span onClick={() => disconnect()}>Se déconnecter</span>
        </div>
    )

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

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-col justify-center items-center h-screen bg-slate-300 bg-landing-main bg-cover w-full'>
                <div ref={refLanding} className={"flex flex-col justify-center items-center text-center h-2/3 w-2/3 bg-transparent text-slate-200 font-bold text-xl leading-loose " + landingAnimation}>
                    <p>
                    Bienvenue sur My Fit Coach, l'endroit où vous pourrez gérer vos entraînement ainsi que vos repas sur la semaine !
                    Rendez vous dans l'onglet <Link to='/nutrition/new' className='text-orange-500'>Nutrition</Link> pour créer vos repas et calculer leurs
                    valeurs nutritionnelles<br/>
                    La page <Link to='/workout' className='text-blue-500'>Sport</Link> quant à elle vous permettra de paramétrer vos entraînements physiques et de les
                    enregistrer pour traquer l'amélioration de vos progrès<br/>
                    Enfin, rendez vous dans votre <Link to='/schedule' className='text-green-500'>Emploi du temps</Link> pour créer votre routine de la semaine grace à
                    vos repas et séances sportives précédemment enregistrées
                    </p>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center h-screen bg-slate-300 bg-landing-nutrition bg-cover w-full'>
                <div ref={refNutrition} className={"flex flex-col justify-center items-center border rounded shadow-md shadow-blue-300 h-1/3 w-1/3 bg-gradient-to-r from-cyan-100 to-sky-100 " + nutritionAnimation}>
                    Nutrition
                </div>
            </div>
            <div className='flex flex-col justify-center items-center h-screen bg-slate-300 bg-landing-sport bg-cover w-full'>
                <div ref={refSport} className={"flex flex-col justify-center items-center border rounded shadow-md shadow-blue-300 h-1/3 w-1/3 bg-gradient-to-r from-cyan-100 to-sky-100 " + sportAnimation}>
                    Sport
                </div>
            </div>
        </div>
    )
}

export default Landing;
