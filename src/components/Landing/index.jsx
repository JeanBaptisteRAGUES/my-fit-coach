import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import {FirebaseContext} from '../Firebase';

const Landing = () => {
    const firebase = useContext(FirebaseContext);
    const [username, setUserName] = useState('');

    const disconnect = () => {
        console.log("Déconnexion");
        firebase.signoutUser();
    }

    /*
    useEffect(() => {
        if(!connected){
            console.log("Déconnexion");
            firebase.signoutUser();
        }
    }, [connected, firebase])
    */
    

    useEffect(() => {
        firebase.auth.onAuthStateChanged((user) => {
            if(user){
                console.log("Username : " + JSON.stringify(user));
                setUserName(user.displayName); //Can't perform a react state update on an unmounted component -> useAsync Hook + async/await ?
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
            <span onClick={() => disconnect()}>Se déconnecter</span>
        </div>
    )

    return (
        <div>
            Page d'accueil :<br/>
            {disconnectedDisplay}
            {connectedDisplay}
        </div>
    )
}

export default Landing;
